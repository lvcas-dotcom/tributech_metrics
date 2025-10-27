import { Injectable, signal } from "@angular/core";
import { IssuesService } from "../data-acess/services/issues-service.service";
import { DataIssues } from "../data-acess/entities/data-issues.model";


@Injectable({
  providedIn: "root"})
export class DataState {
    private readonly EMPTY_ISSUES: DataIssues = {
            project: '',
            totalAbertas: 0,
            totalAbertasAtrasadas: 0,
            totalFinalizadas: 0,
            totalFinalzadasAtrasadas: 0
        };

    private _dataIssues = signal<DataIssues>(this.EMPTY_ISSUES);
    dataIssues = this._dataIssues.asReadonly();

    constructor(private issueService: IssuesService){}

      loadIssuesGraph(projects: string,startDate?: string, endDate?: string){
            this.issueService.getIssuesData(projects,startDate, endDate).subscribe({
                next: (data) => {
                    const issues = {
                        project: data[0].projeto,
                        totalAbertas: data[0].total_abertas,
                        totalFinalizadas: data[0].total_finalizadas_no_prazo,
                        totalFinalzadasAtrasadas: data[0].total_finalizadas_com_atraso,
                        totalAbertasAtrasadas: data[0].total_abertas_atrasadas
                    }
                    this._dataIssues.set(issues);
                } 
            })
        }
}