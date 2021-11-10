import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
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
  isImgLoaded: false;
  hasContent: boolean = true;

  @ViewChild('productImage') productImage: ElementRef;
  @ViewChild('productMagnifier') productMagnifier: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private elements: ElementRef
  ) { }

  ngOnInit(): void {
    let productID = this.route.snapshot.params['productID'];
    this.productType = this.route.snapshot.params['productType'];

    this.getProduct(productID).subscribe(result => {
      this.setMagnifier();
    }, error => {
      alert(error);
    });
  }

  getProduct(id: number) {
    let result = new Subject<boolean>();
    this.loaderService.start();

    this.httpService.get<Product>(`products/${id}`).subscribe(
      response => {
        if (response
          && Object.keys(response).length === 0
          && Object.getPrototypeOf(response) === Object.prototype) {
          this.hasContent = false;
        }

        this.product = response;

        this.setProductImage().then(() => {
          this.loaderService.stop();
        }).catch(error => {
          alert(error);
          this.loaderService.stop();
        })

        result.next(true)
      },
      error => {
        this.loaderService.stop();
        result.error('商品分類載入錯誤')
      }
    );

    return result;
  }

  setProductImage() {
    return new Promise((resolve, reject) => {
      const _this = this;
      const imageURL = this.product.image2;
      let image = new Image();

      image.onload = () => {
        _this.productImage.nativeElement.style.backgroundImage = `url(${imageURL})`;
        _this.productMagnifier.nativeElement.style.backgroundImage = `url(${imageURL})`;
        resolve('')
      }

      image.onerror = () => {
        reject('商品圖片載入錯誤')
      }

      image.src = imageURL;
    })

  }

  setMagnifier() {
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      return;
    }

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
