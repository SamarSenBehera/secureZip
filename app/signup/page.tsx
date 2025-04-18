import { AuthForm } from "@/components/auth-form"
import { Header } from "@/components/header"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-primary-50 to-white">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
          <AuthForm type="signup" />
        </div>
      </main>
    </div>
  )
}
