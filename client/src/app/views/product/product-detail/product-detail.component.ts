import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product';
import { HttpService } from 'src/app/shared/services/http.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product = { id: 0, name: '', price: 0, type: 0, image: '' };
  productType: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    let productID = this.route.snapshot.params['productID'];
    this.productType = this.route.snapshot.params['productType'];

    if (isNaN(this.productType)) {
      this.router.navigate(['/product'])
      return;
    }
    if (isNaN(productID)) {
      this.router.navigate(['/product', this.productType])
      return;
    }

    this.loaderService.start();
    this.getProduct(productID).then(() => {
      this.loaderService.stop();
    }).catch(error => {
      alert(error);
      this.loaderService.stop();
    });
  }

  getProduct(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get<Product>(`products/${id}`).subscribe(
        response => {
          this.product = response;
          resolve('');
        },
        error => {
          reject('商品資料載入錯誤');
        }
      );
    })
  }
}
