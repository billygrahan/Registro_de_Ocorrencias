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
import { AlertCircle, Trash2, Plus, Search, Loader2, ChevronRight, Power, PowerOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Machine {
    id: string
    name: string
    setor: string
    status: boolean
}

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

const CREATE_MACHINE = `
    mutation CriarMachine($input: CreateMachineInput!) {
        criarMachine(input: $input) {
            id
            name
            setor
            status
        }
    }
`

const UPDATE_MACHINE = `
    mutation AtualizarMachine($input: UpdateMachineInput!) {
        atualizarMachine(input: $input) {
            id
            name
            setor
            status
        }
    }
`

const DELETE_MACHINE = `
    mutation DeletarMachine($id: ID!) {
        deletarMachine(id: $id)
    }
`

const TOGGLE_STATUS_MACHINE = `
    mutation AlternarStatusMachine($id: ID!) {
        alternarStatusMachine(id: $id) {
            id
            name
            setor
            status
        }
    }
`

export default function MecanicaPage() {
    const router = useRouter()
    const { token } = useAuth()
    const { data: machinesData, loading: dataLoading, error: dataError, refetch } = useGraphQL<{
        machines: Machine[]
    }>(GET_MACHINES, {})

    const [machines, setMachines] = useState<Machine[]>([])
    const [filteredMachines, setFilteredMachines] = useState<Machine[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [setorFilter, setSetorFilter] = useState<string>('todos')
    const [statusFilter, setStatusFilter] = useState<string>('todos')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        setor: 'PRODUCAO',
    })

    // Atualizar máquinas quando dados forem carregados
    useEffect(() => {
        if (machinesData?.machines) {
            setMachines(machinesData.machines)
            setError(null)
        } else if (dataError) {
            setError(dataError)
        }
    }, [machinesData, dataError])

    // Filtrar máquinas
    useEffect(() => {
        let filtered = machines

        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(
                (machine) =>
                    machine.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtro por setor
        if (setorFilter !== 'todos') {
            filtered = filtered.filter((machine) => machine.setor === setorFilter)
        }

        // Filtro por status
        if (statusFilter !== 'todos') {
            const statusBool = statusFilter === 'ativa'
            filtered = filtered.filter((machine) => machine.status === statusBool)
        }

        setFilteredMachines(filtered)
    }, [machines, searchTerm, setorFilter, statusFilter])

    const handleCreateMachine = async () => {
        if (!formData.name.trim()) {
            setError('Nome da máquina é obrigatório')
            return
        }

        try {
            setLoading(true)
            setError(null)

            await graphqlRequest(
                CREATE_MACHINE,
                {
                    input: {
                        name: formData.name,
                        setor: formData.setor,
                    },
                },
                token || ''
            )

            await new Promise(resolve => setTimeout(resolve, 500))
            await refetch()
            setIsDialogOpen(false)
            resetForm()
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao criar máquina'
            setError(`Erro: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (id: string) => {
        try {
            setToggleLoadingId(id)
            setError(null)

            await graphqlRequest(
                TOGGLE_STATUS_MACHINE,
                { id },
                token || ''
            )

            await new Promise(resolve => setTimeout(resolve, 500))
            await refetch()
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao alternar status'
            setError(`Erro: ${errorMessage}`)
        } finally {
            setToggleLoadingId(null)
        }
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
        setDeleteConfirmOpen(true)
    }

    const confirmDeleteMachine = async () => {
        if (!deleteConfirmId) return

        try {
            setLoading(true)
            setError(null)

            await graphqlRequest(DELETE_MACHINE, { id: deleteConfirmId }, token || '')

            await new Promise(resolve => setTimeout(resolve, 500))
            await refetch()
            setMachines(prev => prev.filter(m => m.id !== deleteConfirmId))
            setDeleteConfirmOpen(false)
            setDeleteConfirmId(null)
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || 'Erro ao deletar máquina'
            setError(`Erro ao deletar: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const cancelDeleteMachine = () => {
        setDeleteConfirmOpen(false)
        setDeleteConfirmId(null)
    }

    const resetForm = () => {
        setFormData({
            name: '',
            setor: 'PRODUCAO',
        })
    }

    const getSetorLabel = (setor: string) => {
        const labels: Record<string, string> = {
            PRODUCAO: 'Produção',
            USINAGEM: 'Usinagem',
            TELHAGEM: 'Telhagem',
        }
        return labels[setor] || setor
    }

    const getSetorBadgeColor = (setor: string) => {
        switch (setor) {
            case 'PRODUCAO':
                return 'bg-blue-100 text-blue-800'
            case 'USINAGEM':
                return 'bg-purple-100 text-purple-800'
            case 'TELHAGEM':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="flex-1 p-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                <span>Painel</span>
                <span>/</span>
                <span className="font-semibold text-gray-900">Mecânica</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Administração de Máquinas</h1>
                <div className="flex gap-3">
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
                                Nova Máquina
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nova Máquina</DialogTitle>
                                <DialogDescription>
                                    Preencha os dados para cadastrar uma nova máquina
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nome</label>
                                    <Input
                                        placeholder="Ex: RTX5090"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Setor</label>
                                    <Select
                                        value={formData.setor}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, setor: value })
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRODUCAO">Produção</SelectItem>
                                            <SelectItem value="USINAGEM">Usinagem</SelectItem>
                                            <SelectItem value="TELHAGEM">Telhagem</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleCreateMachine} disabled={loading} className="w-full">
                                    {loading ? 'Criando...' : 'Criar Máquina'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button
                        onClick={() => router.push('/painel/mecanica/ordens-de-servico')}
                        variant="outline"
                        className="gap-2"
                    >
                        Ordens de Serviço
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
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
                                placeholder="Pesquisar por nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="sm:w-48">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Setor
                        </label>
                        <Select
                            value={setorFilter}
                            onValueChange={setSetorFilter}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="PRODUCAO">Produção</SelectItem>
                                <SelectItem value="USINAGEM">Usinagem</SelectItem>
                                <SelectItem value="TELHAGEM">Telhagem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="sm:w-48">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Status
                        </label>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="ativa">Ativa</SelectItem>
                                <SelectItem value="inativa">Inativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Lista de Máquinas ({filteredMachines.length})
                    </h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Setor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataLoading && machines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredMachines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhuma máquina encontrada
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMachines.map((machine) => (
                                <TableRow key={machine.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900">
                                        {machine.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`capitalize ${getSetorBadgeColor(machine.setor)}`}>
                                            {getSetorLabel(machine.setor)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={machine.status ? 'default' : 'destructive'}>
                                            {machine.status ? 'Ativa' : 'Inativa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleStatus(machine.id)}
                                                disabled={toggleLoadingId === machine.id}
                                                className={machine.status ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}
                                                title={machine.status ? 'Desativar' : 'Ativar'}
                                            >
                                                {toggleLoadingId === machine.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : machine.status ? (
                                                    <Power className="w-4 h-4" />
                                                ) : (
                                                    <PowerOff className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(machine.id)}
                                                className="hover:bg-red-50 text-red-600"
                                                title="Deletar máquina"
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
                        <DialogTitle className="text-red-600">Excluir Máquina</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. A máquina será deletada permanentemente do sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 my-4">
                        <p className="text-sm text-red-800">
                            <strong>Atenção!</strong> Você está prestes a deletar uma máquina. Todas as ordens associadas serão removidas. Tem certeza?
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={cancelDeleteMachine}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteMachine}
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? 'Deletando...' : 'Deletar Máquina'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
