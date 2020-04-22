import { Component, Input, OnInit } from '@angular/core';
import { ActionService } from 'src/@bug-fisch/services/action.service';
import { DataService } from 'src/@bug-fisch/services/data.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  @Input() questionDataBinding = '';
  @Input() optionsBinding = '';
  @Input() answerListBinding = '';
  @Input() answerValueBinding = '';
  @Input() failedListBinding = '';

  dataList: any[] = [];
  answerList: { QuestionId: string; AnswerList: string[] }[] = [];
  failedList = []

  activeCustomers = ['sfjkljl', 'fkjkj']

  constructor(private actionService: ActionService, private dataService: DataService, private mediaObserver: MediaObserver) {

  }

  ngOnInit(): void {
    this.dataService.getObservible(this.questionDataBinding.split('.')[1]).subscribe(() => {
      this.initQuestionData();
    })
    this.initQuestionData();

    this.dataService.getObservible(this.failedListBinding.split('.')[1]).subscribe(() => {
      this.initFailedList();
    })
    this.initFailedList()
  }

  initQuestionData(): void {
    this.dataList = [];
    let data = this.actionService.getInputValueByBinding(this.questionDataBinding);
    let i = 0;
    while (data[i]) {
      let u = 0;
      let options = []
      while (data[i][this.optionsBinding][u]) {
        options.push(data[i][this.optionsBinding][u])
        u++;
      }
      data[i][this.optionsBinding] = options;
      this.dataList.push(data[i]);
      i++;
    }
    this.dataList.forEach(question => {
      if (question.Type === 4) {
        this.answerList.push({ QuestionId: question.Id + '', AnswerList: question.Options.map((option: any) => { return option.Value }) })
        this.setAnswerToAction(question.Id)
      } else {
        this.answerList.push({ QuestionId: question.Id + '', AnswerList: [] })
      }
    });
  }

  initFailedList(): void {
    this.failedList = [];
    let data = this.actionService.getInputValueByBinding(this.failedListBinding);
    if (data) {
      let i = 0;
      while (data[i]) {
        this.failedList.push(data[i])
        i++;
      }
    }
  }

  setAnswer(questionId: number, answerValue: string, questionType: number): void {
    let answerList = this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList
    switch (questionType) {
      case 1:
        this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList = [answerValue + '']
        break;
      case 2:
        this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList = [answerValue + '']
        break;
      case 3:
        this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList = [answerValue + '']
        break;
      case 5:
        this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList = [answerValue + '']
        break;
      case 7:
        answerList = this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList;
        if (answerList.includes(answerValue + '')) {
          this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList = answerList.filter(a => a !== answerValue + '');
        } else {
          answerList.push(answerValue + '');
        }
        break;
      default:
        break;
    }
    this.setAnswerToAction(questionId);
  }

  setAnswerToAction(questionId): void {
    let answerValue = '';
    this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList.forEach(ans => answerValue += ans + ',');
    this.actionService.setInputValueByBinding('Action.SaveQuestionAction.Data.(QuestionId=' + questionId + ').Value', answerValue)
  }

  checkCondition(question: any): boolean {
    if (question.ConditionQuestionId) {
      return this.checkIfValueIsAnAnswer(question.ConditionQuestionId, question.ConditionAnswerValue);
    }
    return true
  }

  checkIfValueIsAnAnswer(questionId: string, value: string): boolean {
    return this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList.find(val => val === value) !== undefined;
  }

  drop(event: CdkDragDrop<string[]>, questionId: number, questionType: number) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.setAnswerToAction(questionId)
  }

  getOptionTextByQuestionIdAndOptionValue(questionId: number, optionValue: number): void {
    return this.dataList.find(question => question.Id === questionId).Options.find((option: any) => option.Value === optionValue).Text;
  }

  getAnwerListByQuestionId(questionId: number): any {
    return this.answerList.find(ans => ans.QuestionId === questionId + '').AnswerList;
  }

  getPreQuestionHalfPage(questionId: any): boolean {
    let lastQuestion = this.dataList[this.dataList.indexOf(this.dataList.find(question => question.Id === questionId)) - 1];
    let question = this.dataList.find(question => question.Id === questionId)
    if (lastQuestion && question) {
      return (lastQuestion.HalfPage === 1 && question.HalfPage === 1)
    }
    return false
  }

  onInputChange($event) {
    console.log($event)
  }

  checkIfValueInList(value: number): boolean {
    return this.failedList.includes(value);
  }
}
