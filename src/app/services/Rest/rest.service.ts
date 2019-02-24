import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
// import { map } from "lodash";
import { THING } from "src/app/models/thing.model";

// TODO delete this file when ready

@Injectable({
  providedIn: "root"
})
export class RestService {
  private token: String = "hdjeHIn53I87€qQ@fm"; // This never got used
  constructor(private http: HttpClient) {}

  endpoint: String = "http://localhost:420/api/v1/";
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  // private extractData(res: Response) {
  //   let body = res;
  //   return body || {};
  // }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getThing(thingUID: number): THING {
    const result = this.http.get(this.endpoint + "things/" + thingUID);
    return new THING(result + "", "test");
  }

  getThings(): Observable<any> {
    return this.http.get(this.endpoint + "things/");
    //  .map(res => ).pipe(map(this.extractData));
  }

  createThing(thing: THING): any {
    console.log(thing);
    return this.http.post(this.endpoint + "thing", thing);
  }

  updateThing(thing: THING): any {
    console.log("Updating...");

    console.log(thing);
    return this.http.post(this.endpoint + "thing", thing);
  }

  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     console.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
}
