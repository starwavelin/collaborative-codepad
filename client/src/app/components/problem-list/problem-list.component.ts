import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[];
  subscriptionProblems: Subscription;

  // DI: inject dataService into constructor
  // private means this service only available for this component
  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    // init problem list
    this.getProblems();
  }

  ngOnDestroy() {
    this.subscriptionProblems.unsubscribe();
  }

  getProblems() {
    this.subscriptionProblems = this.dataService.getProblems().subscribe(problems => this.problems = problems);
  }

}
