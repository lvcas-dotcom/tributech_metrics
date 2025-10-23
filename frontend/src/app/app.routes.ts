import { Routes } from '@angular/router';
import { HomePageComponent } from './features/feature/home-page/home-page.component';
import { EmployeeDataComponent } from './features/feature/employee-data/employee-data.component';
import { EmployeesComponent } from './features/feature/employees/employees.component';
export const routes: Routes = [
    {
        path:'',
        component: HomePageComponent
    },
    {
        path:'employee/data/:username',
        component: EmployeeDataComponent
    },
    {
        path:'employee',
        component: EmployeesComponent
    }
];
