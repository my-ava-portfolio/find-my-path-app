import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable()
export class D3ToInputs {

  pointMapMovedNewCoordinates: Subject<number[]> = new Subject<number[]>();  // input parameters to paths

  constructor(
  ) {}

  emitpointMapMoved(coordinates: number[]): void {
    this.pointMapMovedNewCoordinates.next(coordinates);
  };

}
