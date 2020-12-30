import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewControlerMapService } from '../services/mapcontroler.service';



@Component({
  selector: 'app-viewcontroler',
  templateUrl: './viewcontroler.component.html',
  styleUrls: ['./viewcontroler.component.css']
})
export class ViewcontrolerComponent implements OnInit {
  study_area_value!: string;
  hide_error: boolean = false; 
  coordinates: object = {};

  constructor(
    private mapService: ViewControlerMapService
  ) { }

  ngOnInit(): void {
  }

 
  public computeView() {
    this.mapService.bboxFromLocation(this.study_area_value)
   
  }

}
