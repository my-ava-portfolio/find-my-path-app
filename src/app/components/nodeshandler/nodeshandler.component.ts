import { Component, OnInit } from '@angular/core';

import { PathContainer } from '../../core/interfaces';

import { PathsHandlerService } from '../../services/pathshandler.service';


@Component({
  selector: 'app-nodeshandler',
  templateUrl: './nodeshandler.component.html',
  styleUrls: ['./nodeshandler.component.css']
})
export class NodeshandlerComponent implements OnInit {

  PathFeatures: PathContainer = [];
  countPath = 0;
  isPathFound = false;
  currentTabId!: string;

  constructor(
    private PathsHService: PathsHandlerService,
  ) {

    // to update path data injected into html templates
    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      this.PathFeatures = data;
    });

  }

  ngOnInit(): void {
    this.getTabId(this.currentTabId)
  }

  getTabId(tabId: string): void {
    this.currentTabId = tabId;
    console.log('Get tab: ' + this.currentTabId)
    
  }

  addPath(): void {
    this.isPathFound = true;
    this.PathsHService.addPath(this.currentTabId);
  }
}
