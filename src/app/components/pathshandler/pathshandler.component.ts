import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PathContainer } from '../../core/interfaces';

import { PathsHandlerService } from '../../services/pathshandler.service';


@Component({
  selector: 'app-pathshandler',
  templateUrl: './pathshandler.component.html',
  styleUrls: ['./pathshandler.component.css']
})
export class pathsHandlerComponent implements OnInit {

  PathFeatures: PathContainer = [];
  countPath = 0;
  isPathFound = false;
  currentTabId!: string;

  constructor(
    private PathsHService: PathsHandlerService,
  ) {

    // to update path data injected into html templates children
    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      this.PathFeatures = data;
      this.countPath = data.length
    });

  }

  ngOnInit(): void {
    // this.getTabId(this.currentTabId);

  }

  getTabId(tabId: string): void {
    this.currentTabId = tabId;
    console.log('Get tab: ' + this.currentTabId);
    // inject current tab selected into the service
    this.PathsHService.currentTabDisplayed = tabId
  }

  addPath(): void {
    this.isPathFound = true;
    console.log('ADDED path');
    this.PathsHService.addPath();
  }

}
