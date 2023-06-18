const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: './config/.env' })
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const Post = require('./models/post')
const bcrypt = require('bcrypt')
const multer = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs')

const app = express()
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10)
const secret = 'j3bi749439hjf8hjfr39giru39h'
// cors

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.json())
app.use(cookieParser())
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('connection established')
  })
  .catch((error) => {
    console.log('error connecting ' + error.message)
  })
//
//
//

/// api
//register
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    })
    res.json(userDoc)
  } catch (e) {
    res.status(400).json(e)
  }
})

// login
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userDoc = await User.findOne({ username })
  const passOk = bcrypt.compare(password, userDoc.password)
  if (passOk) {
    // login
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err
      res.cookie('token', token).json({ id: userDoc._id, username })
    })
  } else {
    res.status(400).json('wrong credentials')
  }
})

app.get('/profile', (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err
    res.json(info)
  })
})
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file
  const parts = originalname.split('.')
  const ext = parts[parts.length - 1]
  const newPath = path + '.' + ext
  fs.renameSync(path, newPath)

  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err
    const { title, summary, content } = req.body
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    })
    res.json(postDoc)
  })
})
// update
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null
  if (req.file) {
    const { originalname, path } = req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    newPath = path + '.' + ext
    fs.renameSync(path, newPath)
  }
  const { token } = req.cookies
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err
    const { id, title, summary, content } = req.body
    const postDoc = await Post.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
    if (!isAuthor) {
      res.status(400).json('you are not the author')
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    })

    res.json(postDoc)
  })
})
//// retrieve post
app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  )
})
//
app.get('/post/:id', async (req, res) => {
  const { id } = req.params
  const postDoc = await Post.findById(id).populate('author', ['username'])
  res.json(postDoc)
})

//////
app.listen(4000, () => {
  console.log('Server started on port 4000')
})
