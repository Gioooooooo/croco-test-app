import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private apiService = inject(ApiService);
  searchControl = new FormControl('');
  private users = toSignal<User[], User[]>(this.apiService.getUsers(), {
    initialValue: [],
  });
  private searchTerm = toSignal(this.searchControl.valueChanges, {
    initialValue: '',
  });

  filteredUsers = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
    );
  });
}
