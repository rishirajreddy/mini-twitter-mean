import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tweet } from './models/tweet.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private userMode  = new  Subject<string>();
  public userID = new Subject<string>();
  id!:string;
  public likedUser = new Subject<string>();
  public someId = new Subject<string>();

  readonly url = 'api/v1';

  constructor(private http: HttpClient) {
    this.userID.subscribe({
      next: (v) => {
        this.id = v
      }
    })
   }

  sendData(value:string){
    this.userMode.next(value);
  }
  
  getData() {
    return this.userMode.asObservable();
  }

  registerUser(user: {username:string, email: string, password:string}){
    return this.http.post(`${this.url}/users/register`, user);
  }

  signingInUser(user: {username:string, password:string}){
    return this.http.post(`${this.url}/users/login`, user);
  }

  //get all tweets
  getAllTweets(){
    return this.http.get(`${this.url}/tweets/getAllTweets`);
  }

  //creating tweet
  createTweet(tweet: {content:string}){
    return this.http.post(`${this.url}/tweets/createTweet`, tweet);
  }
  
  // updateTweet
  updateLike(likedBy: {username:any}){
    return this.http.patch(`${this.url}/tweets/likeTweet/${this.id}`, likedBy);
  }

  //adding comments
  addComment(comment: {comments:string}){
    console.log(this.id);
    return this.http.post(`${this.url}/tweets/addComment/${this.id}`, comment);
  }

}
