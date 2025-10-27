import { computed, Injectable, Signal, signal } from "@angular/core";
import { User } from "../data-acess/entities/user.model";
import { UserService } from "../data-acess/services/users-service.service";
import { forkJoin } from "rxjs";
import { Issue } from "../data-acess/entities/issue.model";
import { IssuesService } from "../data-acess/services/issues-service.service";
import { CatalogUser } from "../data-acess/entities/catalog-user.model";

@Injectable({
  providedIn: "root"})
export class UserState {
    private readonly EMPY_USER: User = {
        username: '',
        email: '',
        hours: {
            total: 0,
            helpingHours: 0,
            activeHours: 0
        },
        issues: []
    };

    private _user = signal<User>(this.EMPY_USER);
    user = this._user.asReadonly();
    private _listUsers = signal<User[]>([]);
    listUsers = computed(() => this._listUsers());

    private _catalogUsers = signal<CatalogUser[]>([]);
    readonly catalogUser = this._catalogUsers.asReadonly();
    

    constructor(private userService: UserService) {
    }

    loadCatalogUser(projects: string,startDate?: string, endDate?: string){
        this.userService.getCatalogUsers(projects,startDate, endDate).subscribe({
            next: (users)=>{
                this._catalogUsers.set(users);
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this._catalogUsers.set([]);
            }
        })
    }

    loadAllUsers(projects: string,startDate?: string, endDate?: string){
        this.userService.getAllUsers(projects,startDate, endDate).subscribe({
            next: (users) => {
                const userList: User[] = users.map(user => ({
                    username: user.usuario,
                    email: '',
                    hours: {
                        total: user.horas_apontadas,
                        helpingHours: 0,
                        activeHours: 0
                    },
                    issues: []
                }));
                this._listUsers.set(userList);
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this._listUsers.set([]);
            }
        })
        
    }
    
    loadUser(username: string,projects: string, startDate?: string, endDate?: string){
        forkJoin({
            hours: this.userService.getHoursByUser(username,startDate, endDate,projects),
            issues: this.userService.getIssuesByUser(username,startDate, endDate,projects)
            
        }).subscribe({
            next: ({hours,issues}) =>{
                const userHours = hours?.[0];
                this._user.set({
                    username: userHours.usuario,
                    email: userHours.email,
                    hours: {
                        total: userHours.horas_totais_mes ?? 0,
                        helpingHours: userHours.horas_ajuda ?? 0,
                        activeHours: userHours.horas_liquidas ?? 0
                    },
                    issues: (issues ?? []).map(issue => ({
                        id: issue.issue_id,
                        title: issue.title,
                        project: issue.project,
                        user: issue.user,
                        hours: issue.hours ?? 0,
                        status: issue.status,
                        blocked_time: issue.blocked_time ?? 0,
                        init_time: issue.init_todo,
                        due_date: issue.due_date,
                        closed_date: issue.closed_at ?? "doing"
                    }))
                });
            },
            error: (err) => {
                console.error('Error loading user data:', err);
                this._user.set(this.EMPY_USER);
            }
        });
    }
}