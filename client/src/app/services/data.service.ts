import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Problem } from '../models/problem.model';

@Injectable()
export class DataService {

  private _problemsSource = new BehaviorSubject<Problem[]>([]);
  problemsUrl: string = 'api/v1/problems';

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.http.get(this.problemsUrl).toPromise()
      .then((res: any) => {
        //output the list of problems obtained from restAPI call into the stream _problemSource
        this._problemsSource.next(res);
      }).catch(this.handleError);
    return this._problemsSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`${this.problemsUrl}/${id}`).toPromise()
      .then((res: any) => res).catch(this.handleError);
  }

  addProblem(prob: Problem) {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(this.problemsUrl, prob, options).toPromise()
      .then((res:any) => {
        this.getProblems();
        return res;
      }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred: ', error);
    return Promise.reject(error.body || error);
  }

}
