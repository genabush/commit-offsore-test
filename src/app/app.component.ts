import { Component, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';

// @angular/cdk
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

// ngrx
import { Store } from '@ngrx/store';

// rxjs
import {
  BehaviorSubject, debounceTime,
  distinctUntilChanged, Observable, of,
  Subject, switchMap, take, takeUntil, tap, filter
} from 'rxjs';

// @angular/material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';

// actions
import * as PeopleActions from './state/people.actions';

// selectors
import * as PeopleSelectors from './state/people.selectors';

// components
import { PeopleListComponent } from './components/people-list/people-list.component';

// models
import { Person, SearchHistory } from './models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NgFor,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    PeopleListComponent,
    AsyncPipe,
    NgIf,
    CdkVirtualScrollViewport,
    ScrollingModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  searchForm!: FormGroup;
  people$ = of([] as Person[]);
  isPeopleLoading$ = of(false);
  suggestions$ = of([] as SearchHistory[]);
  error$: Observable<null | string> = of(null);
  itemHeight = 70;
  itemsPerPage = 10;
  count$ = of(0);
  scrollPosition$ = new BehaviorSubject<number>(0);
  private unSubscribe$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }


  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  ngOnInit(): void {
    this.setValuesFromState();
    this.searchPeople();
  }

  private searchPeople(): void {
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(({ query }) => {
        this.store.dispatch(PeopleActions.loadSearchSuggestions({ query }))
      }),
      switchMap(({ query }) => {
        this.store.dispatch(PeopleActions.searchStart({ query }));
        return of(null)
      }),
      takeUntil(this.unSubscribe$)
    ).subscribe();
  }

  onScroll(): void {
    const scrollPosition = this.viewport.measureScrollOffset('bottom');
    const currentOffset = this.viewport.measureScrollOffset();

    if (scrollPosition < this.itemHeight) {

      if (currentOffset > 0) {
        this.scrollPosition$.next(currentOffset);
      } else {
        this.scrollPosition$.pipe(take(1)).subscribe(lastPosition => {

          this.scrollPosition$.next(lastPosition);
        });
      }
      this.isPeopleLoading$.pipe(
        take(1),
        switchMap(isLoading => {
          if (isLoading) {
            return this.isPeopleLoading$.pipe(
              filter(loading => !loading),
              take(1)
            );
          }
          return of(false);
        })
      ).subscribe(() => {
        this.store.select(PeopleSelectors.selectPeopleState)
          .pipe(
            take(1),
            tap((state) => {
              if (!state.next) {
                return;
              }
              const nextPage = state.people.length < state.count
                ? +state.next.split('page=')[1]
                : state.page;

              const query = this.searchForm.get('query')?.value;
              this.store.dispatch(PeopleActions.searchStart({
                query,
                page: nextPage
              }));
            })
          ).subscribe();
      });
    }
  }

  private setValuesFromState(): void {
    this.people$ = this.store.select(PeopleSelectors.selectPeople);
    this.isPeopleLoading$ = this.store.select(PeopleSelectors.selectSearchIsLoading);
    this.error$ = this.store.select(PeopleSelectors.selectSearchError);
    this.count$ = this.store.select(PeopleSelectors.selectCount);
    this.suggestions$ = this.store.select(PeopleSelectors.selectSearchHistory);
    this.scrollPosition$.pipe(
      debounceTime(0)
    ).subscribe((position) => {
      if (position > 0) {
        this.viewport.scrollToOffset(position);
      }
    });
  }
}
