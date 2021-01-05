import { Component, OnInit, Input } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';


import { PathsHandlerService } from '../../services/pathshandler.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { Nodes } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit {
  @Input() pathId!: string;

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

    this.PathsHService.PathsHandlerContainer.subscribe(data => {
      this.currentNodes = this.PathsHService.getNodesFromPathId(this.pathId);
    });

    this.PathBuilderService.pathApiOutputs.subscribe(data => {
      this.PathsHService.setComputedData(this.pathId, data)
      console.log("Compute API data", this.pathId)
    });


  }

  ngOnInit(): void {
    this.getPathName()
    this.getEditMode()
    this.getTransportMode()
    this.getElevationStatus()
  }


  computePath(): void {


    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId);

    if (this.currentNodes.length > 0) {
      this.PathBuilderService.injectParameters(
        this.transportModeSelected,
        this.elevationModeStatus,
        this.currentNodes,
      );
      console.log("Compute Path", this.pathId)
    } else {
      alert(this.currentNodes.length + '  nodes found');
    }

  }

  getPathName(): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId)
    this.pathName = this.PathsHService.PathsHandlerData[pathIndex].name
  }


  getEditMode(): void {
    const editStatus: boolean = this.PathsHService.getPathConfigFromPathId(this.pathId).EditingStatus;
    this.editModeStatus = editStatus;
    // this.editingService.setEdit(EditStatus);
  }
  setEditModel(event: any): void {
    const newEditingStatus: boolean = event.target.checked;
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.EditingStatus = newEditingStatus;
  }


  getTransportMode(): void {
    const transportMode: string = this.PathsHService.getPathConfigFromPathId(this.pathId).transportModeStatus;
    this.transportModeSelected = transportMode;
  }
  setTransportMode(newValue: string): void {
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.transportModeStatus = newValue;
  }

  getElevationStatus(): void {
    const elevationStatus: boolean = this.PathsHService.getPathConfigFromPathId(this.pathId).elevationStatus;
    this.elevationModeStatus = elevationStatus;
  }
  setElevationStatus(event: any): void {
    const newElevationStatus: boolean = event.target.checked;
    const pathIndex: number = this.PathsHService.getPathIndex(this.pathId)
    this.PathsHService.PathsHandlerData[pathIndex].configuration.elevationStatus = newElevationStatus;
  }


  getCurrentNodes(): void {
    const currentNodes: Nodes = this.PathsHService.getNodesFromPathId(this.pathId);
    this.currentNodes = currentNodes;
  }


}
