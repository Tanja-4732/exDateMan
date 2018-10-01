import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(private router: ActivatedRoute) {
    this.email = this.router.snapshot.params["email"];
  }

  ngOnInit() {}

  login(): void {
    // TODO Implement login
  }
}
