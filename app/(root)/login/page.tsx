import React from 'react'
import { LoginForm } from '@/components/admin/LoginForm'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage