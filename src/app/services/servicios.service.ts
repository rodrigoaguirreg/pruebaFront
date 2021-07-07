import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  arrayDelService;
  obsService$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  obsService2$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _http : HttpClient) { }

  setArray(array: any) {
    this.arrayDelService = array;
  }

  getArray() {
    return this.arrayDelService;
  }

  crearNuevoEstudiante(nombres,apellidoPatern,apellidoMater,datepiker,gradoEstudiante,edadEstudiante,diferenciaMeses,imagen){
    this._http.post('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes',{nombre: nombres, apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,fecha: datepiker, grado: gradoEstudiante, anio: edadEstudiante, meses: diferenciaMeses,imagen: imagen }).subscribe(console.log)
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



}
