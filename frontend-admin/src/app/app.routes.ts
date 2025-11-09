import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { authGuard } from './guards/auth.guard';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AdminComponent } from './admin/admin.component';
import { ToolbarComponent } from './toolbar/toolbar/toolbar.component';
import { MainComponent } from './Pages/main/main.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NailsOrderComponent } from './nails-order/nails-order.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'',component:LayoutComponent,canActivate:[authGuard],children:[
        {path:'employees', component: EmployeeListComponent},
        {path:'admin',component:AdminComponent},
        {path:'toolbar',component:ToolbarComponent},
        {path:'main',component:MainComponent},
        {path:'nails-orders',component:NailsOrderComponent},
        {path:'products/add',component:ProductAddComponent},
        {path:'products/list',component:ProductListComponent},
        {path:'employees/add', loadComponent:()=>import('./employee-add/employee-add.component').then(m => m.EmployeeAddComponent)}, 
        {path:'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)}
    ]},
    
];
