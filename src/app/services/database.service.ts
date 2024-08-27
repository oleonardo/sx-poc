import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { from } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public readonly db = new PouchDB('customers');

  public bulkDocs(docs: Customer[]) {
    return from(this.db.bulkDocs<Customer>(docs));
  }

  public update(doc: Customer) {
    return from(this.db.put<Customer>(doc));
  }

  public get(docId: string) {
    return from(this.db.get<Customer>(docId, { attachments: true }));
  }

  private getRemoteDB() {
    return new PouchDB('http://10.0.2.2:5984/customers', {
      auth: {
        username: 'admin',
        password: 'pass#123',
      },
      auto_compaction: true,
    });
  }

  public sync() {
    const remoteDb = this.getRemoteDB();
    return this.db.replicate.to(remoteDb);
  }

  public pull() {
    const remoteDb = this.getRemoteDB();
    return this.db.replicate.from(remoteDb);
  }
}
