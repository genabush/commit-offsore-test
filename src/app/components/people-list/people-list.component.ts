import { Component, input } from '@angular/core';

// models
import { Person } from '../../models';

// components
import { PersonComponent } from '../person/person.component';

@Component({
  selector: 'app-people-list',
  imports: [
    PersonComponent,
  ],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent {
  people = input.required<Person[]>();

}
