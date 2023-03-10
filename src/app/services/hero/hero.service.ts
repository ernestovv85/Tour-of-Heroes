import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { IHero } from '../../Interfaces/selectedHero';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL a la API web
  /**
   * Manejar la operación Http que falló.
   * Deja que la aplicación continúe.
   *
   * @param operation - nombre de la operación que falló
   * @param result - valor opcional para devolver como el resultado observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // iniciar sesión en la consola en su lugar
      // Deje que la aplicación siga funcionando devolviendo un resultado vacío.
      return of(result as T);
    };
  }

  getHeroes(): Observable<IHero[]> {
    return this.http.get<IHero[]>(this.heroesUrl).pipe(
      catchError(this.handleError<IHero[]>('getHeroes', []))
    );
  }
  constructor(
    private http: HttpClient,
  ) {}

  getHero(id: number): Observable<IHero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<IHero>(url).pipe(
      catchError(this.handleError<IHero>(`getHero id=${id}`))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /** PUT: actualizar el héroe en el servidor */
  updateHero(hero: IHero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: añadir un nuevo héroe al servidor */
  addHero(hero: IHero): Observable<IHero> {
    return this.http.post<IHero>(this.heroesUrl, hero, this.httpOptions).pipe(
      catchError(this.handleError<IHero>('addHero'))
    );
  }
  /** DELETE: eliminar al héroe del servidor */
  deleteHero(id: number): Observable<IHero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<IHero>(url, this.httpOptions).pipe(
      catchError(this.handleError<IHero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<IHero[]> {
    if (!term.trim()) {
      // si no es el término de búsqueda, devuelve una matriz de héroes vacía.
      return of([]);
    }
    return this.http.get<IHero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      catchError(this.handleError<IHero[]>('searchHeroes', []))
    );
  }
}
