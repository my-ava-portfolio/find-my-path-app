import { Component, OnInit } from '@angular/core';
import { MapViewBuilderService } from '../../services/mapviewbuider.service';



@Component({
  selector: 'app-viewcontroler',
  templateUrl: './viewcontroler.component.html',
  styleUrls: ['./viewcontroler.component.css']
})

export class ViewcontrolerComponent implements OnInit {
  StudyAreaValue!: string;

  private noneAreaNameMessage = "Area name not defined"
  resultMessage = 'Study area not found';

  errorDisplayed!: boolean;

  coordinates: object = {};
  helpPopup = "Set a location name to zoom!";

  constructor(
    private MapViewService: MapViewBuilderService,
  ) {

    this.MapViewService.errorApiFound.subscribe(status => {
      this.errorDisplayed = status;
    });

    this.MapViewService.errorMessage.subscribe(error => {
      this.resultMessage = error;
    });


   }

  ngOnInit(): void {
  }


  public computeView(): void {

    if (this.StudyAreaValue !== undefined) {
      this.MapViewService.bboxFromLocation(this.StudyAreaValue);

    } else {
      this.errorDisplayed = true;
      this.resultMessage = this.noneAreaNameMessage;
    }

  }

}
