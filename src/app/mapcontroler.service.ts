import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class MapControlerService {
    bbox!: object;
    bboxChange: Subject<object> = new Subject<object>();

  constructor() {
  }

  change(data: object) {
    this.bbox = data;
    this.bboxChange.next(this.bbox);
  }
}
