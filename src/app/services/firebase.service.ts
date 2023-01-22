import { Homework } from './../models/homwork';
import { Injectable } from '@angular/core';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import * as bcrypt from 'bcryptjs';

// Firebase
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { addDoc, CollectionReference, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
  deleteUser,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Lesson } from '../models/lesson';
import { HotToastService } from '@ngneat/hot-toast';
// Models

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  // KayitOl(email: any, password: any) {
  //   throw new Error('Method not implemented.');
  // }
  // UyeEkle(arg0: { uid: any; email: any; displayName: any }): any {
  //   throw new Error('Method not implemented.');
  // }
  user = authState(this.auth);

  constructor(
    public auth: Auth,
    public storage: Storage,
    public firestore: Firestore,
    private toast: HotToastService
  ) {

  }

  // Register
  register(input: any) {
    return from(
      createUserWithEmailAndPassword(this.auth, input.email, input.password)
    );
  }

  // Login
  login(input: any) {
    return from(
      signInWithEmailAndPassword(this.auth, input.email, input.password)
    );
  }

  // Logout
  logout() {
    return from(this.auth.signOut());
  }

  // Get Current User
  getAuth() {
    return this.auth.currentUser;
  }

  get getActiveUser() {
    return this.user.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = docData(
          doc(this.firestore, 'Users', user!.uid)
        ) as Observable<User>;
        return ref;
      })
    );
  }
  kayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  // Get User By ID
  getUserById(uid: string) {
    return docData(doc(this.firestore, 'Users', uid)) as Observable<User>;
  }
  UyeEkle(uye: any) {
    console.log(uye);
    var ref = doc(this.firestore, 'Users', uye.uid);
    return from(setDoc(ref, uye));
  }
  // Create User
  createUser(input: any) {
    console.log(input);

    const hashed = bcrypt.hashSync(input.password, 10);
    return from(
      createUserWithEmailAndPassword(this.auth, input.email, input.password)
    ).pipe((user: any) => {
      return from(
        addDoc(collection(this.firestore, 'Users'), {
          uid: user.uid,
          displayName: input.displayName,
          email: input.email,
          password: hashed,
          role: input.role,
        })
      ).pipe(() => {
        return from(
          setDoc(doc(this.firestore, 'lessons', input.lessons), {
            teacherId: user.uid,
          })
        );
      });
    });
  }

  // Get Users
  getUsers(): Observable<User[]> {
    return collectionData(collection(this.firestore, 'Users'), {
      idField: 'uid',
    }) as Observable<User[]>;
  }

  // Delete User
  deleteUser(uid: string) {
    return from(deleteUser(this.auth.currentUser!)).pipe(() => {
      return from(deleteDoc(doc(this.firestore, 'Users', uid)));
    });
  }

  /****** Lessons ******/
  // Fetch ALl
  fetchLessons(): Observable<Lesson[]> {
    return collectionData(collection(this.firestore, 'lessons'), {
      idField: 'uid',
    }) as Observable<Lesson[]>;
  }

  // Create lesson
  createLesson(input: Lesson) {
    return from(addDoc(collection(this.firestore, 'lessons'), input));
  }

  // Update lesson
  updateLesson(input: Lesson) {
    return from(
      updateDoc(doc(this.firestore, 'lessons', input.uid), input as any)
    );
  }

  // Delete lesson
  deleteLesson(uid: string) {
    return from(deleteDoc(doc(this.firestore, 'lessons', uid)));
  }

  /****** homeworks ******/
  // Fetch homework
  fetchHomeworks(): Observable<Homework[]> {
    return collectionData(collection(this.firestore, 'homeworks'), {
      idField: 'uid',
    }) as Observable<Homework[]>;
  }

  // Create homework
  createHomework(input: Homework) {
    return from(addDoc(collection(this.firestore, 'homeworks'), input));
  }

  // Update homework
  updateHomework(input: Homework) {
    return from(
      updateDoc(doc(this.firestore, 'homeworks', input.uid), input as any)
    );
  }

  // Delete homework
  deleteHomework(uid: string) {
    return from(deleteDoc(doc(this.firestore, 'homeworks', uid)));
  }

    // Create chat
    createChatRoom(id:any,chatData:any) {
      return from(setDoc(doc(this.firestore, 'chats',id), chatData,));
    }

    sendMessage(id:any,messageData:any) {
      return from(addDoc(collection(this.firestore, `chats/${id}/messages`), messageData));
    }

    fetchMessages(id:any): Observable<any[]> {
      return collectionData(collection(this.firestore, `chats/${id}/messages`), {
        idField: 'id',
      }) as Observable<any[]>;

    }


        // fetchMessages(id:any): Observable<any[]> {
    //   return this.db
    //         .collection(`chats/${id}/messages`, (ref) => ref.orderBy("timestamp", "asc"))
    //         .snapshotChanges()
    //         .pipe(
    //             map((actions) =>
    //                 actions.map((a) => {
    //                     const data = a.payload.doc.data() as any;
    //                     const id = a.payload.doc.id;
    //                     return { id, ...data };
    //                 })
    //             )
    //         );

    // }



}
