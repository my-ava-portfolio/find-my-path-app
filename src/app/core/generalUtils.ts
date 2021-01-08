import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

  export class GeneralUtils {

    constructor() {
    }

    randomHexColor(): string{
        // bug !
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    shiftingOnArray(input: any[], from: number, to: number): any[] {
        // TODO add to common func
        let numberOfDeletedElm = 1;
        const elm = input.splice(from, numberOfDeletedElm)[0];
        numberOfDeletedElm = 0;
        input.splice(to, numberOfDeletedElm, elm);
        return input;
      }
}

