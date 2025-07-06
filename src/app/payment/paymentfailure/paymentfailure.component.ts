import { Component } from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-paymentfailure',
  imports: [RouterLink],
  templateUrl: './paymentfailure.component.html',
  styleUrl: './paymentfailure.component.css'
})
export class PaymentfailureComponent {


  bookingReference: string = '';
  amount: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.bookingReference = this.route.snapshot.paramMap.get('bookingReference') || '';
    // @ts-ignore
    this.amount = Number(this.route.snapshot.paramMap.get('amount') || '');
  }
}
