import { AfterViewInit, Component } from '@angular/core';
import { APIServiceService } from 'src/app/Services/apiservice.service';
import { IATruncateDirective } from 'src/app/truncate/ia-truncate.directive';

class Person {
  boxes!: any;
  conf!: number;
  segments!: any;
  pintarContorno!: boolean;
  pintarBox!: boolean;
  
  constructor(segments: any, boxes: any, conf: number) {
    this.boxes = boxes;
    this.conf = conf;
    this.segments =segments;
    this.pintarBox = false;
    this.pintarContorno = false;
  }
}

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
  personas!: Person []
  
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
        this.numPredict = 0;
        input.value = this.numPredict;
      }
      else if(this.numPredict > 100){
        this.numPredict = 100;
        input.value = this.numPredict;
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
          if(this.result.total_personas === 0) {
            this.data = "nada";
          } else {
            this.data = res['result'];
            this.personas = [];
            for(var i = 0; i < this.data.total_personas; i++) {
              this.personas[i] = new Person(this.data.person[i].segments, this.data['person'][i].boxes, this.data['person'][i].conf)
            }
          }
        }
      }
        this.cargando = false;
        this.input = document.getElementById('input');
    }
  }

  async repintarCanvas(option: number, id: number) {
    this.cargando = true;
    if(option === 2) this.personas[id].pintarContorno = !this.personas[id].pintarContorno
    else if(option === 3) this.personas[id].pintarBox = !this.personas[id].pintarBox

    const archivoURL = URL. createObjectURL(this.archivo);
    this.src = archivoURL;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;
    
    var image = new Image();
    image.src = this.src;
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height; 
      // Dibuja la imagen original en el canvas
      ctx.drawImage(image, 0, 0); 
      for(var i = 0; i < this.personas.length; i++) {
        if(this.personas[i].pintarContorno)  await this.dibujarContorno(canvas, ctx, image, this.personas[i])
        if(this.personas[i].pintarBox) await this.dibujarBox(canvas, ctx, image, this.personas[i]);
      }
    };
    this.cargando = false;
  }
  
  async dibujarContorno(canvas: any, ctx: any, image: any, person: Person) {
    const segment = person.segments;
    
    // Dibuja el contorno en el canvas
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    for (let i = 0; i < segment.length-1; i++) {
      ctx.moveTo(segment[i].x, segment[i].y);
      ctx.lineTo(segment[i+1].x, segment[i+1].y);
    }
    ctx.moveTo(segment[segment.length-1].x, segment[segment.length-1].y);
    ctx.lineTo(segment[0].x, segment[0].y);
    ctx.stroke();
    this.src = canvas.toDataURL('image/png');
  }

  async dibujarBox(canvas: any, ctx: any, image: any, person: Person) {
    const box = person.boxes;
    // Dibuja el rectangulo en canvas
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
    const [x1, y1, x2, y2] = box;
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.fill();
    ctx.stroke();
    this.src = canvas.toDataURL('image/png');
  }

}
