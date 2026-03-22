import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ProductColumn } from "./columns";
import { ProductClient } from "./ProductClient";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item: any) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    description: item.description,
    usp: item.usp,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <ProductClient data={formattedProducts} />
    </div>
  );
};

export default ProductsPage;