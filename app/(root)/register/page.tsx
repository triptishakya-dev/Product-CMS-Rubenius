import React from 'react'
import { RegisterForm } from '@/components/admin/RegisterForm'

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage