import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { formUserRegister } from 'src/app/models/userModel';
import { UserService } from 'src/app/services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: formUserRegister = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''  
  }

  constructor(
    private userService: UserService,
    private flashMessagesService: FlashMessagesService
    ) {  }

  ngOnInit(): void {
  }

  registerUser(userForm: NgForm) {
    if(userForm.value.password=== userForm.value.confirmPassword) {
      this.user.name = userForm.value.name
      this.user.email = userForm.value.email
      this.user.password = userForm.value.password
      this.userService.registerUserService(this.user)
      .subscribe(
        res => this.userService.saveToken(res),
        err => 
        this.flashMessagesService.show(err.error.msg,
           {cssClass: 'alert-danger', timeout: 3000} 
           )
      )
      userForm.resetForm()
    }
    userForm.resetForm()
  }

  

}
