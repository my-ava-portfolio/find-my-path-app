import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { SharedPathService } from '../../services/sharedpath.service';

import { NodeFeature, PathElement, Nodes } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit {
  @Input() pathData!: PathElement;
  @Input() isCurrentTab!: boolean;

  @Output() pathEmitToDelete = new EventEmitter<string>();
  @Output() pathEmitToDuplicate = new EventEmitter<string>();

  colorSelected!: string;
  transportModeSelected!: string;
  editModeStatus!: boolean;
  elevationModeStatus!: boolean;
  nodesToMap: Nodes = [];
  pathName!: string;
  dataApiOutput!: OutputPathApi;


  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'pedestrian'},
    {title: 'Vehicle', value: 'vehicle'}
  ];

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private Map2ParametersService: MapToParametersService,
    private PathBuilderService: MapPathBuilderService,
    private SharedNService: SharedPathService
  ) {
    this.Map2ParametersService.newPointCoords.subscribe(coordinates => {
      this.addPointsFromCoords(coordinates)
      this.SharedNService.currentPath.next(this.pathData);
    });

    this.Map2ParametersService.pathComplete.subscribe(pathDone => {
      this.updatePathWithApiData(pathDone)
    });

  }

  ngOnInit(): void {
    this.displayPathParams();
    console.log("AAAAAA", this.pathData.id, this.isCurrentTab)
  }

  sendCurrentPath(): void {
    this.SharedNService.currentPath.next(this.pathData);
  }


  deletePathAction(pathId: string): void {
    this.pathEmitToDelete.emit(pathId)
  }

  duplicatePathAction(pathId: string): void {
    this.pathEmitToDuplicate.emit(pathId)
  }

  computePath(): void {

    this.displayPathParams();
    const nodesCreated: NodeFeature[] = this.pathData.getNodes()
    if (nodesCreated.length > 0) {
      this.PathBuilderService.getPostProcData(this.pathData);
      console.log('Compute Path', this.pathData.id)
    } else {
      alert(nodesCreated.length + '  nodes found');
    }

  }

  updateColor(event: any): void {
    this.pathData.setColor(event.target.value)
    console.log('update color', this.pathData.color)
  }

  updateEditMode(event: any): void {
    this.pathData.setEdit(event.target.checked);
    console.log('update edit', this.pathData.editingStatus)
  }

  updateTransportMode(newValue: string): void {
    this.pathData.setTransportMode(newValue);
    console.log('update transportMode', this.pathData.getTransportMode())
  }

  updateElevationStatus(event: any): void {
    this.pathData.setElevation(event.target.checked);
    console.log('update elevationMode', this.pathData.getElevation())
  }


  addPointsFromCoords(coordinates: number[]): void {
    // here the magic part! update only the active tab and if edit is true of course
    if (this.pathData.getEdit() === true && this.isCurrentTab) {
      console.log('Nodes inserted', this.pathData, this.isCurrentTab)
      const currentNodesPosition: number = this.pathData.getNodes().length;
      // TODO add class for point
      this.pathData.addNode(
        {
          type: 'Point',
          coordinates: [
            coordinates[1],
            coordinates[0]
          ]
        },
        {
          position: currentNodesPosition,
          uuid: currentNodesPosition,
          name: 'node ' + currentNodesPosition,
          path: this.pathData.id
        }
      );
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }
    
  }

  updatePathWithApiData(path: PathElement): void {
    if ( this.isCurrentTab ) {
      this.pathData = path;
      console.log('finito', this.isCurrentTab, this.pathData)
      // TODO from here to paths handler to create the plot
    }
  }

  private displayPathParams(): void {
    console.log(
      this.pathData
    )
  }

}
