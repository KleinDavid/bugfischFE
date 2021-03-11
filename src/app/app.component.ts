import { Component } from '@angular/core';
import { WebsocketService } from 'src/@bug-fisch/services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GeoQuitzFE';

  constructor(private websocketService: WebsocketService) {
  }
}
