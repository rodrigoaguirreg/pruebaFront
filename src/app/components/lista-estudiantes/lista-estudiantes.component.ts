import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-lista-estudiantes',
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {

  EstudiantesArray = [];
  estudiantesEliminar: Esstudiante[] = [];

  micambio = false;

  item = {
    selected: false
  }

  constructor(private servicio: ServiciosService,private _modal : MatDialog,private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.servicio.obsService2$.pipe(filter(m => m != null)).subscribe(m => this.EstudiantesArray.push(m));
  }

  borrarEstudianteLista(estudiante){
    let idEstudiante = estudiante.id;
    console.log(this.EstudiantesArray[0]);
    this._modal.open(ModalConfirmacionComponent,{
      data: `¿Deseas eliminar al estudiante?`
    }).afterClosed().subscribe((confirmado: Boolean)=>{
        if(confirmado) {
            this.servicio.eliminarEstudiante(idEstudiante);

            this.snackbar.open('Estudiante retirado del aula', 'Cancelar', {
              duration: 3000
            });

            this.EstudiantesArray = this.EstudiantesArray[0].filter(p => p.id != idEstudiante);
        }else {
            this.snackbar.open('No se eliminó al estudiante', 'Cancelar', {
              duration: 3000
            });
          }
      })
    console.log(this.item.selected);


  }


  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: ' ', completed: false, color: 'primary'}
    ]
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    console.log('hola');

  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    console.log(completed);
    this.allComplete = completed;
    if (this.allComplete) {
      this.micambio = this.allComplete;
    }


  }
  vercambios(cambio,estudID){
    console.log(cambio,estudID);
    if(cambio && estudID){
      this.estudiantesEliminar.push({estado: cambio,id: estudID})
      console.log(this.estudiantesEliminar,'aqui');

    }else if(cambio == false){
      console.log(this.estudiantesEliminar,'aqui');
      console.log(estudID,'aqui');
      this.estudiantesEliminar =  this.estudiantesEliminar.filter(p => p.id != estudID)
      console.log(this.estudiantesEliminar,'nuevo aqui');
      console.log(cambio,'change');
      this.micambio = cambio
      console.log(this.micambio,'3');
    }

  }
  eliminarCheckBox(){
    for(let i = 0; i < this.estudiantesEliminar.length; i++){
      console.log(this.estudiantesEliminar[i].id,'estudiante id');
      this.servicio.eliminarEstudiante(this.estudiantesEliminar[i].id)
      console.log(this.EstudiantesArray);
      this.EstudiantesArray[0] = this.EstudiantesArray[0].filter(p => p.id != this.estudiantesEliminar[i].id);
      this.estudiantesEliminar =  this.estudiantesEliminar.filter(p => p.id != this.estudiantesEliminar[i].id)
      console.log(this.EstudiantesArray[0]);

    }
  }

}

interface Task {
  name: string;
  completed: boolean;
  color: string;
  subtasks ?: any;

}
interface Esstudiante {
  estado:boolean;
  id: number;
}
