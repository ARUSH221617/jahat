import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Mic, Layers, Clock, Users, ArrowRight,
  CheckCircle, GraduationCap, FileText, Headphones, Package
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Type config
const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  COURSE:  { label: "دوره آموزشی", icon: GraduationCap, color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200" },
  BOOK:    { label: "کتاب آموزشی", icon: BookOpen,      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  PODCAST: { label: "پادکست",      icon: Headphones,    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  BUNDLE:  { label: "پکیج آموزشی",icon: Package,        color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
};

function ItemCard({ item, meta, href }: { item: any; meta: React.ReactNode; href: string }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.BOOK;
  const Icon = cfg.icon;
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 p-4 rounded-2xl border ${cfg.border} ${cfg.bg} hover:shadow-md transition-all duration-200`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white border ${cfg.border}`}>
        <Icon className={`h-5 w-5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
        <div className="text-xs text-slate-500 mt-0.5">{meta}</div>
      </div>
      <ArrowRight className={`h-4 w-4 ${cfg.color} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`} />
    </Link>
  );
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
      books: true,
      podcasts: true,
      courses: {
        include: {
          instructor: { select: { name: true } },
          level: true,
        }
      },
      bundleItems: {
        include: {
          books: true,
          podcasts: true,
          courses: {
            include: {
              instructor: { select: { name: true } },
              level: true,
            }
          }
        }
      },
    }
  });

  if (!product) {
    notFound();
  }

  const bundleCourses  = product.bundleItems?.filter(item => item.type === "COURSE")  || [];
  const bundleBooks    = product.bundleItems?.filter(item => item.type === "BOOK")    || [];
  const bundlePodcasts = product.bundleItems?.filter(item => item.type === "PODCAST") || [];

  const currencySetting = await db.setting.findUnique({ where: { key: "currency" } });
  const currency = currencySetting?.value || "IRR";
  const isIrt = currency === "IRT";
  const displayPrice = isIrt ? Math.floor(product.price / 10) : product.price;
  const unit = isIrt ? "تومان" : "ریال";

  const cfg = TYPE_CONFIG[product.type] || TYPE_CONFIG.BOOK;
  const IconComp = cfg.icon;

  // Linked items for non-bundle types
  const linkedCourse  = product.type === "COURSE"  ? product.courses?.[0]  : null;
  const linkedBook    = product.type === "BOOK"    ? product.books?.[0]    : null;
  const linkedPodcast = product.type === "PODCAST" ? product.podcasts?.[0] : null;

  const hasContent =
    linkedCourse || linkedBook || linkedPodcast ||
    bundleCourses.length > 0 || bundleBooks.length > 0 || bundlePodcasts.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-16" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Back navigation */}
        <Button variant="ghost" asChild className="mb-6 hover:bg-slate-100 gap-2 pr-0">
          <Link href="/products">
            <ArrowRight className="h-4 w-4" />
            <span>بازگشت به محصولات</span>
          </Link>
        </Button>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 text-xs px-3 py-1 border shadow-sm font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}
                >
                  <IconComp className="h-4 w-4" />
                  {cfg.label}
                </Badge>
                {product.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                ))}
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900">{product.title}</h1>

              {/* Book metadata */}
              {(product.type === "BOOK" && linkedBook) && (
                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 text-sm text-slate-600">
                  <div>نویسنده: <span className="font-bold text-slate-800">{linkedBook.author || "جهت"}</span></div>
                  <div>تعداد صفحات: <span className="font-bold text-slate-800">{linkedBook.pages || 0} صفحه</span></div>
                </div>
              )}

              {/* Podcast metadata */}
              {(product.type === "PODCAST" && linkedPodcast) && (
                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 text-sm text-slate-600">
                  <div>میزبان / گوینده: <span className="font-bold text-slate-800">{linkedPodcast.host || "جهت"}</span></div>
                  <div>تعداد اپیزودها: <span className="font-bold text-slate-800">{linkedPodcast.episodes || 0} قسمت</span></div>
                </div>
              )}

              {/* Course metadata */}
              {(product.type === "COURSE" && linkedCourse) && (
                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    مدت: <span className="font-bold text-slate-800">{linkedCourse.duration || "نامشخص"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    مدرس: <span className="font-bold text-slate-800">{linkedCourse.instructor?.name || "نامشخص"}</span>
                  </div>
                </div>
              )}

              <div className="prose max-w-none text-slate-600 leading-relaxed space-y-4">
                <h3 className="text-lg font-bold text-slate-800">توضیحات محصول</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>

            {/* ─── Content Items Box ─── */}
            {hasContent && (
              <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                {/* Box header */}
                <div className="px-6 py-5 border-b flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">محتویات این محصول</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {product.type === "BUNDLE"
                        ? "با تهیه این پکیج به موارد زیر دسترسی خواهید داشت"
                        : "محتوای مرتبط با این محصول"}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">

                  {/* COURSE type — linked course card */}
                  {linkedCourse && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5" /> دوره آموزشی
                      </p>
                      <ItemCard
                        item={{ ...product, type: "COURSE" }}
                        href={`/courses/${linkedCourse.id}`}
                        meta={
                          <span className="flex items-center gap-3">
                            {linkedCourse.duration && (
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{linkedCourse.duration}</span>
                            )}
                            {linkedCourse.instructor?.name && (
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{linkedCourse.instructor.name}</span>
                            )}
                          </span>
                        }
                      />
                    </div>
                  )}

                  {/* BOOK type — linked book card */}
                  {linkedBook && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5" /> کتاب
                      </p>
                      <ItemCard
                        item={{ ...product, type: "BOOK" }}
                        href={`/products/${product.id}`}
                        meta={<span>{linkedBook.author || "نویسنده نامشخص"} · {linkedBook.pages || 0} صفحه</span>}
                      />
                    </div>
                  )}

                  {/* PODCAST type — linked podcast card */}
                  {linkedPodcast && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <Headphones className="h-3.5 w-3.5" /> پادکست
                      </p>
                      <ItemCard
                        item={{ ...product, type: "PODCAST" }}
                        href={`/products/${product.id}`}
                        meta={<span>{linkedPodcast.host || "گوینده نامشخص"} · {linkedPodcast.episodes || 0} اپیزود</span>}
                      />
                    </div>
                  )}

                  {/* BUNDLE: Courses */}
                  {bundleCourses.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5" /> دوره‌های شامل شده
                        <span className="bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 text-[10px] font-bold">{bundleCourses.length}</span>
                      </p>
                      <div className="space-y-2">
                        {bundleCourses.map((item) => {
                          const course = item.courses?.[0];
                          return (
                            <ItemCard
                              key={item.id}
                              item={{ ...item, type: "COURSE" }}
                              href={course ? `/courses/${course.id}` : `/products/${item.id}`}
                              meta={
                                <span className="flex items-center gap-3">
                                  {course?.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>}
                                  {course?.instructor?.name && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.instructor.name}</span>}
                                </span>
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUNDLE: Books */}
                  {bundleBooks.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5" /> کتاب‌های شامل شده
                        <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-[10px] font-bold">{bundleBooks.length}</span>
                      </p>
                      <div className="space-y-2">
                        {bundleBooks.map((item) => {
                          const book = item.books?.[0];
                          return (
                            <ItemCard
                              key={item.id}
                              item={{ ...item, type: "BOOK" }}
                              href={`/products/${item.id}`}
                              meta={<span>{book?.author || "نویسنده نامشخص"} · {book?.pages || 0} صفحه</span>}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUNDLE: Podcasts */}
                  {bundlePodcasts.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <Headphones className="h-3.5 w-3.5" /> پادکست‌های شامل شده
                        <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[10px] font-bold">{bundlePodcasts.length}</span>
                      </p>
                      <div className="space-y-2">
                        {bundlePodcasts.map((item) => {
                          const podcast = item.podcasts?.[0];
                          return (
                            <ItemCard
                              key={item.id}
                              item={{ ...item, type: "PODCAST" }}
                              href={`/products/${item.id}`}
                              meta={<span>{podcast?.host || "گوینده نامشخص"} · {podcast?.episodes || 0} اپیزود</span>}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Pricing & Checkout card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-3xl border shadow-lg overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={product.thumbnail || "https://placehold.co/600x400?text=Product"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="text-3xl font-extrabold text-slate-900 text-center">
                  {product.price === 0 ? (
                    <span className="text-green-600">رایگان</span>
                  ) : (
                    `${displayPrice.toLocaleString("fa-IR")} ${unit}`
                  )}
                </div>

                <Button className="w-full py-6 text-base bg-[#004e75] hover:bg-[#219ebc] text-white rounded-2xl shadow-md transition-all">
                  سفارش و دریافت محصول
                </Button>

                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-bold text-slate-800 text-sm">این خرید شامل موارد زیر است:</h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>دسترسی کامل و فوری بعد از سفارش</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>پشتیبانی آنلاین ۲۴ ساعته</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>ضمانت کیفیت محصول آموزشی</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
