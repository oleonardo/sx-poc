import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Customer, getRandCustomer } from '../models/customer.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  private readonly service = inject(DatabaseService);
  private readonly http = inject(HttpClient);

  private updateDoc(): void {
    this.service.get('000368d8-d7df-412a-9fb8-6c451c82a7cc').subscribe({
      next: (document) => {
        document.name = 'Nome atualizado';
        this.service.update(document).subscribe({
          next: (response) => {
            console.log('Document updated!', JSON.stringify(response));
          },
          error: (error) =>
            console.error('Error updating document', JSON.stringify(error)),
        });
      },
      error: () => {
        // if (error.status === 404) {
        //   this.doc = { _id: 'number', number: 0 };
        //   this.service.update(this.doc).subscribe({
        //     next: (response) => {
        //       console.log('Number document created!', JSON.stringify(response));
        //     },
        //     error: (error) =>
        //       console.error(
        //         'Error creating number document',
        //         JSON.stringify(error)
        //       ),
        //   });
        // }
      },
    });
  }

  public ngOnInit(): void {
    this.updateDoc();
  }

  private loadImageAsBlob() {
    const imagePath = 'assets/logo.png';

    return this.http.get(imagePath, { responseType: 'blob' });
  }

  public generate(): void {
    const docs: Customer[] = [];
    this.loadImageAsBlob().subscribe({
      next: (blob: Blob) => {
        for (let i = 0; i < 1000; i++) {
          const customer = getRandCustomer();
          customer._attachments = {
            'logo.png': {
              content_type: 'image/png',
              data: blob,
            },
          };
          docs.push(customer);
        }
        this.service.bulkDocs(docs).subscribe({
          next: (response) => {
            console.log('Bulk docs response', JSON.stringify(response));
          },
          error: (error) => {
            console.error('Bulk docs error', JSON.stringify(error));
          },
        });
      },
    });
  }

  public sync(): void {
    const syncHandler = this.service.sync();

    syncHandler
      .on('change', (change: PouchDB.Replication.ReplicationResult<{}>) => {
        console.log('Pull change', JSON.stringify(change));
      })
      .on('denied', (error) => {
        console.error('Sync denied', JSON.stringify(error));
      })
      .on('error', (error) => {
        console.error('Sync error', JSON.stringify(error));
      })
      .on('complete', () => {
        // this.updateDoc();
      });
  }

  public pull(): void {
    const pullHandler = this.service.pull();

    pullHandler
      .on('change', (change: PouchDB.Replication.ReplicationResult<{}>) => {
        console.log('Pull change', JSON.stringify(change));
      })
      .on('denied', (error) => {
        console.error('Pull denied', JSON.stringify(error));
      })
      .on('error', (error) => {
        console.error('Pull error', JSON.stringify(error));
      })
      .on('complete', () => {
        // this.updateDoc();
      });
  }
}
