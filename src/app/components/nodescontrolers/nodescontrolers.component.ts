import { Component, OnInit, Input } from '@angular/core';


import { PathsHandlerService } from '../../services/pathshandler.service';

import { Nodes, Node } from '../../core/interfaces';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  @Input() pathId!: string;


  currentNodesDefined: Nodes = [];

  constructor(
    private PathsHService: PathsHandlerService
  ) {

    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      this.nodesCreated(this.pathId); // update the node controler
    });

   }

  ngOnInit(): void {
    this.nodesCreated(this.pathId);
  }

  nodesCreated(pathId: string): void {
    this.currentNodesDefined = this.PathsHService.getNodesFromOpenedPath();

  }

  removeNode(uuid: number): void {

    this.PathsHService.removeNodeAction(
      this.pathId,
      uuid
    );
  }

  upPosition(uuid: number): void {
    this.PathsHService.upPositionAction(
      this.pathId,
      uuid
    );
  }

  botPosition(uuid: number): void {
    this.PathsHService.botPositionAction(
      this.pathId,
      uuid
    );
  }
  
}
