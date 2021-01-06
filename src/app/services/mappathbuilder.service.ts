import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathFeature, NodeGeoJson, Nodes, OutputPathApi, PathElement } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/path?';
    pathApiOutputs: Subject<PathElement> = new Subject<PathElement>();
    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    getPostProcData(path: PathElement): void {
        console.log('Get API data OK')
        const transportMode: string = path.getTransportMode();
        let elevationStatus: boolean | string = path.getElevation();
        const nodes: Nodes = path.getNodes();

        if ( !elevationStatus ) {
            elevationStatus = '';
        }

        this.http.get<OutputPathApi>(
            this.REST_API_SERVER + 'elevation_mode=' + elevationStatus + '&mode=' + transportMode + '&geojson=' + JSON.stringify({ features: nodes })
        ).subscribe(
            (response) => {
                path.setLinePath(response?.line_path);
                path.setPointsPath(response?.points_path);
                path.setStatsPath(response?.stats_path);
                this.pathApiOutputs.next(path);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }
}
