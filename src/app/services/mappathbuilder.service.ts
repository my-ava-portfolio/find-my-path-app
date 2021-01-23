import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { OutputPathApi, PathElement, NodeFeature } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

  // private REST_API_SERVER = 'https://find-my-path.herokuapp.com/api/v1/path?';
  private apiUrl = 'http://192.168.1.16:5000/api/v1/path?';
  pathBuilt: Subject<PathElement> = new Subject<PathElement>();
  ErrorApiFound: Subject<string> = new Subject<string>();
  chartPathToRefresh: Subject<PathElement> = new Subject<PathElement>();

  constructor(
      private http: HttpClient
  ) {}

  getPostProcData(path: PathElement): void {
    // get API data
    const transportMode: string = path.getTransportMode();
    let elevationStatus: boolean | string = path.getElevation();
    const nodes: NodeFeature[] = path.getNodes();

    if ( !elevationStatus ) {
      elevationStatus = '';
    }

    this.http.get<OutputPathApi>(
      this.apiUrl + 'elevation_mode=' + elevationStatus + '&mode=' + transportMode + '&geojson=' + JSON.stringify({ features: nodes })
    ).subscribe(
      (response) => {
        path.setLinePath(response?.line_path);
        path.setPointsPath(response?.points_path);
        path.setStatsPath(response?.stats_path);
        this.pathBuilt.next(path);
      },
      (response) => {
        // TODO improve error message, but API need improvments
        console.log('prout', response.error.message)
        this.ErrorApiFound.next(response.error.message);
      }
    );
  }

  refreshChartPath(path: PathElement): void  {
    this.chartPathToRefresh.next(path);
  }

}
