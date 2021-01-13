import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsToInputs } from '../../services/pathstoinputs.service';

import { Subscription } from 'rxjs';

import { D3LeafletUtils } from '../../core/d3LeafletUtils';

import { NodeFeature, PathElement, Nodes, colorsPalettes } from '../../core/interfaces';


@Component({
  selector: 'app-inputparameters',
  templateUrl: './inputparameters.component.html',
  styleUrls: ['./inputparameters.component.css']
})
export class InputParametersComponent implements OnInit, OnDestroy {
  @Input() pathData!: PathElement;
  @Input() isCurrentTab!: boolean;
  @Input() currentTabId!: string | undefined;

  @Output() pathEmitToDelete = new EventEmitter<string>();
  @Output() pathEmitToDuplicate = new EventEmitter<string>();
  @Output() emitChangePathsHandlerStatus = new EventEmitter<boolean>();

  configureTabOpened = true
  colorsPredefined = new colorsPalettes().colorsBrewer;
  pathName!: string;
  transportModeSelected!: string;

  addPointsSubscription!: Subscription;
  updatePathSubscription!: Subscription;
  pathIdFromPathsSubscription!: Subscription;

  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'pedestrian'},
    {title: 'Vehicle', value: 'vehicle'}
  ];

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private Map2ParametersService: MapToParametersService,
    private PathBuilderService: MapPathBuilderService,
    private MapFuncs: D3LeafletUtils,
    private pathsToInputs: PathsToInputs
  ) {
    this.addPointsSubscription = this.Map2ParametersService.newPointCoords.subscribe(coordinates => {
      this.addPointsFromCoords(coordinates)
    });

    this.updatePathSubscription = this.Map2ParametersService.pathComplete.subscribe(
      pathDone => {
        this.updatePathWithApiData(pathDone)
        this.changePathHandlerAction(true)  // activate buttons : path is finished

      }
      
    );

    this.pathIdFromPathsSubscription = this.pathsToInputs.pathId.subscribe(pathId => {
      this.deletePathAction(pathId)
    })

  }

  ngOnInit(): void {
    this.displayPathParams();
    // in order to generate the map by default, each time we create a new tab (useful if duplicate!)
    this.Parameters2MapService.mapFromPathNodes(this.pathData);
    this.pathName = this.pathData.name
    console.log("init ", this.pathData.id, this.isCurrentTab, this.currentTabId)
  }

  ngOnDestroy(): void {
    console.log("destroyed inputparameters" + this.pathData.id)
    // very important to delete the observable related to this component,
    // to prevent memory leak: close the component instance
    this.addPointsSubscription.unsubscribe()
    this.updatePathSubscription.unsubscribe()
    this.pathIdFromPathsSubscription.unsubscribe()
  }

  updatePathName(event: any): void {
    this.pathName = event.target.value;
    this.pathData.name = this.pathName
  }

  deletePathAction(pathId: string): void {
    this.pathEmitToDelete.emit(pathId)
    this.Parameters2MapService.deletePathMaps(pathId)
  }

  duplicatePathAction(pathId: string): void {
    this.pathEmitToDuplicate.emit(pathId);
  }

  changePathHandlerAction(status: boolean): void {
    this.emitChangePathsHandlerStatus.emit(status);
  }

  computePath(): void {

    this.displayPathParams();
    const nodesCreated: NodeFeature[] = this.pathData.getNodes()
    if (nodesCreated.length > 0) {
      this.changePathHandlerAction(false)  // desactivate buttons to avoid conflicts between path during path computing
      this.PathBuilderService.getPostProcData(this.pathData);

      console.log('Compute Path', this.pathData.id)
    } else {
      alert(nodesCreated.length + '  nodes found');
    }

  }
  updateStrokeWidth(event: any): void {
    this.pathData.setWidth(event.target.value)
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, undefined, event.target.value)
    console.log('update width', this.pathData.getWidth())
  }
  updateStrokeColor(event: any): void {
    this.pathData.setColor(event.target.value)
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, event.target.value)
    console.log('update color', this.pathData.getColor())
  }

  updateEditMode(event: any): void {
    this.pathData.setEdit(event.target.checked);
    this.Parameters2MapService.mapFromPathNodes(this.pathData) // in order to enable or disable drag nodes
    console.log('update edit', this.pathData.editingStatus)
  }

  updateTransportMode(newValue: string): void {
    this.pathData.setTransportMode(newValue);
    this.transportModeSelected = newValue
    console.log('update transportMode', this.pathData.getTransportMode())
  }

  updateElevationStatus(event: any): void {
    this.pathData.setElevation(event.target.checked);
    console.log('update elevationMode', this.pathData.getElevation())
  }


  addPointsFromCoords(coordinates: number[]): void {
    // here the magic part! update only the active tab and if edit is true of course
    console.log('lol ', this.pathData.id , ' ', this.currentTabId)
    if (this.pathData.getEdit() === true && this.pathData.id === this.currentTabId) {
      console.log('Nodes inserted', this.pathData, this.currentTabId)
      const currentNodesPosition: number = this.pathData.getNodes().length;
      // TODO add class for point
      this.pathData.addNode(
        {
          type: 'Point',
          coordinates: [
            coordinates[1],
            coordinates[0]
          ]
        },
        {
          position: currentNodesPosition,
          uuid: currentNodesPosition,
          name: 'node ' + currentNodesPosition
        }
      );
      this.Parameters2MapService.mapFromPathNodes(this.pathData);
    }

  }

  updatePathWithApiData(path: PathElement): void {
    if ( this.pathData.id === this.currentTabId ) {
      this.pathData = path;
      this.pathsToInputs.emitChartRefreshing()
      console.log('finito', this.isCurrentTab, this.pathData)
      // TODO from here to paths handler to create the plot
    }
  }

  private displayPathParams(): void {
    console.log(
      this.pathData
    )
  }

}
