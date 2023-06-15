import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../userContext'

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext)
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo)
      })
    })
  }, [])
  function Logout() {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null)
  }
  const username = userInfo?.username
  return (
    <header>
      <Link to='/' className='logo'>
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
            <Link to='/create'>Create a new post</Link>
            <a onClick={Logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
