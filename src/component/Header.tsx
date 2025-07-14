'use client'
import Link from 'next/link';

export default function Header() {
  return (
    <header className="p-4 bg-blue-500 text-white">
      <nav className="space-x-4">
        <Link href="/">🏠 Trang chủ</Link>
        <Link href="/about">📄 Giới thiệu</Link>
      </nav>
    </header>
  );
}
