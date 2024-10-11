import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { DataWorkerService } from '../../services/data-worker.service';
import {Child, DataElement} from '../../models/data.model';
import {debounceTime, Subject, takeLast} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss']
})
export class DataDisplayComponent implements OnInit, OnDestroy {
  public data: DataElement[] = [];
  public form: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private dataWorkerService: DataWorkerService, private fb: FormBuilder) {
    this.form = this.fb.group({
      interval: [1000],
      arraySize: [10],
      additionalIds: ['']
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(400)
  )
      .subscribe((formValues) => {
        this.onFormChange(formValues);
      });

    this.dataWorkerService.data$
      .pipe(
        takeUntil(this.destroy$),
        takeLast(10)
      )
      .subscribe((newData) => {
        this.data = newData.map(item =>
          new DataElement(
            item.id,
            item.int,
            item.float,
            item.color,
            new Child(item.child.id, item.child.color)
          )
        );
      });
  }

  onFormChange(formValues: { interval: number, arraySize: number, additionalIds: string }) {
    const intervalNumber = formValues.interval;
    const arraySizeNumber = formValues.arraySize;

    const idsArray = formValues.additionalIds ? formValues.additionalIds.split(',').map(id => id.trim()).filter(id => id) : [];

    this.dataWorkerService.updateWorkerConfig(intervalNumber, arraySizeNumber);

    this.dataWorkerService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((newData) => {
        let displayedData = newData.slice(-10);

        if (idsArray.length > 0) {
          displayedData = displayedData.map((item, index) => {
            if (idsArray[index]) {
              return { ...item, id: idsArray[index] };
            }
            return item;
          });
        }

        this.data = displayedData;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataWorkerService.terminateWorker();
  }

  trackById(index: number, item: DataElement): string {
    return item.id;
  }
}
