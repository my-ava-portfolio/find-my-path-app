import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';



@Injectable()
export class PathsToInputs {

  pathId: Subject<string> = new Subject<string>();  // paths to input parameters

  refreshGlobalChart: Subject<boolean> = new Subject<boolean>();  // input parameters to paths

    constructor(
    ) {}

    emitPathId(pathId: string): void {
      this.pathId.next(pathId);
  };

  emitChartRefreshing(): void {
      this.refreshGlobalChart.next(true);
    };
}
