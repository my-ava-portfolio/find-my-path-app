import { Component, OnInit } from '@angular/core';

import { PathContainer } from '../../core/interfaces';

import { PathsHandlerService } from '../../services/pathshandler.service';


@Component({
  selector: 'app-nodeshandler',
  templateUrl: './nodeshandler.component.html',
  styleUrls: ['./nodeshandler.component.css']
})
export class NodeshandlerComponent implements OnInit {

  PathsHandlerContainer: PathContainer = [];
  countPath = 0;
  isPathFound = false;
  currentTabId!: string;

  constructor(
    private PathsHService: PathsHandlerService,
  ) {

    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      this.PathsHandlerContainer = data;
    });

  }

  ngOnInit(): void {
  }

  getTabId(tabId: string): void {
    this.currentTabId = tabId;
    console.log('Get tab: ' + this.currentTabId)
    this.PathsHService.currentTabDisplayed = this.currentTabId;
  }

  addPath(): void {
    this.isPathFound = true;
    this.PathsHService.addPath(this.currentTabId);
  }
}
