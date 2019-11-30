import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CustomValidatorsService } from "../../services/CustomValidators/custom-validators.service";
import { InventoryService } from "../../services/inventory/inventory.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  oof = false;
  emailInUse = false;
  emailAddress: string;

  form: FormGroup;

  constructor(
    private as: AuthService,
    private is: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cvs: CustomValidatorsService
  ) {
    this.createForm();
    this.form.patchValue({ email: this.route.snapshot.params.email });
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      passwords: this.fb.group(
        {
          password: ["", [Validators.required]],
          repeat_password: ["", [Validators.required]]
        },
        { validators: CustomValidatorsService.childrenEqual }
      )
    });
  }

  ngOnInit(): void {}

  async onRegister(): Promise<void> {
    this.emailAddress = this.form.value.email;
    try {
      await this.as.register(
        this.form.value.email,
        this.form.value.passwords.password,
        this.form.value.name
      );
      this.oof = false;
      this.emailInUse = false;

      // Reload the login state
      document.dispatchEvent(new Event("auth"));

      this.router.navigate(["/inventories"], { relativeTo: this.route });
    } catch (error) {
      this.oof = true;
      this.emailInUse = error.error.error === "Email already in use";

      console.error(error);
    }
  }
}
