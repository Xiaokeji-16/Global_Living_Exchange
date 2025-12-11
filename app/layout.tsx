import "./globals.css";
import  type { ReactNode } from "react";

export const metadata = {
    title: "Global Living Exchange",
    description: "A platform for home exchange and global living.", 
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}