import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { TransportMode } from '../../core/interfaces';

import { MapToParametersService } from '../../services/maptoparameters.service';
import { ParametersToMapService } from '../../services/parameterstomap.service';
import { MapPathBuilderService } from '../../services/mappathbuilder.service';
import { PathsToInputs } from '../../services/pathstoinputs.service';
import { D3ToInputs } from '../../services/d3toinputs.service';
import { ControlersToInputs } from '../../services/constrolerstoinputs.service';

import { Subscription } from 'rxjs';

import { D3LeafletUtils } from '../../core/d3LeafletUtils';

import { Node, PathElement, colorsPalettes } from '../../core/interfaces';


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
  colorsPredefined = colorsPalettes;
  pathName!: string;
  transportModeSelected!: string;
  editStatus = 'disabled';
  loopStatus = 'disabled';
  private defaultInfoMessage = 'Define at least 2 nodes!';

  addPointsSubscription!: Subscription;
  updatePathSubscription!: Subscription;
  pathIdFromPathsSubscription!: Subscription;
  ErrorPathApiFoundSubscription!: Subscription;
  d3ToInputsSubscription!: Subscription;
  nodeUuidRemovedSubscription!: Subscription;
  nodeUuidChangedToTopSubscription!: Subscription;
  nodeUuidChangedToBotSubscription!: Subscription;

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
    private d3ToInputs: D3ToInputs,
    private controlersToInputs: ControlersToInputs
  ) {

    this.addPointsSubscription = this.Map2ParametersService.newPointCoords.subscribe(coordinates => {
      this.addPointsFromCoords(coordinates);
    });

    this.updatePathSubscription = this.Map2ParametersService.pathComplete.subscribe(
      (pathDone) => {
        this.updatePathWithApiData(pathDone);
        this.buttonsStatus(true); // activate buttons : path is finished
      }
    );

    this.pathIdFromPathsSubscription = this.pathsToInputs.pathId.subscribe(pathId => {
      this.deletePathAction(pathId);
    });

    // status message updated when api issue occurred
    this.ErrorPathApiFoundSubscription = this.PathBuilderService.ErrorApiFound.subscribe(errorMessage => {
      this.setlogInfoMessage(errorMessage, 'error');
      this.buttonsStatus(true); // reset buttons status

    });

    // status message updated when nodes are modified by controler component
    this.nodeUuidRemovedSubscription = this.controlersToInputs.nodeUuidRemoved.subscribe(nodeUuid => {
      this.setlogInfoMessage('Node ' + nodeUuid + ' removed', 'info');
    });
    this.nodeUuidChangedToTopSubscription = this.controlersToInputs.nodeUuidChangedTop.subscribe(nodeUuid => {
      this.setlogInfoMessage('Node ' + nodeUuid + ' moved to top', 'info');
    });
    this.nodeUuidChangedToBotSubscription = this.controlersToInputs.nodeUuidChangedBot.subscribe(nodeUuid => {
      this.setlogInfoMessage('Node ' + nodeUuid + ' moved to bot', 'info');
    });

    // update log message if coordinates point change
    this.d3ToInputsSubscription = this.d3ToInputs.pointMapMovedNewCoordinates.subscribe(coordinates => {
      this.setlogInfoMessage('Node moved at: ' + coordinates, 'info');
    });

  }

  ngOnInit(): void {
    this.displayPathParams();
    // in order to generate the map by default, each time we create a new tab (useful if duplicate!)
    this.Parameters2MapService.mapFromPathNodes(this.pathData);
    this.pathName = this.pathData.name;
    this.setlogInfoMessage('Path Created: ' + this.pathName, 'info');

  }

  ngOnDestroy(): void {
    // destroyed inputparameters
    // very important to delete the observable related to this component,
    // to prevent memory leak: close the component instance
    this.addPointsSubscription.unsubscribe();
    this.updatePathSubscription.unsubscribe();
    this.pathIdFromPathsSubscription.unsubscribe();
    this.ErrorPathApiFoundSubscription.unsubscribe();
    this.d3ToInputsSubscription.unsubscribe();

    this.nodeUuidRemovedSubscription.unsubscribe();
    this.nodeUuidChangedToTopSubscription.unsubscribe();
    this.nodeUuidChangedToBotSubscription.unsubscribe();

    this.buttonsStatus(true); // reset buttons status
  }

  setlogInfoMessage(message: string, type: string): void {
    if (this.pathData.id === this.currentTabId) {
      let logIcon!: string;
      if (type === 'info') {
        logIcon = 'fa-info-circle text-info';
      } else if (type === 'warning') {
        logIcon = 'fa-exclamation-circle text-warning';
      } else if (type === 'error') {
        logIcon = 'fa-exclamation-circle text-danger';
      } else if (type === 'success') {
        logIcon = 'fa-check-circle text-success';
      } else if (type === 'warning') {
        logIcon = 'fa-exclamation-circle text-warning';
      }
      this.pathData.pathLogMessages.push({
        icon: logIcon,
        details: message
      });

    }
  }


  zoomOnPath(): void {
    // zoom nodes paths...
    this.Parameters2MapService.zoomOnPathOnMap(this.pathData);
  }

  updatePathName(event: any): void {
    this.pathName = event.target.value;
    this.setlogInfoMessage('path renamed: ' + this.pathData.name + ' to ' + this.pathName, 'info');
    this.pathData.name = this.pathName;
    this.PathBuilderService.chartPathToRefresh.next(this.pathData);
    this.pathsToInputs.emitGlobalChartRefreshing();
  }

  deletePathAction(pathId: string): void {
    this.pathEmitToDelete.emit(pathId);
    this.Parameters2MapService.deletePathMaps(pathId);
  }

  duplicatePathAction(pathId: string): void {
    this.setlogInfoMessage('Path duplicated: ' + pathId, 'info');
    this.pathEmitToDuplicate.emit(pathId);
  }

  buttonsStatus(status: boolean): void {
    this.emitChangePathsHandlerStatus.emit(status);
  }

  computePath(): void {
    this.displayPathParams();
    const nodesCreated: Node[] = this.pathData.getNodes();
    if (nodesCreated.length > 0) {
      this.buttonsStatus(false);  // desactivate buttons to avoid conflicts between path during path computing
      this.PathBuilderService.getPostProcData(this.pathData);
      this.Parameters2MapService.zoomOnPathOnMap(this.pathData);
    } else {
      // this alert should not happen because button is enabled only if 2 or more nodes exist
      alert(nodesCreated.length + '  nodes found');
    }
  }

  updateStrokeWidth(event: any): void {
    this.setlogInfoMessage('Line width updated', 'info');
    console.log(this.pathData.id);
    this.pathData.setWidth(event.target.value);
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, undefined, event.target.value);

  }
  updateStrokeColor(event: any): void {
    this.setlogInfoMessage('Color updated', 'info');
    console.log(this.pathData.id);
    this.pathData.setColor(event.target.value);
    this.MapFuncs.UpdatePathStyleFromLayerId(this.pathData.id, event.target.value);
  }

  replayPath(): void {
    this.PathBuilderService.refreshPath(this.pathData);
    this.setlogInfoMessage('Path animation replayed', 'info');
  }

  changeEditMode(): void {
    if (this.pathData.getEdit()) {
      this.pathData.setEdit(false);
      this.editStatus = 'disabled';
    } else {
      this.pathData.setEdit(true);
      this.editStatus = 'enabled';
    }
    this.Parameters2MapService.mapFromPathNodes(this.pathData); // in order to enable or disable drag nodes
  }

  updateTransportMode(newValue: string): void {
    this.pathData.setTransportMode(newValue);
    this.transportModeSelected = newValue;
    this.Parameters2MapService.mapFromPathNodes(this.pathData); // in order to enable or disable drag nodes
    this.setlogInfoMessage(this.pathData.getTransportMode() + ' transport mode applied', 'info');
  }

  updateElevationStatus(event: any): void {
    this.pathData.setElevation(event.target.checked);
    console.log('update elevationMode', this.pathData.getElevation());
  }

  updatePathLoopStatus(): void {
    if (this.pathData.isPathLoop) {
      this.pathData.isPathLoop = false;
      this.loopStatus = 'disabled';
    } else {
      this.pathData.isPathLoop = true;
      this.loopStatus = 'enabled';
    }
    this.setlogInfoMessage('Path loop is ' + this.pathData.isPathLoop, 'info');
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
      this.setlogInfoMessage('Node added at: ' + coordinates, 'info');
    }

  }

  updatePathWithApiData(path: PathElement): void {
    if (this.pathData.id === this.currentTabId) {

      this.pathData = path;
      this.pathsToInputs.emitGlobalChartRefreshing();
      console.log('finito', this.isCurrentTab, this.pathData);
      // status message updated when api call is a success
      this.setlogInfoMessage(this.pathData.getTransportMode() + ' Path built !', 'success');
    }
  }

  private displayPathParams(): void {
    console.log(
      this.pathData
    );
  }

}
