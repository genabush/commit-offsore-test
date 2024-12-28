import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

// ngrx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

// reducers
import { peopleReducer } from './state/people.reducer';

// effects
import { PeopleSearchEffects } from './state/people.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({
      people: peopleReducer
    }),
    provideEffects([PeopleSearchEffects]),
    provideAnimations(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
