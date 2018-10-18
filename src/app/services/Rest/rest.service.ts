import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "lodash";
import { THING } from "src/app/models/thing.model";

@Injectable({
  providedIn: "root"
})
export class RestService {
  private token = "hdjeHIn53I87€qQ@fm";
  constructor(private http: HttpClient) {}

  endpoint = "http://localhost:420/api/v1/";
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  // private extractData(res: Response) {
  //   let body = res;
  //   return body || {};
  // }

  getThings(): Observable<any> {
    return this.http.get(this.endpoint + "things");
  }

  createThing(thing: THING) {
    console.log(thing);
    return this.http.post(this.endpoint + "thing", thing);
  }
}
