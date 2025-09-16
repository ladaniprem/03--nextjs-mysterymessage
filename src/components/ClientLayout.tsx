"use client";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Navbar />
            {children}
        </SessionProvider>
    );
}