'use client'

import { useEffect, useState } from 'react'
import { useGraphQL } from '@/hooks/useGraphQL'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle } from 'lucide-react'
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

const GET_ULTIMOS_INCIDENTES = `
    query GetUltimosIncidentes {
        ultimosincidentes {
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

export default function PainelPage() {
    const { token } = useAuth()
    const { data: incidentsData, loading: dataLoading, error: dataError } = useGraphQL<{
        ultimosincidentes: Incidente[]
    }>(GET_ULTIMOS_INCIDENTES, {})

    const [incidentes, setIncidentes] = useState<Incidente[]>([])

    useEffect(() => {
        if (incidentsData?.ultimosincidentes) {
            setIncidentes(incidentsData.ultimosincidentes)
        }
    }, [incidentsData])

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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Bem-vindo ao Painel</h1>
            <p className="text-gray-600 mt-2">Selecione um módulo no menu lateral</p>

            {/* Ordens Recentes */}
            <div className="mt-16 max-w-4xl bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Ordens Recentes</h2>
                </div>

                {dataError && (
                    <Alert variant="destructive" className="m-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{dataError}</AlertDescription>
                    </Alert>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Máquina</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Severidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Criado em</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataLoading && incidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : incidentes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhuma ordem de serviço encontrada
                                </TableCell>
                            </TableRow>
                        ) : (
                            incidentes.map((incidente) => (
                                <TableRow key={incidente.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900">
                                        {incidente.machine.name}
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-sm truncate">
                                        {incidente.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeOfOccurrenceBadgeVariant(incidente.typeOfOccurrence)} className="capitalize">
                                            {incidente.typeOfOccurrence === 'PREVENTIVA' && 'Preventiva'}
                                            {incidente.typeOfOccurrence === 'CORRETIVA' && 'Corretiva'}
                                            {incidente.typeOfOccurrence === 'PLANEJADA' && 'Planejada'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getSeverityBadgeVariant(incidente.severity)} className="capitalize">
                                            {incidente.severity === 'BAIXA' && 'Baixa'}
                                            {incidente.severity === 'MEDIA' && 'Média'}
                                            {incidente.severity === 'ALTA' && 'Alta'}
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
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
