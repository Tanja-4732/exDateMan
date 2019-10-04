import { Component, OnInit } from "@angular/core";
import { ThingService } from "../../services/thing/thing.service";
import { Thing } from "../../models/thing/thing";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-add-thing",
  templateUrl: "./add-thing.component.html",
  styleUrls: ["./add-thing.component.scss"]
})
export class AddThingComponent implements OnInit {
  oof: boolean = false; // Error flag
  unauthorized: boolean = false;

  thing: Thing;
  inventoryId: number;

  form: FormGroup;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
    ) {
    this.createForm();
    }

    createForm(): void {
      this.form = this.fb.group({
        name: ["", [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.getInventoryId();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  onAddThing(): void {
    this.createThing().then(() => {
      this.router.navigate([".."], { relativeTo: this.route });
    });
  }

  private copyData(): void {
    this.thing = this.form.value;
  }

  async createThing(): Promise<void> {
    try {
      this.copyData();
      this.thing.categoryUuids = [];
      await this.ts.newThing(this.thing, this.inventoryId);
      this.oof = false;
    } catch (err) {
      console.log("oof"); // TODO remove log
      console.log(err);

    }
  }

  getInventoryId(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
  }
}
