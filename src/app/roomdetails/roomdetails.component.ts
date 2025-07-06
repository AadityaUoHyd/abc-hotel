import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-roomdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roomdetails.component.html',
  styleUrls: ['./roomdetails.component.css']
})
export class RoomdetailsComponent {
  constructor(
      private apiService: ApiService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  room: any = null;
  roomId: string | null = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalPrice: number = 0;
  totalDaysToStay: number = 0;
  showDatePicker: boolean = false;
  showBookingPreview: boolean = false;
  message: string | null = null;
  error: string | null = null;

  minDate: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (this.roomId) {
      this.fetchRoomDetails(this.roomId);
    }
  }

  fetchRoomDetails(roomId: string): void {
    this.apiService.getRoomById(roomId).subscribe({
      next: (res: any) => {
        this.room = res.room;
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Unable to fetch room details');
      }
    });
  }

  showError(err: string): void {
    console.error('Error:', err);
    this.error = err;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  calculateTotalPrice(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      this.showError('Invalid date selected');
      return 0;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    this.totalDaysToStay = totalDays;
    return this.room?.pricePerNight * totalDays || 0;
  }

  handleConfirmation(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.showError('Please select both check-in and check-out dates');
      return;
    }

    this.totalPrice = this.calculateTotalPrice();
    this.showBookingPreview = true;
  }

  acceptBooking(): void {
    if (!this.room || !this.roomId) {
      this.showError('Room details not available');
      return;
    }

    const formattedCheckInDate = this.checkInDate ? new Date(this.checkInDate).toLocaleDateString('en-CA') : '';
    const formattedCheckOutDate = this.checkOutDate ? new Date(this.checkOutDate).toLocaleDateString('en-CA') : '';

    console.log('Check-in date:', formattedCheckInDate);
    console.log('Check-out date:', formattedCheckOutDate);

    const booking = {
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      roomId: this.roomId
    };

    this.apiService.bookRoom(booking).subscribe({
      next: (res: any) => {
        console.log('Booking response:', res);
        if (res.status === 200 && res.booking) {
          const bookingReference = res.booking.bookingReference;
          const totalPrice = res.booking.totalPrice;
          if (bookingReference && totalPrice) {
            this.message = 'Your booking is successful. An email with booking details and payment link has been sent.';
            this.router.navigate([`/payment/${bookingReference}/${totalPrice}`]);
          } else {
            this.showError('Booking response missing reference or price');
          }
        } else {
          this.showError('Invalid booking response');
        }
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.showError(err?.error?.message || 'Unable to make a booking');
      }
    });
  }

  cancelBookingPreview(): void {
    this.showBookingPreview = false;
  }

  get isLoading(): boolean {
    return !this.room;
  }
}