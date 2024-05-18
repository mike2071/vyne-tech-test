import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, ListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @Input() transactions = [
    {
      id: 'Dummy ID',
      amount: 0.0,
      currency: 'GBP',
      description: 'Your component is not receiving any data',
      status: 'CREATED',
      createdAt: '2021-07-01T12:27:07.965',
    },
  ];
}
