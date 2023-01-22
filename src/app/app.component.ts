import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public firebaseService: FirebaseService) { }

  title = 'Project';



  ngOnInit() {

  }


  logOut() {
    this.firebaseService.logout();
    localStorage.clear();
    location.href = '/';
  }
}
