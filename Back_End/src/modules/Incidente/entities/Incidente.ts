// Entidade Incidente - representa a estrutura de dados no banco
export interface IIncidente {
    id: string
    createdAt: Date
    updatedAt: Date
    // Adicione aqui os campos da entidade
    // Exemplo:
    // titulo: string
    // descricao: string
    // status: string
    // prioridade: string
}

export class Incidente implements IIncidente {
    id: string
    createdAt: Date
    updatedAt: Date

    constructor(data: Partial<IIncidente> = {}) {
        this.id = data.id || ''
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
    }
}

export default Incidente
