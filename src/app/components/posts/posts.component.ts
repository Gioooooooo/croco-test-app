import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Post } from '../../models/models';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private location = inject(Location);

  private params = toSignal(this.route.paramMap);
  private userId = computed(() => this.params()?.get('id'));

  user = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = params.get('id');
        if (userId) {
          return this.apiService.getUser(+userId);
        }
        return of(null);
      }),
      catchError((err) => {
        this.error.set(err.message);
        return of(null);
      })
    )
  );

  posts = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const userId = params.get('id');
        if (userId) {
          return this.apiService.getPostsByUserId(+userId);
        }
        return this.apiService.getPosts();
      }),
      catchError((err) => {
        this.error.set(err.message);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  selectedPost = signal<Post | null>(null);
  isTableMode = computed(() => !this.userId());
  error = signal<string | null>(null);

  showPostDetails(post: Post) {
    this.selectedPost.set(post);
  }

  closePopup() {
    this.selectedPost.set(null);
  }

  goBack(): void {
    this.location.back();
  }
}
