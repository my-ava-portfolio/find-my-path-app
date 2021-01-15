import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { NodePathFeature, PathElement, Margin } from '../../core/interfaces';
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

  margin: Margin = {top: 30, right: 25, bottom: 30, left: 30};
  width = 400;
  height = 300;

  constructor(
    private PathBuilderService: MapPathBuilderService,
    private d3LeafletUtils: D3LeafletUtils
  ) {

    this.computedChartSubscription = this.PathBuilderService.pathApiOutputs.subscribe(pathData => {
      if (this.pathData.id === this.currentTabId) {

        this.d3LeafletUtils.createLinesChart(
          'TopoLineChart-' + this.pathData.id,
          [pathData],
          this.margin,
          this.width,
          this.height
        ); // get a list of pointsPath
      }
    });

  }

  ngOnInit(): void { }


  ngOnDestroy(): void {
    // very important to delete the observable related to this component,
    // to prevent memory leak: close the component instance
    this.computedChartSubscription.unsubscribe()
  }

}
