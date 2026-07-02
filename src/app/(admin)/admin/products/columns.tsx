"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export type AdminProduct = {
  id: string;
  title: string;
  price: number;
  type: string;
  currency?: string;
  createdAt: string;
  categories: {
    id: string;
    name: string;
  }[];
};

export const getProductColumns = (
  onEdit: (product: AdminProduct) => void,
  onDelete: (product: AdminProduct) => Promise<void>
) => [
  {
    key: "title",
    title: "Title",
    className: "w-[35%]",
    render: (product: AdminProduct) => (
      <div className="flex flex-col">
        <span className="font-medium line-clamp-1">{product.title}</span>
      </div>
    ),
  },
  {
    key: "type",
    title: "Type",
    className: "w-[15%]",
    render: (product: AdminProduct) => (
      <Badge variant="outline" className="capitalize">
        {product.type.toLowerCase()}
      </Badge>
    ),
  },
  {
    key: "price",
    title: "Price",
    className: "w-[15%]",
    render: (product: AdminProduct) => {
      if (product.price === 0) return <span className="text-green-600 font-medium">رایگان</span>;
      const isIrt = product.currency === "IRT";
      const displayPrice = isIrt ? Math.floor(product.price / 10) : product.price;
      const unit = isIrt ? "تومان" : "ریال";
      return <span className="font-medium">{displayPrice.toLocaleString("fa-IR")} {unit}</span>;
    },
  },
  {
    key: "categories",
    title: "Categories",
    className: "w-[20%]",
    render: (product: AdminProduct) => (
      <div className="flex flex-wrap gap-1">
        {product.categories.slice(0, 2).map((cat) => (
          <Badge key={cat.id} variant="secondary" className="text-xs">
            {cat.name}
          </Badge>
        ))}
        {product.categories.length > 2 && (
          <span className="text-xs text-muted-foreground">+{product.categories.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    key: "createdAt",
    title: "Created Date",
    className: "w-[15%]",
    render: (product: AdminProduct) =>
      product.createdAt ? format(new Date(product.createdAt), "MMM d, yyyy") : "-",
  },
];
