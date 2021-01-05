import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathFeature, Nodes } from '../core/interfaces';


@Injectable()
export class ParametersToMapService {

    NodesPathToMap: Subject<PathFeature> = new Subject<PathFeature>();
    NodesToMap: Subject<Nodes> = new Subject<Nodes>();

    constructor() { }

    mapFromPathNodes(pathFeat: PathFeature): void {
        this.NodesPathToMap.next(pathFeat);
    }

}
