'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    ChevronRight,
    Settings,
    LayoutDashboard,
    Wrench,
    Package,
    Home,
    BarChart3,
    DollarSign,
    Users,
    FileText,
    Bell,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const MODULES = [
    { icon: LayoutDashboard, label: 'Painel', href: '/painel' },
    { icon: Wrench, label: 'Mecânica e manutenção', href: '/painel/mecanica' },
    { icon: Home, label: 'Almoxarifado', href: '/painel/almoxarifado' },
    { icon: Package, label: 'Produção', href: '/painel/producao' },
    { icon: DollarSign, label: 'Comercial', href: '/painel/comercial' },
    { icon: Home, label: 'Financeiro', href: '/painel/financeiro' },
    { icon: Users, label: 'Departamento pessoal', href: '/painel/depart-pessoal' },
    { icon: FileText, label: 'RH', href: '/painel/rh' },
    { icon: BarChart3, label: 'Apresentação e resultados', href: '/painel/apresentacao' },
]

const SYSTEM = [
    { icon: Bell, label: 'Notificações', href: '/painel/notificacoes' },
    { icon: Settings, label: 'Configurações', href: '/painel/configuracoes' },
]

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { username, logout } = useAuthContext()
    const [isOpen, setIsOpen] = useState(true)

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const NavItem = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
            <Link href={href}>
                <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 ${isOpen ? 'px-4' : 'px-2'}`}
                    size={isOpen ? 'default' : 'icon'}
                    title={!isOpen ? label : undefined}
                >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {isOpen && <span className="truncate">{label}</span>}
                </Button>
            </Link>
        )
    }

    return (
        <>
            {/* Sidebar Desktop */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {isOpen && <h1 className="text-xl font-bold text-gray-900">▲ Monitoro</h1>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="ml-auto"
                    >
                        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Módulos */}
                <div className="flex-1 overflow-y-auto p-3">
                    {isOpen && (
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                            Módulos
                        </p>
                    )}
                    <nav className="space-y-1">
                        {MODULES.map((item) => (
                            <NavItem key={item.href} {...item} />
                        ))}
                    </nav>
                </div>

                <Separator />

                {/* Sistema */}
                <div className="p-3">
                    {isOpen && (
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                            Sistema
                        </p>
                    )}
                    <nav className="space-y-1">
                        {SYSTEM.map((item) => (
                            <NavItem key={item.href} {...item} />
                        ))}
                    </nav>
                </div>

                <Separator />

                {/* Usuário */}
                <div className="p-3">
                    <div
                        className={`flex items-center gap-3 p-2 rounded-lg bg-gray-50 mb-3 ${!isOpen && 'justify-center'
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {username ? username.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        {isOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate capitalize">
                                    {username || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">Conectado</p>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        size={isOpen ? 'default' : 'icon'}
                        onClick={handleLogout}
                        title={!isOpen ? 'Sair' : undefined}
                    >
                        <LogOut className="w-4 h-4" />
                        {isOpen && <span>Sair</span>}
                    </Button>
                </div>
            </aside>

            {/* Sidebar Mobile - Menu hamburguer */}
            <div className="md:hidden fixed top-4 left-4 z-40">
                <Button variant="outline" size="icon">
                    <Menu className="w-4 h-4" />
                </Button>
            </div>
        </>
    )
}
