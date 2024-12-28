// ngrx
import { createReducer, on } from '@ngrx/store';

// actions
import * as PeopleActions from './people.actions';

// models
import { Person, SearchHistory } from '../models';

export interface PeopleState {
  people: Person[];
  searchHistory: SearchHistory[];
  isLoading: boolean;
  error: string | null;
  page: number;
  next: string | null;
  previous: string | null;
  count: number;
}

export const initialState: PeopleState = {
  people: [],
  searchHistory: [],
  isLoading: false,
  error: null,
  page: 1,
  next: null,
  previous: null,
  count: 0
}

export const peopleReducer = createReducer(
  initialState,
  on(PeopleActions.searchStart, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(PeopleActions.searchSuccess, (state, { people, next, count, previous }) => {
    return ({
      ...state,
      isLoading: false,
      people: previous ? [...state.people, ...people] : people,
      error: null,
      next,
      count,
      previous
    })
  }),
  on(PeopleActions.searchError, (state, { error }) => ({
    ...state,
    isLoading: false,
    people: [],
    error
  })),
  on(PeopleActions.addToSearchHistory, (state, { searchHistory }) => {
    return ({
      ...state,
      searchHistory: [
        searchHistory,
        ...state.searchHistory.filter(h => h.query.toLowerCase() !== searchHistory.query.toLowerCase())
      ]
    })
  })
);
