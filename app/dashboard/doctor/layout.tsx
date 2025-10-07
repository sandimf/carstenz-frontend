'use client';

import { ThemeProvider } from "@/components/theme-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
          <main className="w-full">
            <div className="px-4">{children}</div>
          </main>
    </ThemeProvider>
  );
}
