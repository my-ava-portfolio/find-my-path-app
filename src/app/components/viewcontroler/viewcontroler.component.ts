import { Component, OnInit } from '@angular/core';
import { MapViewBuilderService } from '../../services/mapviewbuider.service';



@Component({
  selector: 'app-viewcontroler',
  templateUrl: './viewcontroler.component.html',
  styleUrls: ['./viewcontroler.component.css']
})

export class ViewcontrolerComponent implements OnInit {
  StudyAreaValue!: string;
  HideError = false;
  ErrorMessage = 'Study area not found';
  coordinates: object = {};

  constructor(
    private MapViewService: MapViewBuilderService,
  ) {

    this.MapViewService.ErrorApiFound.subscribe(status => {
      this.HideError = status;
    });

   }

  ngOnInit(): void {
  }


  public computeView(): void {
    this.MapViewService.bboxFromLocation(this.StudyAreaValue);
  }

}
