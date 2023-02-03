import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItems } from 'src/app/shared/menu-items';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
  @Input() item!: MenuItems;

  constructor(public router: Router) {}

  ngOnInit(): void {}
}
