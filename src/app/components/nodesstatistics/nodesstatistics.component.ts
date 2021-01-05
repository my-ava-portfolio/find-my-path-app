import { Component, OnInit, Input } from '@angular/core';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsHandlerService } from '../../services/pathshandler.service';

import { PathStatistics } from '../../core/interfaces';


@Component({
  selector: 'app-nodesstatistics',
  templateUrl: './nodesstatistics.component.html',
  styleUrls: ['./nodesstatistics.component.css']
})
export class NodesstatisticsComponent implements OnInit {
  @Input() pathId!: string;

  statisticsData: any = {};
  DataExists = false;

  constructor(
    private PathsHService: PathsHandlerService,
    private PathBuilderService: MapPathBuilderService
  ) {

    this.PathBuilderService.pathApiOutputs.subscribe(data => {
      const pathIndex: number = this.PathsHService.getPathIndex(this.pathId);
      this.statisticsData = this.PathsHService.PathsHandlerData[pathIndex].stats_path;
      this.DataExists = true;
    });

    // this.PathsHService.PathsHandlerContainer.subscribe(data => {
    //   const pathIndex: number = this.PathsHService.getPathIndex(this.pathId);
    //   this.statisticsData = this.PathsHService.PathsHandlerData[pathIndex].stats_path;
    // });


  }

  ngOnInit(): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId);
    this.statisticsData = this.PathsHService.PathsHandlerData[pathIndex].stats_path;
  }


}
