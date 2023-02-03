import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrediksiComponent } from './prediksi.component';

const routes: Routes = [
  {
    path: '',
    component: PrediksiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrediksiRoutingModule {}
