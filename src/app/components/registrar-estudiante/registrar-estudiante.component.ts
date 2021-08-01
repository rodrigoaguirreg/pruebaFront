import { HttpClient                         } from '@angular/common/http';
import { Component, Inject, OnInit, Output, ViewChild          } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA                       } from '@angular/material/dialog';
import { MatSnackBar                        } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { ServiciosService                   } from 'src/app/services/servicios.service';
import { SignaturePad} from 'angular2-signaturepad'

import * as moment from 'moment';


@Component({
  selector: 'app-registrar-estudiante',
  templateUrl: './registrar-estudiante.component.html',
  styleUrls: ['./registrar-estudiante.component.css']
})
export class RegistrarEstudianteComponent implements OnInit {

  alumnoEditado: Estudiante[] = [];

  GradosElecttion = [];
  arrays: any = []
  gradoEstudiante;
  edadEstudiante;
  diferenciaMeses;
  imagenCargada;

 base64;

  editarBoton: Boolean = false;

  estudiantesArray : Estudiante[] = [];

  obteniendoEstudiantes;

  hoy = new Date();
  fechaActual : string = `${this.hoy.getDate()} - ${this.hoy.getMonth() + 1} - ${this.hoy.getFullYear()}`

  aniosDate;
  mesesDate;
  valorfecha = '';

  reader = new FileReader();
  nombreArchivo: string = "";

  idestudiante: any = [];

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions = {
    penColor: 'rgb(66,133,244)',
    canvasWidth: 150,
    canvasHeight: 50,
    margin: 'black solid 10px'
  }

  constructor(private _http : HttpClient,public _dialogRef: MatDialogRef<RegistrarEstudianteComponent>,
              private servicio: ServiciosService,private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: {boolean: Boolean, id:number,nombre: string,
                apellidoPaterno: string,apellidoMaterno: string,
                grado: string,anio: number,meses: number,fecha:string,imagen : any
              }
              ) {
                //obteniendo array de estudiantes para editar
                if(this.data){
                  this.servicio.obsService3$.pipe(filter(m => m != null)).subscribe(m => this.alumnoEditado.push(m[0]));
                  this.editarBoton = this.data.boolean
                    
                    const fechaEditada = this.data.fecha.split("/")
                    const nuveaFecha = new Date(`${fechaEditada[1]},${fechaEditada[0]},${fechaEditada[2]}`)
                    this.aniosDate = this.data.anio;
                    this.mesesDate = this.data.meses;
                    this.imagenCargada = this.data.imagen;
                    
                    this.miFormulario.setValue({
                      nombres: this.data.nombre,
                      apellidoPaterno: this.data.apellidoPaterno,
                      apellidoMaterno: this.data.apellidoMaterno,
                      fecha: nuveaFecha ,
                      grado: this.data.grado
                    })
                  
                    
                   
                
                }
             }

  async ngOnInit(): Promise<any> {
    const grados = await this.servicio.obtenerGradoEstudiantes();
      this.arrays = grados;
      this.arrays.sort(function(o1,o2){
        if(o1.Grado > o2.Grado){
            return 1
        } else if( o1.Grado < o2.Grado){
            return -1
        }
      return 0
      })

      
      const obteniendoEstudidantesGet = await this.servicio.obtenerEstudiantes();
      this.obteniendoEstudiantes = obteniendoEstudidantesGet;
      
      

  }
  miFormulario = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidoPaterno: new FormControl('', Validators.required),
    apellidoMaterno: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    grado: new FormControl('', Validators.required),
  })

  
  
  enviarDato(valor){
    console.log(valor)
    this.gradoEstudiante = valor;
    
  }
  onChange(event$){
    //sale error not a function cuando usas getFullYear()
    // this.aniosDate = this.hoy.getFullYear() - event$.getFullYear();
    this.aniosDate = this.hoy.getFullYear() - event$._i.year;

    // this.mesesDate = this.hoy.getMonth()    - event$.getMonth();
    this.mesesDate = this.hoy.getMonth()    - event$._i.month;

    if(this.hoy.getMonth() - event$._i.month < 0){
      this.mesesDate = 12 + this.mesesDate;
      this.aniosDate = this.aniosDate - 1
    }

    if(this.hoy.getDate() - event$._i.date < 0 ){
      this.mesesDate = this.mesesDate - 1;
    }


  }

//enviar imagen base64

