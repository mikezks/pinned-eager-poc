import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgrxRootModule } from '../+state/ngrx-root.module';
import { StoreModule } from '@ngrx/store';
import * as fromCounter from './+state/counter.reducer';
import { CounterComponent } from './counter.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CounterComponent
  ],
  imports: [
    CommonModule,
    NgrxRootModule,
    RouterModule.forChild([{
      path: '',
      component: CounterComponent
    }]),
    StoreModule.forFeature(fromCounter.counterFeatureKey, fromCounter.reducer)
  ]
})
export class MfFeatureAModule { }
