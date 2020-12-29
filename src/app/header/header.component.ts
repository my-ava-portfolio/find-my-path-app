import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() 
  NavBarTitle: String = "Nav bar title";


  // useful to inject dependencies
  constructor() { }
  
  // executed only when Angular component initialization is done
  // @input() will be initialized inside it
  ngOnInit(): void {
  }
}
