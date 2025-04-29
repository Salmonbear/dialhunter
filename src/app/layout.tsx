import type { Metadata } from "next";
// Remove Geist font imports
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Remove Geist font variables
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  // Update title and description later
  title: "DialHunter",
  description: "Find Your Next Luxury Timepiece",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("--- RootLayout Rendering ---");
  return (
    <html lang="en">
      {/* Remove font variables from body className */}
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body>
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-796920049"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-796920049');
          `}
        </script>
        {children}
      </body>
    </html>
  );
}
