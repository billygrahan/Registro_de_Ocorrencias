'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { AlertCircle, Trash2, Plus, Search, Loader2, ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Machine {
    id: string
    name: string
    setor: string
    status: boolean
}

interface Incidente {
    id: string
    description: string
    typeOfOccurrence: string
    machine: Machine
    status: string
    severity: string
    createdAt: string
    finishedAt?: string
}

const GET_INCIDENTES = `
    query GetIncidentes {
        incidentes {
            id
            description
            typeOfOccurrence
            machine {
                id
                name
                setor
                status
            }
            status
            severity
            createdAt
            finishedAt
        }
    }
`

const GET_MACHINES = `
    query GetMachines {
        machines {
            id
            name
            setor
            status
        }
    }
`

const CREATE_INCIDENTE = `
    mutation CriarIncidente($input: CreateIncidenteInput!) {
        criarIncidente(input: $input) {
            id
            description
            typeOfOccurrence
            machine {
                id
                name
                setor
                status
            }
            status
            severity
            createdAt
        }
    }
`

const UPDATE_INCIDENTE = `
    mutation AtualizarIncidente($input: UpdateIncidenteInput!) {
        atualizarIncidente(input: $input) {
            id
            description
            typeOfOccurrence
            machine {
                id
                name
                setor
                status
            }
            status
            severity
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

export default function OrdensDeServicoPage() {
    const router = useRouter()
    const { token } = useAuth()
    const { data: incidentsData, loading: dataLoading, error: dataError, refetch } = useGraphQL<{
        incidentes: Incidente[]
    }>(GET_INCIDENTES, {})

    const { data: machinesData } = useGraphQL<{
        machines: Machine[]
    }>(GET_MACHINES, {})

    const [incidentes, setIncidentes] = useState<Incidente[]>([])
    const [filteredIncidentes, setFilteredIncidentes] = useState<Incidente[]>([])
    const [machines, setMachines] = useState<Machine[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'todos' | 'EM_ABERTO' | 'CONCLUIDO'>('todos')
    const [typeOfOccurrenceFilter, setTypeOfOccurrenceFilter] = useState<string[]>(['PREVENTIVA', 'CORRETIVA', 'PLANEJADA'])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [completeLoadingId, setCompleteLoadingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        description: '',
        typeOfOccurrence: 'PREVENTIVA',
        machineId: '',
        severity: 'BAIXA',
    })

    // Atualizar máquinas quando dados forem carregados
    useEffect(() => {
        if (machinesData?.machines) {
            setMachines(machinesData.machines)
            // Se não houver machineId selecionada, selecione a primeira
            if (!formData.machineId && machinesData.machines.length > 0) {
                setFormData(prev => ({ ...prev, machineId: machinesData.machines[0].id }))
            }
        }
    }, [machinesData])

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
                    inc.machine.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtro por tipo de ocorrência
        if (typeOfOccurrenceFilter.length > 0) {
            filtered = filtered.filter((inc) => typeOfOccurrenceFilter.includes(inc.typeOfOccurrence))
        }

        // Filtro por status
        if (statusFilter !== 'todos') {
            filtered = filtered.filter((inc) => inc.status === statusFilter)
        }

        setFilteredIncidentes(filtered)
    }, [incidentes, searchTerm, statusFilter, typeOfOccurrenceFilter])

    const handleCreateOrder = async () => {
        if (!formData.description.trim()) {
            setError('Descrição é obrigatória')
            return
        }

        if (!formData.machineId) {
            setError('Máquina é obrigatória')
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
                        typeOfOccurrence: formData.typeOfOccurrence,
                        machineId: formData.machineId,
                        severity: formData.severity,
                    },
                },
                token || ''
            )

            await new Promise(resolve => setTimeout(resolve, 500))
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

            await graphqlRequest(
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

            await new Promise(resolve => setTimeout(resolve, 500))
            await refetch()
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao concluir ordem'
            setError(`Erro: ${errorMessage}`)
        } finally {
            setCompleteLoadingId(null)
        }
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
        setDeleteConfirmOpen(true)
    }

    const confirmDeleteOrder = async () => {
        if (!deleteConfirmId) return

        try {
            setLoading(true)
            setError(null)

            await graphqlRequest(DELETE_INCIDENTE, { id: deleteConfirmId }, token || '')

            await new Promise(resolve => setTimeout(resolve, 500))
            await refetch()
            setIncidentes(prev => prev.filter(inc => inc.id !== deleteConfirmId))
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
        setDeleteConfirmOpen(false)
        setDeleteConfirmId(null)
    }

    const toggleTypeOfOccurrenceFilter = (type: string) => {
        setTypeOfOccurrenceFilter(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        )
    }

    const resetForm = () => {
        setFormData({
            description: '',
            typeOfOccurrence: 'PREVENTIVA',
            machineId: machines.length > 0 ? machines[0].id : '',
            severity: 'BAIXA',
        })
    }

    const getTypeOfOccurrenceBadgeVariant = (typeOfOccurrence: string) => {
        switch (typeOfOccurrence) {
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

    const getSeverityBadgeVariant = (severity: string) => {
        switch (severity) {
            case 'BAIXA':
                return 'secondary'
            case 'MEDIA':
                return 'outline'
            case 'ALTA':
                return 'destructive'
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
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/painel/mecanica')}
                        title="Voltar para Máquinas"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
                </div>
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
                                        value={formData.typeOfOccurrence}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, typeOfOccurrence: value })
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
                                        value={formData.machineId}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, machineId: value })
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Selecione uma máquina" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {machines.map((machine) => (
                                                <SelectItem key={machine.id} value={machine.id}>
                                                    {machine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Severidade</label>
                                <Select
                                    value={formData.severity}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, severity: value })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BAIXA">Baixa</SelectItem>
                                        <SelectItem value="MEDIA">Média</SelectItem>
                                        <SelectItem value="ALTA">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
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

                    {/* Tipo de Ocorrência Filter - Inline */}
                    <div className="flex gap-2 items-end">
                        <Badge
                            onClick={() => toggleTypeOfOccurrenceFilter('PREVENTIVA')}
                            className={`capitalize cursor-pointer rounded-lg px-4 py-3.5 ${typeOfOccurrenceFilter.includes('PREVENTIVA')
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Preventiva
                        </Badge>
                        <Badge
                            onClick={() => toggleTypeOfOccurrenceFilter('CORRETIVA')}
                            className={`capitalize cursor-pointer rounded-lg px-4 py-3.5 ${typeOfOccurrenceFilter.includes('CORRETIVA')
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Corretiva
                        </Badge>
                        <Badge
                            onClick={() => toggleTypeOfOccurrenceFilter('PLANEJADA')}
                            className={`capitalize cursor-pointer rounded-lg px-4 py-3.5 ${typeOfOccurrenceFilter.includes('PLANEJADA')
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Planejada
                        </Badge>
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
                            <TableHead>Severidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Criado em</TableHead>
                            <TableHead>Finalizado em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataLoading && incidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredIncidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    Nenhuma ordem de serviço encontrada
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredIncidentes.map((incidente) => (
                                <TableRow key={incidente.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900">
                                        {incidente.machine.name}
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-sm truncate">
                                        {incidente.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeOfOccurrenceBadgeVariant(incidente.typeOfOccurrence)} className="capitalize">
                                            {incidente.typeOfOccurrence === 'PREVENTIVA'
                                                ? 'Preventiva'
                                                : incidente.typeOfOccurrence === 'CORRETIVA'
                                                    ? 'Corretiva'
                                                    : 'Planejada'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getSeverityBadgeVariant(incidente.severity)} className="capitalize">
                                            {incidente.severity === 'ALTA'
                                                ? 'Alta'
                                                : incidente.severity === 'MEDIA'
                                                    ? 'Média'
                                                    : 'Baixa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(incidente.status)} className="capitalize">
                                            {incidente.status === 'EM_ABERTO' ? 'Em Aberto' : 'Concluído'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(incidente.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {incidente.finishedAt ? formatDate(incidente.finishedAt) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            {incidente.status === 'EM_ABERTO' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCompleteOrder(incidente.id)}
                                                    disabled={completeLoadingId === incidente.id || loading}
                                                >
                                                    {completeLoadingId === incidente.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Concluir'
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(incidente.id)}
                                                disabled={loading}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4 justify-end">
                        <Button variant="outline" onClick={cancelDeleteOrder} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteOrder}
                            disabled={loading}
                        >
                            {loading ? 'Deletando...' : 'Deletar'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
