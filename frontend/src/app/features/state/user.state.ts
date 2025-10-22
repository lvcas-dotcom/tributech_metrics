import { computed, Injectable, Signal, signal } from "@angular/core";
import { User } from "../data-acess/entities/user.model";
import { UserService } from "../data-acess/services/users-service.service";
import { Issue } from "../data-acess/entities/issue.model";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root"})
export class UserState {
    private readonly EMPY_USER: User = {
        username: '',
        hours: {
            total: 0,
            helpingHours: 0,
            activeHours: 0
        },
        issues: []
    };

    private _user = signal<User>(this.EMPY_USER);

    private _listUsers = signal<User[]>([]);
    listUsers = computed(() => this._listUsers());

    user = this._user.asReadonly();

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
    
    loadUser(username: string, startDate?: string, endDate?: string,projects?: string){
        forkJoin({
            hours: this.userService.getHoursByUser(username,startDate, endDate,projects),
            issues: this.userService.getIssuesByUser(username,startDate, endDate,projects)
        }).subscribe({
            next: ({hours,issues}) =>{
                const userHours = hours?.[0];
                this._user.set({
                    username: userHours.usuario,
                    hours: {
                        total: userHours.horas_totais_mes ?? 0,
                        helpingHours: userHours.horas_ajuda ?? 0,
                        activeHours: userHours.horas_liquidas ?? 0
                    },
                    issues: (issues ?? []).map(issue => ({
                        id: issue.id,
                        title: issue.title,
                        project: issue.projeto 
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