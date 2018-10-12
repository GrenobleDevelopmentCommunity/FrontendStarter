import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userservice: UserService) { }

  username: string;
  password: string;
  user: User;

  ngOnInit() {
  }

  login(): void {
    this.userservice.getUser(this.username,this.password).subscribe(user => this.user = user[0]); //TODO Why ? :o
    
    //this.router.navigate(["index"]);
  }
}
