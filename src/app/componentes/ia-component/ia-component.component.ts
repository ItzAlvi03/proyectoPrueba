import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { from } from 'rxjs';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-ia-component',
  templateUrl: './ia-component.component.html',
  styleUrls: ['./ia-component.component.css']
})
export class IAComponentComponent implements AfterViewInit{
  input:any;
  src: any;
  result: any;
  img: any;
  private archivo: any;

  constructor(private api: APIServiceService){}

  ngAfterViewInit(): void {
    this.input = document.querySelector('input');
  }

  cambiarImg() {
    const form = document.querySelector('form');
    if(this.input.files[0]){
      this.archivo = this.input.files[0];
      const archivoURL = URL. createObjectURL(this.input.files[0]);
      this.src = archivoURL;
      const archivo = this.input.files[0];
      const formData = new FormData();
      formData.append('img', archivo);
      this.img = formData;

      form?.classList.remove('h-100');
    } else{
      this.archivo = ""
      this.img = "";
      this.src = "";
      this.result = "";
      form?.classList.add('h-100');
    }
  }

  predecirImg(num: number){
    if(this.img) {
      if(num == 1){
        this.api.predict(this.img).subscribe(
          (res: any) => {
            console.log(res)
            this.result = res['result'];
            this.src = 'data:image/png;base64, ' + res['annotated_img'];
          },
          (error) => {
            console.log('Error al procesar la solicitud: ', error);
          }
        );
      } else if (num == 2 && this.result) {
          const data = {
            img: this.src,
            result: this.result
          };
          console.log(data)
          this.api.contorno(data).subscribe(
            (res: any) => {
              console.log(res)
              const src = res['annotated_img'];
              this.src = 'data:image/png;base64, ' + src;
            },
            (error) => {
              console.log('Error al procesar la solicitud: ', error);
            }
          );
        }
    }
  }

}
