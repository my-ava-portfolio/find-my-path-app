import { Component, OnInit, Input } from '@angular/core';

import { version } from '../../../../package.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() NavBarTitle = 'Nav bar title';

  appVersion!: string;

  constructor(
  ) {

  }

  ngOnInit(): void {
    this.appVersion = version;

  }

}
