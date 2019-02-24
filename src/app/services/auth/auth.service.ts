import { Injectable } from "@angular/core";
import { User } from "../../models/user/user";
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
  async login(email: string, pwd: string): Promise<LoginResponse> {
    const user: LoginResponse | any = await this.http
      .post<JSON>(
        this.baseUrl + "/auth/login",
        {
          email: email,
          pwd: pwd
        },
        { withCredentials: true }
      )
      .toPromise();
    return user;
  }
}

/**
 * This is the response form the server for the login route
 *
 * @export
 * @interface LoginResponse
 */
export interface LoginResponse {
  status: number;
  user: string; // The username
}
