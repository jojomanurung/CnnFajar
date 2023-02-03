import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink2';
import { ShellService } from '../services/shell.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss'],
})
export class DatasetComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  activeLink: string;

  constructor(private shellService: ShellService) {}

  ngOnInit(): void {
    this.observeLinks();
  }

  observeLinks() {
    this.subs.sink = this.shellService.currentUrl.subscribe((resp) => {
      this.activeLink = resp;
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
