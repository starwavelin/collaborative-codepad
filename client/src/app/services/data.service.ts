import { Injectable } from '@angular/core';

import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock-problems'; // use const data as db for now

@Injectable()
export class DataService {

  // supply problems from data stored in mock-problems.ts
  problems: Problem[] = PROBLEMS;

  constructor() { }

  getProblems(): Problem[] {
    return this.problems;
  }

  getProblem(id: number): Problem {
    return this.problems.find((prob) => prob.id === id);
  }

}
