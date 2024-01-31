import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.css']
})
export class AppContainerComponent implements AfterViewInit{
@Input() appData: any;
@Input() pantallaData: any;

ngAfterViewInit() {
  const img = document.querySelector('#appContainer img') as any;
  const div = document.querySelector('#appContainer') as any;
  img.src = this.appData.src;
  div.style.width = this.appData.width + "px";
  div.style.height = this.appData.height + "px";
  div.style.top =  this.appData.top + "px"
  div.style.left = this.appData.left + "px"
  setTimeout(() => {
    div.style.width = this.pantallaData.width + "px";
    div.style.height = this.pantallaData.height + "px";
    div.style.top =  this.pantallaData.top + "px"
    div.style.left = this.pantallaData.left + "px"
    div.style.backgroundColor = "black";
    setTimeout(() => {
      div.classList.add('ampliar')
    }, 40);
  },50);
}
}
