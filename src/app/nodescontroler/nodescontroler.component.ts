import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nodescontroler',
  templateUrl: './nodescontroler.component.html',
  styleUrls: ['./nodescontroler.component.css']
})
export class NodescontrolerComponent implements OnInit {
  
  transport_mode_selected: string = "mode_pedestrian";
  edit_mode_status: boolean = false;
  elevation_mode_status: boolean = false;

  transport_modes: any = [
    {"title": "Pedestrian", "value": "mode_pedestrian"},
    {"title": "Vehicle", "value": "mode_vehicle"}
  ];

  constructor() { }

  ngOnInit(): void { }

  computePath() {
    console.log(this.transport_mode_selected, this.edit_mode_status, this.elevation_mode_status);
  }

}
