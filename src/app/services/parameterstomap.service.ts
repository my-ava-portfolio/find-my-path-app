import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathElement, Nodes } from '../core/interfaces';


@Injectable()
export class ParametersToMapService {

    NodesPathToMap: Subject<PathElement> = new Subject<PathElement>();
    MapPathIdToremove: Subject<string> = new Subject<string>();

    constructor() { }

    mapFromPathNodes(pathFeat: PathElement): void {
        this.NodesPathToMap.next(pathFeat);
    }

    deletePathMaps(pathId: PathElement): void {
        this.MapPathIdToremove.next(pathId)
    }

}
