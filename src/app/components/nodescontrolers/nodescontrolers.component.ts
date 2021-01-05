import { Component, OnInit, Input } from '@angular/core';


import { PathsHandlerService } from '../../services/pathshandler.service';

import { PathFeature, Nodes, Node } from '../../core/interfaces';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  @Input() pathData!: PathFeature;


  currentNodesDefined: Nodes = [];

  constructor(
    private PathsHService: PathsHandlerService
  ) {
   }

  ngOnInit(): void {
    this.currentNodesDefined = this.pathData.inputNodes.features ;
  }

  removeNode(uuid: number): void {

    this.PathsHService.removeNodeAction(
      this.pathData.id,
      uuid
    );
  }

  upPosition(uuid: number): void {
    this.PathsHService.upPositionAction(
      this.pathData.id,
      uuid
    );
  }

  botPosition(uuid: number): void {
    this.PathsHService.botPositionAction(
      this.pathData.id,
      uuid
    );
  }
  
}
