import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathElement, Nodes } from '../core/interfaces';


@Injectable()
export class ParametersToMapService {

  NodesPathToMap: Subject<PathElement> = new Subject<PathElement>();
  MapPathIdToremove: Subject<string> = new Subject<string>();
  PathToZoom: Subject<PathElement> = new Subject<PathElement>();

  feature!: PathElement;
  featureId!: string;

    constructor() { }


  mapFromPathNodes(pathFeat: PathElement): void {
    this.feature = pathFeat
    this.NodesPathToMap.next(this.feature);
  }

  deletePathMaps(pathId: string): void {
    this.featureId = pathId // TODO simplify
    this.MapPathIdToremove.next(this.featureId)
  }

  zoomOnPathOnMap(pathFeat: PathElement): void {
    this.PathToZoom.next(pathFeat)
  }

}
