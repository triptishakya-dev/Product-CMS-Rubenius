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

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loginMode, setLoginMode] = React.useState<"password" | "otp">("password")
  const [otpStep, setOtpStep] = React.useState<"send" | "verify">("send")

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    otp: "",
  })
  const [countdown, setCountdown] = React.useState<number>(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Limit OTP to 6 digits
    if (id === "otp" && value.length > 6) return;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSendOtp() {
    if (!formData.email) {
      setError("Please enter your email first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      setOtpStep("verify")
      setCountdown(15) // Start 15s timer
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = loginMode === "password" ? "/api/auth/login" : "/api/auth/otp/verify"
      const body = loginMode === "password" 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, otp: formData.otp }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

      // Success - redirect to admin dashboard
      router.push("/admin")
      router.refresh()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-neutral-200 shadow-xl min-h-[500px] flex flex-col justify-center">
        <CardHeader className="space-y-2 pb-8 text-center">
          <CardTitle className="text-4xl font-bold tracking-tight text-neutral-900">Sign in</CardTitle>
          <CardDescription className="text-lg text-neutral-500">
            {loginMode === "password" 
              ? "Enter your email below to login to your account" 
              : otpStep === "send" 
                ? "Enter your email to receive a login OTP"
                : "Enter the OTP sent to your email"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-lg font-medium text-neutral-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || (loginMode === "otp" && otpStep === "verify")}
                  className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg"
                />
              </div>

              {loginMode === "password" ? (
                <div className="grid gap-3">
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
              ) : otpStep === "verify" ? (
                <div className="grid gap-3">
                  <Label htmlFor="otp" className="text-lg font-medium text-neutral-700">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border-neutral-200 focus:ring-neutral-900 h-12 text-lg"
                  />
                  <div className="flex items-baseline justify-between mt-1">
                    <button 
                      type="button"
                      onClick={() => setOtpStep("send")}
                      className="text-sm text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Change Email
                    </button>
                    {countdown > 0 ? (
                      <span className="text-sm text-neutral-400 font-medium">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleSendOtp}
                        className="text-sm text-neutral-900 font-bold hover:underline"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              {loginMode === "password" || (loginMode === "otp" && otpStep === "verify") ? (
                <Button disabled={isLoading} className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-14 text-xl mt-4 cursor-pointer">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading} 
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-14 text-xl mt-4 cursor-pointer"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              )}
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500 font-medium tracking-wider">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button"
            onClick={() => {
              setLoginMode(loginMode === "password" ? "otp" : "password")
              setOtpStep("send")
              setError(null)
            }}
            className="w-full border-neutral-200 hover:bg-neutral-50 h-12 text-lg text-neutral-700"
          >
            {loginMode === "password" ? "Login with OTP" : "Login with Password"}
          </Button>
        </CardContent>
        <CardFooter className="pt-6">
          <div className="text-base text-neutral-500 text-center w-full">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-neutral-900 hover:underline font-medium">
              Register
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

