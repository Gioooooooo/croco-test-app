import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, finalize, shareReplay, map } from 'rxjs/operators';
import { Post, Todo, User } from '../models/models';
import { LoaderService } from './loader.service';
import { API_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private users$?: Observable<User[]>;
  private posts$?: Observable<Post[]>;
  private loaderService = inject(LoaderService);
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getUsers(): Observable<User[]> {
    if (!this.users$) {
      this.loaderService.show();
      this.users$ = this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
        catchError((error) => {
          console.error('იუზერების პოვნა ვერ მოხდა:', error);
          return throwError(() => new Error('იუზერების პოვნა ვერ მოხდა.'));
        }),
        finalize(() => this.loaderService.hide()),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.users$;
  }

  getUser(id: number): Observable<User> {
    this.loaderService.show();
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error(
          `იუზერის აიდის პოვნისას დაფიქსირდა შეცდომა ${id}:`,
          error
        );
        return throwError(() => new Error('მომხმარებელი ვერ იპოვა'));
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  getPosts(): Observable<Post[]> {
    if (!this.posts$) {
      this.loaderService.show();
      this.posts$ = forkJoin({
        posts: this.http.get<Post[]>(`${this.apiUrl}/posts`),
        users: this.getUsers(),
      }).pipe(
        map(({ posts, users }) => {
          return posts.map(
            (post) =>
              ({
                ...post,
                user: users.find((user) => user.id === post.userId),
              } as Post)
          );
        }),
        catchError((error) => {
          console.error('პოსტები ვერ ჩაიტვირთა:', error);
          return throwError(() => new Error('პოსტები ვერ ჩაიტვირთა.'));
        }),
        finalize(() => this.loaderService.hide()),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.posts$;
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    this.loaderService.show();
    return this.http.get<Post[]>(`${this.apiUrl}/users/${userId}/posts`).pipe(
      catchError((error) => {
        console.error(
          `შეცდომა დაფიქსირდა იუზერების ჩამოტვირთვისას ${userId}:`,
          error
        );
        return throwError(
          () =>
            new Error('სამწუხაროდ დაფიქსირდა შეცდომა მონაცემები ვერ ჩაიტვირთა.')
        );
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  getTodosByUserId(userId: number): Observable<Todo[]> {
    this.loaderService.show();
    return this.http.get<Todo[]>(`${this.apiUrl}/users/${userId}/todos`).pipe(
      catchError((error) => {
        console.error(
          `შეცდომა დაფიქსირდა იუზერების ჩამოტვირთვისას ${userId}:`,
          error
        );
        return throwError(
          () =>
            new Error('სამწუხაროდ დაფიქსირდა შეცდომა მონაცემები ვერ ჩაიტვირთა.')
        );
      }),
      finalize(() => this.loaderService.hide())
    );
  }
}
