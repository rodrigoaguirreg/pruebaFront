import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarEstudianteComponent } from '../registrar-estudiante/registrar-estudiante.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor( private _modal : MatDialog) { }

  ngOnInit(): void {
  }

  crearEstudiante(){
    const modalNuevo = this._modal.open(RegistrarEstudianteComponent,{
      width:'600px',
      disableClose:true
    }
    )
  }

}
