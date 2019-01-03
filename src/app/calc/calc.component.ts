import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { concat } from 'rxjs';
import { Model } from '../model';
import { Key } from 'protractor';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {
  calculations: string = "0"; //string that is displayed
  evaluation: string = '';//string that should be evaluated
  model = new Model();
  firstClick = true; //allows displaying 0 at the beginnig and at reset
  positive = true; //positive or negative number, tracks +/- button 
  priviousEntryIsOperator = false; // whether privious entry is an operator
  priviousEntryIsResult = false; //whether we shall restart calculations

  constructor(private elementRef: ElementRef) { }

  ngOnInit() { }

  plusMinus(item: string) {
    if (item == this.model.operators.plusMinus && !this.priviousEntryIsOperator) {
      switch (this.positive) {
        case true:
          this.positive = false;
          return this.calculations = "-" + this.calculations;
          console.log('item after adding minus' + this.calculations);
          console.log('positive ' + this.positive);
          break;
        case false:
          this.positive = true;
          this.calculations = this.calculations.substr(1);
          console.log('positive ' + this.positive);
          console.log('substr ' + this.calculations);

          break;
      }
    }
  }

  enter(item) {
    /* Shall we restart calculations? */
    if (this.priviousEntryIsResult) {
      this.initialiseEntry();
      this.priviousEntryIsResult = false;
    }

    /* has user clicked on an operator key?*/
    if (isNaN(item)) {
      /* Was previous entry an operator? and the clicked operator is not '+/-' or '.'
      If so we replace it by a new choice using slice() 
      and then we call enterNumber function*/
      if (this.priviousEntryIsOperator && item != this.model.operators.plusMinus && item != this.model.operators.decimal) {
        this.evaluation = this.evaluation.slice(0, this.evaluation.length - 1); //deletes the priviously entered operator

        this.enterNumber(item);
      }
      /* If previous entry is a number, we just add operator*/
      this.enterOperator(item);
      this.priviousEntryIsOperator = true;

      /* If user entered a number, first we check if it's the first number to start calculations*/
    } else if (this.firstClick) { //if pressed button is a number we continue displainh priviously entered numbers
      this.firstClick = false; //thus 0, initially displayed at launch should be hidden
      this.calculations = ''; //hiding zero
      this.enterNumber(item);

    } else if (item == this.model.operators.plusMinus) {
      this.plusMinus(item)

      /* User clicked on a number and it is not his first clicked*/
    } else {
      this.enterNumber(item);
    }
  }

  enterNumber(item) {
    //continuing to register string that should be evaluated at the end
    this.evaluation += item;
    if (!("+-*/").includes(item) && this.calculations.length < 13) {
      this.calculations += item; //adding new number to displayed ones

    }
    this.priviousEntryIsOperator = false;
  }
  enterOperator(item) {
    if (item != this.model.operators.plusMinus && !this.firstClick) {
      this.evaluation += item;
      this.firstClick = true;
    }
  }

  initialiseEntry() { //if button C is pressed we should reset everything
    this.evaluation = '';
    this.calculations = "0";
    this.firstClick = true;
  }

  calculate() {
    this.calculations = this.model.evaluate(this.evaluation);
    this.priviousEntryIsResult = true;
    if (this.calculations == "Infinity") {
      this.calculations = "Error!";
    }
  }
  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent){
    console.log(ev.keyCode);
    
    const REGEX = /^[0-9+*/\-.]$/
    if(REGEX.exec(ev.key)) this.enter(ev.key);
    if(ev.keyCode == 13) this.calculate();
 }
}
  

