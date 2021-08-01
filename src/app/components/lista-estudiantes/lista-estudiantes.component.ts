import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog                                   } from '@angular/material/dialog';
import { MatPaginator                                } from '@angular/material/paginator';
import { MatSnackBar                                 } from '@angular/material/snack-bar';
import { MatTableDataSource                          } from '@angular/material/table';
import { filter                                      } from 'rxjs/operators';
import { ServiciosService                            } from 'src/app/services/servicios.service';
import { ModalConfirmacionComponent                  } from '../modal-confirmacion/modal-confirmacion.component';


export interface PeriodicElement {
  name    : string;
  position: number;
  weight  : number;
  symbol  : string;
}


@Component({
  selector: 'app-lista-estudiantes',
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {

  displayedColumns: string[] = ['seleccionar', 'nombre', 'apellidoPaterno',
                                'apellidoMaterno','edad','grado',
                                'FechaCreacion','eliminarEstudiante','editarEstudiante'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  
  EstudiantesArray = [];
  estudiantesEliminar: Esstudiante[] = [];
  
  micambio = false;
  
  item = {
    selected: false
  }

  constructor(private servicio: ServiciosService,private _modal : MatDialog,private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.servicio.obsService2$.pipe(filter(m => m != null)).subscribe(m => this.EstudiantesArray.push(m));
    this.dataSource.data = this.EstudiantesArray[0];
    this.dataSource.paginator = this.paginator;
  }

  borrarEstudianteLista(estudiante){
    let idEstudiante = estudiante.id;
    this._modal.open(ModalConfirmacionComponent,{
      data: `¿Deseas eliminar al estudiante?`
    }).afterClosed().subscribe((confirmado: Boolean)=>{
        if(confirmado) {
            this.servicio.eliminarEstudiante(idEstudiante);

            this.servicio.invocarSnackBar('Estudiante retirado del aula')

            this.EstudiantesArray = this.EstudiantesArray[0].filter(p => p.id != idEstudiante);
        }else {
            this.servicio.invocarSnackBar('No se eliminó al estudiante')
            
          }
      })


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
  }

  setAll(completed: boolean) {
    this.micambio = completed;
    this.allComplete = completed;
    this.servicio.obsService4$.next(this.micambio);
    

  }
  vercambios(cambio,estudID){
    if(cambio && estudID){
      this.estudiantesEliminar.push({estado: cambio,id: estudID})
    }else if(cambio == false){
      this.estudiantesEliminar =  this.estudiantesEliminar.filter(p => p.id != estudID);
      this.micambio = cambio;
    }

  }
  eliminarCheckBox(){
    for(let i = 0; i < this.estudiantesEliminar.length; i++){
      this.servicio.eliminarEstudiante(this.estudiantesEliminar[i].id);
      this.EstudiantesArray[0] = this.EstudiantesArray[0].filter(p => p.id != this.estudiantesEliminar[i].id);
      this.estudiantesEliminar =  this.estudiantesEliminar.filter(p => p.id != this.estudiantesEliminar[i].id);
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
