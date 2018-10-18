import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users/user.service';
import { User } from '../services/users/user';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a password, min 6 characters' :
        this.password.hasError('password') ? 'Not a valid password' :
        this.password.hasError('minlength') ? 'Min 6 characters' : '';
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  add(): void {
    if (!this.email.valid || !this.password.valid) {
      return; // TODO: display error message
    }

    this.userService.addUser(this.email.value, this.password.value)
      .subscribe(
        (user) => {
          console.log('User added with succes');
          this.users.push(user);
          this.email.reset();
          this.password.reset();
        }, // TODO: refresh list of users + success message
        (error) => console.log(error)
      );
  }

}
