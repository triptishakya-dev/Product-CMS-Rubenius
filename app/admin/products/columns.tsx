"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from "lucide-react"
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

export type ProductColumn = {
  id: number
  name: string
  image: string
  description: string
  usp: string
  createdAt: string
}

const ActionCell = ({ data }: { data: ProductColumn }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
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
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => console.log("Edit", data.id)}
          className="h-8 w-8 border-gray-300 hover:bg-gray-100 text-black"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="h-8 w-8 border-gray-300 hover:bg-red-50 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string
      return (
        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
          <img
            src={image || "/placeholder-product.png"}
            alt={row.getValue("name")}
            className="object-cover w-full h-full"
          />
        </div>
      )
    },
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
    accessorKey: "usp",
    header: "USP",
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("usp")}</div>
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
