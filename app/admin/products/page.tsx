"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ProductColumn } from "./columns";
import { ProductClient } from "./ProductClient";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/products`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const formattedProducts: ProductColumn[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.description,
          usp: item.usp,
          createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Admin products fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="flex-col">
      <ProductClient data={products} />
    </div>
  );
};

export default ProductsPage;