import { Component, OnInit, Input } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { PathFeature, Nodes } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit {
  @Input() pathData!: PathFeature;
  @Input() isCurrentTab!: boolean;

  colorSelected!: string;
  transportModeSelected!: string;
  editModeStatus = false;
  elevationModeStatus = false;
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

  ) {
    this.Map2ParametersService.newPointCoords.subscribe(coordinates => {
      this.addPointsFromCoords(coordinates)
    });

    this.Map2ParametersService.pathComplete.subscribe(pathDone => {
      this.updatePathWithApiData(pathDone)
    });

  }

  ngOnInit(): void {
    this.displayPathParams();
  }


  computePath(): void {

    this.displayPathParams();
    const nodesCreated: Nodes = this.pathData.inputNodes.features
    if (nodesCreated.length > 0) {
      this.PathBuilderService.getPostProcData(this.pathData);
      console.log('Compute Path', this.pathData.id)
    } else {
      alert(nodesCreated.length + '  nodes found');
    }

  }

  updatetColor(event: any): void {
    this.pathData.color = event.target.value;
    console.log('update color', this.pathData.color)
  }

  updateEditMode(event: any): void {
    this.pathData.configuration.EditingStatus = event.target.checked;
    console.log('update edit', this.pathData.configuration.EditingStatus)
  }

  updateTransportMode(newValue: string): void {
    this.pathData.configuration.transportModeStatus = newValue;
    console.log('update transportMode', this.pathData.configuration.transportModeStatus)
  }

  updateElevationStatus(event: any): void {
    this.pathData.configuration.elevationStatus = event.target.checked;
    console.log('update elevationMode', this.pathData.configuration.elevationStatus)
  }


  addPointsFromCoords(coordinates: number[]): void {
    // here the magic part! update only the active tab and if edit is true of course
    if (this.pathData.configuration.EditingStatus && this.isCurrentTab) {
      console.log('Nodes inserted', this.pathData.name)
      const currentNodesPosition: number = this.pathData.inputNodes.features.length;
      this.pathData.inputNodes.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            coordinates[1],
            coordinates[0]
          ]
        },
        properties: {
          position: currentNodesPosition,
          uuid: currentNodesPosition,
          name: 'node ' + currentNodesPosition
        }
      });
    }
    this.Parameters2MapService.mapFromPathNodes(this.pathData);
  }

  updatePathWithApiData(path: PathFeature): void {
    if ( this.isCurrentTab ) {
      this.pathData = path;
      console.log('finito', this.isCurrentTab, this.pathData)
      // TODO from here to paths handler to create the plot
    }
  }

  private displayPathParams(): void {
    console.log(
      this.pathData.name,
      this.pathData.color,
      this.pathData.configuration,
      this.pathData.inputNodes,
    )
  }

}
