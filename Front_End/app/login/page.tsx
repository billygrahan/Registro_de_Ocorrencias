'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthContext } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading: authLoading, error: authError } = useAuth()
    const { isAuthenticated, isLoading: contextLoading } = useAuthContext()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Redirecionar para painel se já estiver autenticado
    useEffect(() => {
        if (contextLoading) return // Aguardar contexto carregar

        if (isAuthenticated) {
            router.push('/painel')
        }
    }, [isAuthenticated, contextLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await login(username, password)
            router.push('/painel')
        } catch (err) {
            // Erro já está em authError
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo - Imagem */}
            <div
                className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/paisagem.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-8 left-8 text-white z-10">
                    <div className="text-4xl font-bold">▲ Monitoro</div>
                    <p className="text-sm text-gray-200 mt-2">Sistema de Registro de Ocorrências</p>
                </div>
            </div>

            {/* Lado direito - Formulário */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo mobile */}
                    <div className="lg:hidden text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Monitoro</h1>
                    </div>

                    {/* Título */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
                        <p className="mt-2 text-gray-600">Utilize seu usuário e senha para acessar sua conta</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {authError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro ao fazer login</AlertTitle>
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                                Usuário
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                disabled={authLoading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                Senha
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={authLoading}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={authLoading}
                            className="w-full py-2 font-medium"
                            size="lg"
                        >
                            {authLoading ? 'Carregando...' : 'Entrar'}
                        </Button>

                        <div className="text-center">
                            <Button variant="link" asChild>
                                <a href="#" className="text-sm">
                                    Esqueceu sua senha?
                                </a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
