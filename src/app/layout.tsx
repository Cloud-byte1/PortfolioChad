import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chad Carmichael — Design & Mechanical Engineer",
  description:
    "Portfolio of Chad Carmichael — design and mechanical engineering with an interactive SolidWorks CAD viewer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${body.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.setAttribute("data-theme",t);r.classList.toggle("dark",t==="dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-body min-h-full flex flex-col text-foreground">
        {children}
      </body>
    </html>
  );
}
