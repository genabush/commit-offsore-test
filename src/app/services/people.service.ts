import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// environments
import { environment } from '../environments/environment';

// rxjs
import { Observable } from 'rxjs';

// models
import { PeopleSearchResponse, Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) {
  }

  searchPeople(query: string, page = 1): Observable<PeopleSearchResponse> {
    return this.http.get<PeopleSearchResponse>(`${environment.peopleApiUrl}?search=${query}&page=${page}`);
  }

}
