import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { TransportMode, OutputPathApi } from '../../core/interfaces';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsToInputs } from '../../services/pathstoinputs.service';
import { D3ToInputs } from '../../services/d3toinputs.service';

import { Subscription } from 'rxjs';

import { D3LeafletUtils } from '../../core/d3LeafletUtils';

import { NodeFeature, PathElement, Nodes, ColorsPalettes } from '../../core/interfaces';


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

  tabOpened = true;
  colorsPredefined = new ColorsPalettes().colorsBrewer;
  pathName!: string;
  transportModeSelected!: string;
  editStatus = 'off';
  private defaultInfoMessage = 'Define at least 2 nodes!';

  addPointsSubscription!: Subscription;
  updatePathSubscription!: Subscription;
  pathIdFromPathsSubscription!: Subscription;
  ErrorPathApiFoundSubscription!: Subscription;
  ControlersToInputsSubscription!: Subscription;

  apiResultErrorMessage!: string;
  apiResultSuccessMessage!: string;
  infoMessage = 'Define at least 2 nodes!';
  infoMessageIcon!: string;

  TransportModes: TransportMode[] = [
    {title: 'Pedestrian', value: 'pedestrian'},
    {title: 'Vehicle', value: 'vehicle'}
  ];

  constructor(
    private Parameters2MapService: ParametersToMapService,
    private Map2ParametersService: MapToParametersService,
    private PathBuilderService: MapPathBuilderService,
    private MapFuncs: D3LeafletUtils,
    private pathsToInputs: PathsToInputs,
    private d3ToInputs: D3ToInputs
  ) {

    this.addPointsSubscription = this.Map2ParametersService.newPointCoords.subscribe(coordinates => {
      this.addPointsFromCoords(coordinates);
    });

    this.updatePathSubscription = this.Map2ParametersService.pathComplete.subscribe(
      (pathDone) => {
        this.updatePathWithApiData(pathDone);
        // status message updated when api call is a success
        this.infoMessage = this.pathData.getTransportMode() + ' Path built !';
        this.infoMessageIcon = 'fa-check-circle text-success';
        this.buttonsStatus(true); // activate buttons : path is finished
      }
    );

    this.pathIdFromPathsSubscription = this.pathsToInputs.pathId.subscribe(pathId => {
      this.deletePathAction(pathId);
    });

    // status message updated when api issue occurred
    this.ErrorPathApiFoundSubscription = this.PathBuilderService.ErrorApiFound.subscribe(errorMessage => {
      this.infoMessage = errorMessage;
      this.infoMessageIcon = 'fa-exclamation-circle text-danger';
      this.buttonsStatus(true); // reset buttons status

    });

    // status message updated when nodes are mapped
    this.Parameters2MapService.NodesPathToMap.subscribe(_ => {
      if (this.pathData.getNodes().length >= 2) {
        this.infoMessage = 'A new ' + this.pathData.getTransportMode() + ' path is ready to be computed! => node(s) added/removed';
        this.infoMessageIcon = 'fa-info-circle text-info';
      }
      if (this.pathData.getNodes().length < 2) {
        this.infoMessage = this.defaultInfoMessage;
        this.infoMessageIcon = 'fa-exclamation-circle text-warning';
      }
    });

    // update log message if coordinates point change
    this.ControlersToInputsSubscription = this.d3ToInputs.pointMapMoved.subscribe(_ => {
      if (this.pathData.getNodes().length >= 2) {
        this.infoMessage = 'A new ' + this.pathData.getTransportMode() + ' path is ready to be computed! => node(s) moved';
        this.infoMessageIcon = 'fa-info-circle text-info';
      }
      if (this.pathData.getNodes().length < 2) {
        this.infoMessage = this.defaultInfoMessage;
        this.infoMessageIcon = 'fa-exclamation-circle text-warning';
      }
    })

  }

  ngOnInit(): void {
    this.displayPathParams();
    // in order to generate the map by default, each time we create a new tab (useful if duplicate!)
    this.Parameters2MapService.mapFromPathNodes(this.pathData);
    this.pathName = this.pathData.name;
  }

  ngOnDestroy(): void {
    // destroyed inputparameters
    // very important to delete the observable related to this component,
    // to prevent memory leak: close the component instance
    this.addPointsSubscription.unsubscribe();
    this.updatePathSubscription.unsubscribe();
    this.pathIdFromPathsSubscription.unsubscribe();
    this.ErrorPathApiFoundSubscription.unsubscribe();
    this.ControlersToInputsSubscription.unsubscribe()
    this.buttonsStatus(true); // reset buttons status
  }

  zoomOnPath(): void {
    // zoom nodes paths...
    this.Parameters2MapService.zoomOnPathOnMap(this.pathData);
  }

  updatePathName(event: any): void {
    this.pathName = event.target.value;
    this.pathData.name = this.pathName;
    this.PathBuilderService.chartPathToRefresh.next(this.pathData);
    this.pathsToInputs.emitGlobalChartRefreshing();
  }

  deletePathAction(pathId: string): void {
    this.pathEmitToDelete.emit(pathId);
    this.Parameters2MapService.deletePathMaps(pathId);
  }

  duplicatePathAction(pathId: string): void {
    this.pathEmitToDuplicate.emit(pathId);
  }

  buttonsStatus(status: boolean): void {
    this.emitChangePathsHandlerStatus.emit(status);
  }

  computePath(): void {
    this.displayPathParams();
    const nodesCreated: NodeFeature[] = this.pathData.getNodes();
    if (nodesCreated.length > 0) {
      this.buttonsStatus(false);  // desactivate buttons to avoid conflicts between path during path computing
      this.PathBuilderService.getPostProcData(this.pathData);
    } else {
      // this alert should not happen because button is enabled only if 2 or more nodes exist
      alert(nodesCreated.length + '  nodes found');
    }
  }

  updateStrokeWidth(event: any): void {
    this.pathData.setWidth(event.target.value);
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, undefined, event.target.value);
  }
  updateStrokeColor(event: any): void {
    this.pathData.setColor(event.target.value);
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, event.target.value);
  }

  replayPath(): void {
    this.PathBuilderService.refreshPath(this.pathData);
  }

  changeEditMode(): void {
    if (this.pathData.getEdit()) {
      this.pathData.setEdit(false);
      this.editStatus = 'off';
    } else {
      this.pathData.setEdit(true);
      this.editStatus = 'on';

    }
    this.Parameters2MapService.mapFromPathNodes(this.pathData); // in order to enable or disable drag nodes
  }

  updateTransportMode(newValue: string): void {
    this.pathData.setTransportMode(newValue);
    this.transportModeSelected = newValue;
    this.Parameters2MapService.mapFromPathNodes(this.pathData); // in order to enable or disable drag nodes
    console.log('update transportMode', this.pathData.getTransportMode());
  }

  updateElevationStatus(event: any): void {
    this.pathData.setElevation(event.target.checked);
    console.log('update elevationMode', this.pathData.getElevation());
  }

  addPointsFromCoords(coordinates: number[]): void {
    // here the magic part! update only the active tab and if edit is true of course
    if (this.pathData.getEdit() === true && this.pathData.id === this.currentTabId) {
      // Nodes inserted
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
          name: 'Map Point N°' + currentNodesPosition
        }
      );
      this.Parameters2MapService.mapFromPathNodes(this.pathData);

    }

  }

  updatePathWithApiData(path: PathElement): void {
    if ( this.pathData.id === this.currentTabId ) {
      this.pathData = path;
      this.pathsToInputs.emitGlobalChartRefreshing();
      console.log('finito', this.isCurrentTab, this.pathData);

    }
  }

  private displayPathParams(): void {
    console.log(
      this.pathData
    );
  }

}
