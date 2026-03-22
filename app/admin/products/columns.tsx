"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Eye } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/admin/AlertModal"
import { ProductViewModal } from "@/components/admin/ProductViewModal"
import { ProductModal } from "@/components/admin/ProductModal"

export type ProductColumn = {
  id: number
  name: string
  image: string
  description: string
  usp: string[] | string
  createdAt: string
}

const ActionCell = ({ data }: { data: ProductColumn }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onConfirm = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${data.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete")
      
      toast.success("Product deleted.")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <ProductViewModal 
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={data}
      />
      <ProductModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={data}
      />
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewOpen(true)}
          className="h-8 w-8 border-gray-300 hover:bg-gray-100 text-black shadow-sm transition-all active:scale-95"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setEditOpen(true)}
          className="h-8 w-8 border-gray-300 hover:bg-gray-100 text-black shadow-sm transition-all active:scale-95"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="h-8 w-8 border-gray-300 hover:bg-red-50 text-red-600 shadow-sm transition-all active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100 p-0 font-semibold text-black"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium text-black">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-gray-600">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
]
