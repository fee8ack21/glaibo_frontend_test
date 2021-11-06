import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()

export class LoaderService {
    isLoading = new BehaviorSubject<boolean>(false);
    isFading = new BehaviorSubject<boolean>(false);

    constructor() { }

    start() {
        this.isFading.next(false);
        this.isLoading.next(true);
    }

    stop() {
        const _this = this;
        this.isFading.next(true);
        setTimeout(function () {
            // 移除loader，時間與CSS transition 配合
            _this.isLoading.next(false);
        }, 500)
    }
}