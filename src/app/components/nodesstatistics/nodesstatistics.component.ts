import { Component, OnInit, Input } from '@angular/core';

import { PathElement } from '../../core/interfaces';


@Component({
  selector: 'app-nodesstatistics',
  templateUrl: './nodesstatistics.component.html',
  styleUrls: ['./nodesstatistics.component.css']
})
export class NodesstatisticsComponent implements OnInit {
  @Input() pathData!: PathElement;


  constructor(
  ) {
  }

  ngOnInit(): void {
  }


}
