import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink2';
import { ShellService } from '../services/shell.service';
import { MenuItems, Menus } from '../shared/menu-items';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  MENU_ITEMS: MenuItems[] = Menus;

  pageTitle = new BehaviorSubject<string>('');
  private subs = new SubSink();

  constructor(private shellService: ShellService) {}

  ngOnInit(): void {
    this.pageTitleService();
    this.currentPageTitle();
  }

  pageTitleService() {
    this.subs.sink = this.shellService.pageTitle.subscribe((val) => {
      if (val) {
        this.pageTitle.next(val);
      }
    });
  }

  currentPageTitle() {
    this.subs.sink = this.shellService.currentUrl.subscribe((url: string) => {
      if (url) {
        this.MENU_ITEMS.forEach((menu) => {
          if (menu.title && url.indexOf(`/${menu.route}`) === 0) {
            this.pageTitle.next(menu.title);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
