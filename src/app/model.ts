import { NumberSymbol } from '@angular/common';

export class Model {
     public numbers : number[] = [];
     public operators;
    constructor() {
        for(let i=0; i<10; i++){
            this.numbers.push(i)
        }
        this.operators = {
            add: "+",
            minus: '-',
            divide: '/',
            multiply: '*',
            percent: '%',
            plusMinus: '+/-',
            decimal : '.'
        }
    }

    evaluate(entry:string) {
        return eval(entry);
    }
/* 
    getNumbers() {
        return this.numbers;
    }

    getOperators(){
        return this.operators;
    } */
   
}
