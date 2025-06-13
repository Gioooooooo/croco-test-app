import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Todo, User } from '../../models/models';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private location = inject(Location);

  private userId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  user = toSignal<User | null>(
    this.userId$.pipe(
      switchMap((userId) => this.apiService.getUser(userId)),
      catchError((err) => {
        this.error.set(err.message);
        return of(null);
      })
    )
  );

  todos = toSignal<Todo[], Todo[]>(
    this.userId$.pipe(
      switchMap((userId) => this.apiService.getTodosByUserId(userId)),
      catchError((err) => {
        this.error.set(`Could not load todos. ${err.message}`);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  error = signal<string | null>(null);

  goBack(): void {
    this.location.back();
  }
}
