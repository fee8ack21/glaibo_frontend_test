import { Component, OnInit, AfterViewInit, Input, HostListener, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-navbar',
  templateUrl: './tab-navbar.component.html',
  styleUrls: ['./tab-navbar.component.scss']
})
export class TabNavbarComponent implements OnChanges, OnInit, AfterViewInit {
  isMobile = false;
  isModalOpen = false;
  breadcrumbName: string;

  @Input()
  public pathPrefix!: string;

  @Input('childrenPathObjList')
  public pathObjList: any;

  // for position sticky
  @ViewChild('tabNavbar') public tabNavbar: ElementRef;
  tabNavbarTop: number;


  constructor(
    private router: Router,
  ) {
    this.onResize();
  }

  ngOnChanges() {
    this.getBreadcrumbName();
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.getBreadcrumbName();
    })
  }

  ngAfterViewInit() {
    this.tabNavbarTop = this.tabNavbar.nativeElement.getBoundingClientRect().top;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event?: any) {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }


  @HostListener('window:scroll', ['$event'])
  onScroll($event?: any) {
    if (window.pageYOffset > this.tabNavbarTop) {
      this.tabNavbar.nativeElement.classList.add('tab-navbar--fixed');
    } else {
      this.tabNavbar.nativeElement.classList.remove('tab-navbar--fixed');
    }
  }

  openTabNavbarModal($event: any) {
    $event.preventDefault();
    this.isModalOpen = true;
  }

  getBreadcrumbName() {
    if (this.pathObjList.length == 0) { return };

    for (let i = 0; i < this.pathObjList.length; i++) {
      if (this.router.url.indexOf(this.pathPrefix + '/' + this.pathObjList[i].path) == -1) { continue; }

      this.breadcrumbName = this.pathObjList[i].name;
      break;
    }

    if (this.breadcrumbName == undefined) {
      this.breadcrumbName = this.pathObjList[0].name;
    }
  }
}
