import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathFeature, NodeGeoJson, OutputPathApi } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/path?';
    pathApiOutputs: Subject<PathFeature> = new Subject<PathFeature>();
    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    getPostProcData(path: PathFeature): void {
        console.log('Get API data OK')
        const transportMode: string = path.configuration.transportModeStatus;
        let elevationStatus: boolean | string = path.configuration.elevationStatus;
        const nodes: NodeGeoJson = path.inputNodes;

        if ( !elevationStatus ) {
            elevationStatus = '';
        }

        this.http.get<OutputPathApi>(
            this.REST_API_SERVER + 'elevation_mode=' + elevationStatus + '&mode=' + transportMode + '&geojson=' + JSON.stringify(nodes)
        ).subscribe(
            (response) => {
                path.line_path = response?.line_path;
                path.points_path = response!.points_path;
                path.stats_path = response?.stats_path;
                this.pathApiOutputs.next(path);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }
}
