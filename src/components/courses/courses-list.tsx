"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Clock, Users, BookOpen, Star, SlidersHorizontal, GraduationCap, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

const COURSES_PER_PAGE = 9;

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string | null;
  price: number;
  currency?: string;
  thumbnail: string | null;
  instructor: string;
  rating?: number;
  students?: number;
}

interface CoursesListProps {
  initialCourses: Course[];
  totalCourses: number;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "Beginner":     { label: "مبتدی",    color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  "Intermediate": { label: "متوسط",    color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200" },
  "Advanced":     { label: "پیشرفته",  color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200" },
};

function getLevelCfg(level: string) {
  return LEVEL_CONFIG[level] || { label: level, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" };
}

function FilterLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm py-2 px-3 rounded-xl transition-all duration-200 text-right w-full ${
        active
          ? "bg-[#004e75] text-white font-semibold shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function CoursesList({ initialCourses, totalCourses }: CoursesListProps) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(COURSES_PER_PAGE);

  // Unique categories from data
  const categories = useMemo(() => {
    const all = initialCourses.map((c) => c.category).filter(Boolean);
    return ["All", ...Array.from(new Set(all))];
  }, [initialCourses]);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = useMemo(() => {
    let list = [...initialCourses];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)
      );
    }
    if (selectedLevel !== "All") list = list.filter((c) => c.level === selectedLevel);
    if (selectedCategory !== "All") list = list.filter((c) => c.category === selectedCategory);
    return list;
  }, [initialCourses, search, selectedLevel, selectedCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setSearch("");
    setSelectedLevel("All");
    setSelectedCategory("All");
    setVisibleCount(COURSES_PER_PAGE);
  };

  const isFiltered = search || selectedLevel !== "All" || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/80 pt-28 pb-20" dir="rtl">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[#004e75] via-[#0369a1] to-[#219ebc] text-white">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
            <GraduationCap className="h-3.5 w-3.5" />
            دوره‌های آموزشی تخصصی
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            دوره‌های آموزشی <span className="text-[#8ecae6]">جهت</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            برنامه‌های مهارتی جامعی که برای ارتقای توانایی‌های شما طراحی شده‌اند را کاوش کنید
          </p>

          {/* Hero search */}
          <div className="max-w-lg mx-auto relative mt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(COURSES_PER_PAGE); }}
              placeholder="جستجو در دوره‌ها..."
              className="w-full pr-5 pl-12 py-3.5 text-sm rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-200" />
          </div>

          {/* Level pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {levels.map((lvl) => {
              const cfg = lvl === "All" ? null : getLevelCfg(lvl);
              return (
                <button
                  key={lvl}
                  onClick={() => { setSelectedLevel(lvl); setVisibleCount(COURSES_PER_PAGE); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    selectedLevel === lvl
                      ? "bg-white text-[#004e75] border-white shadow-md"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {lvl === "All" ? "همه سطوح" : cfg?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 mt-10">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── Sidebar ── */}
          <aside className="space-y-5 lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#219ebc]" />
                <h3 className="font-bold text-slate-800 text-sm">دسته‌بندی</h3>
              </div>
              <div className="p-3 space-y-1">
                <FilterLink active={selectedCategory === "All"} onClick={() => { setSelectedCategory("All"); setVisibleCount(COURSES_PER_PAGE); }}>
                  همه دسته‌بندی‌ها
                </FilterLink>
                {categories.filter((c) => c !== "All").map((cat) => (
                  <FilterLink key={cat} active={selectedCategory === cat} onClick={() => { setSelectedCategory(cat); setVisibleCount(COURSES_PER_PAGE); }}>
                    {cat}
                  </FilterLink>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-gradient-to-br from-[#004e75] to-[#219ebc] rounded-2xl p-5 text-white space-y-4">
              <p className="text-xs font-semibold text-blue-200">آمار دوره‌ها</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{totalCourses}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5">دوره</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{categories.length - 1}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5">دسته‌بندی</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                بهترین دوره‌های آموزشی برای پیشرفت شما
              </p>
            </div>
          </aside>

          {/* ── Courses Grid ── */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">{filtered.length}</span> دوره یافت شد
              </p>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#219ebc] hover:text-[#004e75] transition-colors font-medium"
                >
                  پاک کردن فیلترها ×
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <div className="bg-white text-center py-24 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">هیچ دوره‌ای پیدا نشد</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">لطفاً فیلترها را تغییر داده یا مجدداً جستجو کنید.</p>
                <Button onClick={clearFilters} variant="outline" size="sm" className="rounded-xl mt-2">
                  مشاهده همه دوره‌ها
                </Button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visible.map((course) => {
                    const levelCfg = getLevelCfg(course.level);
                    const isIrt = course.currency === "IRT";
                    const displayPrice = isIrt ? Math.floor(course.price / 10) : course.price;
                    const unit = isIrt ? "تومان" : "ریال";

                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-violet-100 hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
                              <GraduationCap className="h-12 w-12 text-violet-200" />
                            </div>
                          )}

                          {/* Level badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${levelCfg.color} ${levelCfg.bg} ${levelCfg.border}`}>
                              {levelCfg.label}
                            </span>
                          </div>

                          {/* Price badge */}
                          <div className="absolute bottom-3 left-3">
                            {course.price === 0 ? (
                              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow-sm">
                                رایگان
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow-sm border">
                                {displayPrice.toLocaleString("fa-IR")} {unit}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-1 p-4 space-y-3">
                          {/* Category */}
                          {course.category && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 self-start">
                              {course.category}
                            </span>
                          )}

                          {/* Title */}
                          <h2 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-[#219ebc] transition-colors">
                            {course.title}
                          </h2>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {course.instructor}
                            </span>
                            {course.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.round(course.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                              />
                            ))}
                            <span className="text-[10px] text-slate-500 mr-1">{course.rating?.toFixed(1)} · {course.students} دانشجو</span>
                          </div>

                          {/* CTA */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <span className="text-[11px] text-slate-400">مشاهده دوره</span>
                            <span className="w-7 h-7 rounded-full flex items-center justify-center bg-violet-50 text-violet-600 group-hover:bg-[#004e75] group-hover:text-white transition-colors">
                              <ArrowLeft className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => setVisibleCount((v) => v + COURSES_PER_PAGE)}
                      variant="outline"
                      className="rounded-2xl px-8 border-[#219ebc] text-[#219ebc] hover:bg-[#219ebc] hover:text-white transition-all"
                    >
                      دوره‌های بیشتر ({filtered.length - visibleCount} مورد)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
