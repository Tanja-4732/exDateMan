import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "express-serve-static-core";
import { ActivatedRoute } from "@angular/router";
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

  constructor(
    private as: AuthService,
    // private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cvs: CustomValidatorsService
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
      tfa: ["", []]
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
    this.register().then(() => {
      if (!this.oof) {
        // this.router.navigate(["/login"], { relativeTo: this.route });
      }
    });
  }

  async register(): Promise<void> {
    try {
      await this.as.register(
        this.form.value.email,
        this.form.value.passwords.password,
        this.form.value.name
      );
      this.oof = false;
    } catch (error) {
      this.oof = true;
    }
  }
}
