import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomValidatorsService } from "../../services/CustomValidators/custom-validators.service";
import { User } from "../../models/user/user";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  oof: boolean = false;
  loading: boolean = true;
  unauthorized: boolean = false;

  user: User;

  form: FormGroup;
  error: { status: string; user: User };
  disable2FA: boolean = false;

  constructor(
    private as: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.form.patchValue({ email: this.route.snapshot.params["email"] });
  }
  ngOnInit(): void {
    this.loadUser().then();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      passwords: this.fb.group(
        {
          password: ["", []],
          repeat_password: ["", []]
        },
        { validators: CustomValidatorsService.childrenEqual }
      ),
      tfa: ["", []],
      use2FA: [true, []]
    });
  }

  async loadUser(): Promise<void> {
    try {
      this.user = await this.as.getUser();
      console.log(this.user);

      this.form.patchValue(this.user);

      this.form.value.passwords.password = "";

      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Set flag for html change and timeout above
          this.unauthorized = true;
        } else {
          console.log("Unknown error in inventories while fetching");
        }
      }
    }
  }

  onSave(): void {
    this.save().then(() => {
      if (!this.oof) {
        this.router.navigate(["/inventories"], { relativeTo: this.route });
      }
    });
  }

  async save(): Promise<void> {
    try {
      this.error = await this.as.saveUser({
        id: this.user.id,
        name: this.form.value.name,
        email: this.form.value.email,
        pwd: this.form.value.passwords.password,
        tfaToken: this.form.value.tfa,
        tfaEnabled: this.user.tfaEnabled
          ? this.form.value.use2FA
          : this.form.value.tfa !== ""
      });
      this.oof = false;
    } catch (error) {
      this.error = error.error.error; // This works
      this.oof = true;
    }
  }
}
