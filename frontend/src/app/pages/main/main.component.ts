import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: object  

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser() 
    console.log(this.user)
  }

  logout() {
    console.log('gadja')
    this.userService.logout()
  }

}
