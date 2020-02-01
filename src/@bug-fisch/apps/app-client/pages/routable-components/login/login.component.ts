import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password: string;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.dataService.data = [];
  }
}
