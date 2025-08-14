import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ListProductComponent } from './components/product/list-product/list-product.component';
import { AddProductComponent } from './components/product/add-product/add-product.component';
import { EditProductComponent } from './components/product/edit-product/edit-product.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { authGuard } from './guard/auth.guard';
import { BoutiqueComponent } from './components/product/boutique/boutique.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'products', component: ListProductComponent, canActivate: [authGuard] },
    { path: 'create-product', component: AddProductComponent, canActivate: [authGuard] },
    { path: 'edit-product/:id', component: EditProductComponent, canActivate: [authGuard] },

    { path: 'cart', component: CartComponent, canActivate: [authGuard] },

    { path: 'boutique', component: BoutiqueComponent, canActivate: [authGuard] },
];
