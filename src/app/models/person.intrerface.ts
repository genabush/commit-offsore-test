export interface Person {
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
}

export interface PeopleSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}