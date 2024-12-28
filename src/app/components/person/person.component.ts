import { Component, input } from '@angular/core';

// models
import { Person } from '../../models';

@Component({
  selector: 'app-person',
  imports: [],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {
  person = input.required<Person>();

}
