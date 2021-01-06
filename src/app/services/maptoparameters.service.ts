import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Nodes, OutputPathApi, PathElement } from '../core/interfaces';


@Injectable()
export class MapToParametersService {

    newPointCoords: Subject<number[]> = new Subject<number[]>();
    pathComplete: Subject<PathElement> = new Subject<PathElement>();

    constructor() { }

    getPointCoords(coordinates: number[]): void {
        this.newPointCoords.next(coordinates);
    }

    pushCompletePath(Path: PathElement): void {
        this.pathComplete.next(Path)
    }

}
