import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { PathElement, NodeGeoJson, Nodes, PathContainer, PathFeature } from '../../core/interfaces';

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

  PathFeatures: PathElement[] = [];
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
    const newPath: PathElement = this.initPath();
    this.PathFeatures.push(newPath);
    console.log('ADDED path');
  }

  deletePath(pathId: string): void {
    this.PathFeatures = this.PathFeatures.filter(
      (path: PathElement): boolean => path.id !== pathId
    );
    console.log('REMOVED path', pathId);
    // TODO remove nodes on map
  }

  duplicatePath(pathId: string): void {
    const pathToDuplicateIndex: number = this.PathFeatures.findIndex(
      (path: PathElement): boolean => path.id === pathId
    );

    // create and copy nodes
    const nodesCopy: Nodes = this.PathFeatures[pathToDuplicateIndex].getNodes();
    const newPath: PathElement = this.initPath(' from ' + pathId);
    newPath.setNodes(nodesCopy);
    newPath.updatePath(newPath.id)
    this.PathFeatures.push(newPath);
    console.log('DUPL path', newPath, this.PathFeatures);

  }

  initPath(name: string = ''): PathElement {
    this.countPath += 1;
    const colorOuput = this.GeneralFunc.randomHexColor();
    return new PathElement(
      'path' + this.countPath,
      'Path ' + this.countPath + name,
      colorOuput,
    );
  }
}


