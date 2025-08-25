import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ListProductComponent } from './components/product/list-product/list-product.component';
import { AddProductComponent } from './components/product/add-product/add-product.component';
import { EditProductComponent } from './components/product/edit-product/edit-product.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { authGuard } from './guard/auth.guard';
import { BoutiqueComponent } from './components/boutique/boutique.component';
import { CheckoutComponent } from './components/checkout/checkout/checkout.component';
import { ListPormotionComponent } from './components/promotion/list-pormotion/list-pormotion.component';
import { ListPackComponent } from './components/pack/list-pack/list-pack.component';
import { CreatePackComponent } from './components/pack/add-pack/add-pack.component';
import { UpdatePackComponent } from './components/pack/update-pack/update-pack.component';
import { AddPormotionComponent } from './components/promotion/add-pormotion/add-pormotion.component';
import { UpdatePormotionComponent } from './components/promotion/update-pormotion/update-pormotion.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: BoutiqueComponent, canActivate: [authGuard] }, // Redirection vers la boutique par défaut
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // products
    { path: 'products', component: ListProductComponent, canActivate: [authGuard] },
    { path: 'create-product', component: AddProductComponent, canActivate: [authGuard] },
    { path: 'edit-product/:id', component: EditProductComponent, canActivate: [authGuard] },

    // promotions
    { path: 'promotions', component: ListPormotionComponent },
    { path: 'promotions/create', component: AddPormotionComponent },
    { path: 'promotions/update/:id', component: UpdatePormotionComponent },

    // pack
    { path: 'packs', component: ListPackComponent },            
    { path: 'packs/create', component: CreatePackComponent },   
    { path: 'packs/:id/edit', component: UpdatePackComponent },   

    // cart & commande
    { path: 'cart', component: CartComponent, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },

    // boutique
    { path: 'boutique', component: BoutiqueComponent, canActivate: [authGuard] },
];
