import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({providedIn:'root'})
export class IssuesService{
    private http  = inject(HttpClient);
    private api = environment.apiUrl;

    getIssuesData(projects: string,start_date?: string, end_date?: string){
        let params =  new HttpParams().set('projects',projects);
        if(start_date) params = params.set('start_date',start_date);
        if(end_date) params = params.set('end_date',end_date);
        

        return this.http.get<{
            projeto: string,
            total_abertas: number,
            total_abertas_atrasadas: number,
            total_finalizadas_no_prazo: number,
            total_finalizadas_com_atraso: number
        }[]>(`${this.api}/metrics/issues-completion-by-project`,{params});
        
    }
}