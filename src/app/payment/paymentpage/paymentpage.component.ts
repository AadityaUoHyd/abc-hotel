import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-paymentpage',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paymentpage.component.html',
  styleUrls: ['./paymentpage.component.css']
})

export class PaymentpageComponent {
  error: string | null = null;
  processing: boolean = false;

  bookingReference: string | null = null;
  amount: number | null = null;

  // Razorpay integration
  orderId: string | null = null;
  razorpayKey: string | null = null;

  constructor(
      private apiService: ApiService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  async ngOnInit() {
    this.bookingReference = this.route.snapshot.paramMap.get('bookingReference');
    this.amount = parseFloat(this.route.snapshot.paramMap.get('amount') || '0');

    if (this.bookingReference && this.amount) {
      this.apiService.createRazorpayOrder({
        bookingReference: this.bookingReference,
        amount: this.amount
      }).subscribe({
        next: (res: any) => {
          this.orderId = res.orderId;
          this.razorpayKey = res.key;
        },
        error: (err: any) => {
          this.showError(err?.error?.message || 'Failed to initialize payment');
        }
      });
    }
  }



  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  handlePayWithRazorpay() {
    if (!this.bookingReference || !this.amount || !this.razorpayKey || !this.orderId) {
      this.showError('Payment initialization failed');
      return;
    }
    this.processing = true;

    const options = {
      key: this.razorpayKey,
      amount: this.amount * 100, // in paise
      currency: 'INR',
      name: 'ABC Hotel',
      description: 'Room Booking Payment',
      order_id: this.orderId,
      handler: (response: any) => {
        // Payment success: verify with backend
        const paymentData = {
          bookingReference: this.bookingReference,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount: this.amount,
          success: true,
          failureReason: ''
        };
        this.apiService.verifyRazorpayPayment(paymentData).subscribe({
          next: () => {
            this.processing = false;
            this.router.navigate([`/payment-success/${this.bookingReference}`]);
          },
          error: (err: any) => {
            this.processing = false;
            this.showError(err?.error?.message || 'Payment verification failed');
            this.router.navigate([`/payment-failure/${this.bookingReference}`]);
          }
        });
      },
      prefill: {},
      notes: { bookingReference: this.bookingReference },
      theme: { color: '#007F86' }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      // Payment failed: notify backend
      const paymentData = {
        bookingReference: this.bookingReference,
        razorpayPaymentId: response.error.metadata.payment_id,
        razorpayOrderId: response.error.metadata.order_id,
        razorpaySignature: '',
        amount: this.amount,
        success: false,
        failureReason: response.error.description
      };
      this.apiService.verifyRazorpayPayment(paymentData).subscribe({
        next: () => {
          this.processing = false;
          this.router.navigate([`/payment-failure/${this.bookingReference}`]);
        },
        error: (err: any) => {
          this.processing = false;
          this.showError(err?.error?.message || 'Payment verification failed');
          this.router.navigate([`/payment-failure/${this.bookingReference}`]);
        }
      });
    });
    rzp.open();
  }  
}