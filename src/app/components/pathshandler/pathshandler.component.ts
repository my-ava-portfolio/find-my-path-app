import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PathContainer } from '../../core/interfaces';

import { GeneralUtils } from '../../core/generalUtils';


@Component({
  selector: 'app-pathshandler',
  templateUrl: './pathshandler.component.html',
  styleUrls: ['./pathshandler.component.css']
})
export class pathsHandlerComponent implements OnInit {

  private defaultEditStatus = false;
  private defaultTransportMode = 'pedestrian';
  private defaultElevationStatus = false;

  PathFeatures: PathContainer = [];
  countPath = 0;
  isPathFound = false;
  currentTabId!: string;

  constructor(
    private GeneralFunc: GeneralUtils,
  ) {

  }

  ngOnInit(): void {
  }

  switchTab(tabId: string): void {
    this.currentTabId = tabId;
    console.log('Get tab: ' + this.currentTabId);
  }

  addPath(): void {
    this.isPathFound = true;
    this.countPath += 1;
    const colorOuput = this.GeneralFunc.randomHexColor()
    this.PathFeatures.push({
        id: 'path' + this.countPath,
        name: 'Path ' + this.countPath,
        color: colorOuput,
        configuration: {
            EditingStatus: this.defaultEditStatus,
            transportModeStatus: this.defaultTransportMode,
            elevationStatus: this.defaultElevationStatus
        },
        inputNodes: {
            type: 'FeatureCollection',
            features: []
        }
    });
    console.log('ADDED path', colorOuput);
  }

}
