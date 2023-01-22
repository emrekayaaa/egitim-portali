import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import { User } from 'src/app/models/user';
import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as bootstrap from 'bootstrap';
import { IRole } from 'src/app/models/role';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent {
  formGP: any;
  displayyName!: any;

  rolee!: any;
  constructor(
    private firebaseService: FirebaseService,
    private toast: HotToastService
  ) {}

  role!: keyof IRole;
  users!: User[];
  user?: User;

  lessons!: any[];

  modal!: Modal;
  modalHead: string = '';

  formGp: FormGroup = new FormGroup({
    uid: new FormControl(),
    displayName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    role: new FormControl(),
    lessons: new FormControl(),
  });

  ngOnInit() {
    // this.setRole();
    this.list();
    this.firebaseService.fetchLessons().subscribe((data: any) => {
      this.lessons = data;
    });
  }

  // setRole() {
  //   this.firebaseService.getActiveUser.subscribe((user: any) => {
  //     this.role = user!.role;
  //   });
  // }

  list() {
    this.firebaseService.getUsers().subscribe((data: any) => {
      this.users = data as User[];
    });
  }

  add(el: HTMLElement) {
    this.modalHead = 'Add Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  edit(input: any, el: HTMLElement) {
    this.modalHead = 'Add Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Create
  save() {
    console.log(this.formGp.value);
    this.displayyName = this.formGp.value.displayName;
    this.rolee = this.formGp.value.role;
    this.firebaseService
      .kayitOl(this.formGp.value.email, this.formGp.value.password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.firebaseService.UyeEkle({
            uid: uid,
            email: this.formGp.value.email,
            displayName: this.displayyName,
            role: this.rolee,
          })
        ),
        this.toast.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {});
    return this.firebaseService.createUser(this.formGp.value);
  }

  destroy(input: User, el: HTMLElement) {
    this.user = input;
    this.modalHead = 'Delete User';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Delete User
  delete() {
    if (this.user) {
      return this.firebaseService.deleteUser(this.user.uid).subscribe(() => {
        this.toast.success('User deleted');
        this.modal.hide();
        this.formGp.reset();
      });
    } else {
      this.toast.error('User not found');
      this.formGp.reset();
      return this.modal.hide();
    }
  }
}
