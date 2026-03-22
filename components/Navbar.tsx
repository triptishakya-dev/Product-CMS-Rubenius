"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "Our Story" },
  ]

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4",
      isScrolled ? "pt-2" : "pt-6"
    )}>
      <nav className={cn(
        "max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-6 h-16 md:h-20",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg" 
          : "bg-transparent"
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-all hover:opacity-100",
                pathname === route.href 
                  ? "text-black opacity-100" 
                  : "text-gray-500 opacity-60"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
              <User className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 relative">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-black text-[8px] text-white flex items-center justify-center rounded-full font-black">0</span>
          </Button>
          
          {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-top-4 duration-300 z-50">
          <div className="flex flex-col gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-black uppercase tracking-widest transition-all",
                  pathname === route.href ? "text-black" : "text-gray-400"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
