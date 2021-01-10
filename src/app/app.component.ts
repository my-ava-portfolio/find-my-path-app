import { Component, ViewEncapsulation } from '@angular/core';

import { interval } from 'rxjs';
import { startWith  } from 'rxjs/operators';

import { ApiStatusService } from './services/apistatus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  AppTitle = 'Find My Path';
  apiStatus!: string;
  ApiContinuousChecker = interval(5000); // observable which run all the time

  constructor(
    private ApiCheckService: ApiStatusService
  ) {

    this.ApiCheckService.apiHealth.subscribe(data =>
      this.apiStatus = data
    )

  }


  ngOnInit(): void {
    this.checkApiStatus()
  }


  checkApiStatus(): void {
    this.ApiContinuousChecker.pipe(startWith(0)).subscribe(() => {
        this.ApiCheckService.callApiStatus()
      }
    );
  }

}
