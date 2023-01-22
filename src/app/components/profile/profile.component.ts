import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(private firebaseService: FirebaseService) {}

  auth = this.firebaseService.getActiveUser;
  
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    email: new FormControl(),
    displayName: new FormControl(),
    role: new FormControl(),
  });

  ngOnInit() {
    this.firebaseService.getActiveUser.subscribe((user) => {
      this.frm.patchValue({ ...user });
    });
  }

  update() {}
}
