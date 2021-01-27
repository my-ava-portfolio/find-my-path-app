import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PathElement } from '../core/interfaces';


@Injectable()
export class PathsToMapService {

  pathToRefresh: Subject<PathElement> = new Subject<PathElement>();


    constructor() { }

  refreshPathNodesFromPathId(pathFeature: PathElement): void {
      this.pathToRefresh.next(pathFeature);
  }

}
