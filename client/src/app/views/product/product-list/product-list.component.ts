import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
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

  isFirstRouteChange = true;
  @ViewChild('productsList') public productsListEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getPageInfo();

    this.route.params.subscribe(params => {
      if (this.isFirstRouteChange) { this.isFirstRouteChange = false; return; }

      // reset
      this.productList = [];
      this.loadCounter = 1;

      this.loaderService.start();
      
      this.getProducts(params.productType).subscribe(subject => {
        this.showProducts();
        this.loaderService.stop();
      }, error => {
        alert(error);
      })
    })
  }

  @HostListener('window:scroll', ['$event'])
  onResize($event?: any) {
    if (window.scrollY > this.loadCounter * 800) {
      this.showProducts();
    }
  }

  getPageInfo() {
    const param = this.route.snapshot.params['productType'];
    this.loaderService.start();

    this.getProductTypes().subscribe(subject => {
      if (param != undefined) {
        this.getProducts(param).subscribe(subject => {
          this.showProducts();
          this.loaderService.stop();
        }, error => {
          alert(error)
        });
      } else {
        this.getProducts(parseInt(this.childrenPathObjList[0].path)).subscribe(subject => {
          this.showProducts();
          this.loaderService.stop();
        }, error => {
          alert(error);
        });
      }
    }, error => {
      alert(error)
    })
  }

  getProductTypes() {
    let subject = new Subject<boolean>();
    this.httpService.get<ProductType[]>('productTypes').subscribe(
      response => {
        let _childrenPathObjList: TabNavbar[] = [];

        response.forEach((item: any) => {
          _childrenPathObjList.push({ path: item.id.toString(), name: item.name })
        })
        this.childrenPathObjList = _childrenPathObjList;
        subject.next(true)
      },
      error => {
        subject.error('商品分類載入錯誤')
      });
    return subject;
  }

  getProducts(type: number) {
    let subject = new Subject<boolean>();
    this.httpService.get<Product[]>(`products?type=${type}`).subscribe(
      response => {
        this._productList = response;
        this.loadMaxCounter = Math.ceil(response.length / this.loadAmount);
        subject.next(true)
      },
      error => {
        subject.error('商品列表載入錯誤')
      }
    );

    return subject;
  }

  showProducts() {
    if (this.loadCounter > this.loadMaxCounter) { return };

    this.productList = this.productList.concat(this._productList.slice((this.loadCounter - 1) * this.loadAmount, (this.loadCounter * this.loadAmount)))
    this.loadCounter++;
  }
}
