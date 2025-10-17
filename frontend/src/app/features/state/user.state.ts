import { computed, Injectable, Signal, signal } from "@angular/core";
import { User } from "../data-acess/entities/user.model";
import { UserService } from "../data-acess/services/users-service.service";
import { Issue } from "../data-acess/entities/issue.model";

@Injectable({
  providedIn: "root"})
export class UserState {
    private _user = signal<User | null>(null);

    private _listUsers = signal<User[]>([]);
    listUsers = computed(() => this._listUsers());

    users = computed(() => this._user());

    constructor(private userService: UserService) {
    }

    loadUsers(startDate?: string, endDate?: string,projects?: string){
        this.userService.getAllUsers('suporte-geo',startDate, endDate).subscribe({
            next: (users) => {
                const userList: User[] = users.map(user => ({
                    username: user.usuario,
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
        console.log(this.listUsers())
    }
    

    loadUserHours(username: string, startDate?: string, endDate?: string,projects?: string){
        this.userService.getHoursByUser(username, startDate, endDate,projects).subscribe({
            next: (users) => {
                const user = users[0];
                if (user) {
                    this._user.update(current => ({
                        ...current,
                        username: user.usuario,
                        hours: {
                            total: user.horas_totais_mes,
                            helpingHours: user.horas_ajuda,
                            activeHours: user.horas_liquidas,
                        },
                        issues: current?.issues ?? []
                    }));
                }
                
            },
            error: (err) => {
                console.error('Error loading user hours:', err);
                this._user.set(null);
            }
        });
    }

    loadUserIssues(username: string, startDate?: string, endDate?: string,projects?: string){
        this.userService.getIssuesByUser(username, startDate, endDate,projects).subscribe({
            next: (issues) => {
                const mappedIssues: Issue[] = issues.map(issue => ({
                    id: issue.id,
                    title: issue.title,
                    project: issue.projeto,
                    hours: null,
                    label: null,
                    date: null
                }));
                if(issues){
                    this._user.update(current => {
                    if (!current) return null; 
                    return {
                    ...current,
                    issues: mappedIssues
                    };
                });
                }
                
            },
            error: (err) => {
                console.error('Error loading user issues:', err);
                this._user.update(current => {
                    if (!current) return null;
                    return {
                        ...current,
                        issues: []
                    };
                });
            }
        });

    }


}