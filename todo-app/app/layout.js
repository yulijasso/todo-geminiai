import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import ChatbotFloat from "@/components/ChatbotFloat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My To-Do List",
  description: "A minimalistic todo app built with Next.js and Chakra UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          {children}
          <ChatbotFloat />
        </Provider>
      </body>
    </html>
  );
}
