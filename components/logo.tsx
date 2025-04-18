import Link from "next/link"
import { Shield, ShieldCheck } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 text-xl font-bold">
      <div className="relative">
        <Shield className="h-6 w-6 text-primary-600" />
        <ShieldCheck className="absolute inset-0 h-6 w-6 text-primary-400" />
      </div>
      <span className="purple-gradient-text">SecureZip</span>
    </Link>
  )
}
