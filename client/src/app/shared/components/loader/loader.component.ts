import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading = false;
  isFading = false;
  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.loaderService.isLoading.subscribe(boolean => {
      this.isLoading = boolean;
    })
    this.loaderService.isFading.subscribe(boolean => {
      this.isFading = boolean;
    })
  }
}
