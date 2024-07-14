// import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationLoginComponent } from '../Layout/authentication-login/authentication-login.component';
import { HomeComponent } from '../Layout/home/home.component';
import { AuthenticationRegisterComponent } from '../Layout/authentication-register/authentication-register.component';
import { BookComponent } from '../Layout/book/book.component';
import { ContainerComponent } from '../Layout/container/container.component';
import { CustomerComponent } from '../Layout/customer/customer.component';
import { authGuard } from './gaurds/auth.guard';

export const routes: Routes = [
    { path: 'admin', component: HomeComponent,
        canActivate:[authGuard],
        children: [

        { path: 'books', component: BookComponent },
        {path: 'main', component: ContainerComponent},
        {path:'customer', component: CustomerComponent},
        {path:'register', component: AuthenticationRegisterComponent},

    ] },
    { path: 'login', component: AuthenticationLoginComponent },

    {path:"**", redirectTo:"login", pathMatch: "full"},


];
// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })
// export class AppRoutingModule { }
