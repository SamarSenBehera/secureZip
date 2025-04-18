"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"

import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type AuthFormProps = {
  type: "signin" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard"
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"

    if (!password) newErrors.password = "Password is required"
    else if (type === "signup" && password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (type === "signup" && !fullName) newErrors.fullName = "Full name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (type === "signup") {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Create user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email,
          fullName,
          createdAt: serverTimestamp(),
        })

        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials",
        })

        router.push("/login")
      } else {
        // Sign in user
        await signInWithEmailAndPassword(auth, email, password)

        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        })

        router.push(redirectUrl)
      }
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use. Please use a different email or log in."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use at least 6 characters."
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password."
      }

      toast({
        title: "Authentication error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg border border-primary-100">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary-50 p-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold purple-gradient-text">
          {type === "signin" ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-gray-600">
          {type === "signin"
            ? "Enter your credentials to access your account"
            : "Fill in the details below to create your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className={`rounded-lg border-primary-200 focus:border-primary focus:ring-primary ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`rounded-lg border-primary-200 focus:border-primary focus:ring-primary ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            {type === "signin" && (
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={type === "signup" ? "Min. 6 characters" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`rounded-lg border-primary-200 focus:border-primary focus:ring-primary ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          {type === "signup" && !errors.password && (
            <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary-700 py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === "signin" ? "Signing in..." : "Creating account..."}
            </>
          ) : type === "signin" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        {type === "signin" ? (
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
