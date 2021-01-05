import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Nodes, OutputPathApi } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/path?';
    pathApiOutputs: Subject<OutputPathApi> = new Subject<OutputPathApi>();
    pathApiData!: OutputPathApi;

    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    constructor(
        private http: HttpClient
    ) {}

    getPathData(TransportMode: string, nodes: Nodes, ElevationMode: boolean | string): void {
        if ( !ElevationMode ) {
            ElevationMode = '';
        }

        this.http.get<OutputPathApi>(
            this.REST_API_SERVER + 'elevation_mode=' + ElevationMode + '&mode=' + TransportMode + '&geojson=' + JSON.stringify({ type: 'FeatureCollection', features: nodes })
        ).subscribe(
            (response) => {

                this.pathApiData = response;
                this.pathApiOutputs.next(this.pathApiData);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }

    injectParameters(TransportMode: string, ElevationMode: boolean): void {
        this.getPathData(TransportMode, ElevationMode);
    }

}
