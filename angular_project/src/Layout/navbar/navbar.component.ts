import { Component, inject } from '@angular/core';
import { UserService } from '../../app/services/user.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharingService } from '../../app/services/sharing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  displayName: any
  userService: UserService = inject(UserService)
  
  router: Router = inject(Router)
  sharingService: SharingService = inject(SharingService)
  fauthService:AuthService = inject(AuthService)
  constructor() { 
    this.sharingService.isUserLoggedIn
      .subscribe(value=>{
        if(value){
          this.userService.getCurrentUser()
            .then(user => {
                this.displayName = user.displayName!=null? user.displayName: user.email   
                console.log(this.displayName);} 
              ).catch(e => {console.log(e);}
            );										
      }else{
        this.displayName="" //ngược lại khi value=false thì gán lại this.displayName="" để cập nhật lại giao diện
      }	
      })
    
    this.userService.getCurrentUser()
      .then(user=> {
        this.displayName = user.displayName!=null? user.displayName: user.email
        console.log("display Name:",this.displayName);
      });	
      
  }
  logout(){
    this.fauthService.logout().then(()=>{
      this.router.navigate([''])
    })
  }

}
