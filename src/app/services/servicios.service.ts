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
  obsService3$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  obsService4$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // idEstudiante;


  constructor(private _http : HttpClient, private snackbar: MatSnackBar) { }

  setArray(array: any) {
    this.arrayDelService = array;
  }

  getArray() {
    return this.arrayDelService;
  }

  crearNuevoEstudiante(personas: Estudiante,datepiker){
    return this._http.post('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes',personas)
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

  editarEstudiante(idEstudiante,personas: Estudiante){
    return this._http.put(`https://60db9d53801dcb0017291256.mockapi.io/Estudiantes/${idEstudiante}`,personas);
  }
  obtenerDeudas(){
    return this._http.get('https://60db9d53801dcb0017291256.mockapi.io/Deudas').pipe(m => m).toPromise();
  }

}
interface id {
  id: any;
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
