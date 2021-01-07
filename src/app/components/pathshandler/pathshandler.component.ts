import { Component, OnInit } from '@angular/core';

import { NodeFeature, PathElement, NodeGeoJson, Nodes, PathContainer, PathFeature } from '../../core/interfaces';

import { GeneralUtils } from '../../core/generalUtils';
import { interval } from 'rxjs';
import { startWith  } from 'rxjs/operators';

import { ApiStatusService } from '../../services/apistatus.service';


@Component({
  selector: 'app-pathshandler',
  templateUrl: './pathshandler.component.html',
  styleUrls: ['./pathshandler.component.css']
})
export class pathsHandlerComponent implements OnInit {
  apiStatus!: string;
  PathFeatures: PathElement[] = [];
  countPath = 0;
  isPathFound = false;
  currentTabId!: string;
  ApiContinuousChecker = interval(5000); // observable which run all the time

  constructor(
    private GeneralFunc: GeneralUtils,
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


  switchTab(tabId: string): void {
    this.currentTabId = tabId;
    console.log('Get tab: ' + this.currentTabId);
  }

  addPath(): void {
    this.isPathFound = true;
    // TODO add name
    const newPath: PathElement = this.initPath();
    this.PathFeatures.push(newPath);
    this.switchTab(newPath.id);
    console.log('ADDED path');
  }

  deletePath(pathId: string): void {
    this.PathFeatures = this.PathFeatures.filter(
      (path: PathElement): boolean => path.id !== pathId
    );
    this.countPath -= 1;
    this.switchTab(this.PathFeatures[this.PathFeatures.length-1].id);
    console.log('REMOVED path', pathId);
    // TODO remove nodes on map
  }

  duplicatePath(pathId: string): void {
    const pathToDuplicateIndex: number = this.PathFeatures.findIndex(
      (path: PathElement): boolean => path.id === pathId
    );

    // create and copy nodes
    const nodesCopy: NodeFeature[] = this.PathFeatures[pathToDuplicateIndex].getNodes();
    const newPath: PathElement = this.initPath(' from ' + pathId);
    newPath.setNodes(nodesCopy);
    newPath.rebuildNodes(); // deep copy to remove references....
    this.switchTab(newPath.id);

    this.PathFeatures.push(newPath);
    console.log('DUPL path', newPath, this.PathFeatures);
  }

  initPath(name: string = ''): PathElement {
    this.countPath += 1;
    const colorOuput = this.GeneralFunc.randomHexColor();
    return new PathElement(
      'path' + this.countPath,
      'Path ' + this.countPath + name,
      colorOuput
    );
}

}


