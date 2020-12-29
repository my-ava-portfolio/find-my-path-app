import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewcontroler',
  templateUrl: './viewcontroler.component.html',
  styleUrls: ['./viewcontroler.component.css']
})
export class ViewcontrolerComponent implements OnInit {
  study_area_value!: string;
  hide_error: boolean = false; 

  constructor() { }

  ngOnInit(): void {
  }

  computeView() {
    console.log(this.study_area_value);
  }
}
