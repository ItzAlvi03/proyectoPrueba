import { AfterViewInit, Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-animacion-app',
  templateUrl: './animacion-app.component.html',
  styleUrls: ['./animacion-app.component.css']
})
export class AnimacionAppComponent implements AfterViewInit{
  @Input() appData: any;
  @Input() pantallaData: any;
  
  ngAfterViewInit() {
    const img = document.querySelector('#appContainer img') as any;
    const div = document.querySelector('#appContainer') as any;
    img.src = this.appData.src;
    img.style.width = this.appData.width + "px";
    img.style.height = this.appData.height + "px";
    if(this.appData.top != 1){
      img.style.top = (this.appData.height + 22) * (this.appData.top - 1) + "px";
    }
    if(this.appData.left != 1){
      img.style.left = (this.appData.width + 28) * (this.appData.left - 1) + "px";
    }
    setTimeout(() => {
      img.style.width = "100%";
      img.style.height = "100%";
      div.style.margin = "0";
      div.style.padding = "0";
      img.style.top =  "0"
      img.style.left = "0"
      div.style.backgroundColor = "black";
      setTimeout(() => {
        div.classList.add('ampliar')
      }, 40);
    },50);
  }
}
