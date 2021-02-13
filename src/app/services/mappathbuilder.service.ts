import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { OutputPathApi, PathElement, Node } from '../core/interfaces';
import { apiBaseUrl } from '../core/interfaces';


@Injectable()
export class MapPathBuilderService {

  private apiUrl = `${apiBaseUrl}path?`;
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
    let loopStatus: boolean | string = path.isPathLoop;

    const nodes: Node[] = path.getNodes();

    if ( !elevationStatus ) {
      elevationStatus = '';
    }
    if ( !loopStatus ) {
      loopStatus = '';
    }
    const geojsonData: string = JSON.stringify({ features: nodes });

    this.http.get<OutputPathApi>(
      `${this.apiUrl}path_name=${path.name}&elevation_mode=${elevationStatus}&mode=${transportMode}&geojson=${geojsonData}&is_loop=${loopStatus}`
    ).subscribe(
      (response) => {
        path.setLinePath(response?.line_path);
        path.setPointsPath(response?.points_path);
        path.setStatsPath(response?.stats_path);
        this.pathBuilt.next(path);
      },
      (response) => {
        // TODO improve error message, but API need improvments
        this.ErrorApiFound.next(response.error.message);
      }
    );
  }

  refreshChartPath(path: PathElement): void  {
    this.chartPathToRefresh.next(path);
  }

  refreshPath(path: PathElement): void {
    // in order to replay path animation
    this.pathBuilt.next(path);
  }

}
