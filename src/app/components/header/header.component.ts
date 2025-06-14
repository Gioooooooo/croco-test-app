import {
  Component,
  Inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentDateTime = signal<Date | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentDateTime.set(new Date());
      timer(0, 1000)
        .pipe(map(() => new Date()))
        .subscribe((date) => {
          this.currentDateTime.set(date);
          this.cdr.detectChanges();
        });
    }
  }
}
