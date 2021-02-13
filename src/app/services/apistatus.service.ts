import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiBaseUrl } from '../core/interfaces';


@Injectable()
export class ApiStatusService {

    private apiUrl = `${apiBaseUrl}health`;
    apiHealth: Subject<string> = new Subject<string>();

    constructor(
        private http: HttpClient
    ) {}

    callApiStatus(): void {

      this.http.get<any>(this.apiUrl).subscribe(
        (response) => {
          this.apiHealth.next(response.status);
        },
        (err) => {
          this.apiHealth.next('Starting...');
        }
      );
    }

}
