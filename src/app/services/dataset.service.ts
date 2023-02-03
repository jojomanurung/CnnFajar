import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient) { }

  getDataset(filter, from): Observable<any> {
    const url = 'assets/json/' + from + '.json';

    return this.http.get(url, {responseType: "json"}).pipe(map(dataset => dataset[filter]))
  }
}
