import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {

  /* the instance var of this class, which will be binded to template */
  problem: Problem;

  constructor(private dataService: DataService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    /* subscribe: listen to the params change. 
      When params change, the model "this.problem" will be updated.
    */
    this.route.params.subscribe(params => {
      this.problem = this.dataService.getProblem(+params.id); //same as +params['id']
    });
  }

}
