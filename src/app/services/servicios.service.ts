import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { map, pluck, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  arrayDelService;
  obsService$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  obsService2$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // idEstudiante;


  constructor(private _http : HttpClient, private snackbar: MatSnackBar) { }

  setArray(array: any) {
    this.arrayDelService = array;
  }

  getArray() {
    return this.arrayDelService;
  }

  crearNuevoEstudiante(nombres,apellidoPatern,apellidoMater,datepiker,gradoEstudiante,edadEstudiante,diferenciaMeses,diaHoy,imagen){
    // const idnumber = [];

    // this._http.post('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes',{nombre: nombres, apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,fecha: datepiker, grado: gradoEstudiante, anio: edadEstudiante, meses: diferenciaMeses,imagen: imagen })
    // .pipe(pluck('id'),map(m=> idnumber.push(m)))
    // .subscribe(m => console.log(m));
    // return idnumber;
    return this._http.post('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes',{nombre: nombres, apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,fecha: datepiker, grado: gradoEstudiante, anio: edadEstudiante, meses: diferenciaMeses,actual: diaHoy,imagen: imagen })
              .pipe(m=>m).toPromise();
    // //return id
  }

  obtenerEstudiantes(){
    return this._http.get('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes').pipe(m => m).toPromise();
  }

  obtenerGradoEstudiantes(){
    return this._http.get('https://60db9d53801dcb0017291256.mockapi.io/Grados').pipe(m => m).toPromise();
  }

  eliminarEstudiante(idEstudiante){
    this._http.delete(`https://60db9d53801dcb0017291256.mockapi.io/Estudiantes/${idEstudiante}`).subscribe({
      next: data => {
        console.log(data,' salio')
      },
      error: error=> {
        console.log(error, "error aqui")
      }
    })
  }

  eliminarTodosEstudiantes(idEstudiante){
    this._http.delete(`https://60db9d53801dcb0017291256.mockapi.io/Estudiantes/${idEstudiante}`).subscribe({
      next: data => {
        console.log(data,' salio')
      },
      error: error=> {
        console.log(error, "error aqui")
      }
    })
  }

  invocarSnackBar(mensaje){
    this.snackbar.open(mensaje, 'Cancelar', {
      duration: 3000
    });
  }

}
interface id {
  id: any;
}
