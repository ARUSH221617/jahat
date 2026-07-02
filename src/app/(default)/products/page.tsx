import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, BookOpen, Headphones, Package,
  Search, SlidersHorizontal, ArrowLeft, Star, TrendingUp,
  Clock, FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "فروشگاه محصولات | جهت",
  description: "کتاب‌های تخصصی ریاضی، پادکست‌های آموزشی و پکیج‌های ویژه موسسه جهت را مشاهده و تهیه فرمایید.",
};

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; border: string; glow: string }> = {
  BOOK:    { label: "کتاب آموزشی",  icon: BookOpen,   color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", glow: "group-hover:shadow-emerald-100" },
  PODCAST: { label: "پادکست",       icon: Headphones, color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    glow: "group-hover:shadow-blue-100" },
  BUNDLE:  { label: "پکیج آموزشی", icon: Package,    color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   glow: "group-hover:shadow-amber-100" },
};

function FilterLink({ href, active, children }: { href: any; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm py-2 px-3 rounded-xl transition-all duration-200 text-right w-full ${
        active
          ? "bg-[#004e75] text-white font-semibold shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; search?: string }>;
}) {
  const { type, category, search } = await searchParams;

  const where: any = {
    type: type ? type : { in: ["BOOK", "PODCAST", "BUNDLE"] },
  };
  if (category && category !== "All") where.categories = { some: { slug: category } };
  if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];

  const [products, categories, currencySetting] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { categories: true, books: true, podcasts: true, bundleItems: true },
    }),
    db.productCategory.findMany({ orderBy: { name: "asc" } }),
    db.setting.findUnique({ where: { key: "currency" } }),
  ]);

  const currency = currencySetting?.value || "IRR";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/80 pt-28 pb-20" dir="rtl">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-l from-[#004e75] via-[#0369a1] to-[#219ebc] text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
            <ShoppingBag className="h-3.5 w-3.5" />
            فروشگاه محصولات آموزشی
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            محصولات آموزشی <span className="text-[#8ecae6]">جهت</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            کتاب‌های تخصصی، پادکست‌های شنیداری و پکیج‌های ویژه دوره‌ها را کشف کنید
          </p>

          {/* Search bar in hero */}
          <form method="GET" className="max-w-lg mx-auto relative mt-2">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="جستجو در محصولات..."
              className="w-full pr-5 pl-12 py-3.5 text-sm rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
              <Search className="h-4 w-4" />
            </button>
            {type && <input type="hidden" name="type" value={type} />}
            {category && <input type="hidden" name="category" value={category} />}
          </form>

          {/* Type filter tabs in hero */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href={{ pathname: "/products", query: { ...(category && { category }), ...(search && { search }) } }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                !type ? "bg-white text-[#004e75] border-white shadow-md" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              همه
            </Link>
            {Object.entries(TYPE_CONFIG).map(([key, val]) => {
              const Icon = val.icon;
              return (
                <Link
                  key={key}
                  href={{ pathname: "/products", query: { type: key, ...(category && { category }), ...(search && { search }) } }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    type === key ? "bg-white text-[#004e75] border-white shadow-md" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {val.label}
                </Link>
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
                <FilterLink
                  href={{ pathname: "/products", query: { ...(type && { type }), ...(search && { search }) } }}
                  active={!category || category === "All"}
                >
                  <span>همه دسته‌بندی‌ها</span>
                </FilterLink>
                {categories.map((cat) => (
                  <FilterLink
                    key={cat.id}
                    href={{ pathname: "/products", query: { category: cat.slug, ...(type && { type }), ...(search && { search }) } }}
                    active={category === cat.slug}
                  >
                    {cat.name}
                  </FilterLink>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-gradient-to-br from-[#004e75] to-[#219ebc] rounded-2xl p-5 text-white space-y-4">
              <p className="text-xs font-semibold text-blue-200">آمار فروشگاه</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{products.length}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5">محصول</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{categories.length}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5">دسته‌بندی</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                بهترین منابع آموزشی برای پیشرفت شما در جهت جمع‌آوری شده است
              </p>
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <div className="lg:col-span-3">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">{products.length}</span> محصول یافت شد
              </p>
              {(type || category || search) && (
                <Link
                  href="/products"
                  className="text-xs text-[#219ebc] hover:text-[#004e75] transition-colors font-medium"
                >
                  پاک کردن فیلترها ×
                </Link>
              )}
            </div>

            {products.length === 0 ? (
              <div className="bg-white text-center py-24 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">هیچ محصولی پیدا نشد</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">لطفاً فیلترها را تغییر داده یا مجدداً جستجو کنید.</p>
                <Button asChild variant="outline" size="sm" className="rounded-xl mt-2">
                  <Link href="/products">مشاهده همه محصولات</Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => {
                  const cfg = TYPE_CONFIG[product.type] || { label: "محصول", icon: ShoppingBag, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", glow: "" };
                  const Icon = cfg.icon;
                  const isIrt = currency === "IRT";
                  const displayPrice = isIrt ? Math.floor(product.price / 10) : product.price;
                  const unit = isIrt ? "تومان" : "ریال";

                  // Subtype meta
                  const book    = (product as any).books?.[0];
                  const podcast = (product as any).podcasts?.[0];
                  const bundleCount = (product as any).bundleItems?.length || 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={`group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl ${cfg.glow} hover:-translate-y-1 transition-all duration-300`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={product.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=محصول"}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Type badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </div>
                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          {product.price === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow-sm">
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
                        {/* Categories */}
                        {product.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.categories.slice(0, 2).map((cat) => (
                              <span key={cat.id} className="text-[10px] text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-[#219ebc] transition-colors">
                          {product.title}
                        </h2>

                        {/* Subtype metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-auto">
                          {book && (
                            <>
                              <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{book.pages || 0} صفحه</span>
                              {book.author && <span className="flex items-center gap-1">{book.author}</span>}
                            </>
                          )}
                          {podcast && (
                            <>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{podcast.episodes || 0} اپیزود</span>
                              {podcast.host && <span>{podcast.host}</span>}
                            </>
                          )}
                          {product.type === "BUNDLE" && (
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {bundleCount} مورد شامل
                            </span>
                          )}
                        </div>

                        {/* CTA */}
                        <div className={`flex items-center justify-between pt-3 border-t border-slate-50`}>
                          <span className="text-[11px] text-slate-400">مشاهده جزئیات</span>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center ${cfg.bg} ${cfg.color} group-hover:bg-[#004e75] group-hover:text-white transition-colors`}>
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
