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
        className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 cursor-pointer flex flex-col h-full"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          <img 
            src={data.image || "/placeholder-product.png"} 
            alt={data.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-xl hover:scale-110 transition-transform"
            >
              <Eye className="h-5 w-5 text-black" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-xl hover:scale-110 transition-transform"
            >
              <ShoppingBag className="h-5 w-5 text-black" />
            </Button>
          </div>

          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                New Arrival
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-black tracking-tight text-black group-hover:text-gray-600 transition-colors truncate">
              {data.name}
            </h3>
            <span className="text-xs font-bold text-gray-400">#{data.id}</span>
          </div>
          
          <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
            {data.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Refined On</span>
              <span className="text-xs font-bold text-black">{data.createdAt}</span>
            </div>
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
