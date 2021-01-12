import { Component, OnInit, ViewChild } from '@angular/core';

import { NodeFeature, PathElement, NodeGeoJson, Nodes, PathContainer, PathFeature } from '../../core/interfaces';

import { GeneralUtils } from '../../core/generalUtils';

import { map } from 'leaflet';
import { Subscription } from 'rxjs';
import { PathsToMapService } from '../../services/pathstomap.service';
import { PathsToInputs } from '../../services/pathstoinputs.service';

import { D3LeafletUtils } from '../../core/d3LeafletUtils';


@Component({
  selector: 'app-pathshandler',
  templateUrl: './pathshandler.component.html',
  styleUrls: ['./pathshandler.component.css']
})
export class pathsHandlerComponent implements OnInit {

  PathFeatures: PathElement[] = [];
  countPath = 0;
  currentTabId!: string | undefined;
  helpPopup = 'Start a new path!';
  topoChartDisplayed = false;
  pathActionButtonEnabled = true;

  constructor(
    private GeneralFunc: GeneralUtils,
    private pathsToMapService: PathsToMapService,
    private d3LeafletUtils: D3LeafletUtils,
    private pathsToInputs: PathsToInputs
  ) {

  }

  ngOnInit(): void {
  }

  switchTab(tabId: string): void {
    // console.log('start switch', this.currentTabId)

      // disable edition interactivity on the current path
    const indexCurrentPath: number = this.PathFeatures.findIndex(path => path.id === this.currentTabId);
    if (indexCurrentPath !== -1) {
      console.log('wsixtch', indexCurrentPath, this.currentTabId, this.PathFeatures[indexCurrentPath])
      this.PathFeatures[indexCurrentPath].setEdit(false);
      // console.log(this.currentTabId, this.PathFeatures[indexCurrentPath].getEdit())
      this.pathsToMapService.refreshPathNodesFromPathId(this.PathFeatures[indexCurrentPath]);
    }

    // go to switch
    const indexPath: number = this.PathFeatures.findIndex(path => path.id === tabId);
    if (indexPath >= 0) {
      this.currentTabId = this.PathFeatures[indexPath].id;
      this.pathsToMapService.refreshPathNodesFromPathId(this.PathFeatures[indexPath]);
    } else {
      this.currentTabId = undefined;
    }
    console.log('Get tab: ' + this.currentTabId);
  }

  desactivateButtons(status: boolean): void {
    console.log('blooom', status)
    this.pathActionButtonEnabled = status;
  }

  addPath(): void {
    // TODO add name
    const newPath: PathElement = this.initPath();
    this.PathFeatures.push(newPath);
    this.currentTabId = newPath.id;
    this.switchTab(newPath.id);
    console.log('ADDED path');
  }

  clearPaths(): void {
    this.PathFeatures.reverse().forEach((item: PathElement) => {
      this.pathsToInputs.emitPathId(item.id)
    });
    // this.currentTabId = undefined;
    this.topoChartDisplayed = false;
    // this.countPath = 0;
    console.log('CLEAR', this.PathFeatures, this.countPath, this.currentTabId)
  }

  comparePath(): void {
    if (this.countPath > 1) {
      this.topoChartDisplayed = !this.topoChartDisplayed;
      // TODO add name
      const margin = {top: 30, right: 25, bottom: 30, left: 30};
      const width = 400;
      const height = 400;

      this.d3LeafletUtils.createLinesChart('globalChart', this.PathFeatures, margin, width, height);
    }

  }

  deletePath(pathId: string): void {
    this.PathFeatures = this.PathFeatures.filter(
      (path: PathElement): boolean => path.id !== pathId
    );
    if (this.countPath > 0) {
      this.countPath -= 1;
      const lastPathId: string = this.PathFeatures[this.PathFeatures.length - 1].id;
      this.switchTab(lastPathId);
      console.log('REMOVED path', pathId);
    }

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

    this.PathFeatures.push(newPath);
    this.switchTab(newPath.id);

    console.log('DUPL path', newPath, this.PathFeatures);
  }

  initPath(name: string = ''): PathElement {
    this.countPath += 1;
    const colorOuput = this.GeneralFunc.randomHexColor();
    console.log(colorOuput);
    return new PathElement(
      'path' + this.countPath,
      'Path ' + this.countPath + name,
      colorOuput
    );
}

}


