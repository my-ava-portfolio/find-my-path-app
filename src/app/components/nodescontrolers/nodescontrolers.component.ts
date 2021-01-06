import { Component, OnInit, Input } from '@angular/core';

import { ParametersToMapService } from '../../services/parameterstomap.service';
import { GeneralUtils } from '../../core/generalUtils';

import { PathElement, Nodes, Node } from '../../core/interfaces';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  @Input() pathData!: PathElement;
  @Input() isCurrentTab!: boolean;
  @Input() CurrentTab!: string;

  currentNodes!: Nodes;

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private GeneralFunc: GeneralUtils,
  ) {
  }

  ngOnInit(): void {
      this.currentNodes = this.pathData.getNodes()
  }

  removeNode(uuid: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {

      const nodes: Nodes = this.pathData.getNodes();
      const nodesFiltered: Nodes = nodes.filter(data => data.properties.uuid !== uuid);
      console.log(uuid, nodesFiltered)
      this.currentNodes = nodesFiltered

      this.pathData.setNodes(nodesFiltered);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  upPosition(uuid: number): void {
    if (this.pathData.getEdit() && this.isCurrentTab) {
      console.log(uuid)
      const nodes: Nodes = this.pathData.getNodes();
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, -1);
      this.currentNodes = nodesUpdated

      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  botPosition(uuid: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {
      const nodes: Nodes = this.pathData.getNodes();
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, 1);
      this.currentNodes = nodesUpdated

      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  private _findNodeIndex(uuid: number): number {
    return this.pathData.getNodes().findIndex(
      (node: Node): boolean => node.properties.uuid === uuid
    );
  }

  private _updatePositionNodes(nodes: Nodes, uuidToChange: number, incrementPos: number): Nodes {
    // TODO avoid to do something if node is a the top and if click on top
    // TODO there is a bug somewhere
    const nodesShifted: Nodes = this.GeneralFunc.shiftingOnArray(nodes, uuidToChange, uuidToChange + incrementPos);
    nodesShifted.forEach((feature, index) => {
        nodesShifted[index].properties.position = index;
    });
    return nodesShifted;
}






}
