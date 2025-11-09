import { PaymentUnderVerificationComponent } from './pages/payment-under-verification/payment-under-verification.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AboutComponent } from './EssentialPages/about/about.component';
import { ContactComponent } from './EssentialPages/contact/contact.component';
import { ServicesComponent } from './EssentialPages/services/services.component';
import { ServiceNailExtensionsComponent } from './EssentialPages/service-nail-extensions/service-nail-extensions.component';
import { ServicePressOnNailsComponent } from './EssentialPages/service-press-on-nails/service-press-on-nails.component';
import { ServiceNailCareComponent } from './EssentialPages/service-nail-care/service-nail-care.component';
import { GalleryComponent } from './EssentialPages/gallery/gallery.component';
import { PricingComponent } from './EssentialPages/pricing/pricing.component';
import { PrivacyPolicyComponent } from './EssentialPages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './EssentialPages/terms-of-service/terms-of-service.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

export const routes: Routes = [
    {path:'',redirectTo:'products',pathMatch:'full'},
  { path: 'products', component: ProductsComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:orderId', component: OrderConfirmationComponent }, 
  { path: 'myallorders/:customerId', component: OrdersComponent },
  { path: 'payment/:orderId/:amount', component: PaymentComponent },
  { path: 'payment-under-verification/:orderId', component: PaymentUnderVerificationComponent }, 
    { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/nail-extensions', component: ServiceNailExtensionsComponent },
  { path: 'services/press-on-nails', component: ServicePressOnNailsComponent },
  { path: 'services/nail-care', component: ServiceNailCareComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: '**', redirectTo: '' } // 404 redirect to home
];
