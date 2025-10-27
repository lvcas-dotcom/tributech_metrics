import { Injectable, signal } from "@angular/core";


@Injectable({
  providedIn: "root"})
export class ConfigurationState {
    private _project = signal<string>('suporte-geo');
    private _date_init = signal<string  | null>(null);
    private _date_end = signal<string  | null>(null);

    readonly project = this._project.asReadonly();
    readonly date_init = this._date_init.asReadonly();
    readonly date_end = this._date_end.asReadonly();

    setProject(project: string){
        this._project.set(project);
    }

    setDate(init: string, end: string){
        this._date_init.set(init);
        this._date_end.set(end);
    }

}