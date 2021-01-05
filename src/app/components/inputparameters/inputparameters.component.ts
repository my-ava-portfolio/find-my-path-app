import { Component, OnInit, Input } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';


import { PathsHandlerService } from '../../services/pathshandler.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { PathFeature, Nodes } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit {
  @Input() pathData!: PathFeature;

  colorSelected!: string;
  transportModeSelected = 'pedestrian';
  editModeStatus = false;
  elevationModeStatus = false;
  currentNodes: Nodes = [];
  pathName!: string;
  dataApiOutput!: OutputPathApi;


  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'pedestrian'},
    {title: 'Vehicle', value: 'vehicle'}
  ];

  constructor(
    private PathsHService: PathsHandlerService,
    private PathBuilderService: MapPathBuilderService,

  ) {
    this.PathBuilderService.pathApiOutputs.subscribe(data => {
      this.PathsHService.getComputedData(data);
      console.log("Get API data OK")
    });


  }

  ngOnInit(): void {
    this.getPathName();
    this.getEditMode();
    this.getTransportMode();
    this.getElevationStatus();
    this.getColor();
    this.currentNodes = this.pathData.inputNodes.features

    console.log(
      this.pathName,
      this.colorSelected,
      this.transportModeSelected,
      this.editModeStatus,
      this.elevationModeStatus,
      this.currentNodes,
    )
  }


  computePath(): void {

    console.log("parameters defined",
      this.transportModeSelected,
      this.elevationModeStatus,
      this.currentNodes,
      this.colorSelected
    )

    if (this.currentNodes.length > 0) {
      this.PathBuilderService.injectParameters(
        this.transportModeSelected,
        this.elevationModeStatus,
        this.currentNodes
      );
      console.log("Compute Path", this.pathData.id)
    } else {
      alert(this.currentNodes.length + '  nodes found');
    }

  }

  getPathName(): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathData.id);
    this.pathName = this.PathsHService.PathsHandlerData[pathIndex].name;
  }

  getColor(): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathData.id);
    this.colorSelected = this.PathsHService.PathsHandlerData[pathIndex].color;
  }
  setColor(event: any): void {
    console.log("color", event)
    this.colorSelected = event.target.value;
  }

  getEditMode(): void {
    const editStatus: boolean = this.PathsHService.getPathConfigFromPathId(this.pathData.id).EditingStatus;
    this.editModeStatus = editStatus;
    // this.editingService.setEdit(EditStatus);
  }
  setEditMode(event: any): void {
    const newEditingStatus: boolean = event.target.checked;
    // this.editModeStatus = newEditingStatus;
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathData.id)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.EditingStatus = newEditingStatus;
  }


  getTransportMode(): void {
    const transportMode: string = this.PathsHService.getPathConfigFromPathId(this.pathData.id).transportModeStatus;
    this.transportModeSelected = transportMode;
  }
  setTransportMode(newValue: string): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathData.id)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.transportModeStatus = newValue;
  }

  getElevationStatus(): void {
    const elevationStatus: boolean = this.PathsHService.getPathConfigFromPathId(this.pathData.id).elevationStatus;
    this.elevationModeStatus = elevationStatus;
  }
  setElevationStatus(event: any): void {
    const newElevationStatus: boolean = event.target.checked;
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathData.id)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.elevationStatus = newElevationStatus;
  }


  getCurrentNodes(): void {
    const currentNodes: Nodes = this.PathsHService.getNodesFromOpenedPath();
    this.currentNodes = currentNodes;
  }


}
