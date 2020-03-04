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

  getCommands() {
    this.creatingATable();
    this.getCoordinates(this.startPoint, this.targetPoint, this.blockedPoints);
    this.results.push('[' + this.resultArray + ']');
  }

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

  getCoordinates(startPoint, targetPoint, blockedPoints) {
    this.startPointX = Number.parseInt(startPoint[1]);
    this.startPointY = Number.parseInt(startPoint[0]);
    this.targetPointX = Number.parseInt(targetPoint[1]);
    this.targetPointY = Number.parseInt(targetPoint[0]);
    if (blockedPoints.length == 0) {
      //Выполняется функция при условии что на карте нет блокированных клеток.
      this.calculationOfPossibleMoves(this.startPointX, this.targetPointX, this.startPointY, this.targetPointY);
    } else {
      //Находим координаты клеток куда робот не может сходить.
      blockedPoints.map((element) => {
        let object = new Blocked;
        object.xPoint = element[1];
        object.yPoint = element[0];
        this.blockedPointsArray.push(object);
      });
      // this.calculationOfPossibleMovesWithBlocked(this.startPointX, this.targetPointX, this.startPointY, this.targetPointY, this.blockedPointsArray);
    }
    if (this.steps < 0 || this.steps == null) {
      this.resultArray = [];
    }
    console.log(this.resultArray);
  }

  calculationOfPossibleMoves(startPointX, targetPointX, startPointY, targetPointY) {
    if (startPointX < targetPointX && startPointY < targetPointY) {
      this.direction = this.Directions.East;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.pointsXIncrease(startPointX, targetPointX);
      this.direction = this.Directions.South;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.pointsYIncrease(startPointY, targetPointY);
    } else if (startPointX > targetPointX && startPointY < targetPointY) {
      this.direction = this.Directions.West;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_LEFT);
      this.pointsXDecrease(startPointX, targetPointX);
      this.direction = this.Directions.South;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_LEFT);
      this.pointsYIncrease(startPointY, targetPointY);
    } else if (startPointX > targetPointX && startPointY > targetPointY) {
      this.pointsYDecrease(startPointY, targetPointY);
      this.direction = this.Directions.West;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_LEFT);
      this.pointsXDecrease(startPointX, targetPointX);
    } else if (startPointX < targetPointX && startPointY > targetPointY) {
      this.pointsYDecrease(startPointY, targetPointY);
      this.direction = this.Directions.East;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.pointsXIncrease(startPointX, targetPointX);
    } else if (startPointX === targetPointX && startPointY < targetPointY) {
      this.direction = this.Directions.East;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.direction = this.Directions.South;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.pointsYIncrease(startPointY, targetPointY);
    } else if (startPointX === targetPointX && startPointY > targetPointY) {
      this.pointsYDecrease(startPointY, targetPointY);
    } else if (startPointX < targetPointX && startPointY === targetPointY) {
      this.direction = this.Directions.East;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_RIGHT);
      this.pointsXIncrease(startPointX, targetPointX);
    } else if (startPointX > targetPointX && startPointY === targetPointY) {
      this.direction = this.Directions.West;
      this.steps--;
      this.resultArray.push(this.Commands.TURN_LEFT);
      this.pointsXDecrease(startPointX, targetPointX);
    }
  }


  /**
   * Функция увеличения значения стартовой точки по X.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsXIncrease(startPointX, targetPointX) {
    while (startPointX !== targetPointX) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPointX++;
    }
  }


  /**
   * Функция уменьшения значения стартовой точки по X.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsXDecrease(startPointX, targetPointX) {
    while (startPointX !== targetPointX) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPointX--;
    }
  }

  /**
   * Функция увеличения значения стартовой точки по Y.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsYIncrease(startPointY, targetPointY) {
    while (startPointY !== targetPointY) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPointY++;
    }
  }

  /**
   * Функция уменьшения значения стартовой точки по Y.
   * @param startPointX 
   * @param targetPointX 
   */

  pointsYDecrease(startPointY, targetPointY) {
    while (startPointY !== targetPointY) {
      this.resultArray.push(this.Commands.MOVE_FORWARDS);
      this.steps--;
      startPointY--;
    }
  }

  /**
   * Функция увеличения значения стартовой точки по X если есть преграды.
   * @param startPointX 
   * @param targetPointX 
   */

}


