import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IssueMetric {
    total: number;
    month: string;
}

export interface HighPriorityIssue {
    issue_id: number;
    titulo_issue: string;
    projeto: string;
    label: string;
    created_at: string;
    updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class MetricsService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://192.168.100.191:8003/metrics';

    /**
     * Busca issues criadas em um mês específico
     */
    getIssuesCreatedByMonth(year: number, month: number, projects?: string[]): Observable<any> {
        const params: any = {
            start_date: `${year}-${String(month).padStart(2, '0')}-01`,
            end_date: this.getLastDayOfMonth(year, month)
        };
        
        if (projects && projects.length > 0) {
            params.projects = projects.join(',');
        }

        return this.http.get(`${this.API_URL}/by-task`, { params });
    }

    /**
     * Busca issues concluídas antes do prazo
     */
    getIssuesCompletedBeforeDeadline(projects?: string[]): Observable<any> {
        const params: any = {};
        
        if (projects && projects.length > 0) {
            params.projects = projects.join(',');
        }

        return this.http.get(`${this.API_URL}/by-user-month`, { params });
    }

    /**
     * Busca issues de alta prioridade
     */
    getHighPriorityIssues(projects?: string[]): Observable<HighPriorityIssue[]> {
        const params: any = {};
        
        if (projects && projects.length > 0) {
            params.projects = projects.join(',');
        }

        return this.http.get<HighPriorityIssue[]>(`${this.API_URL}/high-priority-issues`, { params });
    }

    /**
     * Helper para obter o último dia do mês
     */
    private getLastDayOfMonth(year: number, month: number): string {
        const lastDay = new Date(year, month, 0).getDate();
        return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }
}
