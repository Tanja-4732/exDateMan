import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Logs in the user
   *
   * @param {string} email The email address of the user to be logged in
   * @param {string} pwd The password of the user to be logged in
   * @returns {Promise<User>}
   * @memberof AuthService
   */
  async login(email: string, pwd: string): Promise<User> {
    const url: string = this.baseUrl + "/auth/login";
    const user: User = await this.http
      .post<JSON>(url, {
        email: email,
        pwd: pwd
      })
      .toPromise();
    console.log(JSON.stringify(user, null, 2));

    return user;
  }
}
