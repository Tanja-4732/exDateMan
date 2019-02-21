import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(private router: ActivatedRoute, private as: AuthService) {
    this.email = this.router.snapshot.params["email"];
  }

  ngOnInit() {}

  login(): void {
    this.as.login(this.email, this.password);
  }
}
