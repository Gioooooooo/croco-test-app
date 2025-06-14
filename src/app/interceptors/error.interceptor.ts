import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'დაფიქსირდა შეცდომა';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `დაფიქსირდა შეცდომა: ${error.error.message}`;
      } else {
        errorMessage = `დაფიქსირდა შეცდომა სერვერზე: ${error.status}, error message is: ${error.message}`;
      }
      console.error(errorMessage);
      alert(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
