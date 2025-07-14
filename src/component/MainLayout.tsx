'use client'
import Header from './Header'
import Footer from './Footer'
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="p-4">{children}</main>
      <Footer />
    </>
  );
}
