export interface CatalogUser{
    username: string,
    email: string,
    horas_apontadas: number,
    issues_assignadas: {
        issues_feitas_atrasadas: number,
        issues_feitas: number,
        issues_totais: number
    },
    atividade_semanal:number[]
}