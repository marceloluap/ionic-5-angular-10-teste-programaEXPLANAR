import { Component } from '@angular/core';
import { SmartToastService } from '../services/smart-toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  count: number = 0;

  constructor(private smartToasts: SmartToastService) {}

  buttonClick() {
    this.count = this.count + 1;
    this.smartToasts.show(
      'Link gerado com sucesso ' + this.getRandomInt(1, 100000000)
    );
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
