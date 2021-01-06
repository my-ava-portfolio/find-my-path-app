import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathElement, Nodes } from '../core/interfaces';


@Injectable()
export class ParametersToMapService {

    NodesPathToMap: Subject<PathElement> = new Subject<PathElement>();
    NodesToMap: Subject<Nodes> = new Subject<Nodes>();

    constructor() { }

    mapFromPathNodes(pathFeat: PathElement): void {
        this.NodesPathToMap.next(pathFeat);
    }

}
