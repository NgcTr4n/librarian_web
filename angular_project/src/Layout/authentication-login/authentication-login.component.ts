import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-authentication-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule,FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './authentication-login.component.html',
  styleUrl: './authentication-login.component.css',
})
export class AuthenticationLoginComponent {
  constructor() {
    this.userFrm = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]],
    })
  }
  router: Router = inject(Router)
  fb: FormBuilder = inject(FormBuilder)
  fauthService: AuthService = inject(AuthService)
  userFrm: any
  // navigateToHome() {
  //   this.router.navigate(['/home']);
  // }
  
  authSrv: AuthService = inject(AuthService)
  tryGoogleLogin(){
    this.authSrv.signinGmail().then(user => {console.log("Đăng nhập thành công:"), user})
    this.router.navigate(['admin/main'])
    // location.href=""
  }
  LoginWithFirebase(){
    this.authSrv.Login(this.userFrm.controls['email'].value, this.userFrm.controls['password'].value)
    .then(user => {
      console.log(user)
      this.router.navigate(['admin/main'])
    })
  }
}
