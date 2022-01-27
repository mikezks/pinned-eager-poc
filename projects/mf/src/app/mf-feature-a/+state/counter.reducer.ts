import { createReducer, on } from '@ngrx/store';
import * as CounterActions from './counter.actions';

export const counterFeatureKey = 'counter';

export interface State {
  count: number
}

export const initialState: State = {
  count: 10
};

export const reducer = createReducer(
  initialState,

  on(CounterActions.increment, state => ({ count: state.count + 1 })),
  on(CounterActions.decrement, state => ({ count: state.count - 1 }))
);
