import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable()
export class ControlersToInputs {

  nodeUuidRemoved: Subject<number> = new Subject<number>();
  nodeUuidChangedTop: Subject<number> = new Subject<number>();
  nodeUuidChangedBot: Subject<number> = new Subject<number>();

  constructor(
  ) {}

  emitNodeRemoved(uuid: number): void {
    this.nodeUuidRemoved.next(uuid);
  };

  emitNodeChangedToTop(uuid: number): void {
    this.nodeUuidChangedTop.next(uuid);
  };

  emitNodeChangedToBot(uuid: number): void {
    this.nodeUuidChangedBot.next(uuid);
  };
}
