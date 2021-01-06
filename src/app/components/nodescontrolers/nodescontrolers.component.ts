import { Component, OnInit, Input } from '@angular/core';

import { ParametersToMapService } from '../../services/parameterstomap.service';

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

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private GeneralFunc: GeneralUtils,
  ) {

  }


  ngOnInit(): void {
  }

  removeNode(uuid: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {

      const nodes: NodeFeature[] = this.pathData.getNodes();
      const nodesFiltered: NodeFeature[] = nodes.filter(data => data.properties.uuid !== uuid);
      console.log(uuid, nodesFiltered)

      this.pathData.setNodes(nodesFiltered);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  upPosition(uuid: number): void {
    if (this.pathData.getEdit() && this.isCurrentTab) {
      console.log(uuid)
      const nodes: NodeFeature[] = this.pathData.getNodes();
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, -1);

      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  botPosition(uuid: number): void {
    if (this.pathData.getEdit() === true && this.isCurrentTab) {
      const nodes: NodeFeature[] = this.pathData.getNodes();
      const nodesUpdated = this._updatePositionNodes(nodes, uuid, 1);

      this.pathData.setNodes(nodesUpdated);
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
  }

  private _updatePositionNodes(nodes: NodeFeature[], uuidToChange: number, incrementPos: number): NodeFeature[] {
    // TODO avoid to do something if node is a the top and if click on top
    // TODO there is a bug somewhere
    const nodesShifted: NodeFeature[] = this.GeneralFunc.shiftingOnArray(nodes, uuidToChange, uuidToChange + incrementPos);
    nodesShifted.forEach((feature, index) => {
        nodesShifted[index].properties.position = index;
    });
    return nodesShifted;
  }
}
