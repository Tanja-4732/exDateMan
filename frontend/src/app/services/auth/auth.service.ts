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
   * @param email The email address of the user to be logged in
   * @param pwd The password of the user to be logged in
   */
  async login(
    email: string,
    pwd: string,
    tfaToken?: string
  ): Promise<LoginResponse> {
    const user: LoginResponse | any = await this.http
      .post<JSON>(
        this.baseUrl + "/authentication/login",
        {
          email,
          pwd,
          tfaToken
        },
        { withCredentials: true }
      )
      .toPromise();
    return user;
  }

  /**
   * Perform a logout request
   *
   * This will remove the JWT thus signing out the user.
   */
  async logout(): Promise<any> {
    return await this.http
      .post(this.baseUrl + "/authentication/logout", null)
      .toPromise();
  }

  /**
   * Issues a request to the server to create a new account
   * @param email The desired email
   * @param pwd The desired password
   * @param name The desired friendly name
   */
  async register(
    email: string,
    pwd: string,
    name: string
  ): Promise<RegisterResponse> {
    const req: RegisterRequest = { email, pwd, name } as RegisterRequest;
    return await this.http
      .post<RegisterResponse>(this.baseUrl + "/authentication/register", req)
      .toPromise();
  }

  async getUser(): Promise<User> {
    const res: { status: string; user: User } = await this.http
      .get<{ status: string; user: User }>(this.baseUrl + "/account")
      .toPromise();

    if (res.status !== "Authenticated") {
      throw new Error("Not signed in");
    }
    return res.user;
  }

  async saveUser(user: User): Promise<{ status: string; user: User }> {
    return await this.http
      .put<{ status: string; user: User }>(this.baseUrl + "/account", user)
      .toPromise();
  }
}

/**
 * This is the response form the server for the login route
 */
export interface LoginResponse {
  // TODO redo
  status: number;
  user: string; // The username
}

interface RegisterRequest {
  email: string;
  pwd: string;
  name: string;
}

interface RegisterResponse {
  status: number;
  message: string;
  email: string;
}
