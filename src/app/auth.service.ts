import { Injectable, NgZone, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GOOGLE_CLIENT_ID } from './config';

export interface User { sub: string; name: string; email: string; picture: string; exp: number }
declare const google: any;
const KEY = 'mtgvault.user';

/** Google Identity Services login (client-side only; used for sign-in only). */
@Injectable({ providedIn: 'root' })
export class Auth {
  private router = inject(Router); private zone = inject(NgZone);
  user = signal<User | null>(this.restore());

  private restore(): User | null {
    try { const u = JSON.parse(localStorage.getItem(KEY) || 'null'); return u && u.exp * 1000 > Date.now() ? u : null; } catch { return null; }
  }
  private ready() {
    return new Promise<void>(res => { const t = () => ((window as any).google?.accounts?.id ? res() : setTimeout(t, 100)); t(); });
  }
  async renderButton(el: HTMLElement) {
    await this.ready();
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r: any) => this.zone.run(() => this.onCredential(r.credential)) });
    google.accounts.id.renderButton(el, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', width: 280 });
  }
  private onCredential(jwt: string) {
    const b64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const p = JSON.parse(decodeURIComponent(escape(atob(b64))));
    const u: User = { sub: p.sub, name: p.name, email: p.email, picture: p.picture, exp: Math.floor(Date.now() / 1000) + 7 * 86400 };
    localStorage.setItem(KEY, JSON.stringify(u));
    this.user.set(u);
    this.router.navigateByUrl('/');
  }
  logout() {
    try { google.accounts.id.disableAutoSelect(); } catch {}
    localStorage.removeItem(KEY); this.user.set(null); this.router.navigateByUrl('/login');
  }
}
export const authGuard: CanActivateFn = () => inject(Auth).user() ? true : inject(Router).parseUrl('/login');
