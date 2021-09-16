import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit{

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    console.log(this.dataService.getDataBinding('Data.kapitel'));
  }
}
