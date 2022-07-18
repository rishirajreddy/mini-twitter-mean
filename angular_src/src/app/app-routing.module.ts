import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NewTweetComponent } from './new-tweet/new-tweet.component';

const routes: Routes = [
  {path:"", component: HeaderComponent},
  {path:"tweets", component: NewTweetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
