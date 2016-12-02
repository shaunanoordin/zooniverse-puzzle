/*  Example Class
    Demonstrates ES6 import function in main.js
 */
//==============================================================================
export class ImportExample {
  constructor(txt = "DEFAULT TEXT") {
    this.txt = txt;
  }
  
  getText() {
    return "An ImportExample class was imported and has the text: " + this.txt;
  }
}
//==============================================================================
