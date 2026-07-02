"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { GraduationCap, Plus } from "lucide-react";
import { getCoursesColumns, CourseWithInstructor } from "./courses-table";
import ImageUpload from "@/components/ui/image-upload";
import { InstructorSelect } from "@/components/ui/instructor-select";
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

interface User {
  id: string;
  name: string;
}

export default function CoursesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] =
    useState<CourseWithInstructor | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructorId: "",
    price: "",
    duration: "",
    thumbnail: "",
    categoryId: "",
    levelId: "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [instructors, setInstructors] = useState<User[]>([]);
  const [globalCurrency, setGlobalCurrency] = useState("IRR");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  // Category inline creation
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  // Level inline creation
  const [newLevelName, setNewLevelName] = useState("");
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);

  // Fetch instructors, categories, levels, and settings
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setInstructors(data.users || []);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

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

    const fetchCategoriesAndLevels = async () => {
      try {
        const [catsRes, levelsRes] = await Promise.all([
          fetch("/api/admin/product-categories"),
          fetch("/api/admin/course-levels"),
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (levelsRes.ok) setLevels(await levelsRes.json());
      } catch (error) {
        console.error("Error fetching categories or levels:", error);
      }
    };

    fetchInstructors();
    fetchSettings();
    fetchCategoriesAndLevels();
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

  const handleCreateLevel = async () => {
    if (!newLevelName.trim()) return;
    setIsCreatingLevel(true);
    try {
      const res = await fetch("/api/admin/course-levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLevelName }),
      });
      if (res.ok) {
        const newLvl = await res.json();
        toast.success("Level created successfully");
        setLevels((prev) => [...prev, newLvl]);
        setFormData((prev) => ({ ...prev, levelId: newLvl.id }));
        setNewLevelName("");
      } else {
        toast.error("Failed to create level");
      }
    } catch (e) {
      toast.error("Error creating level");
    } finally {
      setIsCreatingLevel(false);
    }
  };

  const fetchCourses = async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    const response = await fetch(
      `/api/admin/courses?page=${page}&limit=${limit}&search=${search}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    const data = await response.json();
    return {
      data: data.courses,
      pagination: data.pagination,
    };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.instructorId) {
      errors.instructorId = "Instructor is required";
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      errors.price = "Price must be a valid number";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }

    if (!formData.levelId) {
      errors.levelId = "Level is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = "/api/admin/courses";

      const bodyData = editingCourse
        ? {
            id: editingCourse.id,
            ...formData,
            price: parseFloat(formData.price) || 0,
          }
        : {
            ...formData,
            price: parseFloat(formData.price) || 0,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Course ${editingCourse ? "updated" : "created"} successfully`
        );
        setRefreshTrigger((prev) => prev + 1);
        handleOpenChange(false);
      } else {
        toast.error(
          result.error ||
            `Failed to ${editingCourse ? "update" : "create"} course`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred");
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      instructorId: "",
      price: "",
      duration: "",
      thumbnail: "",
      categoryId: "",
      levelId: "",
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditCourse = (course: CourseWithInstructor) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructorId: course.instructor.id,
      price: course.price.toString(),
      duration: course.duration,
      thumbnail: course.thumbnail || "",
      categoryId: course.categoryId || "",
      levelId: course.levelId || "",
    });
    setShowAddModal(true);
  };

  const handleDeleteCourse = async (course: CourseWithInstructor) => {
    try {
      const response = await fetch(`/api/admin/courses?id=${course.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Course deleted successfully");
        setRefreshTrigger((prev) => prev + 1);
        return Promise.resolve();
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to delete course");
        return Promise.reject();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("An error occurred while deleting the course");
      return Promise.reject();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowAddModal(open);
    if (!open) {
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        instructorId: "",
        price: "",
        duration: "",
        thumbnail: "",
        categoryId: "",
        levelId: "",
      });
      setFormErrors({});
    }
  };

  const columns = getCoursesColumns(handleEditCourse, handleDeleteCourse);

  return (
    <div className="p-6">
      <DataTable
        title="Courses"
        columns={columns}
        fetchData={fetchCourses}
        onAdd={handleAddCourse}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        addButtonLabel="Add Course"
        searchPlaceholder="Search courses..."
        refreshTrigger={refreshTrigger}
      />

      <Sheet open={showAddModal} onOpenChange={handleOpenChange}>
        <SheetContent className="flex flex-col h-full sm:max-w-4xl w-full">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <SheetTitle>
                {editingCourse ? "Edit Course" : "Add New Course"}
              </SheetTitle>
            </div>
            <SheetDescription>
              {editingCourse
                ? "Update the course details below."
                : "Fill in the details to create a new course."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 px-1">
            <form
              id="course-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full p-2 border rounded ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter course title"
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Editor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Instructor
                </label>
                <InstructorSelect
                  value={formData.instructorId}
                  onChange={(value) =>
                    setFormData({ ...formData, instructorId: value })
                  }
                  instructors={instructors}
                  error={formErrors.instructorId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (IRR / ریال)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
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
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., 6 weeks, 40 hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category (دسته‌بندی)
                  </label>
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
                          placeholder="e.g., ریاضی متوسطه"
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
                  {formErrors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Level (سطح / پایه)
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1">
                      <Combobox
                        options={levels.map((l) => ({ label: l.name, value: l.id }))}
                        value={formData.levelId}
                        onChange={(val) => setFormData({ ...formData, levelId: val })}
                        placeholder="Select level..."
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 space-y-2">
                        <label className="text-xs font-semibold">New Level</label>
                        <input
                          type="text"
                          className="w-full p-1 text-sm border rounded bg-background"
                          value={newLevelName}
                          onChange={(e) => setNewLevelName(e.target.value)}
                          placeholder="e.g., کلاس هفتم"
                        />
                        <Button
                          type="button"
                          className="w-full text-xs h-7"
                          size="sm"
                          onClick={handleCreateLevel}
                          disabled={isCreatingLevel}
                        >
                          {isCreatingLevel ? "Creating..." : "Create"}
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {formErrors.levelId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.levelId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thumbnail
                </label>
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) =>
                    setFormData({ ...formData, thumbnail: url })
                  }
                />
              </div>
            </form>
          </div>

          <SheetFooter>
            <div className="flex justify-end gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" form="course-form">
                {editingCourse ? "Update" : "Create"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
