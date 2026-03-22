"use client"

import * as React from "react"
import { Plus, Trash2, ChevronRight, ChevronLeft, Upload, X, FileIcon, ImageIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any // ProductColumn | null
}

interface ImageMetadata {
  name: string
  size: string
  type: string
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [isMounted, setIsMounted] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [usps, setUsps] = React.useState<string[]>([""])
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [imageMeta, setImageMeta] = React.useState<ImageMetadata | null>(null)
  const [loading, setLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const title = initialData ? "Edit Product" : "Add Product"
  const descriptionText = initialData ? "Update your product details." : "Create a new product for your store."
  const toastMessage = initialData ? "Product updated." : "Product created."
  const action = initialData ? "Save Changes" : "Create Product"

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setUsps(Array.isArray(initialData.usp) ? initialData.usp : [initialData.usp])
      setImagePreview(initialData.image)
      setImageMeta({
        name: "Existing Image",
        size: "Unknown",
        type: "S3"
      })
    } else {
      setName("")
      setDescription("")
      setUsps([""])
      setImagePreview(null)
      setImageMeta(null)
    }
  }, [initialData, isOpen])

  if (!isMounted) {
    return null
  }

  const onNext = () => setStep(2)
  const onBack = () => setStep(1)

  const handleAddUsp = () => {
    setUsps([...usps, ""])
  }

  const handleRemoveUsp = (index: number) => {
    const newUsps = usps.filter((_, i) => i !== index)
    setUsps(newUsps.length ? newUsps : [""])
  }

  const handleUspChange = (index: number, value: string) => {
    const newUsps = [...usps]
    newUsps[index] = value
    setUsps(newUsps)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageMeta({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type.split('/')[1].toUpperCase()
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImagePreview(null)
    setImageMeta(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      
      if (!name || !description || !imagePreview || usps.some(u => !u.trim())) {
        toast.error("Please fill all fields and add at least one USP.")
        return
      }

      const url = initialData 
        ? `/api/products/${initialData.id}` 
        : "/api/products"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          usp: usps.filter(u => u.trim() !== ""),
          image: imagePreview,
        }),
      })

      if (!response.ok) {
        throw new Error(initialData ? "Failed to update product" : "Failed to create product")
      }

      toast.success(toastMessage)
      router.refresh()
      onClose()
      // Reset form
      setStep(1)
      setName("")
      setDescription("")
      setUsps([""])
      setImagePreview(null)
      setImageMeta(null)
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={cn(
        "h-2 w-16 rounded-full transition-all duration-300",
        step === 1 ? "bg-black" : "bg-gray-200"
      )} />
      <div className={cn(
        "h-2 w-16 rounded-full transition-all duration-300",
        step === 2 ? "bg-black" : "bg-gray-200"
      )} />
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white text-black border-none rounded-2xl shadow-2xl">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Step {step} of 2</span>
              <DialogTitle className="text-3xl font-extrabold tracking-tight">
                {title} - {step === 1 ? "Basic Info" : "Details"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-base mt-2">
                {descriptionText}
              </DialogDescription>
            </div>
          </DialogHeader>

          <StepIndicator />

          <div className="space-y-8 min-h-[350px]">
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700">Product Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rubenius Premium Edition" 
                    className="h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-black/5 focus:border-black"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the value proposition and core features..." 
                    className="min-h-[180px] p-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-black/5 focus:border-black resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-gray-700">Unique Selling Points</Label>
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar border border-transparent rounded-xl focus-within:border-gray-100 transition-all">
                    {usps.map((usp, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input 
                          value={usp}
                          onChange={(e) => handleUspChange(index, e.target.value)}
                          placeholder={`Feature #${index + 1}`}
                          className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveUsp(index)}
                          className="h-11 w-11 shrink-0 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddUsp}
                    className="w-full h-11 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-black hover:text-black transition-all font-medium"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Another Feature
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">Product Image</Label>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div 
                    onClick={triggerFileInput}
                    className={cn(
                      "relative group border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden",
                      imagePreview 
                        ? "border-black/10 bg-gray-50" 
                        : "border-gray-200 bg-gray-50 hover:bg-white hover:border-black/30 p-8"
                    )}
                  >
                    {imagePreview ? (
                      <div className="p-4 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-white">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-bold text-black truncate">{imageMeta?.name}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">{imageMeta?.type}</span>
                            <span>{imageMeta?.size}</span>
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={removeImage}
                              className="h-8 rounded-lg text-xs font-bold border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                            >
                              <X className="h-3 w-3 mr-1" /> Replace Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-6">
                        <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-black">Upload product visual</p>
                          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Max 5MB • JPG, PNG, WebP</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
            {step === 2 ? (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="h-12 px-6 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="h-12 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancel
              </Button>
            )}
            
            <div className="flex gap-3">
              {step === 1 ? (
                <Button 
                  onClick={onNext}
                  className="h-12 px-8 rounded-xl bg-black text-white hover:bg-gray-800 font-bold shadow-lg shadow-black/10 transition-all active:scale-95"
                >
                  Next Step <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  onClick={onSubmit}
                  disabled={loading}
                  className="h-12 px-8 rounded-xl bg-black text-white hover:bg-gray-800 font-bold shadow-lg shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {action}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
