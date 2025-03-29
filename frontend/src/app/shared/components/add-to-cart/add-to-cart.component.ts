import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FavoriteType} from "../../../../types/favorite.type";
import {environment} from "../../../../environments/environment";
import {FavoriteService} from "../../services/favorite.service";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {

  @Input() product!: FavoriteType;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  @Input() countInCart: number | undefined = 0;
  @Output() productForRemove: EventEmitter<FavoriteType> = new EventEmitter<FavoriteType>();

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) { }

  removeFromFavorites() {
    this.productForRemove.emit(this.product);
  }

  ngOnInit() {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error((cartData as DefaultResponseType).message);
        }

        const cartDataResponse = cartData as CartType;

        if (cartDataResponse) {
          const productInCart = cartDataResponse.items.find(item => item.product.id === this.product.id);
          if (productInCart) {
            this.product.countInCart = productInCart.quantity;
            this.count = this.product.countInCart;
          }
        }
      });
  }

  addToCart(): void {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = this.count;
      });
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.countInCart = this.count;
        });
    }
  }

}
