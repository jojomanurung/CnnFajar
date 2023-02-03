import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetRoutingModule } from './dataset-routing.module';
import { DatasetComponent } from './dataset.component';
import { SharedModule } from '../shared/shared.module';
import { DatasetTableComponent } from './dataset-table/dataset-table.component';

@NgModule({
  declarations: [DatasetComponent, DatasetTableComponent],
  imports: [CommonModule, DatasetRoutingModule, SharedModule],
})
export class DatasetModule {}
