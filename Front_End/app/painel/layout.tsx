'use client'

import { AppSidebar } from '@/components/app-sidebar'

export default function PainelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
