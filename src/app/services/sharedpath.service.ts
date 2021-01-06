import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathFeature, NodeGeoJson, Nodes, OutputPathApi, PathElement, NodeFeature } from '../core/interfaces';


@Injectable()
export class SharedPathService {

    currentPath: Subject<PathElement> = new Subject<PathElement>();

    constructor() { }
}