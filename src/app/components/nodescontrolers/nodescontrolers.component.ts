import { Component, OnInit, Input } from '@angular/core';

import { ParametersToMapService } from '../../services/parameterstomap.service';
import { GeneralUtils } from '../../core/generalUtils';

import { PathFeature, Nodes, Node } from '../../core/interfaces';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  @Input() pathData!: PathFeature;
  @Input() isCurrentTab!: boolean;

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private GeneralFunc: GeneralUtils,
  ) {
  }

  ngOnInit(): void {

  }

  removeNode(uuid: number): void {
    if (this.pathData.configuration.EditingStatus && this.isCurrentTab) {
      console.log(uuid)

      const IndexNodeToRemove: number = this._findNodeIndex(uuid)

      const nodes: Nodes = this.pathData.inputNodes.features;
      const nodesFiltered: Nodes = nodes.filter(data => data.properties.uuid !== IndexNodeToRemove);

      this.pathData.inputNodes.features = nodesFiltered;
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  upPosition(uuid: number): void {
    if (this.pathData.configuration.EditingStatus && this.isCurrentTab) {
      console.log(uuid)
      const nodes: Nodes = this.pathData.inputNodes.features;
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, -1);
      this.pathData.inputNodes.features = nodesUpdated;
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  botPosition(uuid: number): void {
    if (this.pathData.configuration.EditingStatus && this.isCurrentTab) {
      const nodes: Nodes = this.pathData.inputNodes.features;
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, 1);
      this.pathData.inputNodes.features = nodesUpdated;
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  private _findNodeIndex(uuid: number): number {
    return this.pathData.inputNodes.features.findIndex(
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
