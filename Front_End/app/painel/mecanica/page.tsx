'use client'

import { useEffect, useState } from 'react'
import { useGraphQL } from '@/hooks/useGraphQL'
import { useAuth } from '@/hooks/useAuth'
import { graphqlRequest } from '@/lib/graphql'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Trash2, Plus, Search, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Incidente {
    id: string
    description: string
    tipo: string
    machineName: string
    status: string
    createdAt: string
    finishedAt?: string
}

const GET_INCIDENTES = `
    query GetIncidentes {
        ultimosincidentes {
            id
            description
            tipo
            machineName
            status
            createdAt
            finishedAt
        }
    }
`

const CREATE_INCIDENTE = `
    mutation CriarIncidente($input: CreateIncidenteInput!) {
        criarIncidente(input: $input) {
            id
            description
            tipo
            machineName
            status
            createdAt
        }
    }
`

const UPDATE_INCIDENTE = `
    mutation AtualizarIncidente($input: UpdateIncidenteInput!) {
        atualizarIncidente(input: $input) {
            id
            description
            tipo
            machineName
            status
            createdAt
            finishedAt
        }
    }
`

const DELETE_INCIDENTE = `
    mutation DeletarIncidente($id: ID!) {
        deletarIncidente(id: $id)
    }
`

export default function MecanicaPage() {
    const { token } = useAuth()
    const { data: incidentsData, loading: dataLoading, error: dataError, refetch } = useGraphQL<{
        incidentes: Incidente[]
    }>(GET_INCIDENTES, {})

    const [incidentes, setIncidentes] = useState<Incidente[]>([])
    const [filteredIncidentes, setFilteredIncidentes] = useState<Incidente[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'todos' | 'EM_ABERTO' | 'CONCLUIDO'>('todos')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [completeLoadingId, setCompleteLoadingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        description: '',
        tipo: 'PREVENTIVA',
        machineName: 'RTX5090',
    })

    // Atualizar incidentes quando dados forem carregados
    useEffect(() => {
        if (incidentsData?.incidentes) {
            setIncidentes(incidentsData.incidentes)
            setError(null)
        } else if (dataError) {
            setError(dataError)
        }
    }, [incidentsData, dataError])

    // Filtrar incidentes
    useEffect(() => {
        let filtered = incidentes

        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(
                (inc) =>
                    inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inc.machineName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtro por status
        if (statusFilter !== 'todos') {
            filtered = filtered.filter((inc) => inc.status === statusFilter)
        }

        setFilteredIncidentes(filtered)
    }, [incidentes, searchTerm, statusFilter])

    const handleCreateOrder = async () => {
        if (!formData.description.trim()) {
            setError('Descrição é obrigatória')
            return
        }

        try {
            setLoading(true)
            setError(null)

            await graphqlRequest(
                CREATE_INCIDENTE,
                {
                    input: {
                        description: formData.description,
                        tipo: formData.tipo,
                        machineName: formData.machineName,
                    },
                },
                token || ''
            )

            // Aguardar um pouco antes de recarregar
            await new Promise(resolve => setTimeout(resolve, 500))

            // Recarregar incidentes
            await refetch()
            setIsDialogOpen(false)
            resetForm()
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao criar ordem'
            setError(`Erro: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteOrder = async (id: string) => {
        try {
            setCompleteLoadingId(id)
            setError(null)

            const result = await graphqlRequest(
                UPDATE_INCIDENTE,
                {
                    input: {
                        id,
                        status: 'CONCLUIDO',
                        finishedAt: new Date().toISOString(),
                    },
                },
                token || ''
            )

            // Aguardar um pouco antes de recarregar
            await new Promise(resolve => setTimeout(resolve, 500))

            // Recarregar incidentes
            await refetch()
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao concluir ordem'
            setError(`Erro: ${errorMessage}`)
        } finally {
            setCompleteLoadingId(null)
        }
    }

    const handleDelete = (id: string) => {
        console.log('🗑️ [ABRIR DIALOG] Abrindo diálogo de confirmação para ID:', id)
        setDeleteConfirmId(id)
        setDeleteConfirmOpen(true)
    }

    const confirmDeleteOrder = async () => {
        if (!deleteConfirmId) return

        try {
            setLoading(true)
            setError(null)

            await graphqlRequest(DELETE_INCIDENTE, { id: deleteConfirmId }, token || '')

            // Aguardar um pouco antes de recarregar
            await new Promise(resolve => setTimeout(resolve, 500))

            // Recarregar incidentes
            await refetch()

            // Remover manualmente se refetch não atualizar
            setIncidentes(prev => prev.filter(inc => inc.id !== deleteConfirmId))

            // Fechar o diálogo
            setDeleteConfirmOpen(false)
            setDeleteConfirmId(null)
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao deletar ordem'
            setError(`Erro ao deletar: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const cancelDeleteOrder = () => {
        console.log('❌ Deleção cancelada pelo usuário')
        setDeleteConfirmOpen(false)
        setDeleteConfirmId(null)
    }

    const resetForm = () => {
        setFormData({
            description: '',
            tipo: 'PREVENTIVA',
            machineName: 'MAQUINA_01',
        })
    }

    const getTypeBadgeVariant = (tipo: string) => {
        switch (tipo) {
            case 'PREVENTIVA':
                return 'secondary'
            case 'CORRETIVA':
                return 'destructive'
            case 'PLANEJADA':
                return 'outline'
            default:
                return 'default'
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        return status === 'EM_ABERTO' ? 'destructive' : 'default'
    }

    const formatDate = (date: string) => {
        try {
            return new Date(date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return '-'
        }
    }

    const getMachineLabel = (machineName: string) => {
        const machines: Record<string, string> = {
            RTX5090: 'RTX5090',
            R75800X3D: 'R75800X3D',
            SSDSATA: 'SSDSATA',
            SSDNVME: 'SSDNVME',
            RAMDDR43200MHZ: 'RAMDDR43200MHZ',
        }
        return machines[machineName] || machineName
    }

    return (
        <div className="flex-1 p-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                <span>Painel</span>
                <span>/</span>
                <span>Mecânica</span>
                <span>/</span>
                <span className="font-semibold text-gray-900">Ordens de Serviço</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                resetForm()
                                setIsDialogOpen(true)
                            }}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nova Ordem
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                            <DialogDescription>
                                Preencha os dados para criar uma nova ordem de serviço
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Descrição</label>
                                <Textarea
                                    placeholder="Descreva a ordem de serviço"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="mt-1"
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tipo</label>
                                    <Select
                                        value={formData.tipo}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, tipo: value })
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PREVENTIVA">Preventiva</SelectItem>
                                            <SelectItem value="CORRETIVA">Corretiva</SelectItem>
                                            <SelectItem value="PLANEJADA">Planejada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Máquina</label>
                                    <Select
                                        value={formData.machineName}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, machineName: value })
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder={getMachineLabel(formData.machineName)} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RTX5090">RTX5090</SelectItem>
                                            <SelectItem value="R75800X3D">R75800X3D</SelectItem>
                                            <SelectItem value="SSDSATA">SSDSATA</SelectItem>
                                            <SelectItem value="SSDNVME">SSDNVME</SelectItem>
                                            <SelectItem value="RAMDDR43200MHZ">RAMDDR43200MHZ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleCreateOrder} disabled={loading} className="w-full">
                                {loading ? 'Criando...' : 'Criar Ordem'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Error Alert */}
            {(error || dataError) && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || dataError}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Pesquisar
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Pesquisar por descrição ou máquina..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Status
                        </label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: any) => setStatusFilter(value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="EM_ABERTO">Em Aberto</SelectItem>
                                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Lista de Ordens de Serviço ({filteredIncidentes.length})
                    </h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Máquina</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Criado em</TableHead>
                            <TableHead>Finalizado em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataLoading && incidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredIncidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Nenhuma ordem de serviço encontrada
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredIncidentes.map((incidente) => (
                                <TableRow key={incidente.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900">
                                        {getMachineLabel(incidente.machineName)}
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-sm truncate">
                                        {incidente.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeBadgeVariant(incidente.tipo)} className="capitalize">
                                            {incidente.tipo === 'PREVENTIVA' && 'Preventiva'}
                                            {incidente.tipo === 'CORRETIVA' && 'Corretiva'}
                                            {incidente.tipo === 'PLANEJADA' && 'Planejada'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(incidente.status)}>
                                            {incidente.status === 'EM_ABERTO' ? 'Em Aberto' : 'Concluído'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                        {formatDate(incidente.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                        {incidente.finishedAt ? formatDate(incidente.finishedAt) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {incidente.status === 'EM_ABERTO' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCompleteOrder(incidente.id)}
                                                    disabled={completeLoadingId === incidente.id}
                                                    className="text-green-600 hover:bg-green-50"
                                                    title="Marcar como concluída"
                                                >
                                                    {completeLoadingId === incidente.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Concluir'
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(incidente.id)}
                                                className="hover:bg-red-50 text-red-600"
                                                title="Deletar ordem"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Excluir Ordem de Serviço</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. A ordem será deletada permanentemente do sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 my-4">
                        <p className="text-sm text-red-800">
                            <strong>Atenção!</strong> Você está prestes a deletar uma ordem de serviço. Tem certeza?
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={cancelDeleteOrder}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteOrder}
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? 'Deletando...' : 'Deletar Ordem'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
