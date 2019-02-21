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

  async login(email: string, pwd: string): Promise<User> {
    let url: string = this.baseUrl + "/auth/login";
    const user = await this.http
      .post<JSON>(url, {
        email: email,
        pwd: pwd
      })
      .toPromise();
    console.log(JSON.stringify(user, null, 2));

    return user;
  }
}
