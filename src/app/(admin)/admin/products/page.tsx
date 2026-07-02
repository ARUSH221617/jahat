"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getProductColumns, AdminProduct } from "./columns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductForm } from "./product-form";

export default function ProductsAdminPage() {
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProducts = async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    const response = await fetch(
      `/api/admin/products?page=${page}&limit=${limit}&search=${search}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return {
      data: data.products,
      pagination: data.pagination,
    };
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowSheet(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setShowSheet(true);
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        setRefreshTrigger((prev) => prev + 1);
        return Promise.resolve();
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to delete product");
        return Promise.reject();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
      return Promise.reject();
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    setShowSheet(open);
    if (!open) {
      setEditingProduct(null);
    }
  };

  const handleFormSuccess = () => {
    setShowSheet(false);
    setRefreshTrigger((prev) => prev + 1);
    toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
  };

  const columns = getProductColumns(handleEditProduct, handleDeleteProduct);

  return (
    <div className="p-6">
      <DataTable
        title="Products Shop"
        columns={columns}
        fetchData={fetchProducts}
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        addButtonLabel="New Product"
        searchPlaceholder="Search products..."
        refreshTrigger={refreshTrigger}
      />

      <Sheet open={showSheet} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="flex flex-col h-full sm:max-w-4xl w-full">
          <SheetHeader>
            <SheetTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </SheetTitle>
            <SheetDescription>
              {editingProduct
                ? "Update the product details below."
                : "Fill in the details to create a new product (Book, Podcast, or Bundle)."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 px-1">
             <ProductForm
               initialData={editingProduct}
               onSuccess={handleFormSuccess}
               onCancel={() => handleSheetOpenChange(false)}
             />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
