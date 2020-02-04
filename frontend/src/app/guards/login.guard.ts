import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService, GetStatusResponse } from "../services/auth/auth.service";

@Injectable({
  providedIn: "root"
})
export class LoginGuard implements CanActivate, CanActivateChild {
  constructor(private as: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn();
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn();
  }

  /**
   * Checks, whether the user is logged in
   */
  private isLoggedIn(): boolean {
    try {
      return AuthService.cachedUserStatus.authorized;
    } catch (err) {
      // TODO remove log
      console.warn(err);
      return false;
    }
  }
}
