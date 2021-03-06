import { Component } from '@angular/core';

export class Blocked {
  xPoint: number;
  yPoint: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  map: string;
  steps: number = null;
  containerElement: HTMLElement;
  cellsElements: any = [];
  cell: HTMLElement;
  startPoint: string;
  targetPoint: string;
  blockedPoints: any = [];
  direction: string = 'N';
  resultArray: any = [];
  blockedPointsArray = [];
  startPointX: number;
  startPointY: number;
  targetPointX: number;
  targetPointY: number;


  Fields = {
    "WALKABLE": ".", // Robby may walk on this
    "BLOCKED": "#", // Robby must not walk on this
    "START": "S", // Robby is starting here, he may also walk here
    "TARGET": "T" // The target cell, Robby has to reach
  };

  Commands = {
    "TURN_RIGHT": "r", // turn right by 90°
    "TURN_LEFT": "l", // turn left by 90°
    "MOVE_FORWARDS": "f" // move one field forwards into current direction
  };

  Directions = {
    "North": "N",
    "South": "S",
    "East": "E",
    "West": "W"
  };

  results = [];

  /**
   * Функция выполняется при нажатии на кнопку расчитать.
   */
  getCommands() {
    this.creatingATable();
    this.getCoordinates(this.startPoint, this.targetPoint);
    this.results.push('[' + this.resultArray + ']');
  }

  /**
   * Функция занимается созданием поля.
   */
  creatingATable() {
    let arr = this.map.split('', this.map.length);
    this.containerElement = document.getElementById('map');
    let i = 0;
    for (let row = 0; row < Math.sqrt(arr.length); row++) {
      const trElem = document.createElement('tr');
      this.containerElement.appendChild(trElem);
      for (let col = 0; col < Math.sqrt(arr.length); col++) {
        this.cell = document.createElement('td');
        this.cellsElements.push(this.cell);
        trElem.appendChild(this.cell);
        this.cell.dataset.cell_num = row + '' + col;
        this.fields(arr[i], this.cell);
        i++;
      }
    }
  }

  /**
   * Функция присваивает нужный класс разным точкам для понятного
   * и корректного отображения
   * @param element номер элемента
   * @param cell текущая ячейка
   */
  fields(element: string, cell: HTMLElement) {
    switch (element) {
      case this.Fields.WALKABLE:
        break;
      case this.Fields.BLOCKED:
        cell.classList.add('BLOCKED');
        this.blockedPoints.push(cell.dataset.cell_num);
        break;
      case this.Fields.START:
        cell.classList.add('START');
        this.startPoint = cell.dataset.cell_num;
        break;
      case this.Fields.TARGET:
        cell.classList.add('TARGET');
        this.targetPoint = cell.dataset.cell_num;
        break;
    }
  }

  /**
   * Функция получает координаты стартовой и конечной точки и из строк
   * делает числа. Так же мы определяем есть ли точки блоков чтобы не 
   * совершать лишних действий.
   * @param startPoint стартовая точка
   * @param targetPoint целевая точка
   * @param blockedPoints массив блокированных точек.
   */
  getCoordinates(startPoint, targetPoint) {
    //Выполняется функция при условии что на карте нет блокированных клеток.
    this.calculationOfPossibleMoves(startPoint, targetPoint);
    if (this.steps < 0 || this.steps == null) {
      this.resultArray = [];
    }
    console.log(this.resultArray);
  }


  /**
   * Узнав стартовые координаты x и y и координаты нашеей цели, мы в зависимости от того
   * где находится наша цель и стартовая точка совершаем определённые действия.
   * @param startPointX стартовая точка по x
   * @param targetPointX целевая точка по x 
   * @param startPointY стартовая точка по y
   * @param targetPointY целевая точка по y
   */
  calculationOfPossibleMoves(startPoint, targetPoint) {
    //Находим точки старта и цели по координатам
    this.startPointX = Number.parseInt(startPoint[1]);
    this.startPointY = Number.parseInt(startPoint[0]);
    this.targetPointX = Number.parseInt(targetPoint[1]);
    this.targetPointY = Number.parseInt(targetPoint[0]);
    //Находим точки по координатам блоков
    this.blockedPoints.map((element) => {
      let object = new Blocked;
      object.xPoint = element[1];
      object.yPoint = element[0];
      this.blockedPointsArray.push(object);
    });
    //Делаем проверки по различным направлениям
    // this.blockedPointsArray.forEach(element => {
      if (this.startPointX < this.targetPointX && this.startPointY < this.targetPointY) {
        this.direction = this.Directions.East;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.pointsIncrease(this.startPointX, this.targetPointX);
        this.direction = this.Directions.South;
        this.steps -= 2;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.pointsIncrease(this.startPointY, this.targetPointY);
      } else if (this.startPointX > this.targetPointX && this.startPointY < this.targetPointY) {
        this.direction = this.Directions.West;
        this.resultArray.push(this.Commands.TURN_LEFT);
        this.pointsDecrease(this.startPointX, this.targetPointX);
        this.direction = this.Directions.South;
        this.steps -= 2;
        this.resultArray.push(this.Commands.TURN_LEFT);
        this.pointsIncrease(this.startPointY, this.targetPointY);
      } else if (this.startPointX > this.targetPointX && this.startPointY > this.targetPointY) {
        this.pointsDecrease(this.startPointY, this.targetPointY);
        this.direction = this.Directions.West;
        this.steps--;
        this.resultArray.push(this.Commands.TURN_LEFT);
        this.pointsDecrease(this.startPointX, this.targetPointX);
      } else if (this.startPointX < this.targetPointX && this.startPointY > this.targetPointY) {
        this.pointsDecrease(this.startPointY, this.targetPointY);
        this.direction = this.Directions.East;
        this.steps--;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.pointsIncrease(this.startPointX, this.targetPointX);
      } else if (this.startPointX === this.targetPointX && this.startPointY < this.targetPointY) {
        this.direction = this.Directions.East;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.direction = this.Directions.South;
        this.steps -= 2;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.pointsIncrease(this.startPointY, this.targetPointY);
      } else if (this.startPointX === this.targetPointX && this.startPointY > this.targetPointY) {
        this.pointsDecrease(this.startPointY, this.targetPointY);
      } else if (this.startPointX < this.targetPointX && this.startPointY === this.targetPointY) {
        this.direction = this.Directions.East;
        this.steps--;
        this.resultArray.push(this.Commands.TURN_RIGHT);
        this.pointsIncrease(this.startPointX, this.targetPointY);
      } else if (this.startPointX > this.targetPointX && this.startPointY === this.targetPointY) {
        this.direction = this.Directions.West;
        this.steps--;
        this.resultArray.push(this.Commands.TURN_LEFT);
        this.pointsDecrease(this.startPointX, this.targetPointX);
      }
  }

  calculationBlock(startPointX, startPointY, blockedPointX, blockedPointY) {
    if (startPointX + 1 === +blockedPointX) {
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.resultArray.push(this.Commands.TURN_RIGHT);
    } else if(startPointX - 1 === +blockedPointX) {
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.resultArray.push(this.Commands.TURN_RIGHT);
    } 
    return startPointX;
  }


  /**
   * Функция увеличения значения стартовой точки по X.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsIncrease(startPoint, targetPoint) {
    while (startPoint !== targetPoint) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPoint++;
    }
  }


  /**
   * Функция уменьшения значения стартовой точки по X.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsDecrease(startPoint, targetPoint) {
    while (startPoint !== targetPoint) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPoint--;
    }
  }

}


