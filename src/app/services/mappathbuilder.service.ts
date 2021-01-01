import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Node, OutputPathApi, NodePathGeoJson, PathStatistics } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/path?';
    PathPointsOutput: Subject<NodePathGeoJson> = new Subject<NodePathGeoJson>();
    PathStatisticsOutput: Subject<PathStatistics> = new Subject<PathStatistics>();
    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    getPathData(TransportMode: string, nodes: Node[], ElevationMode: boolean | string ): void {
        console.log("yatta", JSON.stringify({ type: "FeatureCollection", features: nodes }))
        if ( !ElevationMode ) {
            ElevationMode = '';
        }

        this.http.get<OutputPathApi>(
            this.REST_API_SERVER + 'elevation_mode=' + ElevationMode + '&mode=' + TransportMode + '&geojson=' + JSON.stringify({ type: "FeatureCollection", features: nodes })
        ).subscribe(
            (response) => {
                this.PathPointsOutput.next(response.points_path);
                this.PathStatisticsOutput.next(response.stats_path);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }

    injectParameters(TransportMode: string, ElevationMode: boolean, NodesDefined: Node[]): void {
        this.getPathData(TransportMode, NodesDefined, ElevationMode)
    }

}
