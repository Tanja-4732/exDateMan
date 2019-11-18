import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  async getUser(email: string): Promise<User> {
    const qRes: User = await this.http.get<User>(this.baseUrl + "/users/" + email).toPromise();
    return qRes;
  }
}

export interface InventoryUsers {
  owner?: User;
  admins: User[];

}
