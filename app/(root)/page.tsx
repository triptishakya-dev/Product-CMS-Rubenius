import React from 'react'
import { format } from "date-fns"
import { ProductColumn } from "@/app/admin/products/columns"
import ProductCard from '@/components/ProductCard'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Home = async () => {
  const response = await fetch("/api/products", {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await response.json();

  const formattedProducts: ProductColumn[] = products.map((item: any) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    description: item.description,
    usp: item.usp,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col pb-20 pt-10">
      {/* Product Showcase */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="h-1 w-20 bg-black rounded-full" />
            <h2 className="text-4xl font-black tracking-tight text-black">The Collection</h2>
            <p className="text-gray-500 font-medium max-w-md">
              A curated selection of our finest products, each crafted to redefine your daily essentials.
            </p>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
            View All Products
            <div className="h-10 w-10 rounded-full border border-gray-200 group-hover:border-black flex items-center justify-center transition-all">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {formattedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {formattedProducts.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
             <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-300 mb-6">
                <Sparkles className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-black text-black mb-2">Collection Loading...</h3>
             <p className="text-gray-400 font-medium text-center max-w-xs">
                Our premium inventory is currently being refined. Please check back shortly.
             </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home