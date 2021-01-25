import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { NodePathGeoJson, LinePathGeoJson, PathElement, Margin } from '../../core/interfaces';
import { D3LeafletUtils } from '../../core/d3LeafletUtils';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nodesstatistics',
  templateUrl: './nodesstatistics.component.html',
  styleUrls: ['./nodesstatistics.component.css']
})
export class NodesstatisticsComponent implements OnInit, OnDestroy {
  @Input() pathData!: PathElement;
  @Input() currentTabId!: string | undefined;

  computedChartSubscription!: Subscription;
  refreshedChartSubscription!: Subscription;

  downloadJsonOriginalNodes!: SafeUrl;

  nodesOutputData!: NodePathGeoJson;
  downloadJsonNodes!: SafeUrl;

  pathOutputData!: LinePathGeoJson;
  downloadJsonPath!: SafeUrl;
    
  private margin: Margin = {top: 30, right: 25, bottom: 30, left: 30};
  private width = 400;
  private height = 300;

  constructor(
    private PathBuilderService: MapPathBuilderService,  // TODO create a new service between nodescontrolers and nodes statistics
    private d3LeafletUtils: D3LeafletUtils,
    private sanitizer: DomSanitizer
  ) {

    this.computedChartSubscription = this.PathBuilderService.pathBuilt.subscribe(pathData => {
      if (this.pathData.id === this.currentTabId) {
        this.createPathChart(pathData)

        this.pathOutputData = pathData.getLinePath()
        this.generateDownloadJsonUriForPath(this.pathOutputData)

        this.nodesOutputData = pathData.getPointsPath()
        this.generateDownloadJsonUriForNodes(this.nodesOutputData)
      }
    });

    this.refreshedChartSubscription = this.PathBuilderService.chartPathToRefresh.subscribe(pathData => {
      if (this.pathData.id === this.currentTabId) {
        this.createPathChart(pathData)
      }
    });

  }

  ngOnInit(): void { }


  ngOnDestroy(): void {
    // very important to delete the observable related to this component,
    // to prevent memory leak: close the component instance
    this.computedChartSubscription.unsubscribe();
    this.refreshedChartSubscription.unsubscribe();
  }

  createPathChart(pathData: PathElement): void {
    this.d3LeafletUtils.createLinesChart(
      'TopoLineChart-' + this.pathData.id,
      [pathData],
      this.margin,
      this.width,
      this.height,
      false
    ); // get a list of pointsPath
  }

  generateDownloadJsonUriForPath(data: LinePathGeoJson): void {
    let jsonData = JSON.stringify(data);
    let blob = new Blob([jsonData], { type: 'text/json' });
    let url= window.URL.createObjectURL(blob);
    let uri:SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonPath = uri;
  }

  generateDownloadJsonUriForNodes(data: NodePathGeoJson): void {
    let jsonData = JSON.stringify(data);
    let blob = new Blob([jsonData], { type: 'text/json' });
    let url= window.URL.createObjectURL(blob);
    let uri:SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonNodes = uri;
  }

  generateDownloadJsonUriForOriginalNodes(): void {
    if (this.pathData !== undefined) {
      if (this.pathData.getNodes().length > 0) {
        let jsonData = this.pathData.buildGeojsonOriginalNodes();
        let blob = new Blob([jsonData], { type: 'text/json' });
        let url= window.URL.createObjectURL(blob);
        let uri:SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.downloadJsonOriginalNodes = uri;
      };
    };
  }

}
