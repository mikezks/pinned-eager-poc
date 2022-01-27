import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { decrement, increment } from './+state/counter.actions';
import { selectCount } from './+state/counter.selectors';

@Component({
  selector: 'app-counter',
  template: `
    <p>
      Counter:<br><br>
      <button (click)="action.decrement()">-</button>
      <span>{{ count$ | async }}</span>
      <button (click)="action.increment()">+</button>
    </p>
  `,
  styles: [`
    :host {
      font-family: verdana, sans-serif;
    }

    button {
      border: none;
      border-radius: 13px;
      width: 25px;
      height: 25px;
      background-color: lightsteelblue;
      cursor: pointer;
    }

    span {
      display: inline-block;
      min-width: 40px;
      text-align: center;
    }
  `]
})
export class CounterComponent {
  count$: Observable<number> = this.store.select(selectCount);
  action = {
    increment: () => this.store.dispatch(increment()),
    decrement: () => this.store.dispatch(decrement())
  };

  constructor(private store: Store) { }
}
