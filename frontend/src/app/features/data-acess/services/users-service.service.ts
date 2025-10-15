import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class UserService{
    private http = inject(HttpClient);
    private api = environment.apiUrl;

    getHoursByUser(users: string,startDate?: string, endDate?: string,projects?: string){
        let params = new HttpParams().set('users',users);
        if(startDate) params = params.set('start_date',startDate);
        
        if(endDate) params = params.set('end_date',endDate);
        
        if(projects) params = params.set('projects',projects);
        
        return this.http.get<{usuario:string, horas_ajuda:number,horas_totais_mes:number,horas_liquidas:number}>(
            `${this.api}/metrics/hours-by-user`, {params});
    }
}