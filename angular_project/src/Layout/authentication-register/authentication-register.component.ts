import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentication-register',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './authentication-register.component.html',
  styleUrl: './authentication-register.component.css'
})
export class AuthenticationRegisterComponent {
  router: Router = inject(Router)
  fb: FormBuilder = inject(FormBuilder)
  fauthService: AuthService = inject(AuthService)
  userFrm: any
  constructor() {
    this.userFrm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }
resetFrm(){
  this.userFrm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['']
  }
  )}
  passwordMatchValidator(frm: any) {
    return frm.get('password').value === frm.get('confirmPassword').value ? null : { passwordMismatch: true };
  }
  createUser() {
    this.fauthService.CreateAcount(this.userFrm.controls['email'].value, this.userFrm.controls['password'].value)
      .then(user => {
        console.log(user)
        this.resetFrm()
        alert("Đăng ký tài khoản thành công")
        this.router.navigate(["/admin/register"])
      })
  }
}
