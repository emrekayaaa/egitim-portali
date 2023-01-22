import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from 'src/app/models/lesson';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent {
  constructor(
    private firebaseService: FirebaseService,
    private toast: HotToastService,
    private route: ActivatedRoute
  ) {}

  lessons!: Lesson[];
  lesson?: Lesson;
  teacher?: User;
  currentUser!: any;

  modal!: Modal;
  modalHead: string = '';

  formGp: FormGroup = new FormGroup({
    uid: new FormControl(),
    name: new FormControl(),
    credit: new FormControl(),
  });

  ngOnInit() {
    this.list();
    this.firebaseService.getActiveUser.subscribe((d: any) => {
      this.currentUser = d?.role;
    });
  }

  // Index
  list() {
    this.firebaseService.fetchLessons().subscribe((lessons: Lesson[]) => {
      this.lessons = lessons;
    });
  }
  // getTeacher(uid: string | User, el: HTMLElement) {
  //   this.modalHead = 'Edit Lesson';
  //   this.modal = new bootstrap.Modal(el);
  //   this.modal.show();
  //   return this.firebaseService.getUserById(uid as string).subscribe((user: any) => {
  //     return (this.teacher = user);
  //   });
  // }

  // handleCloseTeacher() {
  //   console.log('close');
  //   this.teacher = undefined;
  //   this.modal.hide();
  // }

  // Add
  add(el: HTMLElement) {
    this.modalHead = 'Edit Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Edit
  edit(input: Lesson, el: HTMLElement) {
    this.formGp.patchValue(input);
    this.modalHead = 'Edit Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Create or Edit Lesson
  save() {
    const form: Lesson = this.formGp.value;
    if (!form.uid) {
      return this.firebaseService.createLesson(form).subscribe(() => {
        this.toast.success('Lesson created');
        this.modal.hide();
        this.formGp.reset();
      });
    }
    return this.update(form);
  }

  update(input: Lesson) {
    return this.firebaseService.updateLesson(input).subscribe(() => {
      this.toast.success('Lesson updated');
      this.modal.hide();
      this.formGp.reset();
    });
  }

  destroy(input: Lesson, el: HTMLElement) {
    this.lesson = input;
    this.modalHead = 'Delete Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Delete Lesson
  delete() {
    if (this.lesson) {
      return this.firebaseService
        .deleteLesson(this.lesson.uid)
        .subscribe(() => {
          this.toast.success('Lesson deleted');
          this.modal.hide();
          this.formGp.reset();
        });
    } else {
      this.toast.error('Lesson not found');
      this.formGp.reset();
      return this.modal.hide();
    }
  }

  // Get Assigned Teacher
}
