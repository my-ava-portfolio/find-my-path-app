import { Component, OnInit, ViewChild } from '@angular/core';

import { NodeFeature, PathElement, NodeGeoJson, Nodes, PathContainer, ColorsPalettes } from '../../core/interfaces';

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
export class PathsHandlerComponent implements OnInit {

  PathFeatures: PathElement[] = [];
  countPath = 0; // to delete action
  countTotalPath = 0; // for id
  currentTabId!: string | undefined;
  helpPopup = 'Start a new path!';
  topoChartDisplayed = false;
  pathActionButtonEnabled = true;
  colorsPredefined = new ColorsPalettes().colorsBrewer;

  private margin = {top: 30, right: 25, bottom: 30, left: 30};
  private width = 400;
  private height = 400;

  constructor(
    private GeneralFunc: GeneralUtils,
    private pathsToMapService: PathsToMapService,
    private d3LeafletUtils: D3LeafletUtils,
    private pathsToInputs: PathsToInputs
  ) {

    this.pathsToInputs.refreshGlobalChart.subscribe(refresh => {
      if (refresh) {
        // refresh the chart
        this.pathsReadyCharted();
      }
    });

  }

  ngOnInit(): void {
  }

  switchTab(tabId: string): void {
    // disable edition interactivity on the current path
    const indexCurrentPath: number = this.PathFeatures.findIndex(path => path.id === this.currentTabId);
    if (indexCurrentPath !== -1) {
      this.PathFeatures[indexCurrentPath].setEdit(false);
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
  }

  desactivateButtons(status: boolean): void {
    this.pathActionButtonEnabled = status;
  }

  addPath(): void {
    // TODO add name
    const newPath: PathElement = this.initPath();
    this.PathFeatures.push(newPath);
    // this.currentTabId = newPath.id;
    this.switchTab(newPath.id);
  }

  clearPaths(): void {
    this.PathFeatures.reverse().forEach((item: PathElement) => {
      this.pathsToInputs.emitPathId(item.id);
    });
    this.topoChartDisplayed = false;
    this.pathsReadyCharted(); // we refresh the chart to clean it!
  }

  comparePath(): void {
    // TODO ? check if path has been computed than check the count paths
    if (this.countPath > 1) {
      this.topoChartDisplayed = !this.topoChartDisplayed;
    }

  }

  deletePath(pathId: string): void {


    this.PathFeatures = this.PathFeatures.filter(
      (path: PathElement): boolean => path.id !== pathId
    );
    this.countPath -= 1;

    if (this.countPath > 0) {

      const lastPathId: string = this.PathFeatures[this.PathFeatures.length - 1].id;
      this.switchTab(lastPathId);
      // filter paths to chart (only if path has been computed)
      this.pathsReadyCharted();
    }

    if (this.countPath <= 1) {
      // to hide comparison topo chart
      this.topoChartDisplayed = false;
    }
  }

  pathsReadyCharted(): void {
    // to select only the path ready to be charted
    const pathsToChart: PathElement[] = [];
    this.PathFeatures.forEach((d) => {
      if (d.isPathComputed()) {
        pathsToChart.push(d);
      }
    });
    this.d3LeafletUtils.createLinesChart('globalChart', pathsToChart, this.margin, this.width, this.height);
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
  }

  initPath(name: string = ''): PathElement {

    let colorOutput = this.GeneralFunc.randomHexColor();
    if (this.countPath <= this.colorsPredefined.length) {
      colorOutput = this.colorsPredefined[this.countPath];
    }
    this.countPath += 1;
    this.countTotalPath += 1;
    return new PathElement(
      'path' + this.countTotalPath,
      'Path ' + this.countTotalPath + name,
      colorOutput
    );
}

}


