import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { SubSink } from 'subsink2';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dataset-table',
  templateUrl: './dataset-table.component.html',
  styleUrls: ['./dataset-table.component.scss'],
})
export class DatasetTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private subs = new SubSink();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name'];
  types: string[] = ['training', 'validasi'];
  typeFilter = new FormControl('benign');
  currentParam: string;
  folderLink: string;
  page: number = 0;

  constructor(private router: ActivatedRoute, private route: Router, private datasetService: DatasetService) {}

  ngOnInit(): void {
    this.subs.sink = this.router.paramMap.subscribe((resp) => {
      const params = resp.get('type');
      if (!this.types.includes(params)) {
        this.route.navigate(['dataset', 'training']);
      }
      this.currentParam = params;
      console.log(params);
      this.getTableData();
    });
    this.initFilter();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subs.sink = this.paginator.page.subscribe((page) => {
      this.page = page.pageIndex * page.pageSize;
    });
  }

  getTableData() {
    const filter = this.typeFilter.value;
    this.subs.sink = this.datasetService.getDataset(filter, this.currentParam).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        const data = _.cloneDeep(resp);
        this.folderLink = data.folder_link;
        const gambar = data.gambar;
        this.dataSource.data = gambar;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    }, (err) => {
      console.log(err);
    })
  }

  initFilter() {
    this.subs.sink = this.typeFilter.valueChanges.subscribe((type) => {
      console.log(type);
      this.getTableData();
    })
  }

  goToFolderLink() {
    window.open(this.folderLink, '_blank');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
