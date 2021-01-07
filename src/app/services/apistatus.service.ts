import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { repeat  } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ApiStatusService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/health';
    apiHealth: Subject<string> = new Subject<string>();
    startingMessage = from(['', '.', '..', '...']);

    constructor(
        private http: HttpClient
    ) {}

    callApiStatus(): void {

      this.http.get<any>(this.REST_API_SERVER).subscribe(
        (response) => {
          this.apiHealth.next(response.status);
        },
        (err) => {
          this.apiHealth.next('Starting...');
        }
      )
    };

}
