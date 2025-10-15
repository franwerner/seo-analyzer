import { fontSans } from "@/config/fonts";
import "@/src/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import Breadcrumbs from "@/src/common/components/Breadcrums.component";

export const metadata: Metadata = {
  title: {
    default: "SEO Analizer",
    template: `SEO Analizer`,
  },
  description: "SEO Analizer",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen flex flex-col bg-default-50 text-foreground font-sans antialiased",

          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Breadcrumbs />
          {children}
        </Providers>
      </body>
    </html>
  );
}
