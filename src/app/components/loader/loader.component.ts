import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  private loaderService = inject(LoaderService);
  isLoading = this.loaderService.isLoading;
}
