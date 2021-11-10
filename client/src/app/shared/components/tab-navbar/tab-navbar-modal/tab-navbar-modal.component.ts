import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TabNavbar } from 'src/app/shared/models/tab-navbar';

@Component({
  selector: 'app-tab-navbar-modal',
  templateUrl: './tab-navbar-modal.component.html',
  styleUrls: ['./tab-navbar-modal.component.scss']
})
export class TabNavbarModalComponent implements OnInit {

  @Input() public pathPrefix: string;
  @Input() public pathObjList: TabNavbar[];
  @Input() public isModalOpen: boolean;
  @Output() public modalClose = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onModalClose($event: any) {
    if ($event.target.classList.contains('js-close')) {
      this.modalClose.emit(false);
      return;
    }
  }
}
