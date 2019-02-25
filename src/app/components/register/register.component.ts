import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  oof: boolean = false;

  email: string;
  password: string;
  repeat_password: string;
  name: string;


  constructor(private as: AuthService, private router: Router, private route: ActivatedRoute) {
    this.email = this.route.snapshot.params["email"];
  }

  ngOnInit(): void {}

  onRegister(): void {
    this.register().then(() => {
     if(!this.oof) {
        this.router.navigate(["/login"], { relativeTo: this.route });
     }
    });
  }

  async register(): Promise<void> {
    if (this.password !== this.repeat_password) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await this.as.register(this.email, this.password, this.name);
      this.oof = false;
    } catch (error) {
      this.oof = true;
    }
  }
}
