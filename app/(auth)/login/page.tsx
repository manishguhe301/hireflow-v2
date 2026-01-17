import Login from '@/src/components/auth/login/Login'
import React, { Suspense } from 'react'

const LoginPage = () => {
  return (
    <Suspense fallback={<div> Loading...</div>}>
      {/* Added suspense because this will not stop pre-rendering and will not block the rest of the page */}
      <Login />
    </Suspense >
  )
}

export default LoginPage