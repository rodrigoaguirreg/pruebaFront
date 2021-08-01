import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, of } from 'rxjs';
import { mapTo, map, catchError, pluck, filter  } from 'rxjs/operators';
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

  aniosDate;
  mesesDate;

  reader = new FileReader();

  idestudiante: any = [];


  constructor(private _http : HttpClient,public _dialogRef: MatDialogRef<RegistrarEstudianteComponent>, private servicio: ServiciosService,private snackbar: MatSnackBar) { }

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
    // console.log(event$.getMonth() + 1,'mes - 1');
    // console.log(this.hoy.getMonth(),'mes - 1');
    // console.log(event$.getDate(),'dia ');
    // console.log(event$.getFullYear(),'año ');
    this.aniosDate = this.hoy.getFullYear() - event$.getFullYear();

    console.log(this.hoy.getFullYear() - event$.getFullYear(),"Años")

    this.mesesDate = this.hoy.getMonth() - event$.getMonth()

    if(this.hoy.getMonth() - event$.getMonth() < 0){
      this.mesesDate = 12 + this.mesesDate;
      this.aniosDate = this.aniosDate - 1
    }

    if(this.hoy.getDate() - event$.getDate() < 0 ){
      this.mesesDate = this.mesesDate - 1;
    }
    console.log(this.aniosDate,'anios corregidos');
    console.log(this.mesesDate,'meses corregido');
    console.log(this.hoy.getDate() - event$.getDate(),'meses corregido');


  }

//enviar imagen base64

handleUpload(event) {
  const file = event.target.files[0];
  this.reader.readAsDataURL(file);
  this.reader.onload = () => {
  };
}

//termina imagen

  async AgregarEstudiante(nombres, apellidoPatern , apellidoMater,datepiker): Promise<any>{

    if(this.obteniendoEstudiantes.length == 0){
          const estudiantecreado = this.servicio.crearNuevoEstudiante(nombres, apellidoPatern, apellidoMater, datepiker, this.gradoEstudiante, this.aniosDate, this.mesesDate, this.reader.result);
          //agregando estudiante a array
          this.idestudiante = estudiantecreado;
          console.log(estudiantecreado);
          this.estudiantesArray.push({id: this.idestudiante.id,nombre: nombres,apellidoPaterno: apellidoPatern,apellidoMaterno: apellidoMater,grado: this.gradoEstudiante,anio: this.aniosDate,meses: this.mesesDate, imagen: this.reader.result})

          //transportando array a modulo card
          this.servicio.obsService$.next(this.estudiantesArray)
          console.log("aqui estoyX2");
          this._dialogRef.close()
    } else{
      for(let i = 0; i < this.obteniendoEstudiantes.length; i++){

          console.log(nombres,'nombre obtenio');
          //agregarnoestudiante a bd
          console.log(this.estudiantesArray,'array');
          if((this.obteniendoEstudiantes[i].nombre).includes(nombres) && (this.obteniendoEstudiantes[i].apellidoPaterno).includes(apellidoPatern) && (this.obteniendoEstudiantes[i].apellidoMaterno).includes(apellidoMater)){
            this.snackbar.open('Este estudiante ya se encuentra registrado', 'Cancelar', {
              duration: 3000
            });
            console.log("aqui estoy");
            break;
          }else if(i == this.obteniendoEstudiantes.length - 1 ){
            console.log("entro aqui");

            const estudiantecreado2 = await this.servicio.crearNuevoEstudiante(nombres, apellidoPatern, apellidoMater, datepiker, this.gradoEstudiante, this.aniosDate, this.mesesDate, this.reader.result);
            this.idestudiante = estudiantecreado2;
            console.log(this.idestudiante.id,'ide22222');
            //agregando estudiante a array
          //   console.log(idEstudiante2,'hereeeee1');
          //   const idesegundo = idEstudiante2;
          // console.log(idesegundo[0],'hereeeee');

            this.estudiantesArray.push({id: this.idestudiante.id,nombre: nombres,apellidoPaterno: apellidoPatern,apellidoMaterno: apellidoMater,grado: this.gradoEstudiante,anio: this.aniosDate,meses: this.mesesDate,imagen: this.reader.result})

            //transportando array a modulo card
            this.servicio.obsService$.next(this.estudiantesArray)
            console.log("aqui estoyX2");
            this._dialogRef.close();
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
  imagen ?: any;
}
