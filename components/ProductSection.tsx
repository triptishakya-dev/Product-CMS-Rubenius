"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { ProductColumn } from "@/app/admin/products/columns";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => (
  <div className="flex flex-col md:flex-row bg-white rounded-[2rem] border border-slate-100 overflow-hidden w-full h-[400px] md:h-[320px]">
    <Skeleton className="w-full md:w-80 h-72 md:h-auto shrink-0" />
    <div className="p-8 md:p-10 flex flex-col flex-1 space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-12 w-12 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default function ProductSection() {
  const [products, setProducts] = useState<ProductColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen py-24 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-20 space-y-6 text-center md:text-left">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-24 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen  py-24 px-6 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-20 space-y-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-100/50 rounded-full"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">
              Premium Selection
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] mb-6">
              Refining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Modern Craft.
              </span>
            </h1>
            
            <p className="max-w-lg text-lg text-slate-600 font-medium leading-relaxed mx-auto md:mx-0">
              Explore our latest masterpieces, where setiap detail is curated for the ultimate experience.
            </p>
          </motion.div>
        </div>

        {/* Wide Product Grid - Now 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {products.map((product: ProductColumn) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium italic">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
