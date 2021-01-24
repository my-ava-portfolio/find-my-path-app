import { Component, OnInit, Input } from '@angular/core';

import { NodeFeature, PathElement, Nodes, ColorsPalettes } from '../../core/interfaces';

@Component({
  selector: 'app-pathlogs',
  templateUrl: './pathlogs.component.html',
  styleUrls: ['./pathlogs.component.css']
})
export class PathlogsComponent implements OnInit {
  @Input() pathData!: PathElement;
  @Input() currentTabId!: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
