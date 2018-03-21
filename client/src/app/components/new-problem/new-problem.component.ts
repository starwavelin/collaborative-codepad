import { Component, OnInit } from '@angular/core';

import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['Easy', 'Medium', 'Hard', 'Super'];

  constructor(private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
  }

  addProblem() {
    this.dataService.addProblem(this.newProblem);

    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
