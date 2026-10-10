import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Auth } from './auth.service';
import { GOOGLE_CLIENT_ID } from './config';

@Component({
  selector: 'app-login', standalone: true, host: { class: 'page' },
  template: `<div class="login glass"><div class="float">🃏</div><h1>MTG<span class="grad">Vault</span></h1>
    <p class="muted">Scan, value and organize your Magic: The Gathering collection.<br>Sign in to open your private vault.</p>
    <div #btn class="gbtn"></div>
    @if (missing) { <p class="warn">⚠ Set your Google Client ID in <code>src/app/config.ts</code></p> }
    <div class="orbit"><i>🔥</i><i>💧</i><i>🌿</i><i>⚡</i><i>💀</i></div></div>`,
})
export class LoginComponent implements AfterViewInit {
  private auth = inject(Auth);
  missing = GOOGLE_CLIENT_ID.startsWith('YOUR_');
  @ViewChild('btn') btn!: ElementRef<HTMLElement>;
  ngAfterViewInit() { this.auth.renderButton(this.btn.nativeElement); }
}
