import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService,) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  lisConfig() {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/course/config";
    this.isLoadingSubject.next(true);
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  registerCourses(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS +"/course";
    return this.http.post(URL, data, { headers: headers }).pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
  updateCourses(data: any, course_id: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ Authorization: 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/course/" + course_id;
    return this.http.post(URL, data, { headers: headers }).pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteCourses(course_id: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/course/" + course_id;
    return this.http.delete(URL, { headers: headers }).pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
