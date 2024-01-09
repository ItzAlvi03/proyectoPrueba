import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-ia-component',
  templateUrl: './ia-component.component.html',
  styleUrls: ['./ia-component.component.css']
})
export class IAComponentComponent implements AfterViewInit{
  input:any;
  src: any;

  constructor(private api: APIServiceService){}

  ngAfterViewInit(): void {
    this.input = document.querySelector('input');
  }

  predecirImg(num: number){
    if(this.input.files.length > 0) {
      const archivo = this.input.files[0];
      const formData = new FormData();
      formData.append('img', archivo);
      if(num == 1){
        this.api.predict(formData).subscribe(
          (res: any) => {
            const src = res['annotated_img'];
            this.src = 'data:image/png;base64, ' + src
          },
          (error) => {
            console.log('Error al procesar la solicitud: ', error);
          }
        );
      } else if(num == 2){
        this.api.contorno(formData).subscribe(
          (res: any) => {
            const src = res['annotated_img'];
            this.src = 'data:image/png;base64, ' + src
          },
          (error) => {
            console.log('Error al procesar la solicitud: ', error);
          }
        );
      }
    }
  }

}
