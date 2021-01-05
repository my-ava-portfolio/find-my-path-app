import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Nodes, OutputPathApi, PathFeature } from '../core/interfaces';


@Injectable()
export class MapToParametersService {

    newPointCoords: Subject<number[]> = new Subject<number[]>();
    pathComplete: Subject<PathFeature> = new Subject<PathFeature>();

    constructor() { }

    getPointCoords(coordinates: number[]): void {
        this.newPointCoords.next(coordinates);
    }

    pushCompletePath(Path: PathFeature): void {
        this.pathComplete.next(Path)
    }

}
