'use client';
import { TanstackProvider } from '@/component/provider/TanStackProvider';
import './globals.css'
import MainLayout from '@/component/MainLayout';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <TanstackProvider>
          <MainLayout>
            {children}
            <ToastContainer /> {/* đặt cuối body */}
          </MainLayout>
        </TanstackProvider>
      </body>
    </html>
  );
}
