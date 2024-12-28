// ngrx
import { createAction, props } from '@ngrx/store';

// models
import { Person, SearchHistory } from '../models';

export const searchStart = createAction(
  '[People] Search Start',
  props<{ query: string; page?: number }>()
);

export const searchSuccess = createAction(
  '[People] Search Success',
  props<{ people: Person[]; next: string | null; count: number; previous: string | null }>()
);

export const searchError = createAction(
  '[People] Search Error',
  props<{ error: string }>()
);

export const addToSearchHistory = createAction(
  '[People] Add To Search Suggestions',
  props<{ searchHistory: SearchHistory }>()
);

export const loadSearchSuggestions = createAction(
  '[People] Load Search Suggestions',
  props<{ query: string }>()
);
