import React from 'react'

const Post = () => {
  return (
    <div className='post'>
      <div className='image'>
        <img
          src='https://plus.unsplash.com/premium_photo-1674168439528-7a1810e73a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=60'
          alt=''
        />
      </div>
      <div className='text'>
        <h2>full house battery backup coming this year</h2>
        <p className='info'>
          <a href='' className='author'>
            Tehua Justin
          </a>
          <time>2023-06-13 23:50</time>
        </p>
        <p className='summary'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe nobis,
          aliquam ad accusamus, cumque numquam mollitia.
        </p>
      </div>
    </div>
  )
}

export default Post
