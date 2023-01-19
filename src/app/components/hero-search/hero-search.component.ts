import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { IHero } from 'src/app/Interfaces/selectedHero';
import { HeroService } from 'src/app/services/hero/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.scss' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<IHero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Introduce un término de búsqueda en el flujo observable.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {

    this.heroes$ = this.searchTerms.pipe(
      // espere 300 ms después de cada pulsación de tecla antes de considerar el término
      debounceTime(300),

      // ignorar el nuevo término si es el mismo que el anterior
      distinctUntilChanged(),

      // cambiar a una nueva búsqueda observable cada vez que cambia el término
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}