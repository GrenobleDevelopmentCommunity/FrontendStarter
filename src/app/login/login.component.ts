import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userservice: UserService) { }

  username: string;
  password: string;
  errorMessage: string;

  ngOnInit(): void {
  }

  login(): void {
    this.userservice.authenticateUser(this.username, this.password)
      .subscribe(
        () => this.router.navigate(['/'], { replaceUrl: true }),
        () => this.errorMessage = 'Bad credentials'
      );
  }
}
