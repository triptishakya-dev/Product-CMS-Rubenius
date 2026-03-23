"use client"

import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

 

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-300 shadow-md",
      isScrolled ? "bg-gray-200/90 backdrop-blur-lg" : "bg-gray-200"
    )}>
      <nav className="w-full transition-all duration-300 flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <span className={cn(
            "text-2xl font-black tracking-tighter transition-colors",
            isScrolled ? "text-black" : "text-black"
          )}>
            RUBENIUS
          </span>
        </Link>

        {/* Actions / Mobile Toggle / Login */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:flex group relative items-center bg-black hover:bg-[#1a1510] text-white rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 shadow-xl hover:translate-x-1">
            <span className="font-dm text-[10px] font-black uppercase tracking-[0.3em] mr-6">
              Login
            </span>
            <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-black group-hover:rotate-[-45deg] transition-transform duration-500">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
