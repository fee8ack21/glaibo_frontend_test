import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './views/product/product-list/product-list.component';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './shared/services/loader.service';
import { TabNavbarComponent } from './shared/components/tab-navbar/tab-navbar.component';
import { TabNavbarModalComponent } from './shared/components/tab-navbar/tab-navbar-modal/tab-navbar-modal.component';
import { HttpService } from './shared/services/http.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
    LoaderComponent,
    TabNavbarComponent,
    TabNavbarModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [LoaderService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
