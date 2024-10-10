import { TestBed } from '@angular/core/testing';
import { DataWorkerService } from './data-worker.service';

describe('DataWorkerService', () => {
  let service: DataWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update data from web worker', (done) => {
    service.data$.subscribe((data) => {
      expect(data.length).toBeGreaterThan(0);
      done();
    });

    service.updateWorkerConfig(1000, 10);
  });
});
