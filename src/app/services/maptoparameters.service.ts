import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Nodes, OutputPathApi, PathElement } from '../core/interfaces';


@Injectable()
export class MapToParametersService {

  newPointCoords: Subject<number[]> = new Subject<number[]>();
  pathComplete: Subject<PathElement> = new Subject<PathElement>();

  pointCoords!: number[];
  pathDone!: PathElement;

  constructor() { }

  getPointCoords(coordinates: number[]): void {
    this.pointCoords = coordinates,
    this.newPointCoords.next(this.pointCoords);
  }

  pushCompletePath(Path: PathElement): void {
    this.pathDone = Path,
    this.pathComplete.next(this.pathDone)
  }

}
