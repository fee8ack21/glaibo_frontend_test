import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

export class ProductListComponent implements OnInit, OnDestroy {
  childrenPathObjList: TabNavbar[] = [];

  _productList: Product[] = [];
  productList: Product[] = [];

  loadCounter = 1;
  loadAmount = 30;
  loadMaxCounter: number;

  getProductsInterval: ReturnType<typeof setInterval>;
  oldIndexChangedList: number[] = [];
  newIndexChangedList: number[] = [];

  isFirstRouteChange = true;
  @ViewChild('productsList') public productsListEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private loaderService: LoaderService,
    private elements: ElementRef
  ) { }

  ngOnInit(): void {
    this.getPageInfo();

    this.route.params.subscribe(params => {
      if (this.isFirstRouteChange) { this.isFirstRouteChange = false; return; }

      // reset
      this._productList = [];
      this.productList = [];
      this.loadCounter = 1;

      this.loaderService.start();
      this.getProducts(params.productType).subscribe(result => {
        this.showProducts();

        // 路由變化後，重新綁定request interval
        this.resetGetProductsInterval();

        this.loaderService.stop();
      }, error => {
        alert(error);
      })
    })
  }

  ngOnDestroy() {
    clearInterval(this.getProductsInterval)
  }

  @HostListener('window:scroll', ['$event'])
  lazyLoadProducts($event?: any) {
    if (this.loadCounter == 1) { return } // 避免params change時觸發

    let windowHeight = window.screen.height;
    let windowScrollY = window.scrollY;
    let listOffsetTop = this.elements.nativeElement.querySelector('.products__list').offsetTop;
    let listHeight = this.elements.nativeElement.querySelector('.products__list').offsetHeight;

    // 在有資料的情況時，至少預留一個window height的scroll 空間
    if ((listOffsetTop + listHeight) - (windowScrollY + windowHeight) <= windowHeight) {
      this.showProducts();
    }
  }

  getPageInfo() {
    const param = this.route.snapshot.params['productType'];
    this.loaderService.start();

    this.getProductTypes().subscribe(result => {
      if (param != undefined) {
        this.getProducts(param).subscribe(result => {
          this.showProducts();

          // 執行第一次getProducts後，綁定request interval
          this.resetGetProductsInterval();

          this.loaderService.stop();
        }, error => {
          alert(error)
        });
      } else {
        this.router.navigate(['/product', this.childrenPathObjList[0].path]);
      }
    }, error => {
      alert(error)
    })
  }

  getProductTypes() {
    let result = new Subject<boolean>();
    this.httpService.get<ProductType[]>('productTypes').subscribe(
      response => {
        let _childrenPathObjList: TabNavbar[] = [];

        response.forEach((item: any) => {
          _childrenPathObjList.push({ path: item.id.toString(), name: item.name })
        })
        this.childrenPathObjList = _childrenPathObjList;
        result.next(true)
      },
      error => {
        result.error('商品分類載入錯誤')
      });
    return result;
  }

  getProducts(type: number) {
    let result = new Subject<boolean>();
    this.httpService.get<Product[]>(`products?type=${type}`).subscribe(
      response => {
        this._productList = response;
        this.loadMaxCounter = Math.ceil(response.length / this.loadAmount);
        result.next(true)
      },
      error => {
        result.error('商品列表載入錯誤')
      }
    );

    return result;
  }

  showProducts() {
    if (this.loadCounter > this.loadMaxCounter) { return };

    this.productList = this.productList.concat(this._productList.slice((this.loadCounter - 1) * this.loadAmount, (this.loadCounter * this.loadAmount)))
    this.loadCounter++;
  }

  setGetProductsInterval() {
    const param = this.route.snapshot.params['productType'];

    // 模擬請求，儘管response 一樣
    this.getProductsInterval = setInterval(() => {
      let result = new Subject<boolean>();
      this.httpService.get<Product[]>(`products?type=${param}`).subscribe(
        response => {
          // 取得要替換資料的index
          this.oldIndexChangedList = this.newIndexChangedList;
          this.newIndexChangedList = [];
          let priceColumns = this.elements.nativeElement.querySelectorAll('.js-price-cell');

          while (this.newIndexChangedList.length < 50) {
            let randomIndex = this.getRandomInt(0, response.length);
            let isUnique = true;
            for (let j = 0; j < this.newIndexChangedList.length; j++) {
              if (randomIndex == this.newIndexChangedList[j]) {
                isUnique = false;
                break;
              }
            }

            if (isUnique) {
              this.newIndexChangedList.push(randomIndex);
            }
          }

          // 如為正式狀況，則另外取出兩個陣列不同value 的index位置

          // 替換資料，商品價格+1
          for (let i = 0; i < this.newIndexChangedList.length; i++) {
            this._productList[this.newIndexChangedList[i]].price++;

            if (this.newIndexChangedList[i] > this.productList.length) { continue }
            if (this.productList[this.newIndexChangedList[i]] == undefined) { continue }
            this.productList[this.newIndexChangedList[i]].price++;
          }

          // 還原上一輪樣式變動的欄位
          for (let i = 0; i < this.oldIndexChangedList.length; i++) {
            if (this.oldIndexChangedList[i] > priceColumns.length) { continue };
            if (priceColumns[this.oldIndexChangedList[i]] == undefined) { continue }

            priceColumns[this.oldIndexChangedList[i]].style['color'] = 'black';
          }

          // 針對這一輪資料變動的欄位更改樣式
          for (let i = 0; i < this.newIndexChangedList.length; i++) {
            if (this.newIndexChangedList[i] > priceColumns.length) { continue };
            if (priceColumns[this.newIndexChangedList[i]] == undefined) { continue }

            priceColumns[this.newIndexChangedList[i]].style['color'] = 'red';
          }
        },
        error => {
          result.error('商品列表載入錯誤')
        }
      );
      return result;
    }, 5000)
  }

  resetGetProductsInterval() {
    clearInterval(this.getProductsInterval);
    this.setGetProductsInterval();
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
