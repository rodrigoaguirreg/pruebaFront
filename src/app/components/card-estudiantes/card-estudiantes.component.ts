import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';

import { debounceTime, filter } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-card-estudiantes',
  templateUrl: './card-estudiantes.component.html',
  styleUrls: ['./card-estudiantes.component.css']
})
export class CardEstudiantesComponent implements OnInit {

  search = new FormControl('');
  @Output('search') searchEmitter = new EventEmitter<string>();

  personas: any = [];


  constructor(private _http: HttpClient,private _modal : MatDialog,private snackbar: MatSnackBar,private servicio: ServiciosService) { }

  async ngOnInit(): Promise<any> {
    const Esstudiantes = await this._http.get('https://60db9d53801dcb0017291256.mockapi.io/Estudiantes').pipe(m => m).toPromise()
    this.personas = Esstudiantes;

    this.search.valueChanges
    .pipe(
      debounceTime(2500)
    ).subscribe(value => this.searchEmitter.emit(value));


    const nuevoarray = this.servicio.getArray();


    this.servicio.obsService$.pipe(filter(m => m != null)).subscribe(m => this.personas.push(m[0]));

  }

  borrarEstudiante(estudiante){
    let idEstudiante = estudiante.id;
    this._modal.open(ModalConfirmacionComponent,{
      data: `¿Deseas eliminar al estudiante?`
    }).afterClosed().subscribe((confirmado: Boolean)=>{
        if(confirmado) {
            this._http.delete(`https://60db9d53801dcb0017291256.mockapi.io/Estudiantes/${idEstudiante}`).subscribe({
              next: data => {
                console.log(data,' salio')
              },
              error: error=> {
                console.log(error, "error aqui")
              }
            })
            this.snackbar.open('Estudiante retirado del aula', 'Cancelar', {
              duration: 3000
            });
            this.personas = this.personas.filter(p => p.id != idEstudiante);
        }else {
            this.snackbar.open('No se eliminó al estudiante', 'Cancelar', {
              duration: 3000
            });
          }
      })

  }

}