handleUpload(event) {
  const file = event.target.files[0];
  this.reader.readAsDataURL(file);
  this.reader.onload = () => {
    this.nombreArchivo = file.name
    this.imagenCargada = this.reader.result;
  };
}

//termina imagen

async AgregarEstudiante(nombres, apellidoPatern , apellidoMater,datepiker): Promise<any>{
  
  this.base64 = this.signaturePad.toDataURL('imagen/png',0.5);
  console.log(this.base64);
  
  const estudianteAgregar: Estudiante[] = [{nombre: nombres,apellidoPaterno: apellidoPatern,apellidoMaterno: apellidoMater,fecha: datepiker,grado:this.gradoEstudiante,
                                            anio:this.aniosDate,meses:this.mesesDate,actual:this.fechaActual,imagen:this.reader.result,firma: this.base64}]
  if(this.editarBoton){
  console.log("soy true")
  } else{
    if(this.obteniendoEstudiantes.length == 0){
      const estudiantecreado = this.servicio.crearNuevoEstudiante(estudianteAgregar[0],datepiker);
      //agregando estudiante a array
      this.idestudiante = estudiantecreado;
      this.estudiantesArray.push({id             : this.idestudiante.id,nombre         : nombres,
                                  apellidoPaterno: apellidoPatern      ,apellidoMaterno: apellidoMater,
                                  fecha          : datepiker           ,grado          : this.gradoEstudiante,
                                  anio           : this.aniosDate      ,meses          : this.mesesDate,
                                  actual         :this.fechaActual     ,imagen         : this.reader.result,
                                  firma          : this.base64
                                });
      //transportando array a modulo card
      this.servicio.obsService$.next(this.estudiantesArray);
      this._dialogRef.close()
  } else{
    for(let i = 0; i < this.obteniendoEstudiantes.length; i++){

        //agregarnoestudiante a bd
        if((this.obteniendoEstudiantes[i].nombre)         .includes(nombres)        &&
           (this.obteniendoEstudiantes[i].apellidoPaterno).includes(apellidoPatern) &&
           (this.obteniendoEstudiantes[i].apellidoMaterno).includes(apellidoMater)
          ){
          this.servicio.invocarSnackBar('Este estudiante ya se encuentra registrado');
          
          break;
        }else if(i == this.obteniendoEstudiantes.length - 1 ){

          const estudiantecreado2 = await this.servicio.crearNuevoEstudiante(estudianteAgregar[0],datepiker);
          this.idestudiante = estudiantecreado2;
          //agregando estudiante a array
          this.estudiantesArray.push({id             : this.idestudiante.id,nombre         : nombres,
                                      apellidoPaterno: apellidoPatern      ,apellidoMaterno: apellidoMater,
                                      fecha          : datepiker           ,grado          : this.gradoEstudiante,
                                      anio           : this.aniosDate      ,meses          : this.mesesDate,
                                      actual         :this.fechaActual     ,imagen         : this.reader.result,
                                      firma          : this.base64
                                    })

          //transportando array a modulo card
          this.servicio.obsService$.next(this.estudiantesArray)
          this._dialogRef.close()
          break;
        }

        }
}
    
  }
    }

    editarEstudiante(nombre,apellidoPaterno,apellidoMaterno,datepiker){
      
      // console.log(this.alumnoEditado)
      // console.log(nombre)
      // console.log(apellidoPaterno)
      // console.log(apellidoMaterno)
      // console.log(this.aniosDate)
      // console.log(this.mesesDate)
     

      const grado = this.gradoEstudiante == undefined ? this.data.grado : this.gradoEstudiante;
      const anio = this.aniosDate == undefined ? this.data.anio : this.aniosDate;
      const meses = this.mesesDate == undefined ? this.data.meses : this.mesesDate;
      const imagen = this.reader.result == undefined ? this.data.imagen : this.reader.result;
      

      const estudianteEditar = {nombre: nombre   ,apellidoPaterno : apellidoPaterno, apellidoMaterno: apellidoMaterno,
                                fecha : datepiker,grado           : grado          ,anio            : anio           ,
                                meses : meses    ,imagen          : imagen }
      this.servicio.editarEstudiante(this.data.id,estudianteEditar).subscribe()

      this._dialogRef.close(estudianteEditar)

    }
    

      // }

}



interface Estudiante {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fecha ?: string;
  grado ?: string;
  anio: number;
  meses:number;
  actual?:string;
  imagen ?: any;
  firma ?: any;
}
