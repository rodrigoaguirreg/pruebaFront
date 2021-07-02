import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(private _http : HttpClient,public _dialogRef: MatDialogRef<RegistrarEstudianteComponent>, private servicio: ServiciosService) { }

  async ngOnInit(): Promise<any> {
    const grados = await this._http.get('https://60db9d53801dcb0017291256.mockapi.io/Grados').pipe(
      map(arm => arm),
      ).toPromise()
      this.arrays = grados;
      this.arrays.sort(function(o1,o2){
        if(o1.Grado > o2.Grado){
            return 1
        } else if( o1.Grado < o2.Grado){
            return -1
        }
      return 0
      })



  }
  miFormulario = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidoPaterno: new FormControl('', Validators.required),
    apellidoMaterno: new FormControl('', Validators.required),
  })


  enviarDato(valor){
    this.gradoEstudiante = valor;

  }
  onChange(event){
    console.log(event,'eventoooo');
  }
  AgregarEstudiante(nombres, apellidoPatern , apellidoMater,datepiker,imagen){

    //obtener edad

    const hoy = new Date();

    const convertAge = new Date(datepiker);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.edadEstudiante = Math.floor((timeDiff / (1000 * 3600 * 24))/365);



    if( hoy.getDay() > convertAge.getDay()){
      this.diferenciaMeses = (hoy.getMonth() - convertAge.getMonth()) - 1;
    }  else{
      this.diferenciaMeses = (hoy.getMonth() - convertAge.getMonth())
    }

    //termina eddad

      this._http.post('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes',{nombre: nombres, apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,fecha: datepiker, grado: this.gradoEstudiante, anio: this.edadEstudiante, meses:this.diferenciaMeses,imagen: imagen }).subscribe(console.log)



      this.estudiantesArray.push({nombre: nombres,apellidoPaterno: apellidoPatern,apellidoMaterno: apellidoMater,grado: this.gradoEstudiante,anio: this.edadEstudiante,meses: this.diferenciaMeses,imagen})


      this.servicio.obsService$.next(this.estudiantesArray)

      this._dialogRef.close()

  }

}

interface Estudiante {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado ?: string;
  anio: number;
  meses:number;
  imagen:number;
}
