import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-crumb-trail",
  templateUrl: "./crumb-trail.component.html",
  styleUrls: ["./crumb-trail.component.scss"]
})
export class CrumbTrailComponent implements OnInit {
  constructor() {}

  /**
   * An accessor to make the static variable available in the template
   */
  get crumbs(): Crumb[] {
    return CrumbTrailComponent.crumbs;
  }

  /**
   * A list of crumbs to be displayed
   */
  public static crumbs: Crumb[] = [];

  ngOnInit() {}
}

/**
 * The icons of the application
 */
export enum Icon {
  Auth = "vpn_key",
  Events = "blur_on",
  Scan = "camera",
  Inventory = "work",
  Add = "add",
  Welcome = "home"
}

/**
 * An item in the CrumbTrail
 */
export interface Crumb {
  /**
   * Determines the icon to be used
   */
  icon?: Icon;

  /**
   * The title of the crumb
   */
  title: string;

  /**
   * Where this crumb should link to
   */
  routerLink?: string;
}
