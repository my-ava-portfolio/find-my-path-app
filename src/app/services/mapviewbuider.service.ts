import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Bbox } from '../core/interfaces';


@Injectable()
export class MapViewBuilderService {

    private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/location?';
    bboxCoords: Subject<number[]> = new Subject<number[]>();
    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    bboxFromLocation(StudyAreaName: string): void {
        this.http.get<Bbox>(this.REST_API_SERVER + 'name=' + StudyAreaName).subscribe(
            (response) => {
                this.bboxCoords.next(response.bbox);
                this.ErrorApiFound.next(false);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }
}
