import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  title: string = '<portfolio/>';
  isMobile = true;

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2){}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }
  
  ngOnInit() {
    this.checkWindowSize();
  }
  
  checkWindowSize() {
    this.isMobile = window.innerWidth <= 900;
  }
}
