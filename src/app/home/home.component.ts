import { Component } from '@angular/core';
import { RoomsearchComponent } from '../roomsearch/roomsearch.component';
import { RoomresultComponent } from '../roomresult/roomresult.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RoomsearchComponent, RoomresultComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchResults: any[] = [];

  handleSearchResult(results: any[]) {
    this.searchResults = results;
  }
}