import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FavoriteComponent} from "./favorite/favorite.component";
import {OrdersComponent} from "./orders/orders.component";
import {InfoComponent} from "./info/info.component";
import {AuthGuard} from "../../core/auth/auth.guard";

const routes: Routes = [
  {path: 'favorite', component: FavoriteComponent, canActivate:[AuthGuard]},
  {path: 'orders', component: OrdersComponent},
  {path: 'profile', component: InfoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule {
}
