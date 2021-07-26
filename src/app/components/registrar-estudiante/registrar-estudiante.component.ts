import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiciosService } from 'src/app/services/servicios.service';



@Component({
  selector: 'app-registrar-estudiante',
  templateUrl: './registrar-estudiante.component.html',
  styleUrls: ['./registrar-estudiante.component.css']
})
export class RegistrarEstudianteComponent implements OnInit {

  GradosElecttion = [];
  arrays: any = []
  gradoEstudiante;
  edadEstudiante;
  diferenciaMeses;

  estudiantesArray : Estudiante[] = [];

  obteniendoEstudiantes;

  hoy = new Date();
  fechaActual : string = `${this.hoy.getDate()} - ${this.hoy.getMonth()} - ${this.hoy.getFullYear()}`

  aniosDate;
  mesesDate;

  reader = new FileReader();
  nombreArchivo: string = "";

  idestudiante: any = [];


  constructor(private _http : HttpClient,public _dialogRef: MatDialogRef<RegistrarEstudianteComponent>,
              private servicio: ServiciosService,private snackbar: MatSnackBar) { }

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
  })


  enviarDato(valor){
    this.gradoEstudiante = valor;

  }
  onChange(event$){
    this.aniosDate = this.hoy.getFullYear() - event$.getFullYear();

    this.mesesDate = this.hoy.getMonth()    - event$.getMonth();

    if(this.hoy.getMonth() - event$.getMonth() < 0){
      this.mesesDate = 12 + this.mesesDate;
      this.aniosDate = this.aniosDate - 1
    }

    if(this.hoy.getDate() - event$.getDate() < 0 ){
      this.mesesDate = this.mesesDate - 1;
    }


  }

//enviar imagen base64

handleUpload(event) {
  const file = event.target.files[0];
  this.reader.readAsDataURL(file);
  this.reader.onload = () => {
    this.nombreArchivo = file.name
  };
}

//termina imagen

  async AgregarEstudiante(nombres, apellidoPatern , apellidoMater,datepiker): Promise<any>{

    if(this.obteniendoEstudiantes.length == 0){
          const estudiantecreado = this.servicio.crearNuevoEstudiante(nombres, apellidoPatern, apellidoMater,
                                   datepiker, this.gradoEstudiante, this.aniosDate, this.mesesDate,this.fechaActual, this.reader.result);
          //agregando estudiante a array
          this.idestudiante = estudiantecreado;
          this.estudiantesArray.push({id             : this.idestudiante.id,nombre         : nombres,
                                      apellidoPaterno: apellidoPatern      ,apellidoMaterno: apellidoMater,
                                      grado          : this.gradoEstudiante,anio           : this.aniosDate,
                                      meses          : this.mesesDate      ,actual         :this.fechaActual,
                                      imagen         : this.reader.result
                                    });

          //transportando array a modulo card
          this.servicio.obsService$.next(this.estudiantesArray);
          this._dialogRef.close();
    } else{
      for(let i = 0; i < this.obteniendoEstudiantes.length; i++){

          //agregarnoestudiante a bd
          if((this.obteniendoEstudiantes[i].nombre).includes(nombres)                 &&
             (this.obteniendoEstudiantes[i].apellidoPaterno).includes(apellidoPatern) &&
             (this.obteniendoEstudiantes[i].apellidoMaterno).includes(apellidoMater)
            ){
            this.servicio.invocarSnackBar('Este estudiante ya se encuentra registrado');
            
            break;
          }else if(i == this.obteniendoEstudiantes.length - 1 ){

            const estudiantecreado2 = await this.servicio.crearNuevoEstudiante(nombres, apellidoPatern, apellidoMater,
                                            datepiker, this.gradoEstudiante, this.aniosDate, this.mesesDate,this.fechaActual, this.reader.result);
            this.idestudiante = estudiantecreado2;
            //agregando estudiante a array

            this.estudiantesArray.push({id             : this.idestudiante.id,nombre         : nombres,
                                        apellidoPaterno: apellidoPatern      ,apellidoMaterno: apellidoMater,
                                        grado          : this.gradoEstudiante,anio           : this.aniosDate,
                                        meses          : this.mesesDate      ,actual         :this.fechaActual,
                                        imagen         : this.reader.result
                                      })

            //transportando array a modulo card
            this.servicio.obsService$.next(this.estudiantesArray)
            this._dialogRef.close()
            break;
          }

          }
    }

      // }

  }

}

interface Estudiante {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado ?: string;
  anio: number;
  meses:number;
  actual:string;
  imagen ?: any;
}
