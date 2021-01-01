import { Component, OnInit } from '@angular/core';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { PathStatistics} from '../../core/interfaces';


@Component({
  selector: 'app-nodesstatistics',
  templateUrl: './nodesstatistics.component.html',
  styleUrls: ['./nodesstatistics.component.css']
})
export class NodesstatisticsComponent implements OnInit {

  StatisticsData!: PathStatistics;
  DataExists = false;

  constructor(
    private PathBuilderService: MapPathBuilderService
  ) {
    this.PathBuilderService.PathStatisticsOutput.subscribe(StatisticsData => {
      this.StatisticsData = StatisticsData;
      this.DataExists = true;
    });

  }

  ngOnInit(): void {
  }

}
