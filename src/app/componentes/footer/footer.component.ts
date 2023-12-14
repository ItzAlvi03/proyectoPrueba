import { Component } from '@angular/core';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  version: any;
  localTime: any;
  constructor(private service: APIServiceService){}
  
  ngAfterViewInit() {
    this.service.getVersion().subscribe((data: any) => {
      this.version = data['version'];
    });
    this.service.getAPILocalTime().subscribe((data: any) => {
      this.localTime = data['time']
    })
  }
}
