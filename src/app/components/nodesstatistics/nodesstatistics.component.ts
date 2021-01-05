import { Component, OnInit, Input } from '@angular/core';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsHandlerService } from '../../services/pathshandler.service';

import { PathFeature, PathStatistics } from '../../core/interfaces';


@Component({
  selector: 'app-nodesstatistics',
  templateUrl: './nodesstatistics.component.html',
  styleUrls: ['./nodesstatistics.component.css']
})
export class NodesstatisticsComponent implements OnInit {
  @Input() pathData!: PathFeature;


  constructor(
  ) {
  }

  ngOnInit(): void {
  }


}
