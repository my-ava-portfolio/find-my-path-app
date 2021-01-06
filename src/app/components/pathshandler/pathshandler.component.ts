import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { NodeGeoJson, Nodes, PathContainer, PathFeature } from '../../core/interfaces';

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
    // TODO add name
    const newPath: PathFeature = this.initPath()
    this.PathFeatures.push(newPath);
    console.log('ADDED path');
  }

  deletePath(pathId: string): void {
    this.PathFeatures = this.PathFeatures.filter(
      (path: PathFeature): boolean => path.id !== pathId
    )
    console.log('REMOVED path', pathId);
    // TODO remove nodes on map
  }

  duplicatePath(pathId: string): void {
    const pathToDuplicateIndex: number = this.PathFeatures.findIndex(
      (path: PathFeature): boolean => path.id === pathId
    )

    // create and copy nodes
    const nodesCopy: Nodes = this.PathFeatures[pathToDuplicateIndex].inputNodes.features
    const newPath: PathFeature = this.initPath(" from " + pathId)
    newPath.inputNodes.features = nodesCopy; 

    this.PathFeatures.push(newPath)
    console.log('DUPL path', newPath, this.PathFeatures);

  }

  initPath(name: string = ''): PathFeature {
    this.countPath += 1;
    const colorOuput = this.GeneralFunc.randomHexColor()
    return {
        id: 'path' + this.countPath,
        name: 'Path ' + this.countPath + name,
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
    }
  }
}


