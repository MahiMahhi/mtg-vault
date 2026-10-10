import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './auth.service';
@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  @if (auth.user(); as u) {
    <nav class="glass"><a class="logo" routerLink="/">🃏 MTG<span>Vault</span></a>
      <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
      <a routerLink="/collection" routerLinkActive="on">Collection</a>
      <a routerLink="/add" routerLinkActive="on">＋ Add Card</a>
      <img class="avatar" [src]="u.picture" [title]="u.email" referrerpolicy="no-referrer" alt="">
      <button class="btn ghost" (click)="auth.logout()">Log out</button></nav>
  }
  <main><router-outlet/></main>`,
})
export class AppComponent { auth = inject(Auth); }
