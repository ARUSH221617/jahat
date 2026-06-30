export const metadata = {
  title: 'ورود | جهت',
  description: 'ورود به پنل کاربری مؤسسه آموزشی جهت',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
