import { Injectable } from "@angular/core";


@Injectable({providedIn:'root'})
export class GitLabService{
    private gitLabUrl = 'https://git.tributech.com.br';

    getIssueUrl(project: string, idIssue: number){
        return `${this.gitLabUrl}/sigweb/${project}/-/issues/${idIssue}`;
    }
}