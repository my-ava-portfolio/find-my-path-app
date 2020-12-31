import { Component, OnInit } from '@angular/core';

import { TransportMode } from '../../core/interfaces';

import { MapEditingService } from '../../services/mapediting.service';


@Component({
  selector: 'app-nodesparameters',
  templateUrl: './nodesparameters.component.html',
  styleUrls: ['./nodesparameters.component.css']
})
export class NodesParametersComponent implements OnInit {

  TransportModeSelected = 'mode_pedestrian';
  EditModeStatus = false;
  ElevationModeStatus = false;

  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'mode_pedestrian'},
    {title: 'Vehicle', value: 'mode_vehicle'}
  ];

  constructor(
    private EditingService: MapEditingService
  ) { }

  ngOnInit(): void { }

  computePath(): void {
    console.log(this.TransportModeSelected, this.EditModeStatus, this.ElevationModeStatus);
  }

  checkEditMode(event: any): void {
    this.EditModeStatus = event.target.checked;
    this.EditingService.setEdit(this.EditModeStatus);
 }

}
