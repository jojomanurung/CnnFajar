import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
})
export class TableDataComponent implements OnInit, AfterViewInit, OnDestroy {
  _imageList: any[];

  @Input('data')
  set imageList(value) {
    this._imageList = value;
    this.getDataTable();
  }

  get imageList() {
    return this._imageList;
  }

  @Input('editable') editable: boolean;
  @Output('dataChange') action = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'action'];
  page: number = 0;
  private subs = new SubSink();

  constructor() {}

  ngOnInit(): void {
    console.log('step 2');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subs.sink = this.paginator.page.subscribe((page) => {
      this.page = page.pageIndex * page.pageSize;
    });
  }

  getDataTable() {
    this.dataSource.data = this.imageList;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteData(value) {
    this.imageList.splice(value, 1);
    this.action.emit(this.imageList);
    this.getDataTable();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
