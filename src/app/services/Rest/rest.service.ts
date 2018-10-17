import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RestService {
  constructor(private http: HttpClient) {}

  endpoint = "http://localhost:420/api/v1/";
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
}
