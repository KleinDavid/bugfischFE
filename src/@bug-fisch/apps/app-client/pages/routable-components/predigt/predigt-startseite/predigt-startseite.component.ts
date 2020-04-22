import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-predigt-startseite',
  templateUrl: './predigt-startseite.component.html',
  styleUrls: ['./predigt-startseite.component.scss']
})
export class PredigtStartseiteComponent implements OnInit {

  password: string;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.dataService.data = [];
  }
}
