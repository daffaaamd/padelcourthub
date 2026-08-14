import React, { ReactNode } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface AppLayoutProps {
    children: ReactNode;
    transparentNavbar?: boolean;
    showFooter?: boolean;
}

export default function AppLayout({ children, transparentNavbar = false, showFooter = true }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar transparent={transparentNavbar} />
            <main className={`flex-1 ${!transparentNavbar ? 'pt-16' : ''}`}>
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
