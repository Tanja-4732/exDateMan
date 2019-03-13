import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  oof: boolean = false;

  form: FormGroup;

  constructor(
    private as: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.form.patchValue({email: this.route.snapshot.params["email"]});
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      repeat_password: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onRegister(): void {
    this.register().then(() => {
      if (!this.oof) {
        this.router.navigate(["/login"], { relativeTo: this.route });
      }
    });
  }

  async register(): Promise<void> {
    if (this.form.value.password !== this.form.value.repeat_password) {
      alert("Passwords don't match!");
      return;
    }
    try {
      await this.as.register(this.form.value.email, this.form.value.password, this.form.value.name);
      this.oof = false;
    } catch (error) {
      this.oof = true;
    }
  }
}
