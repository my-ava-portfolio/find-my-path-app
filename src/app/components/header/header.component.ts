import { Component, OnInit, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith  } from 'rxjs/operators';

import { ApiStatusService } from '../../services/apistatus.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() NavBarTitle = 'Nav bar title';

  apiStatus!: string;
  ApiContinuousChecker = interval(5000); // observable which run all the time

  ApiContinuousCheckerSubscription!: Subscription;

  constructor(
    private ApiCheckService: ApiStatusService
  ) {

    this.ApiCheckService.apiHealth.subscribe(data => {
        this.apiStatus = data;
        if (this.apiStatus === 'Ready' ) {
          this.ApiContinuousCheckerSubscription.unsubscribe();
        }
      }

    );

  }

  ngOnInit(): void {
    this.checkApiStatus();
  }

  checkApiStatus(): void {
    this.ApiContinuousCheckerSubscription = this.ApiContinuousChecker.pipe(startWith(0)).subscribe(() => {
        this.ApiCheckService.callApiStatus();
      }
    );
  }

}
