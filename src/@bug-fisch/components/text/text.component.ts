import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';

@Component({
  selector: 'app-text-component',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, AfterViewInit {

  @Input() dataInputBinding = '';
  @Input() text = '';
  @Input() width = '';
  @Input() textMode = '';
  @Input() icon = '';
  @Input() opasityTime = ''

  inputValue = '';

  timeLeft: number = 60;
  opasity: number = 99;
  interval: any;

  constructor(private actionService: ActionService, private dataService: DataService) {

  }

  ngAfterViewInit(): void {
    if (this.width === '')
      return
    document.getElementById('formField').style.width = this.width + 'px';
  }

  ngOnInit(): void {
    this.dataService.getObservible('SaveSucces').subscribe(() => {
      this.solveBinding();
    });
    this.solveBinding();
  }

  solveBinding(): void {
    let dataValue = this.actionService.getInputValueByBinding(this.dataInputBinding);
    this.inputValue = this.textMode == 'text' && dataValue.length > 0 ? this.text : dataValue;
    if (this.opasityTime.length > 0 && this.inputValue.length > 0) {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timeLeft = parseInt(this.opasityTime);
    this.opasity = 99;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.opasity = 0;
        this.pauseTimer();
      }
      if(this.opasity > 0){
        if(this.opasity > 10){
          document.getElementById('app-text-component').style.opacity = '0.' + Math.floor(this.opasity);
        } else {
          document.getElementById('app-text-component').style.opacity = '0.0' + Math.floor(this.opasity);
        }
        
        this.opasity = this.opasity - 99 / parseInt(this.opasityTime);
      }else {
        document.getElementById('app-text-component').style.opacity = '0.0';
      }
    }, 100);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
  }
}
