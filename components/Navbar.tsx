"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
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
      "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4",
      isScrolled ? "pt-2" : "pt-6"
    )}>
      <nav className={cn(
        "max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-6 h-16 md:h-20",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg" 
          : "bg-gray-100 border border-gray-100"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <span className={cn(
            "text-2xl font-black tracking-tighter transition-colors",
            isScrolled ? "text-black" : "text-black"
          )}>
            RUBENIX
          </span>
        </Link>

        {/* Actions / Mobile Toggle / Login */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button 
              variant="outline" 
              className="h-10 px-4 md:px-6 rounded-xl border-gray-200 text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
            >
              Login
            </Button>
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
