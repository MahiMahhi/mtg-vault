import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CardPrint, Scryfall } from './scryfall.service';
import { CONDITIONS, Store } from './store.service';

@Component({
  selector: 'app-add', standalone: true, imports: [ReactiveFormsModule], host: { class: 'page' },
  template: `
  <h1>Add a <span class="grad">Card</span></h1>
  <div class="filters glass"><input #s placeholder="Search Scryfall… e.g. Lightning Bolt" (keyup.enter)="go(s.value)"><button class="btn" (click)="go(s.value)">Search</button></div>
  @if (loading()) { <div class="spinner"></div> }
  @if (searched() && !loading() && !results().length) { <p class="muted">No cards found.</p> }
  @if (!picked()) {
    <div class="grid">@for (c of results(); track c.cardId; let n = $index) {
      <div class="card tilt" [style.--i]="n" (click)="pick(c)"><img [src]="c.img" [alt]="c.name" loading="lazy"><div class="cap"><b>{{ c.name }}</b><small>{{ c.setName }} · €{{ c.price.toFixed(2) }}</small></div></div>}</div>
  } @else {
    <div class="modal" (click)="picked.set(null)"><form class="sheet glass" [formGroup]="f" (ngSubmit)="save()" (click)="$event.stopPropagation()">
      <img [src]="picked()!.img" [alt]="picked()!.name">
      <div class="info"><h2>{{ picked()!.name }}</h2><p class="muted">{{ picked()!.setName }} · #{{ picked()!.cn }} · €{{ picked()!.price.toFixed(2) }}</p>
        <div class="fgrid">
          <label>Quantity<input type="number" min="1" formControlName="qty"></label>
          <label>Condition<select formControlName="condition">@for (c of conds; track c) {<option>{{ c }}</option>}</select></label>
          <label>Language<input formControlName="lang"></label>
          <label>Purchase price<input type="number" step="0.01" formControlName="paid"></label>
          <label>Purchase date<input type="date" formControlName="date"></label>
          <label class="chk"><input type="checkbox" formControlName="foil"> Foil ✨</label>
        </div>
        <label>Notes<input formControlName="notes"></label>
        <div class="qtyrow"><button class="btn" type="submit">Add to Collection</button><button class="btn ghost" type="button" (click)="picked.set(null)">Cancel</button></div>
      </div></form></div>
  }
  @if (toast()) { <div class="toast">✔ {{ toast() }}</div> }`,
})
export class AddComponent {
  private sf = inject(Scryfall); private store = inject(Store); private fb = inject(FormBuilder);
  conds = CONDITIONS;
  results = signal<CardPrint[]>([]); picked = signal<CardPrint | null>(null); loading = signal(false); searched = signal(false); toast = signal('');
  f = this.fb.nonNullable.group({ qty: 1, condition: 'NM', lang: 'EN', paid: null as number | null, date: '', foil: false, notes: '' });
  go(q: string) {
    if (!q.trim()) return;
    this.loading.set(true); this.searched.set(true);
    this.sf.search(q.trim()).subscribe(r => { this.results.set(r); this.loading.set(false); });
  }
  pick(c: CardPrint) { this.picked.set(c); }
  save() {
    const c = this.picked(); if (!c) return;
    const v = this.f.getRawValue();
    this.store.add({ ...c, ...v, qty: Math.max(1, +v.qty || 1) });
    this.toast.set(`${c.name} added`); setTimeout(() => this.toast.set(''), 2200);
    this.picked.set(null); this.f.reset({ qty: 1, condition: 'NM', lang: 'EN', paid: null, date: '', foil: false, notes: '' });
  }
}
