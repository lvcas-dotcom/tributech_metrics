import { Routes } from '@angular/router';
import { HomePageComponent } from './features/feature/home-page/home-page.component';
import { EmployeeDataComponent } from './features/feature/employee-data/employee-data.component';
export const routes: Routes = [
    {
        path:'',
        component: HomePageComponent
    },
    {
        path:'employee/data',
        component: EmployeeDataComponent
    }
];
