import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-viewcontroler',
  templateUrl: './viewcontroler.component.html',
  styleUrls: ['./viewcontroler.component.css']
})
export class ViewcontrolerComponent implements OnInit {
  study_area_value!: string;
  hide_error: boolean = false; 
  private REST_API_SERVER: string = "https://find-my-path.herokuapp.com/api/v1/location?";
  coordinates: object = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

 
  public computeView(){
    this.http.get(this.REST_API_SERVER + "name=" + this.study_area_value)
      .subscribe(response => {
        this.coordinates = response
        console.log(response)
    });
    
  }

  // fitBounds(bbox_coordinates: number[]) {
  //   this.map.fitBounds([
  //     [bbox_coordinates[0], bbox_coordinates[2]],
  //     [bbox_coordinates[1], bbox_coordinates[3]]
  //   ]);
  // }
}
