import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { configuration, OutputPathApi, Node, Nodes, PathFeature, PathContainer } from '../core/interfaces';


function shiftingOnArray(input: any[], from: number, to: number): Node[] {
    // TODO add to common func
    let numberOfDeletedElm = 1;
    const elm = input.splice(from, numberOfDeletedElm)[0];
    numberOfDeletedElm = 0;
    input.splice(to, numberOfDeletedElm, elm);
    return input;
  }

function randomHexColor(): string{
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

@Injectable()
export class PathsHandlerService {

    private defaultEditStatus = false;
    private defaultTransportMode = 'pedestrian';
    private defaultElevationStatus = false;

    PathsHandlerContainer: Subject<PathContainer> = new Subject<PathContainer>();
    PathsHandlerData: PathContainer = [];
    currentTabDisplayed!: string;

    constructor() {
    }

    private _updatePathHandlerContainer(indexPath: number, nodesToUpdate: Nodes): void {
         // very important
        this.PathsHandlerData[indexPath].inputNodes.features = nodesToUpdate;
        this.PathsHandlerContainer.next(this.PathsHandlerData);
    }

    getComputedData(outputApiData: OutputPathApi): void {
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        this.PathsHandlerData[indexPath].line_path = outputApiData.line_path;
        this.PathsHandlerData[indexPath].points_path = outputApiData.points_path;
        this.PathsHandlerData[indexPath].stats_path = outputApiData.stats_path;

        this.PathsHandlerContainer.next(this.PathsHandlerData);
    }

    buildNodesArray(coordinates: number[]): void {
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        const currentNodes: Nodes = this.PathsHandlerData[indexPath].inputNodes.features;
        const feature: Node = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    coordinates[1],
                    coordinates[0]
                ]
            },
            properties: {
                position: currentNodes.length,
                uuid: currentNodes.length,
                name: 'node ' + currentNodes.length
            }
        };
        currentNodes.push(feature);
        this._updatePathHandlerContainer(indexPath, currentNodes)
    }

    addNodesFromPathId(pathId: string, nodes: Nodes): void {
        // not really add but build
        this.currentTabDisplayed = pathId;
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        this._updatePathHandlerContainer(indexPath, nodes)
    }

    getNodesFromOpenedPath(): Nodes {
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        return this.PathsHandlerData[indexPath].inputNodes.features;
    }

    getOpenedPath(): PathFeature {
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        return this.PathsHandlerData[indexPath];
    }

    addPath(name?: string): void {
        // TODO name input
        this.initNewPath();
        this.PathsHandlerContainer.next(this.PathsHandlerData);
    }

    countPath(): number {
        return this.PathsHandlerData.length;
    }

    getPathIndex(pathId: string): number {
        const pathIndex: number = this.PathsHandlerData.findIndex(
            (path: PathFeature): boolean => path.id === pathId
        );
        return pathIndex;
    }

    getPathConfigFromPathId(pathId: string): configuration {
        this.currentTabDisplayed = pathId;
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        return this.PathsHandlerData[indexPath].configuration;
    }


    removeNodeAction(pathId: string, uuidToRemove: number): void {
        console.log("DEL", "pathId:" + pathId + ", handler:" + this.currentTabDisplayed)
        this.currentTabDisplayed = pathId;
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        const nodes: Nodes = this.PathsHandlerData[indexPath].inputNodes.features;

        const nodesCleaned: Nodes = nodes.filter(data => data.properties.uuid !== uuidToRemove);
        this._updatePathHandlerContainer(indexPath, nodesCleaned)

    }


    upPositionAction(pathId: string, uuidToChange: number): void {
        console.log("UP", "pathId:" + pathId + ", handler:", this.currentTabDisplayed)
        this.currentTabDisplayed = pathId;
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        const nodes: Nodes = this.PathsHandlerData[indexPath].inputNodes.features;

        const nodesUpdated = this._updatePositionNodes(nodes, uuidToChange, -1);
        this._updatePathHandlerContainer(indexPath, nodesUpdated);
    }

    botPositionAction(pathId: string, uuidToChange: number): void {
        console.log("DWN", "pathId:" + pathId + ", handler:" + this.currentTabDisplayed)
        this.currentTabDisplayed = pathId;
        const indexPath: number = this.getPathIndex(this.currentTabDisplayed);
        const nodes: Nodes = this.PathsHandlerData[indexPath].inputNodes.features;

        const nodesUpdated = this._updatePositionNodes(nodes, uuidToChange, 1);
        this._updatePathHandlerContainer(indexPath, nodesUpdated);
    }

    private _updatePositionNodes(nodes: Nodes, uuidToChange: number, incrementPos: number): Nodes {
        // TODO avoid to do something if node is a the top and if click on top
        const uuidIndex = nodes.findIndex( (node: Node): boolean => {
            return node.properties.uuid === uuidToChange;
        });
        const nodesShifted: Nodes = shiftingOnArray(nodes, uuidIndex, uuidIndex + incrementPos);
        nodesShifted.forEach((feature, index) => {
            nodesShifted[index].properties.position = index;
        });
        return nodesShifted;
    }


    private initNewPath(): void {
        const idValue = this.countPath() + 1;
        this.currentTabDisplayed = 'path' + idValue;
        this.PathsHandlerData.push({
            id: 'path' + idValue,
            name: 'Path ' + idValue,
            color: randomHexColor(),
            configuration: {
                EditingStatus: this.defaultEditStatus,
                transportModeStatus: this.defaultTransportMode,
                elevationStatus: this.defaultElevationStatus
            },
            inputNodes: {
                type: 'FeatureCollection',
                features: []
            }
        });
    }

}


