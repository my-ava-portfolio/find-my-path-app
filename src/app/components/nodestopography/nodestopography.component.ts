import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { MapPathBuilderService } from '../../services/mappathbuilder.service';

import { NodePathGeoJson, NodePathFeature, Node, Margin } from '../../core/interfaces';

@Component({
  selector: 'app-nodestopography',
  templateUrl: './nodestopography.component.html',
  styleUrls: ['./nodestopography.component.css']
})
export class NodestopographyComponent implements OnInit {

  margin: Margin = {top: 30, right: 25, bottom: 30, left: 30};
  width = 400;
  height = 300;

  svg!: any;
  contentWidth!: number;
  contentHeight!: number;
  g!: any;

  constructor(
    private PathBuilderService: MapPathBuilderService
  ) {

    this.PathBuilderService.PathPointsOutput.subscribe(PathData => {
      this.initChart();
      console.log(PathData.features);
      this.createChart(PathData.features);
    });

  }

  ngOnInit(): void { }

  initChart(): void {

    this.svg = d3.select('#TopoChart').append('svg');

    this.contentWidth = this.width; // + this.margin.left + this.margin.right;
    this.contentHeight = this.height + this.margin.top + this.margin.bottom;

    this.g = this.svg
      .attr('width', '100%')
      .attr('height', this.contentHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  createChart(data: NodePathFeature[]): void {

    // Set the ranges
    const x: any = d3.scaleLinear().range([0, this.contentWidth]);
    const y: any = d3.scaleLinear().range([this.contentHeight, 0]);

    // Define the axes
    const xAxis: any = d3.axisBottom(x);
    const yAxis: any = d3.axisLeft(y);

    // Define the line
    const lineBuilder: any = d3.line<NodePathFeature>()
      .x( (d: NodePathFeature) => x(d.properties.distance) )
      .y( (d: NodePathFeature) => y(d.properties.height) )
      .curve(d3.curveCatmullRom);

    // Scale the range of the data
    x.domain(d3.extent(data, (d: NodePathFeature) => d.properties.distance ));
    y.domain([
      d3.min(data, (d: NodePathFeature) => d.properties.height - 2),
      d3.max(data, (d: NodePathFeature) => d.properties.height + 2)
    ]);

    // Add the line_value path.
    this.g.append('path')
      .attr('class', 'line')
      .attr('d', lineBuilder(data))
      .style('fill', 'none') // add a color
      .style('opacity', 'unset') // add 0 to hide the path
      .style('stroke', 'black')
      .style('stroke-width', '2')
      .style('overflow', 'overlay');

    // Add the valueline path.
    this.g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 3)
      .style('stroke', 'none')
      .style('stroke-width', 20)
      .attr('pointer-events', 'all')
      .style('cursor', 'pointer')
      .attr('cx', (d: NodePathFeature) => x(d.properties.distance))
      .attr('cy', (d: NodePathFeature) => y(d.properties.height));


    // Add X axis
    this.g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    // text label x axis
    this.g.append('text')
      .attr('transform', 'translate(' + (this.width + 0) + ' ,' + (this.height - 5) + ')')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .text('Distance parcourue (mètre)');

    // Add Y axis
    this.g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // text label y axis
    this.g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('x', 0)
      .attr('dy', '1em')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .text('Altitude (mètres)');
  }

}
