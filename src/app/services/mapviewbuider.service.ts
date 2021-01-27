import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Bbox } from '../core/interfaces';
import { apiBaseUrl } from '../core/interfaces';


@Injectable()
export class MapViewBuilderService {

  private apiUrl = `${apiBaseUrl}/api/v1/location?`;

  errorMessage: Subject<string> = new Subject<string>();
  bboxCoords: Subject<number[]> = new Subject<number[]>();
  errorApiFound: Subject<boolean> = new Subject<boolean>();

  constructor(
      private http: HttpClient
  ) {}

  bboxFromLocation(StudyAreaName: string): void {
    this.http.get<Bbox>(
      `${this.apiUrl}name=${StudyAreaName}`
    ).subscribe(
      (response) => {
        this.bboxCoords.next(response.bbox);
        this.errorApiFound.next(false);
      },
      (error) => {
        this.errorMessage.next(error.error.message + ' (' + error.status + ')');
        this.errorApiFound.next(true);
      }
    );
  }
}
