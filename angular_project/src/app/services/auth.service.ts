import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { SharingService } from './sharing.service';
import { Alert } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  fauth:Auth = inject(Auth)
  sharing:SharingService = inject(SharingService)
  constructor() { }
  async CreateAcount(email: string, password: string){
    return await createUserWithEmailAndPassword(this.fauth, email, password)
    .then(result => {
      var user = result.user;
      // this.sharing.isUserLoggedIn.next(true)
      console.log(user)
    })
    .catch((error)=>{
        // Handle Errors here.
						var errorCode = error.code;
						var errorMessage = error.message;
						// The email of the user's account used.
						var email = error.email;
						// The firebase.auth.AuthCredential type that was used.
						var credential = error.credential;
						// ...
    })
  }
  async signinGmail(){
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.fauth, provider);
      const user = result.user;
      this.sharing.isUserLoggedIn.next(true); // Cập nhật trạng thái đăng nhập khi đăng nhập Google thành công
      console.log(user);
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }
  async Login(email: string, password:string){   
    
    return await  signInWithEmailAndPassword(this.fauth,email,password)
      .then( result => {      
      var user = result.user;
      this.sharing.isUserLoggedIn.next(true)
      console.log(user)						
      }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
     });
  }
  logout(){
    return new Promise<any>((resolve,reject)=>{
      if (this.fauth.currentUser){
        this.fauth.signOut();
        this.sharing.isUserLoggedIn.next(false)
        resolve("log out");
      }else{
        reject();
      }  
    })
    }
}
