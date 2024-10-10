import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataWorkerService } from '../../services/data-worker.service';
import { DataElement } from '../../models/data.model';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule]
})
export class DataDisplayComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<DataElement>([]);
  public displayedColumns: string[] = ['id', 'int', 'float', 'color', 'child'];

  protected readonly parseInt = parseInt;

  private destroy$ = new Subject<void>();

  constructor(private dataWorkerService: DataWorkerService) {}

  ngOnInit(): void {
    this.dataWorkerService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((newData) => {
        // show last 10 items
        this.dataSource.data = newData.slice(-10);
    });
  }

  updateWorkerSettings(interval: number, arraySize: number) {
    this.dataWorkerService.updateWorkerConfig(interval, arraySize);
  }

  trackById(index: number, item: DataElement): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
