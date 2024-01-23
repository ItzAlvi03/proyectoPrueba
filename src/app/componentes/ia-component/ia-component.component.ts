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
        const form = new FormData();
        form.append('img', this.archivo);
        form.append('predict', String(this.numPredict/100.0));
        this.mensajeSpinner = "Prediciendo resultados...";
        this.cargando = true;
        const res = await this.api.predict(form).toPromise()
        if(res){
          this.result = res['result'];
          this.data = res['result'];
        }
      } else if (num == 2) {
        if(!this.result){
          await this.predecirImg(1);
        }
        this.mensajeSpinner = "Dibujando Contorno...";
        this.cargando = true;
        await this.dibujarContorno();

        } else if(num == 3){
          if(!this.result){
            await this.predecirImg(1);
          }
          this.mensajeSpinner = "Dibujando el cuadrado...";
          this.cargando = true;
          await this.dibujarBox();
        }
        this.cargando = false;
        this.input = document.getElementById('input');
    }
  }
  
  async dibujarContorno() {
    const segments = this.result.segments;
    console.log(segments)

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;
    
    const image = new Image();
    image.src = this.src;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Dibuja la imagen original en el canvas
      ctx.drawImage(image, 0, 0);

      // Dibuja el contorno en el canvas
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';

      segments.forEach((segment: any | any[]) => {
        ctx.beginPath();
        for (let i = 0; i < segment.length-1; i++) {
          ctx.moveTo(segment[i][0], segment[i][1]);
          ctx.lineTo(segment[i+1][0], segment[i+1][1]);
        }
        ctx.moveTo(segment[segment.length-1][0], segment[segment.length-1][1]);
        ctx.lineTo(segment[0][0], segment[0][1]);

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      });

      this.src = canvas.toDataURL('image/png');
    };
  }

  async dibujarBox() {
    const boxes = this.result.boxes;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;

    const image = new Image();
    image.src = this.src;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      // Dibuja el rectangulo en canvas
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      boxes.forEach((box: [any, any, any, any]) => {
        const [x1, y1, x2, y2] = box;
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
      });
      ctx.stroke();

      this.src = canvas.toDataURL('image/png');
    };
  }

}
