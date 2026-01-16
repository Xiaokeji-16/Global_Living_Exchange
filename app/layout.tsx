import "./globals.css";
import  type { ReactNode } from "react";
import { Footer } from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
    title: "Global Living Exchange",
    description: "A platform for home exchange and global living.", 
}

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