// import './globals.css'
"use client";
import HeaderLayout from "@/components/templates/HeaderLayout";
import AuthProvider from "@/provider/AuthProvider";
import LayoutProvider from "@/provider/LayoutProvider";
import ReactFormProvider from "@/provider/ReactFormProvider";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return (
      <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />
        <body>
          <AuthProvider>
            <LayoutProvider>
              <ReactFormProvider>{children}</ReactFormProvider>
            </LayoutProvider>
          </AuthProvider>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />
        <body>
          <AuthProvider>
            <LayoutProvider>
              <ReactFormProvider>
                <HeaderLayout>{children}</HeaderLayout>
              </ReactFormProvider>
            </LayoutProvider>
          </AuthProvider>
        </body>
      </html>
    );
  }
}
