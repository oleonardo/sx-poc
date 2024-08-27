import { Component, inject, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  RefresherCustomEvent,
} from '@ionic/angular';
import { Customer } from '../models/customer.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public items: Customer[] = [];
  public totalRows: number = 0;

  private limit: number = 0;
  private readonly service = inject(DatabaseService);

  private loadItems(
    ev?: InfiniteScrollCustomEvent | RefresherCustomEvent
  ): void {
    if (this.items.length >= this.totalRows) {
      return;
    }

    this.limit += 30;

    this.service.db
      .allDocs<Customer>({
        include_docs: true,
        limit: this.limit,
      })
      .then((response) => {
        this.items = response.rows.map((row) => row.doc!);
      })
      .finally(() => {
        ev?.target.complete();
      });
  }

  public ngOnInit(): void {
    this.service.db.allDocs({ limit: 0 }).then((response) => {
      this.totalRows = response.total_rows;
      this.loadItems();
    });
  }

  public onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.loadItems(ev);
  }

  public handleRefresh(ev: RefresherCustomEvent) {
    this.limit = 0;
    this.items = [];
    this.loadItems(ev);
  }
}
