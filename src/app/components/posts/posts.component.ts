import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Post, User } from '../../models/models';

@Component({
  selector: 'app-posts',
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private location = inject(Location);

  error = signal<string | null>(null);

  private data$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const userId = params.get('id');
      if (userId) {
        return forkJoin({
          user: this.apiService.getUser(+userId),
          posts: this.apiService.getPostsByUserId(+userId),
        });
      }
      return this.apiService
        .getPosts()
        .pipe(map((posts) => ({ user: null as User | null, posts: posts })));
    }),
    catchError((err) => {
      this.error.set(err.message);
      return of({ user: null as User | null, posts: [] as Post[] });
    })
  );

  private data = toSignal(this.data$, {
    initialValue: { user: null as User | null, posts: [] as Post[] },
  });

  user = computed(() => this.data().user);
  posts = computed(() => this.data().posts);

  selectedPost = signal<Post | null>(null);
  isTableMode = computed(() => !this.user());

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
