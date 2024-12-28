// ngrx
import { createFeatureSelector, createSelector } from '@ngrx/store';

// reducers
import { PeopleState } from './people.reducer';

export const selectPeopleState = createFeatureSelector<PeopleState>('people');

export const selectPeople = createSelector(
  selectPeopleState,
  (state: PeopleState) => state.people
);

export const selectSearchError = createSelector(
  selectPeopleState,
  (state: PeopleState) => state.error
);

export const selectSearchIsLoading = createSelector(
  selectPeopleState,
  (state: PeopleState) => state.isLoading
);

export const selectSearchHistory = createSelector(
  selectPeopleState,
  (state: PeopleState) => state.searchHistory
);


export const selectCount = createSelector(
  selectPeopleState,
  (state: PeopleState) => state.count
);
