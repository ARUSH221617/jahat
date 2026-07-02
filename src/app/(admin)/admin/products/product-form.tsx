"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import dynamic from "next/dynamic";
import { AdminProduct } from "./columns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema } from "@/lib/validations";
import { Combobox } from "@/components/ui/combobox";
import { X } from "lucide-react";

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/ui/editor"), { ssr: false });

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData: AdminProduct | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  name: string;
}

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("IRR");

  // Bundle selection lists
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [availableBooks, setAvailableBooks] = useState<any[]>([]);
  const [availablePodcasts, setAvailablePodcasts] = useState<any[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      thumbnail: "",
      type: "BOOK",
      categoryIds: [],
      tags: "",
      courseId: "",
      author: "",
      pages: 0,
      host: "",
      episodes: 0,
      courseIds: [],
      bookIds: [],
      podcastIds: [],
    },
  });

  const selectedType = form.watch("type");
  const priceValue = form.watch("price");
  const selectedCourseIds = form.watch("courseIds") || [];
  const selectedBookIds = form.watch("bookIds") || [];
  const selectedPodcastIds = form.watch("podcastIds") || [];

  // Fetch full details if editing
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (initialData?.id) {
        try {
          const res = await fetch(`/api/admin/products/${initialData.id}`);
          if (res.ok) {
            const data = await res.json();
            form.reset({
              title: data.title,
              description: data.description,
              price: data.price,
              thumbnail: data.thumbnail || "",
              type: data.type as any,
              categoryIds: data.categories.map((c: any) => c.id),
              tags: data.tags.map((t: any) => t.name).join(", "),
              courseId: data.courses?.[0]?.id || "",
              author: data.books?.[0]?.author || "",
              pages: data.books?.[0]?.pages || 0,
              host: data.podcasts?.[0]?.host || "",
              episodes: data.podcasts?.[0]?.episodes || 0,
              courseIds: data.bundleItems?.filter((item: any) => item.type === "COURSE").map((item: any) => item.id) || [],
              bookIds: data.bundleItems?.filter((item: any) => item.type === "BOOK").map((item: any) => item.id) || [],
              podcastIds: data.bundleItems?.filter((item: any) => item.type === "PODCAST").map((item: any) => item.id) || [],
            });
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch product details");
        }
      }
    };

    fetchProductDetails();
  }, [initialData, form]);

  // Fetch categories, settings, and bundle items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, settingsRes, coursesRes, productsRes] = await Promise.all([
          fetch("/api/admin/product-categories"),
          fetch("/api/settings"),
          fetch("/api/admin/courses?limit=100"),
          fetch("/api/admin/products?limit=100"),
        ]);

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCurrency(settings.currency || "IRR");
        }

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setAvailableCourses(coursesData.courses || []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const allProducts = productsData.products || [];
          setAvailableBooks(allProducts.filter((p: any) => p.type === "BOOK"));
          setAvailablePodcasts(allProducts.filter((p: any) => p.type === "PODCAST"));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/admin/products/${initialData.id}`
        : `/api/admin/products`;

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Something went wrong");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Product Type</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!initialData}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOOK">Book</SelectItem>
                    <SelectItem value="PODCAST">Podcast</SelectItem>
                    <SelectItem value="BUNDLE">Bundle</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Product Title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (Rial)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Price in IRR"
              {...form.register("price", { valueAsNumber: true })}
            />
            {currency === "IRT" && priceValue > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Equivalent: {Math.floor(priceValue / 10).toLocaleString("fa-IR")} تومان
              </p>
            )}
            {form.formState.errors.price && (
              <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <Controller
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <ImageUpload
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Conditional Subtype Fields */}
        {selectedType === "COURSE" && (
          <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50">
            <Label htmlFor="courseId">Connect to Course</Label>
            <Controller
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <Combobox
                  options={availableCourses.map((c) => ({ label: c.title, value: c.id }))}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select a course to link..."
                />
              )}
            />
          </div>
        )}

        {selectedType === "BOOK" && (
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50/50">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Book Author"
                {...form.register("author")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Number of Pages</Label>
              <Input
                id="pages"
                type="number"
                placeholder="Pages"
                {...form.register("pages", { valueAsNumber: true })}
              />
            </div>
          </div>
        )}

        {selectedType === "PODCAST" && (
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50/50">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="Podcast Host"
                {...form.register("host")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="episodes">Number of Episodes</Label>
              <Input
                id="episodes"
                type="number"
                placeholder="Episodes count"
                {...form.register("episodes", { valueAsNumber: true })}
              />
            </div>
          </div>
        )}

        {selectedType === "BUNDLE" && (
          <div className="border p-4 rounded-lg bg-slate-50/50 space-y-4">
            <h4 className="font-semibold text-sm">Bundle Items (Select what is included)</h4>
            
            {/* Courses list */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Courses</Label>
              <Combobox
                options={availableCourses
                  .filter((c) => !selectedCourseIds.includes(c.productId))
                  .map((c) => ({ label: c.title, value: c.productId }))}
                value=""
                onChange={(val) => {
                  if (val) {
                    form.setValue("courseIds", [...selectedCourseIds, val]);
                  }
                }}
                placeholder="Select course to add..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCourseIds.map((id: string) => {
                  const course = availableCourses.find((c) => c.productId === id);
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {course?.title || "دوره"}
                      <button
                        type="button"
                        onClick={() => form.setValue("courseIds", selectedCourseIds.filter((cid) => cid !== id))}
                        className="text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Books list */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Books</Label>
              <Combobox
                options={availableBooks
                  .filter((b) => !selectedBookIds.includes(b.id))
                  .map((b) => ({ label: b.title, value: b.id }))}
                value=""
                onChange={(val) => {
                  if (val) {
                    form.setValue("bookIds", [...selectedBookIds, val]);
                  }
                }}
                placeholder="Select book to add..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBookIds.map((id: string) => {
                  const book = availableBooks.find((b) => b.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {book?.title || "کتاب"}
                      <button
                        type="button"
                        onClick={() => form.setValue("bookIds", selectedBookIds.filter((bid) => bid !== id))}
                        className="text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Podcasts list */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Podcasts</Label>
              <Combobox
                options={availablePodcasts
                  .filter((p) => !selectedPodcastIds.includes(p.id))
                  .map((p) => ({ label: p.title, value: p.id }))}
                value=""
                onChange={(val) => {
                  if (val) {
                    form.setValue("podcastIds", [...selectedPodcastIds, val]);
                  }
                }}
                placeholder="Select podcast to add..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPodcastIds.map((id: string) => {
                  const podcast = availablePodcasts.find((p) => p.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {podcast?.title || "پادکست"}
                      <button
                        type="button"
                        onClick={() => form.setValue("podcastIds", selectedPodcastIds.filter((pid) => pid !== id))}
                        className="text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Editor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map((cat) => {
              const selected = form.watch("categoryIds")?.includes(cat.id);
              return (
                <Badge
                  key={cat.id}
                  variant={selected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const current = form.getValues("categoryIds") || [];
                    if (selected) {
                      form.setValue("categoryIds", current.filter((id) => id !== cat.id));
                    } else {
                      form.setValue("categoryIds", [...current, cat.id]);
                    }
                  }}
                >
                  {cat.name}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            placeholder="math, tutorial, freebie"
            {...form.register("tags")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
