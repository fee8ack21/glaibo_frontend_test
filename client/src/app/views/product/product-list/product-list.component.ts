import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductType } from 'src/app/shared/models/product';
import { TabNavbar } from 'src/app/shared/models/tab-navbar';
import { HttpService } from 'src/app/shared/services/http.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  childrenPathObjList: TabNavbar[] = [];

  _productList: Product[] = [];
  productList: Product[] = [];

  loadCounter = 1;
  loadAmount = 20;
  loadMaxCounter: number;
  @ViewChild('productsList') public productsListEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.params['productType'] != undefined) {
      this.loaderService.start();

      this.getProductTypes().then(productType => {
        this.getProducts(this.route.snapshot.params['productType'])
        this.loaderService.stop();
      }).catch(error => {
        alert(error);
        this.loaderService.stop();
      })
    } else {
      this.getProductTypes().then(productType => {
        this.router.navigate(['/product', productType])
      }).catch(error => {
        alert(error);
        this.loaderService.stop();
      })
    }

    this.route.params.subscribe(params => {
      // reset
      this.productList = [];
      this.loadCounter = 1;

      this.loaderService.start();

      this.getProducts(params.productType).then(() => {
        this.loaderService.stop();
      }).catch(error => {
        alert(error);
        this.loaderService.stop();
      }).then(() => {
        this.showProducts();
      });
    })
  }

  @HostListener('window:scroll', ['$event'])
  onResize($event?: any) {
    if (window.scrollY > this.loadCounter * 800) {
      this.showProducts();
    }
  }

  getProductTypes() {
    return new Promise((resolve, reject) => {
      this.httpService.get<ProductType[]>('productTypes').subscribe(
        response => {
          let _childrenPathObjList: TabNavbar[] = [];

          response.forEach((item: any) => {
            _childrenPathObjList.push({ path: item.id.toString(), name: item.name })
          })
          this.childrenPathObjList = _childrenPathObjList;

          resolve(this.childrenPathObjList[0].path);
        },
        error => {
          reject('商品分類載入錯誤');
        });
    })
  }

  getProducts(type: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get<Product[]>(`products?type=${type}`).subscribe(
        response => {
          this._productList = response;
          this.loadMaxCounter = Math.ceil(response.length / this.loadAmount);
          resolve('');
        },
        error => {
          reject('商品列表載入錯誤');
        }
      );
    })
  }

  showProducts() {
    if (this.loadCounter > this.loadMaxCounter) { return };

    this.productList = this.productList.concat(this._productList.slice((this.loadCounter - 1) * this.loadAmount, (this.loadCounter * this.loadAmount)))
    this.loadCounter++;
  }
}
