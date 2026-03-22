import { format } from "date-fns";
import { ProductColumn } from "./columns";
import { ProductClient } from "./ProductClient";

const ProductsPage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
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
    <div className="flex-col">
      <ProductClient data={formattedProducts} />
    </div>
  );
};

export default ProductsPage;