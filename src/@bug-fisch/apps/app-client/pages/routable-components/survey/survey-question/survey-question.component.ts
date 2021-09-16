import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.scss']
})
export class SurveyQuestionComponent implements OnInit{

  public kapitelName = ''

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.kapitelName = this.dataService.getDataBinding('Data.kapitel').name;
    this.dataService.getObservible('kapitel').subscribe(k => {
      this.kapitelName = this.dataService.getDataBinding('Data.kapitel').name;
    })
  }
}
