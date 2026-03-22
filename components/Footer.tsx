import Link from "next/link"
import { Facebook, Instagram, Twitter, MessageSquare } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Info */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-xl italic">R</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-black">RUBENIX</span>
          </Link>
          <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
            Redefining the digital shopping experience with premium curated collections and seamless technical integration.
          </p>
          <div className="flex items-center gap-4 pt-2">
            {[Instagram, Twitter, Facebook, MessageSquare].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-300">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-black">Navigation</h4>
          <ul className="space-y-4">
            <li><Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Home</Link></li>
            <li><Link href="/products" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Shop All</Link></li>
            <li><Link href="/about" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Our Story</Link></li>
            <li><Link href="/admin/products" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Merchant Portal</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-black">Support</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Help Center</Link></li>
            <li><Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Shipping Info</Link></li>
            <li><Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Returns</Link></li>
            <li><Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-wider">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">© 2026 Rubenix Advanced Commerce. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Privacy Policy</Link>
          <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
