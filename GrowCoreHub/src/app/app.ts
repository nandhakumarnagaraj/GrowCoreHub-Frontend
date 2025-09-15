import { Component } from '@angular/core';
import { AppRoutingModule } from "./app.routes";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [AppRoutingModule]
})
export class AppComponent {
  title = 'GrowCoreHub';
}