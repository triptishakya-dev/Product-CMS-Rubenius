"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/DataTable"
import { ProductModal } from "@/components/admin/ProductModal"
import { columns, ProductColumn } from "./columns"

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ProductModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-black">Products ({data.length})</h2>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </div>
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </>
  )
}
