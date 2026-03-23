"use client"

import { useState } from "react"
import { Eye, ShoppingBag } from "lucide-react"
import { ProductColumn } from "@/app/admin/products/columns"
import { ProductViewModal } from "@/components/admin/ProductViewModal"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  data: ProductColumn
}

const ProductCard: React.FC<ProductCardProps> = ({
  data
}) => {
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <>
      <ProductViewModal 
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={data}
      />
      <div 
        onClick={() => setViewOpen(true)}
        className="group relative flex flex-col md:flex-row bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer w-full max-w-4xl "
      >
        {/* Image Section - Wide Aspect on Desktop */}
        <div className="relative w-full md:w-80 h-72 md:h-auto bg-slate-50 overflow-hidden flex-shrink-0">
          <img 
            src={data.image || "/placeholder-product.png"} 
            alt={data.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out py-4"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 shadow-2xl hover:scale-110 transition-transform bg-white/90 backdrop-blur-md border-none"
            >
              <Eye className="h-5 w-5 text-slate-900" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 shadow-2xl hover:scale-110 transition-transform bg-white/90 backdrop-blur-md border-none"
            >
              <ShoppingBag className="h-5 w-5 text-slate-900" />
            </Button>
          </div>

          <div className="absolute top-6 left-6">
             <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200">
                New Arrival
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10 flex flex-col flex-1 min-w-0 bg-gradient-to-br from-white to-slate-50/30">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Premium Collection</span>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                {data.name}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-300 bg-slate-50 px-3 py-1 rounded-full">#{data.id}</span>
          </div>
          
          <p className="text-slate-500 text-base font-medium leading-relaxed mb-8 line-clamp-3">
            {data.description}
          </p>

          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Refined On</span>
                <span className="text-sm font-bold text-slate-900">{data.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">View Details</span>
              <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-emerald-600 group-hover:rotate-[360deg] transition-all duration-700 shadow-xl shadow-slate-200 group-hover:shadow-emerald-100">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
