import { Component, OnInit } from '@angular/core';

import { TransportMode } from '../../core/interfaces';

import { MapEditingService } from '../../services/mapediting.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { MapNodesBuilderService } from '../../services/mapnodesbuilder.service';

import { Node } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit {

  TransportModeSelected = 'pedestrian';
  EditModeStatus = false;
  ElevationModeStatus = false;
  NodesDefined!: Node[];

  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'pedestrian'},
    {title: 'Vehicle', value: 'vehicle'}
  ];

  constructor(
    private EditingService: MapEditingService,
    private PathBuilderService: MapPathBuilderService,
    private MapNodesService: MapNodesBuilderService

  ) {

    this.MapNodesService.nodes.subscribe(data => {
      this.NodesDefined = data;
    });

  }

  ngOnInit(): void { }

  computePath(): void {
    if (this.NodesDefined) {
      this.PathBuilderService.injectParameters(
        this.TransportModeSelected,
        this.ElevationModeStatus,
        this.NodesDefined,
      );
    } else {
      console.log('no nodes found', this.NodesDefined);
    }

  }

  checkEditMode(event: any): void {
    this.EditModeStatus = event.target.checked;
    this.EditingService.setEdit(this.EditModeStatus);
 }

}
