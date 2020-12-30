import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ViewControlerMapService {

    private REST_API_SERVER: string = "https://find-my-path.herokuapp.com/api/v1/location?";
    bboxCoords: Subject<number[]> = new Subject<number[]>();

    constructor(
        private http: HttpClient
    ) {}

    bboxFromLocation(study_area_name: string) {
        this.http.get<any>(this.REST_API_SERVER + "name=" + study_area_name)
            .subscribe(response => {
                this.bboxCoords.next(response.bbox);
            }
        );
    }
}
