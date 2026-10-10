import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { Item } from './store.service';

export type CardPrint = Pick<Item, 'cardId' | 'name' | 'set' | 'setName' | 'cn' | 'rarity' | 'type' | 'colors' | 'img' | 'oracle' | 'mana' | 'artist' | 'price' | 'priceFoil'>;

/** Card data provider (Scryfall). Replace this class to support another provider. */
@Injectable({ providedIn: 'root' })
export class Scryfall {
  private http = inject(HttpClient);
  search(q: string) {
    return this.http.get<any>('https://api.scryfall.com/cards/search', { params: { q, unique: 'prints', order: 'released' } }).pipe(
      map(r => (r.data as any[]).slice(0, 40).map(c => this.map(c))), catchError(() => of([] as CardPrint[])));
  }
  private map(c: any): CardPrint {
    const f = c.card_faces?.[0];
    return {
      cardId: c.id, name: c.name, set: c.set.toUpperCase(), setName: c.set_name, cn: c.collector_number, rarity: c.rarity,
      type: c.type_line, colors: c.colors ?? f?.colors ?? [], mana: c.mana_cost ?? f?.mana_cost ?? '', artist: c.artist ?? '',
      oracle: c.oracle_text ?? f?.oracle_text ?? '',
      img: c.image_uris?.normal ?? f?.image_uris?.normal ?? '',
      price: +(c.prices?.eur ?? c.prices?.usd ?? 0), priceFoil: +(c.prices?.eur_foil ?? c.prices?.usd_foil ?? 0),
    };
  }
}
