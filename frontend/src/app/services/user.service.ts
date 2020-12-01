import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formUserLogin, formUserRegister } from '../models/userModel';
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registerUserUrl = 'https://vrfhyoeld8.execute-api.us-east-1.amazonaws.com/dev/registeruser'
  loginUserUrl = 'https://vrfhyoeld8.execute-api.us-east-1.amazonaws.com/dev/loginuser'
  getUserUrl = 'https://vrfhyoeld8.execute-api.us-east-1.amazonaws.com/dev/getuser'

  token: any
  private authStatusListener = new Subject<boolean>()
  user: object 

  constructor(private http: HttpClient, private router: Router) { }

  registerUserService (user: formUserRegister): Observable<any> {
    return this.http.post(this.registerUserUrl, user)
  }

  loginUserService (user: formUserLogin): Observable<any> {
    return this.http.post(this.loginUserUrl, user)
  } 

  saveToken (token: any): void {
    this.token = token
    this.authStatusListener.next(true)
    localStorage.setItem('id_token', token)
    this.getUserService()
  }

  getUserService () {
    this.loadToken()
    let headers = new HttpHeaders()
    headers = headers.set('Authorization', this.token)
    return this.http.get(this.getUserUrl, {headers: headers})
    .subscribe(data=> {
      this.user = data
      console.log(this.user)
      this.router.navigate(["/main"])
    }) 
  }

  loadToken ():void {
    const token = localStorage.getItem('id_token')
    this.token = token
  }
  ////////////////////////////////////////////////////

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUser() {
    return this.user
  }

  logout() {
    localStorage.removeItem('id_token')
    this.token = null
    this.router.navigate(["/"])
  }

}
