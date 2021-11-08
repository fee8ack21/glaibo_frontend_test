import { Component, ElementRef, OnInit } from '@angular/core';
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
  product: Product = { id: '', name: '', price: 0, type: 0, typeName: '', image1: '', image2: '' };
  productType: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private elements: ElementRef
  ) { }

  ngOnInit(): void {
    let productID = this.route.snapshot.params['productID'];
    this.productType = this.route.snapshot.params['productType'];

    this.loaderService.start();
    this.getProduct(productID).then(() => {
      this.loaderService.stop();
    }).catch(error => {
      alert(error);
      this.loaderService.stop();
    });

    this.setMagnifier();
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

  setMagnifier() {
    var productImage = this.elements.nativeElement.querySelector('.product-image');
    var magnifier = this.elements.nativeElement.querySelector('.product-image__magnifier');

    productImage.addEventListener('mouseenter', enterHandler)
    productImage.addEventListener('mousemove', moveHandler)
    productImage.addEventListener('mouseleave', leaveHandler)

    function enterHandler(e: any) {
      magnifier.classList.add('product-image__magnifier--show')
    }

    function moveHandler(e: any) {
      let rect = productImage.getBoundingClientRect()
      let offsetX, offsetY

      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      if (offsetX < 0 || offsetY < 0 || offsetX > rect.width || offsetY > rect.height) {
        magnifier.classList.remove('product-image__magnifier--show')
        return
      }

      let distanceX = offsetX / rect.width
      let distanceY = offsetY / rect.height

      let magnifierWidth = magnifier.offsetWidth;
      let magnifierHeight = magnifier.offsetHeight;

      magnifier.style.setProperty('--distance-x', distanceX)
      magnifier.style.setProperty('--distance-y', distanceY)
      magnifier.style["top"] = `calc(${distanceY * 100}% - ${magnifierWidth / 2}px)`;
      magnifier.style["left"] = `calc(${distanceX * 100}% - ${magnifierHeight / 2}px)`;
    }

    function leaveHandler(e: any) {
      magnifier.classList.remove('product-image__magnifier--show')
    }
  }
}
