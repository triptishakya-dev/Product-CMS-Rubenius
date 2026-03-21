"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Success
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      
      // Redirect to login page
      router.push("/admin/login")
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-neutral-200 shadow-xl min-h-[600px] flex flex-col justify-center">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-4xl font-bold tracking-tight text-neutral-900">Create an account</CardTitle>
          <CardDescription className="text-lg text-neutral-500">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-lg font-medium text-neutral-700">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-lg font-medium text-neutral-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" title="Password" className="text-lg font-medium text-neutral-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Eye className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" title="Confirm Password" className="text-lg font-medium text-neutral-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Eye className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <Button disabled={isLoading} className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-14 text-xl mt-4 cursor-pointer">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="pt-4">
          <div className="text-base text-neutral-500 text-center w-full">
            Already have an account?{" "}
            <a href="/admin/login" className="text-neutral-900 hover:underline font-medium">
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
