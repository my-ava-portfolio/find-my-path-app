import { Component, OnInit } from '@angular/core';

import { MapNodesBuilderService } from '../../services/mapnodesbuilder.service';

import { Node } from '../../core/interfaces';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  NodesDefined!: Node[];


  constructor(
    private MapNodesService: MapNodesBuilderService
  ) {

    this.MapNodesService.nodes.subscribe(data => {
      this.NodesDefined = data;
    });

   }

  ngOnInit(): void {
  }

  removeNode(uuid: number): void {
    this.MapNodesService.removeNodeAction(uuid);

    console.log(uuid);
  }

  upPosition(uuid: number): void {
    this.MapNodesService.upPositionAction(uuid);
  }

  botPosition(uuid: number): void {
    this.MapNodesService.botPositionAction(uuid);
  }
  
}
