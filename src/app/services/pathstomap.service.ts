import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathElement, Nodes } from '../core/interfaces';


@Injectable()
export class PathsToMapService {

  pathToRefresh: Subject<PathElement> = new Subject<PathElement>();


    constructor() { }

  refreshPathNodesFromPathId(pathFeature: PathElement): void {
    console.log('refresh ', pathFeature)
      this.pathToRefresh.next(pathFeature);
  }

}
