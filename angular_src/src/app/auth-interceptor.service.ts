import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})  
export class AuthInterceptorService implements HttpInterceptor{
  
  constructor(private route:Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log("Inteception in progress!!");
        const token = localStorage.getItem('token');
        req = req.clone({headers: req.headers.set('Authorization','Bearer '+token)});
        req = req.clone({headers:req.headers.set('Content-Type', 'application/json')});
        req = req.clone({headers: req.headers.set('Accept', 'application/json')});

        return next.handle(req)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if(error && error.status === 401){
              console.log('Not Authorized');
              console.log('Logged Out');
              this.route.navigate(['/'])
            }
            const err = error.error.message || error.statusText;
            return throwError(error);
          })
        )
    }
}
