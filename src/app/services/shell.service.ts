import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShellService {
  private currentUrlSubject = new BehaviorSubject<string>('');
  public currentUrl = this.currentUrlSubject.asObservable();

  private pageTitleSubject = new BehaviorSubject<string>('');
  public pageTitle = this.pageTitleSubject.asObservable();

  constructor() {}

  setCurrentUrl(url: string) {
    this.currentUrlSubject.next(url);
  }

  setPageTitle(value: string) {
    if (value) {
      this.pageTitleSubject.next(value);
    }
  }
}
