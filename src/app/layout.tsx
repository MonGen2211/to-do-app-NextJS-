'use client';
import { TanstackProvider } from '@/component/provider/TanStackProvider';
import './globals.css'
import MainLayout from '@/component/MainLayout';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from "react-redux";
import store from "../store/store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <TanstackProvider>
          <MainLayout>
            <Provider store={store}>
              {children}
            </Provider>
            <ToastContainer /> {/* đặt cuối body */}
          </MainLayout>
        </TanstackProvider>
      </body>
    </html>
  );
}
