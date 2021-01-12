import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';



@Injectable()
export class PathsToInputs {

    pathId: Subject<string> = new Subject<string>();

    constructor(
    ) {}

    emitPathId(pathId: string): void {

      this.pathId.next(pathId);
    };

}
