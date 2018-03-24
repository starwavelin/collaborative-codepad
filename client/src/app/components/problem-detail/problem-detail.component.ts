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
      When params change, the model "this.problem" will be updated, based
      on the resolve of the promise this.dataService.getProblem(+params.id).
    */
    this.route.params.subscribe(params => 
      this.dataService.getProblem(+params.id).then(prob => this.problem = prob) 
        // +params.id is the same as +params['id']
        // this line returns a ZoneAwarePromise whose status and value will be evaluated right after promise resolves
    );
  }

}
