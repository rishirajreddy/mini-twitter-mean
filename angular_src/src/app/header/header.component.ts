import { Component,  Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  loggedIn!: boolean;

  constructor(public dialog: MatDialog, 
    public service: AppService, 
    private router:Router
    , private _snackBar: MatSnackBar
    ) { }

  ngOnInit(){
    this.service.getAllTweets().subscribe({
      next:(v:any) => {
        if(v.msg !== 'Invalid Token' || localStorage.length !== 0){
          this.loggedIn = true;
          console.log(this.loggedIn);
          console.log("User logged in");
        }else {
          this.loggedIn = false;
          console.log(this.loggedIn);
          console.log("User LoggedOut");
        }
      }
    })
  }
  
  signOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/']);
    this._snackBar.open("Logged out","", {
      duration: 2*1000,
      verticalPosition: 'top'
    })
  }

  openDialog(mode:string):void {
    this.service.sendData(mode);
    const dialogRef = this.dialog.open(FormInputComponent, {
      width: '280px',
      data: mode
    });
  }

}

@Component({
  selector: 'app-form-input',
  templateUrl: './modals/formInput.component.html',
  styleUrls: ['./header.component.css']
})

export class FormInputComponent implements OnInit{

  token!:string;

  constructor(
    public dialogRef:MatDialogRef<FormInputComponent>,
    public service:AppService,
    private route:Router,
    @Inject (MAT_DIALOG_DATA) public mode:string,
    private _snackBar:MatSnackBar
  ){}

  ngOnInit() {
      this.service.getData().subscribe({
        next:(v) => {
          this.mode = v;
        }
      })
  }

  
  //authorizing user
  onSubmit(value:NgForm){
    if(this.mode === 'signup'){
      this.service.registerUser({
        username: value.value.username,
        email: value.value.email,
        password:value.value.password
      }).subscribe({
        next: (v:any) => {
          if(v.msg === "User registered successfully!!"){
            localStorage.setItem('token', v.data.token);
            localStorage.setItem('username', v.data.username);
          }
          console.log(v)
          this.route.navigate(['/tweets']);  
          this._snackBar.open(`Registered as ${v.data.username}`,"", {
            duration: 2*1000,
            verticalPosition: 'top',
            panelClass: "auth"
          })
        }
      })
      this.onNoClick();
    }
    else {
      this.service.signingInUser({
        username: value.value.username,
        password:value.value.password
      }).subscribe({
        next: (v:any) => {
          if(v.status === 'User found!!'){
            localStorage.setItem('token', v.token);
            localStorage.setItem('username', v.username);
          }
          console.log(v)
          this.route.navigate(['/tweets'])
          this._snackBar.open(`Logged in as ${v.username}`,"", {
            duration: 2*1000,
            verticalPosition: 'top',
            panelClass: "auth"
          })
        }
      })
      this.onNoClick();
    }
  }

  



  onNoClick():void {
    this.dialogRef.close();
  }
}