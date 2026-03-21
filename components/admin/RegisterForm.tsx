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

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulation of registration
    setTimeout(() => {
      setIsLoading(false)
      // router.push("/admin/login")
    }, 1000)
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
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-lg font-medium text-neutral-700">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
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
                <Label htmlFor="confirm-password" title="Confirm Password" className="text-lg font-medium text-neutral-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
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
