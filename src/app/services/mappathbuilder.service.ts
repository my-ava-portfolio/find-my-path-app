import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Node, NodeGeoJson, OutputPathApi, NodePathGeoJson } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

    // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
    private REST_API_SERVER = 'http://192.168.1.16:5000/api/v1/path?';
    PathPointsOutput: Subject<NodePathGeoJson> = new Subject<NodePathGeoJson>();
    PathPointsOutputTemp!: NodePathGeoJson;
    ErrorApiFound: Subject<boolean> = new Subject<boolean>();

    ElevationMode!: boolean;
    TransportMode!: string;
    NodesDefined!: Node[];

    constructor(
        private http: HttpClient
    ) {}

    getPathData(TransportMode: string, nodes: Node[], ElevationMode: boolean): void {
        console.log("yatta", JSON.stringify({ type: "FeatureCollection", features: nodes }))
        this.http.get<OutputPathApi>(
            this.REST_API_SERVER + 'elevation_mode=' + ElevationMode + '&mode=' + TransportMode + '&geojson=' + JSON.stringify({ type: "FeatureCollection", features: nodes })
        ).subscribe(
            (response) => {
                this.PathPointsOutputTemp = response.points_path;
                this.PathPointsOutput.next(this.PathPointsOutputTemp);
            },
            (error) => {
                // TODO improve error message, but API need improvments
                this.ErrorApiFound.next(true);
            }
        );
    }

    injectParameters(TransportMode: string, ElevationMode: boolean, NodesDefined: Node[]): void {
        this.TransportMode = TransportMode;
        this.ElevationMode = ElevationMode;
        this.NodesDefined = NodesDefined;
        this.getPathData(TransportMode, NodesDefined, ElevationMode)
        console.log("parameters injected", this.TransportMode, this.ElevationMode, this.NodesDefined)
    }

}
