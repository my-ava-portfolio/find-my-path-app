import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable()
export class D3ToInputs {

  pointMapMoved: Subject<string> = new Subject<string>();  // input parameters to paths

  constructor(
  ) {}

  emitpointMapMoved(pathId: string): void {
    this.pointMapMoved.next(pathId);
  };

}
