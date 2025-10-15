import { Issue } from "./issue.model";

export interface User{
    username: string;
    hours: {
        total: number;
        helpingHours: number;
        activeHours: number;
    }
    issues: Issue[];

}