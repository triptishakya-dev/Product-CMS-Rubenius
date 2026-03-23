import Link from "next/link"
import { Facebook, Instagram, Twitter, MessageSquare, Mail, MapPin, Phone, Github, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0b] text-white pt-24 pb-12 px-6 overflow-hidden relative">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Socials */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center group-hover:rotate-[360deg] transition-all duration-700 shadow-xl shadow-white/10">
                <span className="text-black font-black text-2xl italic">R</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">Rubenius</span>
            </Link>
            
            <p className="text-slate-400 text-sm font-medium leading-[1.8] max-w-xs">
              Crafting premium digital experiences through curated collections and state-of-the-art technical excellence.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="h-11 w-11 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white hover:-translate-y-1.5 transition-all duration-500 border border-white/10"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Navigation</h4>
            <ul className="space-y-5">
              {[
                { name: "Home", href: "/" },
                { name: "Collections", href: "/products" },
                { name: "Our Story", href: "/about" },
                { name: "Admin Portal", href: "/admin/products" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-0 bg-emerald-500 group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Service</h4>
            <ul className="space-y-5">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Shipping Info",
                "Returns & FAQ"
              ].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Mail className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Us</p>
                  <p className="text-sm font-bold text-slate-200">hello@rubenius.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Phone className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Call Us</p>
                  <p className="text-sm font-bold text-slate-200">+1 (888) 123-4567</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            © 2026 Rubenius Commerce. <span className="text-slate-700 mx-2">|</span> Designed for Excellence.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0a0a0b] bg-slate-800" />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Trusted by 10k+ users
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
