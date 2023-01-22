import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  currentUser!: any;
  adminChat: boolean = false;
  allUsers: any[] = [];
  allMessages: any[] = [];
  message = new FormControl();

  currentActiveChatUser: any;

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit() {
    this.allMessages=[]
    this.firebaseService.getActiveUser.subscribe((d: any) => {
      this.currentUser = d;
      console.log(this.currentUser.uid)
      if (this.currentUser?.role == 'teacher') {
        this.adminChat = true;
      }
      else{
        this.adminChat=false
      }
      this.getAllUsers();
    });
  }

  getAllMessages(docId: any) {
    this.firebaseService.fetchMessages(docId).subscribe((res: any) => {
      this.allMessages = [];
      if (res) {
        this.allMessages = res;
        this.allMessages = this.allMessages.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });
        setTimeout(() => {
          let objDiv: any;
          objDiv = document.getElementById('chatDiv');
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 300);
      }
    });
  
  }

  getAllUsers() {
    this.allUsers=[]
    this.firebaseService.getUsers().subscribe((res: any) => {
      this.allUsers = res;
      if (this.adminChat) {
        this.allUsers = this.allUsers.filter(
          (item) => item?.uid != this.currentUser?.uid
        );
        this.initiateChat(this.allUsers[0]);
      } else {
        this.allUsers = this.allUsers.filter((item) => item?.role == 'teacher');
        this.initiateChat(this.allUsers[0]);
        console.log(this.allUsers);
      }
    });
  }

  setCurrentActiveChatUser(user: any) {
    this.initiateChat(user);
  }

  initiateChat(user: any) {
    if (!user) {
      return;
    }
    let combinationId: any;
    if (user.uid > this.currentUser.uid) {
      combinationId = user.uid + this.currentUser.uid;
    } else {
      combinationId = this.currentUser.uid + user.uid;
    }
    if (combinationId) {
      let data: any = {};
      data = {
        uids: [user.uid, this.currentUser.uid],
        id: combinationId,
        timestamp: Timestamp.now(),
      };
      this.firebaseService
        .createChatRoom(combinationId, data)
        .subscribe((res) => {
          this.currentActiveChatUser = user;
          this.getAllMessages(combinationId);
        });
    }
  }

  sendMessage(user: any) {
    let messageData: any = {};
    messageData = {
      content: this.message.value,
      timestamp: Timestamp.now(),
      uid: this.currentUser.uid,
    };
    let combinationId: any;
    if (user.uid > this.currentUser.uid) {
      combinationId = user.uid + this.currentUser.uid;
    } else {
      combinationId = this.currentUser.uid + user.uid;
    }
    this.firebaseService
      .sendMessage(combinationId, messageData)
      .subscribe((res) => {
        this.message.reset();
      });
  }
}
