import '@repo/ui/styles.css';
import "./globals.css";
import type { Metadata } from "next";
import { MainLayout } from "./layout/MainLayout";
import { ThemeProvider } from "next-themes";
import { TanstackProvider } from "@repo/gql";
import { WebStoreProvider } from "@repo/reduxSetup";

export const metadata: Metadata = {
  title: "DevDocs_Terminal",
  description: "Technical Tutorials for Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">

          <WebStoreProvider>

            <TanstackProvider>

              <MainLayout>


                {children}


              </MainLayout>

            </TanstackProvider>


          </WebStoreProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
