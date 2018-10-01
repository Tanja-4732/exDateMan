import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  repeat_password: string;

  constructor(private router: ActivatedRoute) {
    this.email = this.router.snapshot.params["email"];
  }

  ngOnInit() {}

  register() {
    if (this.password !== this.repeat_password) {
      alert("Passwords don't match!");
      return;
    }
    console.log("User registered: " + this.email);
  }
}
