import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { formUserLogin } from 'src/app/models/userModel';
import { UserService } from 'src/app/services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: formUserLogin = {
    email: '',
    password: ''
  }

  constructor(
    private userService: UserService,
    private flashMessagesService: FlashMessagesService
    ) { }

  ngOnInit(): void {
  }

  loginUser(userForm: NgForm) {
    this.user.email = userForm.value.email
    this.user.password = userForm.value.password
    this.userService.loginUserService(this.user).subscribe(
      res => {
        this.userService.saveToken(res)
      },
      err => 
      this.flashMessagesService.show(err.error.msg,
         {cssClass: 'alert-danger', timeout: 3000} 
         )
    )
    userForm.resetForm()
  }

}
