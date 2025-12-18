import { Inter } from "next/font/google";
import "@/assets/css/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`custom-scrollbar overflow-y-hidden ${inter.className}`}>
        {children}
      </body>
    </html>
  );
};