"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isDemoMode } = useAuth();
    const pathname = usePathname();

    const isLoginPage = pathname === '/login';
    const showSidebar = (isAuthenticated || isDemoMode) && !isLoginPage;

    return (
        <div className="flex min-h-screen">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 ${showSidebar ? 'lg:ml-72' : ''} bg-slate-50 min-h-screen`}>
                <div className={showSidebar ? "pt-16 p-4 md:p-8 lg:p-12" : ""}>
                    {children}
                </div>
            </main>
        </div>
    );
}
