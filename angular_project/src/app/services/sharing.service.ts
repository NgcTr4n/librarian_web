import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  userSrv: UserService =inject(UserService)
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
    this.userSrv.getCurrentUser().then(user=>{
      if(user){
      this.isUserLoggedIn.next(true)
      }
    })
    }}
