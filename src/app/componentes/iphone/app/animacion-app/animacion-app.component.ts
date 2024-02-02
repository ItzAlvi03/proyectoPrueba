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
    const div = document.querySelector('#appContainer.appBox') as any;
    img.src = this.appData.src;
    img.style.width = this.appData.width + "px";
    img.style.height = this.appData.height + "px";
    if(this.appData.top != 1){
      img.style.top =  (this.appData.height + this.pantallaData.top) * (this.appData.top - 1) + ((this.appData.top + ((this.appData.top*0.1)+0.5) ) * 2) + "px";
    }
    if(this.appData.left != 1){
      img.style.left = (this.appData.width + 16) * (this.appData.left - 1) + "px";
    }
    setTimeout(() => {
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.margin = "0";
      div.style.padding = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.top =  "0"
      img.style.left = "0"
      setTimeout(() => {
        div.style.backgroundColor = "black";
        div.classList.add('ampliar')
      }, 80);
    },50);
  }
}
