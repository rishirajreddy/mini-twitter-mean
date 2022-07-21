import { Component,Inject,Injectable,OnDestroy,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { Tweet } from '../models/tweet.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-tweet',
  templateUrl: './new-tweet.component.html',
  styleUrls: ['./new-tweet.component.css']
})

//using this component as as service
//for the commentwindow comp
@Injectable({
  providedIn: 'root'
})

export class NewTweetComponent implements OnInit {
  
  longText = `Hey there this is my first tweet!`;
  isCommented:boolean = false;
  tweetsArr:Tweet[] = [];
  username!:string | null;
  user!:string;
  showLike = false;
  userInCommentsExists = false;
  closeResult = '';
  panelOpenState = false;
  isLoading = false;    //for loading spinner
  isLikedClicked = false; //for isLiked post

  constructor(
    private service:AppService, 
    private router:Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar
    // private comService:CommentWindowComponent
    ) { }
  
  ngOnInit(){
    this.onGettingTweets();
    this.user = localStorage.getItem('username')!;
    this.username = localStorage.getItem('username');
  }


  onSubmitTweet(value:NgForm){
    if(value.value.tweet.trim().length === 0){
      this.openSnackBar("Please enter some shit","","error")
      return;
    }
    console.log(value.value.tweet);
    this.service.createTweet({content: value.value.tweet}).subscribe({
      next: (v) => {
        console.log(v);
        this.onGettingTweets();        
      }      
    })
  }
  
  onGettingTweets(){
    if(this.isLikedClicked){
      this.isLoading = false;
    }else {
      this.isLoading = true;
    }
    return this.service.getAllTweets().subscribe({
      next:(v:any) => {
        this.tweetsArr = v;
        if(v.msg === 'Invalid Token'){
          this.router.navigate(['/']);
        }else {
          console.log("Printing new tweet comp arr")
          console.log(this.tweetsArr);
          this.isLoading = false;
        }
      },
      error: (err) => console.log(err)
    })
  }
  
  onLiked(id:string){
    this.service.userID.next(id);
    this.isLikedClicked = true;
    this.service.updateLike({username: this.username}).subscribe({
      next:(v:any) => {
        console.log(v)
        if(v.msg === 'Connot like your own post'){
          this.openSnackBar("Please don't like your own shit!! 💩","cancel","shit-tweet")
        }
        else if(v.msg === 'Tweet liked'){
          this.openSnackBar("Tweet liked 👍","cancel",'like-tweet')
        }
        else {
          this.openSnackBar('Tweet Disliked 👎','cancel','dislike-tweet')

        }
        this.onGettingTweets();
      }
    });
  }

  onComment(id:string){
    this.service.userID.next(id);
    // this.commentInput = false;
  }
  
  openCommentBox(value:NgForm){
    this.service.addComment({comments: value.value.comment}).subscribe({
      next: (v) => {
        console.log(v);
        this.onGettingTweets();
        this.modalService.dismissAll();
        this.openSnackBar("Commented Posted 😎",'cancel', 'comment-tweet')
      }
    })
  }
  openSnackBar(message:string, action:string,snackClass:string) {
    this._snackBar.open(message, action, {
      duration: 2*1000,
      panelClass: snackClass
    });
  }

  open(content:any, id:string) {
    this.service.userID.next(id);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered:true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openPanel(index:number){
    this.tweetsArr[index].expansion = true;
  }
  
  closePanel(index:number){
    this.tweetsArr[index].expansion = false;
  }

   


  ///hovering over likes to display usernames
}


//comment window
// @Component({
//   selector: "app-comment-window",
//   templateUrl: '../header/modals/comment-window.component.html',
//   styleUrls: ['./new-tweet.component.css']
// })

// export class CommentWindowComponent implements OnInit{
 
//   constructor(
//     public dialogRef:MatDialogRef<CommentWindowComponent>,
//     @Inject (MAT_DIALOG_DATA) public mode:string,
//     private service:AppService,
//     private route: Router,
//     private tweetsService:NewTweetComponent
//   ){}

//     mySubscription!:Subscription;

//   ngOnInit() {
//     // this.onGettingTweets();    
//   }

//   onComment(value:NgForm){
//     this.service.addComment({comments:value.value.comment}).subscribe({
//       next: (v) => {
//         console.log(v);
//         this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//           this.route.navigate(['/tweets'])
//         })
//       },
//       error: (e) => console.log(e)
//     })
//     this.onNoClick();
//   }


//   onNoClick():void {
//     this.dialogRef.close();
//   }

// }