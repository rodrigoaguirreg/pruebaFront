import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { debounceTime, filter } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ModalConfirmacionComponent } from '../../modal-confirmacion/modal-confirmacion.component';
import { RegistrarEstudianteComponent } from '../registrar-estudiante/registrar-estudiante.component';

@Component({
  selector: 'app-card-estudiantes',
  templateUrl: './card-estudiantes.component.html',
  styleUrls: ['./card-estudiantes.component.css']
})
export class CardEstudiantesComponent implements OnInit {
  listaOCard: Boolean = true;

  search = new FormControl('');
  @Output('search') searchEmitter = new EventEmitter<string>();

  personas: any = [];

  miCheckList: Boolean = false;

  estudiantesEliminar: Esstudiante[] = [];

  micambio = false;

  datosAlumnoEditar: Estudiante[] = [];


  constructor(private _modal: MatDialog, private snackbar: MatSnackBar, private servicio: ServiciosService) { }

  async ngOnInit(): Promise<any> {
    const Esstudiantes = await this.servicio.obtenerEstudiantes();
    this.personas = Esstudiantes;

    this.search.valueChanges
      .pipe(
        debounceTime(3000)
      ).subscribe(value => this.searchEmitter.emit(value));


    //recibiendo array de registrarmodule y pusheando el array
    this.servicio.obsService$.pipe(filter(m => m != null)).subscribe(m => this.personas.push(m[0]));

    //enviando array de card a list
    this.servicio.obsService2$.next(this.personas)

    this.servicio.obsService4$.pipe(filter(m => m != null)).subscribe(m => this.miCheckList = m);


  }


  borrarEstudiante(estudiante) {
    let idEstudiante = estudiante.id;
    this._modal.open(ModalConfirmacionComponent, {
      data: `¿Deseas eliminar al estudiante?`
    }).afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.servicio.eliminarEstudiante(idEstudiante);

        this.servicio.invocarSnackBar('Estudiante retirado del aula');

        this.personas = this.personas.filter(p => p.id != idEstudiante);
      } else {
        this.servicio.invocarSnackBar('No se eliminó al estudiante');

      }
    })

  }


  vercambios(cambio, estudID) {
    //checkbox dentro del card manda cuales estan seleccionados para eliminar
    if (cambio && estudID) {
      this.estudiantesEliminar.push({ estado: cambio, id: estudID });

    } else if (cambio == false) {
      this.estudiantesEliminar = this.estudiantesEliminar.filter(p => p.id != estudID);
      this.micambio = cambio;
    }

  }

  EliminarTodosEstudiantes() {
    this._modal.open(ModalConfirmacionComponent, {
      data: `¿Deseas eliminar todos los estudiantes seleccionados?`
    }).afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        if (this.miCheckList) {
          //elimina todos los estudiantes (checkAll)
          for (let i = 0; i < this.personas.length; i++) {
            this.servicio.eliminarTodosEstudiantes(this.personas[i].id);
          }
          // this.personas.splice(0,this.personas.length)
          this.personas = [];
          this.servicio.invocarSnackBar('Se eliminaron todos los estudiantes');

        } else if (this.estudiantesEliminar.length > 0) {
          //elimina los check seleccionados
          for (let i = 0; i < this.estudiantesEliminar.length; i++) {
            this.servicio.eliminarEstudiante(this.estudiantesEliminar[i].id)

            this.personas = this.personas.filter(p => p.id != this.estudiantesEliminar[i].id);
            this.estudiantesEliminar = this.estudiantesEliminar.filter(p => p.id != this.estudiantesEliminar[i].id)
          }
          this.servicio.invocarSnackBar('Se eliminaron todos los estudiantes seleccionados');

        }

      }
    })

  }

  editarEstudiante(estudi) {
    this.datosAlumnoEditar.push({
      id: estudi.id, nombre: estudi.nombre,
      apellidoPaterno: estudi.apellidoPaterno, apellidoMaterno: estudi.apellidoMaterno,
      grado: estudi.grado, anio: estudi.anio,
      meses: estudi.meses, actual: estudi.fecha,
      imagen: estudi.imagen, firma: estudi.firma, deudas: estudi.deudas
    });

    this.servicio.obsService3$.next(this.datosAlumnoEditar)

    this._modal.open(RegistrarEstudianteComponent, {
      width: '650px',
      height: '600px',
      data: {
        boolean: true,
        id: estudi.id,
        nombre: estudi.nombre,
        apellidoPaterno: estudi.apellidoPaterno,
        apellidoMaterno: estudi.apellidoMaterno,
        grado: estudi.grado,
        anio: estudi.anio,
        meses: estudi.meses,
        fecha: estudi.fecha,
        imagen: estudi.imagen,
        firma: estudi.firma,
        deudas: estudi.deudas
      }
      , disableClose: true
    }).afterClosed().subscribe(result => {
      if (result.nombre) {
        console.log(estudi.id)
        this.personas.findIndex(x => {
          if (x.id == estudi.id) {
            const position = this.personas.indexOf(x);

            this.personas[position].nombre = result.nombre;
            this.personas[position].apellidoPaterno = result.apellidoPaterno;
            this.personas[position].apellidoMaterno = result.apellidoMaterno;
            this.personas[position].grado = result.grado;
            this.personas[position].anio = result.anio;
            this.personas[position].meses = result.meses;
            this.personas[position].fecha = result.fecha;
            this.personas[position].imagen = result.imagen;
            this.personas[position].firma = result.firma;
          }
        })

      }
    })
  }


  //checklist

  task = {
    name: '',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: '', completed: false, color: 'primary' }
    ]
  }

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    this.miCheckList = this.allComplete
  }


  setAll(completed: boolean) {
    this.miCheckList = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  cambiar() {
    this.listaOCard = !this.listaOCard
  }

}

interface Esstudiante {
  estado: boolean;
  id: number;
}
interface Estudiante {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado?: string;
  anio: number;
  meses: number;
  actual?: string;
  imagen?: any;
  firma?: any;
  deudas : any;
}