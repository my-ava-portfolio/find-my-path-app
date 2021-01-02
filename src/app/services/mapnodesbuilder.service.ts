import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Node } from '../core/interfaces';


function move(input: Node[], from: number, to: number): Node[] {
    let numberOfDeletedElm = 1;
    const elm = input.splice(from, numberOfDeletedElm)[0];
    numberOfDeletedElm = 0;
    input.splice(to, numberOfDeletedElm, elm);
    return input;
  }


@Injectable()
export class MapNodesBuilderService {

    nodes: Subject<Node[]> = new Subject<Node[]>();
    NodesArray: Node[] = [];
    markerUuidToDelete: Subject<number> = new Subject<number>();

    constructor() { }

    buildNodesArray(coordinates: number[]): void {

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
                position: this.NodesArray.length,
                uuid: this.NodesArray.length,
                name: 'node ' + this.NodesArray.length
            }
        };
        this.NodesArray.push(feature);
        this.nodes.next(this.NodesArray);
    }

    updateNodeFeature(uuid: number, coordinates: number[]): void {

        this.NodesArray.forEach((feature, index) => {
            if (feature.properties.uuid === uuid) {
                console.log('coucou uuid', uuid);
                this.NodesArray[index].geometry.coordinates = coordinates;
            }
        });
        this.nodes.next(this.NodesArray);
    }

    getNodeFromUuid(uuid: number): Node {
        const NodeFound = this.NodesArray.filter(data => data.properties.uuid === uuid);
        return NodeFound[0];
    }

    removeNodeAction(uuid: number): void {
        if (this.NodesArray !== []) {
            this.NodesArray = this.NodesArray.filter(data => data.properties.uuid !== uuid);
            this.nodes.next(this.NodesArray);
            console.log('hahahaha2', this.NodesArray);
            // try to delete marker related uuid
            this.markerUuidToDelete.next(uuid);
        }
    }

    upPositionAction(uuid: number): void{
        const uuidIndex = this.NodesArray.findIndex( (node: Node): boolean => {
            return node.properties.uuid === uuid;
        });
        if (uuidIndex > 0) {
            move(this.NodesArray, uuidIndex, uuidIndex - 1);
            this.nodes.next(this.NodesArray);
            console.log('up', this.NodesArray);
        }

    }

    botPositionAction(uuid: number): void{
        const uuidIndex: number = this.NodesArray.findIndex((node: Node): boolean =>
            node.properties.uuid === uuid
        );
        if (uuidIndex < this.NodesArray.length) {
            move(this.NodesArray, uuidIndex, uuidIndex + 1);
            this.nodes.next(this.NodesArray);
            console.log('up', this.NodesArray);
        }

    }

}
