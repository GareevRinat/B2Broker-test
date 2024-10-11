import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataElement } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataWorkerService {
  private dataSubject = new BehaviorSubject<DataElement[]>([]);
  public data$: Observable<DataElement[]> = this.dataSubject.asObservable();
  private worker: Worker | undefined;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../workers/data-worker.worker', import.meta.url));


      this.worker.onmessage = ({ data }) => {
        this.dataSubject.next(data);
      };
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  updateWorkerConfig(interval: number, arraySize: number) {
    if (this.worker) {
      this.worker.postMessage({ interval, arraySize });
    }
  }

  terminateWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}
