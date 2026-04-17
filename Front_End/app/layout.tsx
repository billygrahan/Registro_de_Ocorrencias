import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
    title: 'Monitoro - Registro de Ocorrências',
    description: 'Sistema de Registro de Ocorrências e Ordens de Serviço',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className="antialiased bg-gray-50">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
