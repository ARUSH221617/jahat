"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { Headphones, Plus } from "lucide-react";
import { getPodcastsColumns, PodcastAdminData } from "./podcasts-table";
import ImageUpload from "@/components/ui/image-upload";
import FileUpload from "@/components/ui/file-upload";
import Editor from "@/components/ui/editor";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

export default function PodcastsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<PodcastAdminData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    categoryId: "",
    host: "",
    episodes: "",
    audioUrl: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalCurrency, setGlobalCurrency] = useState("IRR");
  const [categories, setCategories] = useState<any[]>([]);

  // Category inline creation
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.currency) {
            setGlobalCurrency(data.currency);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/product-categories");
        if (res.ok) setCategories(await res.json());
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSettings();
    fetchCategories();
  }, [refreshTrigger]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setIsCreatingCat(true);
    try {
      const res = await fetch("/api/admin/product-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });
      if (res.ok) {
        const newCat = await res.json();
        toast.success("Category created successfully");
        setCategories((prev) => [...prev, newCat]);
        setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
        setNewCatName("");
      } else {
        toast.error("Failed to create category");
      }
    } catch (e) {
      toast.error("Error creating category");
    } finally {
      setIsCreatingCat(false);
    }
  };

  const fetchPodcasts = async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    const response = await fetch(
      `/api/admin/podcasts?page=${page}&limit=${limit}&search=${search}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch podcasts");
    }
    const data = await response.json();
    return {
      data: data.podcasts,
      pagination: data.pagination,
    };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (formData.price && isNaN(parseFloat(formData.price))) {
      errors.price = "Price must be a valid number";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }
    if (formData.episodes && isNaN(parseInt(formData.episodes))) {
      errors.episodes = "Episodes must be a valid number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const method = editingPodcast ? "PUT" : "POST";
      const url = "/api/admin/podcasts";

      const bodyData = editingPodcast
        ? {
            id: editingPodcast.id,
            ...formData,
            price: parseFloat(formData.price) || 0,
            episodes: parseInt(formData.episodes) || 0,
          }
        : {
            ...formData,
            price: parseFloat(formData.price) || 0,
            episodes: parseInt(formData.episodes) || 0,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Podcast ${editingPodcast ? "updated" : "created"} successfully`);
        setRefreshTrigger((prev) => prev + 1);
        handleOpenChange(false);
      } else {
        toast.error(result.error || `Failed to ${editingPodcast ? "update" : "create"} podcast`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred");
    }
  };

  const handleAddPodcast = () => {
    setEditingPodcast(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      thumbnail: "",
      categoryId: "",
      host: "",
      episodes: "",
      audioUrl: "",
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditPodcast = (podcast: PodcastAdminData) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description,
      price: podcast.price.toString(),
      thumbnail: podcast.thumbnail || "",
      categoryId: podcast.categoryId || "",
      host: podcast.host || "",
      episodes: podcast.episodes.toString(),
      audioUrl: podcast.audioUrl || "",
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleDeletePodcast = async (podcast: PodcastAdminData) => {
    try {
      const response = await fetch(`/api/admin/podcasts?id=${podcast.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Podcast deleted successfully");
        setRefreshTrigger((prev) => prev + 1);
        return Promise.resolve();
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to delete podcast");
        return Promise.reject();
      }
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error("An error occurred while deleting the podcast");
      return Promise.reject();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowAddModal(open);
    if (!open) {
      setEditingPodcast(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        thumbnail: "",
        categoryId: "",
        host: "",
        episodes: "",
        audioUrl: "",
      });
      setFormErrors({});
    }
  };

  const columns = getPodcastsColumns(handleEditPodcast, handleDeletePodcast);

  return (
    <div className="p-6">
      <DataTable
        title="Podcasts"
        columns={columns}
        fetchData={fetchPodcasts}
        onAdd={handleAddPodcast}
        onEdit={handleEditPodcast}
        onDelete={handleDeletePodcast}
        addButtonLabel="Add Podcast"
        searchPlaceholder="Search podcasts..."
        refreshTrigger={refreshTrigger}
      />

      <Sheet open={showAddModal} onOpenChange={handleOpenChange}>
        <SheetContent className="flex flex-col h-full sm:max-w-4xl w-full">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              <SheetTitle>{editingPodcast ? "Edit Podcast" : "Add New Podcast"}</SheetTitle>
            </div>
            <SheetDescription>
              {editingPodcast ? "Update the podcast details below." : "Fill in the details to create a new podcast."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 px-1">
            <form id="podcast-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full p-2 border rounded ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter podcast title"
                />
                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Editor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (IRR / ریال)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-background"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                  {formData.price && !isNaN(parseFloat(formData.price)) && globalCurrency === "IRT" && (
                    <p className="text-xs text-slate-500 mt-1">
                      Equivalent: {(parseFloat(formData.price) / 10).toLocaleString()} تومان
                    </p>
                  )}
                  {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category (دسته‌بندی)</label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1">
                      <Combobox
                        options={categories.map((c) => ({ label: c.name, value: c.id }))}
                        value={formData.categoryId}
                        onChange={(val) => setFormData({ ...formData, categoryId: val })}
                        placeholder="Select category..."
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 space-y-2">
                        <label className="text-xs font-semibold">New Category</label>
                        <input
                          type="text"
                          className="w-full p-1 text-sm border rounded bg-background"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="e.g., پادکست ریاضی"
                        />
                        <Button
                          type="button"
                          className="w-full text-xs h-7"
                          size="sm"
                          onClick={handleCreateCategory}
                          disabled={isCreatingCat}
                        >
                          {isCreatingCat ? "Creating..." : "Create"}
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {formErrors.categoryId && <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Host / Speaker</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter host name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Episodes</label>
                  <input
                    type="number"
                    value={formData.episodes}
                    onChange={(e) => setFormData({ ...formData, episodes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded bg-background"
                    placeholder="e.g., 12"
                    min="0"
                  />
                  {formErrors.episodes && <p className="text-red-500 text-sm mt-1">{formErrors.episodes}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Audio File URL (پادکست شنیداری)</label>
                <FileUpload
                  value={formData.audioUrl}
                  onChange={(url) => setFormData({ ...formData, audioUrl: url })}
                  accept="audio/*"
                  placeholder="Paste audio link or upload podcast file..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail</label>
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                />
              </div>
            </form>
          </div>

          <SheetFooter>
            <div className="flex justify-end gap-2 w-full">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" form="podcast-form">
                {editingPodcast ? "Update" : "Create"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
