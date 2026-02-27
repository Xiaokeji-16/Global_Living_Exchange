import "./globals.css";
import  type { ReactNode } from "react";
import { Footer } from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";

export const metadata = {
    title: "Global Living Exchange",
    description: "A platform for home exchange and global living.", 
}

export const nunito = Nunito({ 
  subsets: ["latin"], 
  weight: ["700", "800"] 
});

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
        <html lang="en">
            <body>
                {children}
                <Footer />
            </body>
        </html>
        </ClerkProvider>
    );
}



