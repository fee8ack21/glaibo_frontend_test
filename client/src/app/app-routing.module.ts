import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { ProductListComponent } from './views/product/product-list/product-list.component';

const routes: Routes = [
  { path: 'product/:productType', component: ProductListComponent },
  { path: 'product/:productType/:productID', component: ProductDetailComponent },
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: '**', redirectTo: '/product' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
