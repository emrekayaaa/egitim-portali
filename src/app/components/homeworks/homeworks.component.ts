import { FormGroup, FormControl } from '@angular/forms';
import { Homework } from './../../models/homwork';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { FirebaseService } from './../../services/firebase.service';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-homeworks',
  templateUrl: './homeworks.component.html',
  styleUrls: ['./homeworks.component.scss']
})
export class HomeworksComponent {

  constructor(
    private firebaseService: FirebaseService,
    private toast: HotToastService,
    private route: ActivatedRoute
  ) { }

  homeworks!: Homework[];
  homework?: Homework;


  modal!: Modal;
  modalHead: string = '';

  formGp: FormGroup = new FormGroup({
    uid: new FormControl(),
    displayName: new FormControl(),
    lessonId: new FormControl(),
    detail: new FormControl(),
  });

  ngOnInit() {
    this.list();
  }

  // Index
  list() {
    this.firebaseService.fetchHomeworks().subscribe((homeworks: Homework[]) => {
      this.homeworks = homeworks;
    });
  }

  // Add
  add(el: HTMLElement) {
    this.modalHead = 'Edit Lesson';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Edit
  edit(input: Homework, el: HTMLElement) {
    this.formGp.patchValue(input);
    this.modalHead = 'Edit Homework';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Create or Edit Homework
  save() {
    const form: Homework = this.formGp.value;
    if (!form.uid) {
      return this.firebaseService.createHomework(form).subscribe(() => {
        this.toast.success('Homework created');
        this.modal.hide();
        this.formGp.reset();
      });
    }
    return this.update(form);
  }

  update(input: Homework) {
    return this.firebaseService.updateHomework(input).subscribe(() => {
      this.toast.success('Lesson updated');
      this.modal.hide();
      this.formGp.reset();
    });
  }

  destroy(input: Homework, el: HTMLElement) {
    this.homework = input;
    this.modalHead = 'Delete Homework';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  // Delete Lesson
  delete() {
    if (this.homework) {
      return this.firebaseService
        .deleteHomework(this.homework.uid)
        .subscribe(() => {
          this.toast.success('Homework deleted');
          this.modal.hide();
          this.formGp.reset();
        });
    } else {
      this.toast.error('Homework not found');
      this.formGp.reset();
      return this.modal.hide();
    }
  }


  // Get Assigned Teacher
}

