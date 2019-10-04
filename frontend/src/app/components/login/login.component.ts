import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService, LoginResponse } from "../../services/auth/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { InventoryService } from "../../services/inventory/inventory.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  /**
   * Error flag
   */
  oof = false;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private as: AuthService,
    private fb: FormBuilder,
    private is: InventoryService,
    private router: Router
  ) {
    this.createForm();
    this.form.patchValue({ email: this.route.snapshot.params.email });
  }

  createForm(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required]],
      pwd: ["", [Validators.required]],
      totp: ["", [Validators.maxLength(6)]]
    });
  }

  ngOnInit() {}

  async onLogin(): Promise<void> {
    try {
      await this.as.login(
        this.form.value.email,
        this.form.value.pwd,
        this.form.value.totp
      );
      this.oof = false;

      // Refresh the inventories
      // await this.is.reFetchAll();

      this.router.navigate(["/inventories"], { relativeTo: this.route });
    } catch (error) {
      this.oof = true;

      console.error(error);
    }
  }
}
