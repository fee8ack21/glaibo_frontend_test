import { Component, OnInit, Input, HostListener, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-navbar',
  templateUrl: './tab-navbar.component.html',
  styleUrls: ['./tab-navbar.component.scss']
})
export class TabNavbarComponent implements OnChanges, OnInit {
  isMobile = false;
  isModalOpen = false;
  breadcrumbName: string;

  @Input()
  public pathPrefix!: string;

  @Input('childrenPathObjList')
  public pathObjList: any;

  @ViewChild('tabNavbar') public tabNavbar: ElementRef;

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

  @HostListener('window:resize', ['$event'])
  onResize($event?: any) {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
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
