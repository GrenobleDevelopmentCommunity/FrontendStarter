import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { isDefined } from '@angular/compiler/src/util';

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
  errorMessage: string;

  ngOnInit() {
  }

  login(): void {
    this.userservice.getUser(this.username,this.password).subscribe(user =>this.canLogin(user[0])); //TODO Why ? :o
    
  }

  canLogin(user: User): void {
    //TODO Regarder que le TOKEN
    if(isDefined(user)){
      //TODO stocker en local storage
      this.router.navigate(["index"]);
    }else{
      this.errorMessage="Bad credentials";
    }
    //
  }
}
