import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetTableComponent } from './dataset-table/dataset-table.component';
import { DatasetComponent } from './dataset.component';

const routes: Routes = [
  {
    path: '',
    component: DatasetComponent,
    children: [
      {
        path: ':type',
        component: DatasetTableComponent,
      },
      {
        path: '',
        redirectTo: 'training',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatasetRoutingModule {}
