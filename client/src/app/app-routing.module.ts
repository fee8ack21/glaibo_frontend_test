import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { ProductListComponent } from './views/product/product-list/product-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  { path: 'product', component: ProductListComponent, pathMatch: 'full' },
  { path: 'product/:productType', component: ProductListComponent },
  { path: 'product/:productType/:productID', component: ProductDetailComponent },
  { path: '**', redirectTo: 'product' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
