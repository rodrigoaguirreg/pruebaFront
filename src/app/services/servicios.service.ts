import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  arrayDelService;
  obsService$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  setArray(array: any) {
    this.arrayDelService = array;
  }

  getArray() {
    return this.arrayDelService;
  }

}
