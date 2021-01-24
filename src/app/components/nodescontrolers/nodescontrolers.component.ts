import { Component, OnInit, Input} from '@angular/core';

import { ParametersToMapService } from '../../services/parameterstomap.service';
import { ControlersToInputs } from '../../services/constrolerstoinputs.service';

import { NodeFeature, PathElement } from '../../core/interfaces';

import { GeneralUtils } from '../../core/generalUtils';


@Component({
  selector: 'app-nodescontrolers',
  templateUrl: './nodescontrolers.component.html',
  styleUrls: ['./nodescontrolers.component.css']
})
export class nodesControlersComponent implements OnInit {
  @Input() pathData!: PathElement;
  @Input() isCurrentTab!: boolean;
  @Input() currentTabId!: string | undefined;

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private GeneralFunc: GeneralUtils,
    private controlersToInputs: ControlersToInputs
  ) {

  }


  ngOnInit(): void {
  }

  removeNode(uuid: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {

      const nodes: NodeFeature[] = this.pathData.getNodes();
      const nodesFiltered: NodeFeature[] = nodes.filter(data => data.properties.uuid !== uuid);
      console.log(uuid, nodesFiltered)
      // update nodes list regarding user removing action
      nodesFiltered.forEach((feature, index) => {
        nodesFiltered[index].properties.position = index;
        // nodesFiltered[index].properties.uuid = index;
        // nodesFiltered[index].properties.name = 'Map Point N°' + index;
      });
      this.pathData.setNodes(nodesFiltered);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
      this.controlersToInputs.emitNodeRemoved(uuid)
    }
  }

  upPosition(position: number): void {
    if (this.pathData.getEdit() && this.isCurrentTab) {
      console.log(position)
      const nodes: NodeFeature[] = this.pathData.getNodes();
      this.controlersToInputs.emitNodeChangedToTop(nodes[position].properties.uuid)

      const nodesUpdated = this._switchPositionNodes(nodes, position, -1);
      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  botPosition(position: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {
      const nodes: NodeFeature[] = this.pathData.getNodes();
      this.controlersToInputs.emitNodeChangedToBot(nodes[position].properties.uuid)

      const nodesUpdated = this._switchPositionNodes(nodes, position, 1);
      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  private _switchPositionNodes(nodes: NodeFeature[], positionToChange: number, incrementPos: number): NodeFeature[] {
    const toPosition = positionToChange + incrementPos
    if (toPosition !== -1 && toPosition !== nodes.length) { // do nothing for the first (top action) elements and the last (bot action) element
      console.log(toPosition, toPosition !== -1)
      const nodesShifted: NodeFeature[] = this.GeneralFunc.shiftingOnArray(nodes, positionToChange, toPosition);
      nodesShifted.forEach((feature, index) => {
        nodesShifted[index].properties.position = index;
      });
      console.log(nodesShifted)
      return nodesShifted;
    }
    return nodes
  }
}
