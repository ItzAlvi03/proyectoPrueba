import { AfterViewInit, Component } from '@angular/core';
import { APIServiceService } from 'src/app/Services/apiservice.service';

@Component({
  selector: 'app-ia-component',
  templateUrl: './ia-component.component.html',
  styleUrls: ['./ia-component.component.css']
})
export class IAComponentComponent implements AfterViewInit{
  input:any;
  src: any = "../../../assets/images/no_image.jpg";
  result: any;
  img: any;
  archivo: any;
  cargando: boolean = false;
  mensajeSpinner: string = "Prediciendo resultados...";
  data: any;
  textoInput: string = "Seleccionar Archivos";
  ampliar: boolean = false;
  seleccionado: boolean = false;
  private barra: any;
  private selector: any;
  numPredict!: number;
  
  constructor(private api: APIServiceService){}
  
  restar() {
    if(this.numPredict > 0) this.numPredict--
  }
  sumar() {
    if(this.numPredict < 100) this.numPredict++
  }
  comprobarNum(){
    setTimeout(() => {
      const input = document.querySelector('input.form-control') as any;
      input.value = Math.floor(this.numPredict);
      if(this.numPredict < 0){
        this.numPredict = 0
        input.value = this.numPredict
      }
      else if(this.numPredict > 100){
        this.numPredict = 100
        input.value = this.numPredict
      }
    },10);
  }

  ngAfterViewInit(): void {
    this.input = document.getElementById('input');
  }

  cambiarImg(event: any) {
    const form = document.querySelector('form');
    this.input = event.target;
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[event.target.files.length - 1];
      this.archivo = selectedFile;
      const archivoURL = URL. createObjectURL(this.archivo);
      this.src = archivoURL;
      const formData = new FormData();
      formData.append('img', this.archivo);
      this.img = formData;
      this.textoInput = "Cambiar Imagen"
      form?.classList.remove('h-100');
    } else{
      this.archivo = ""
      this.img = "";
      this.src = "../../../assets/images/no_image.jpg";
      this.textoInput = "Seleccionar Imagen"
      form?.classList.add('h-100');
    }
    this.result = "";
    this.data = "";
  }

  async predecirImg(num: number){
    if(this.img) {
      if(num == 1 && (this.numPredict <= 100 && this.numPredict >= 0)){
        this.img.append('predict', this.numPredict/100.0);
        this.mensajeSpinner = "Prediciendo resultados...";
        this.cargando = true;
        const res = await this.api.predict(this.img).toPromise()
        if(res){
          this.cargando = false;
          this.result = res['result'];
          this.data = res['data'];
          this.src = 'data:image/png;base64, ' + res['annotated_img'];
        }
      } else if (num == 2) {
        if(!this.result){
          await this.predecirImg(1);
        }
        this.mensajeSpinner = "Dibujando Contorno...";
        this.cargando = true;
          const formData = new FormData();
          formData.append('img', this.archivo);
          formData.append('result', this.result);

          const res = await this.api.contorno(formData).toPromise();
          if(res){
            this.cargando = false;
            const src = res['annotated_img'];
            this.src = 'data:image/png;base64, ' + src;
          }
        }
        this.input = document.getElementById('input');
    }
  }
}
