import { inject, Injectable } from '@angular/core';

// ngrx
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

// rxjs
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

// actions
import * as PeopleActions from './people.actions';

// services
import { PeopleService } from '../services/people.service';


@Injectable()
export class PeopleSearchEffects {
  private actions$ = inject(Actions);
  private peopleService = inject(PeopleService);
  private store = inject(Store);

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PeopleActions.searchStart),
      switchMap(({ query, page }) => {
        if (!query.trim()) {
          return of(PeopleActions.searchSuccess({ people: [], next: null, count: 0, previous: null }));
        }
        return this.peopleService.searchPeople(query, page).pipe(
          map(({ results, next, count, previous }) => {
            if (results.length > 0) {
              this.store.dispatch(PeopleActions.addToSearchHistory({
                searchHistory: {
                  query
                }
              }));
            }
            return PeopleActions.searchSuccess({ people: results, next, count, previous });
          }),
          catchError(error => of(PeopleActions.searchError({ error: error.message })))
        )
      })
    )
  );
}
