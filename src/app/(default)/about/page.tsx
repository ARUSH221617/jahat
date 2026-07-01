"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Target, Eye, Award, BookOpen, Globe, Lightbulb } from "lucide-react";

const timelineEvents = [
  {
    year: "۲۰۰۱",
    title: "تاسیس جهت",
    description: "مؤسسه آموزشی جهت با چشم‌انداز ساخت یک سیستم آموزشی جامع، خودکفا و نخبه‌پرور تاسیس شد.",
    icon: Calendar,
    color: "bg-blue-600"
  },
  {
    year: "۲۰۰۶",
    title: "اولین برنامه آموزش مدرسان",
    description: "راه‌اندازی برنامه شاخص آموزش مدرسان با ۵۰ معلم پیشگام.",
    icon: Users,
    color: "bg-green-600"
  },
  {
    year: "۲۰۱۵",
    title: "توسعه برنامه درسی",
    description: "معرفی دوره‌های پیشرفته در روانشناسی تربیتی و مدیریت کلاس درس.",
    icon: BookOpen,
    color: "bg-purple-600"
  },
  {
    year: "۲۰۲۱",
    title: "تحول دیجیتال",
    description: "انتقال به مدل‌های یادگیری ترکیبی، با ادغام آموزش آنلاین و حضوری.",
    icon: Globe,
    color: "bg-orange-600"
  },
  {
    year: "۲۰۲۴",
    title: "سامانه مدیریت یادگیری جدید",
    description: "راه‌اندازی سامانه مدیریت یادگیری (LMS) پیشرفته با مسیرهای یادگیری شخصی‌سازی‌شده مبتنی بر هوش مصنوعی.",
    icon: Lightbulb,
    color: "bg-yellow-600"
  }
];

