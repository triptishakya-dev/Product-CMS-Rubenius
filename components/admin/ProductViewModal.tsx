"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductColumn } from "@/app/admin/products/columns"
import { Calendar, Tag, FileText, CheckCircle2, X } from "lucide-react"

interface ProductViewModalProps {
  isOpen: boolean
  onClose: () => void
  data: ProductColumn | null
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !data) {
    return null
  }

  const usps = Array.isArray(data.usp) 
    ? data.usp 
    : typeof data.usp === 'string' 
      ? data.usp.split(',').map(s => s.trim()).filter(s => s !== "")
      : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[800px] p-0 overflow-hidden bg-white text-black border-none rounded-3xl shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">{data.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View detailed information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-[-44px] z-20 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-md border border-gray-100 transition-all active:scale-95"
          >
            <X className="h-5 w-5 text-gray-600" />
          </Button>

          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Visual Section */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center relative min-h-[400px] p-6 lg:p-10">
              {data.image ? (
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="max-w-full max-h-[400px] object-contain shadow-2xl rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-product.png";
                  }}
                />
              ) : (
                <img 
                  src="/placeholder-product.png" 
                  alt="Placeholder"
                  className="max-w-full max-h-[400px] object-contain opacity-50"
                />
              )}
            </div>
            
            {/* Details Section */}
            <div className="flex-1 p-8 flex flex-col gap-6 bg-white border-l border-gray-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Product #{data.id}</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-black leading-tight">{data.name}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <FileText className="h-3.5 w-3.5" />
                  Technical Narrative
                </div>
                <p className="text-gray-600 leading-relaxed text-base font-medium">
                  {data.description}
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Unique Value Propositions
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {usps.length > 0 ? (
                    usps.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-100 shadow-sm hover:border-black/10 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
                        {item}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No specific USPs defined.</span>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory Status</span>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-black" />
                    Engraved {data.createdAt}
                  </div>
                </div>
                <Button 
                  onClick={onClose}
                  className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-8 font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