const teamMembers = [
  {
    name: "دکتر محمدرضا علوی",
    role: "مؤسس و مدیر عامل",
    description: "صاحب‌نظر آموزشی با بیش از ۲۵ سال تجربه در آموزش مدرسان.",
    avatar: "/api/placeholder/150/150"
  },
  {
    name: "پروفسور فاطمه محمدی",
    role: "مدیر آموزش",
    description: "متخصص روانشناسی تربیتی و توسعه برنامه درسی.",
    avatar: "/api/placeholder/150/150"
  },
  {
    name: "دکتر علی کاظمی",
    role: "رئیس برنامه‌های آموزشی",
    description: "متخصص روش‌های نوین تدریس و فناوری‌های آموزشی.",
    avatar: "/api/placeholder/150/150"
  },
  {
    name: "سرکار خانم مریم حسینی",
    role: "مدیر امور دانشجویان",
    description: "متعهد به موفقیت دانشجویان و پشتیبانی از توسعه مسیر شغلی.",
    avatar: "/api/placeholder/150/150"
  }
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Jahat Educational Institute",
      "foundingDate": "2001",
      "employees": teamMembers.map(member => ({
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "description": member.description
      }))
    }
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4 animate-fade-in">
              <Badge className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                درباره موسسه ما
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                درباره مؤسسه آموزشی جهت
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                جهت نمادی از سرآمدی آموزشی است که به توانمندسازی دانش‌آموزان و متحول کردن زندگی آن‌ها از طریق آموزش‌های باکیفیت اختصاص یافته است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  داستان ما
                </h2>
                <div className="h-1 w-20 bg-yellow-400 rounded"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                مؤسسه آموزشی جهت با چشم‌اندازی روشن برای ساخت یک محیط یادگیری نخبه‌پرور شکل گرفت: ایجاد مؤسسه‌ای در سطح جهانی که دانشجویان را توانمند ساخته و آینده جوانان بااستعداد را رقم می‌زند. آنچه با گروه کوچکی از دانش‌آموزان آغاز شد، اکنون به یک مرکز آموزشی پیشرو تبدیل شده است که سالانه به بیش از ۱,۲۰۰ شرکت‌کننده خدمت‌رسانی می‌کند.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                در طول دو دهه گذشته، ما متعهد به اصول بنیادی خود یعنی سرآمدی، نوآوری و همه‌گیری باقی مانده‌ایم. برنامه‌های ما برای پاسخگویی به نیازهای در حال تغییر آموزش قرن بیست و یکم تکامل یافته و روش‌های نوین تدریس و فناوری‌های آموزشی روز را در بر گرفته‌اند.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-bold text-2xl text-gray-900">۲۰+</p>
                    <p className="text-gray-600">سال سابقه درخشان</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-bold text-2xl text-gray-900">۱,۲۰۰+</p>
                    <p className="text-gray-600">دانش‌آموخته</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/api/placeholder/600/400"
                alt="Jahat Campus Building"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (GEO Optimized) */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              پرسش‌های متداول
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              پاسخ به سوالات رایج در مورد دوره‌ها و مدارک جهت
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">آیا مدارک جهت معتبر هستند؟</h3>
              <p className="text-gray-600">بله، جهت یک موسسه آموزشی کاملاً معتبر است و مدارک آن مورد تایید سازمان‌های مربوطه می‌باشد.</p>
            </div>
            <div className="border rounded-lg p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-2">مدت زمان دوره‌ها چقدر است؟</h3>
               <p className="text-gray-600">مدت زمان دوره‌ها از کارگاه‌های کوتاه مهارتی (۱ تا ۴ هفته) تا دوره‌های جامع مهارتی (بیش از ۹ هفته) متغیر است.</p>
            </div>
             <div className="border rounded-lg p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-2">چگونه گواهینامه دوره را دریافت کنم؟</h3>
               <p className="text-gray-600">پس از تکمیل موفقیت‌آمیز تمام مباحث دوره و قبولی در ارزیابی نهایی، گواهینامه معتبر دیجیتال و فیزیکی شما صادر خواهد شد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              مسیر توسعه ما در گذر زمان
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقاط عطف کلیدی که موسسه ما را شکل داده و دستاوردهای ما را تعریف کرده‌اند
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 hidden lg:block"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full z-10 hidden lg:block"></div>
                  
                  {/* Content */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pe-12 lg:text-end' : 'lg:ps-12 lg:text-start lg:ms-auto'}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                          <div className={`${event.color} text-white p-3 rounded-full`}>
                            <event.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              {event.year}
                            </Badge>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">{event.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">ماموریت ما</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                توانمندسازی فراگیران با استفاده از روش‌های نوین تدریس، روانشناسی تربیتی و مهارت‌های رهبری برای خلق تجربه‌های یادگیری متحول‌کننده. ما متعهد به ارتقای سرآمدی در آموزش از طریق برنامه‌های جامع توسعه حرفه‌ای هستیم که تئوری را با کاربردهای عملی ترکیب می‌کند.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">آموزش و تربیت باکیفیت فراگیران و مدرسان</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">روش‌های تدریس مبتنی بر پژوهش و تجربه</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">توسعه مداوم مهارت‌های حرفه‌ای فراگیران</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Eye className="h-10 w-10 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">چشم‌انداز ما</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                تبدیل شدن به موسسه آموزشی پیشرو در منطقه، شناخته‌شده برای سرآمدی در آموزش، نوآوری در تدریس و سهم موثر ما در پیشرفت علمی جامعه. ما در تلاشیم تا جامعه‌ای از متخصصان خلاق و اثرگذار ایجاد کنیم.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">رهبری منطقه‌ای در آموزش مهارت‌های تخصصی</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">نوآوری در به‌کارگیری فناوری‌های آموزشی نوین</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">شناخت و اعتبار ملی و منطقه‌ای برای کیفیت آموزش</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              با تیم رهبری ما آشنا شوید
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              متخصصان متعهدی که به سرآمدی و نوآوری آموزشی پایبند هستند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-6 space-y-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <Badge variant="secondary" className="mt-2">{member.role}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              به میراث سرآمدی ما بپیوندید
            </h2>
            <p className="text-xl text-blue-100">
              عضوی از جامعه‌ای شوید که آینده آموزش را شکل می‌دهد و مسیرهای شغلی واقعی می‌سازد.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors">
                مشاهده برنامه‌های ما
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                تنظیم زمان بازدید
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
