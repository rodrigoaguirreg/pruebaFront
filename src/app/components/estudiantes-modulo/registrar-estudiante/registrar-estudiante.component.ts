import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SignaturePad } from 'angular2-signaturepad'

import * as moment from 'moment';


@Component({
  selector: 'app-registrar-estudiante',
  templateUrl: './registrar-estudiante.component.html',
  styleUrls: ['./registrar-estudiante.component.css']
})
export class RegistrarEstudianteComponent implements OnInit {

  deudasAcomulada = []

  seccion: number;
  deuda = [];

  inicial = []
  primaria = []
  secundaria = []


  alumnoEditado: Estudiante[] = [];

  GradosElecttion = [];
  arrays: any = []
  gradoEstudiante;
  edadEstudiante;
  diferenciaMeses;
  imagenCargada;

  base64;

  editarBoton: Boolean = false;

  estudiantesArray: Estudiante[] = [];

  obteniendoEstudiantes;

  hoy = new Date();
  fechaActual: string = `${this.hoy.getDate()} - ${this.hoy.getMonth() + 1} - ${this.hoy.getFullYear()}`

  aniosDate;
  mesesDate;
  valorfecha = '';

  dia;

  compararPrecio;
  freezeobject;
  obtenerDeuda;

  arrayCorregido = [];

  reader = new FileReader();
  nombreArchivo: string = "";

  idestudiante: any = [];

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions = {
    penColor: 'rgb(66,133,244)',
    canvasWidth: 150,
    canvasHeight: 50,
    margin: 'black solid 10px',
    border: '1px solid #afb8c7'
  }

  constructor(private _http: HttpClient, public _dialogRef: MatDialogRef<RegistrarEstudianteComponent>,
    private servicio: ServiciosService, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {
      boolean: Boolean, id: number, nombre: string,
      apellidoPaterno: string, apellidoMaterno: string,
      grado: string, anio: number, meses: number, fecha: string, imagen: any, firma: any, deudas: any
    }
  ) {
    //obteniendo array de estudiantes para editar
    if (this.data) {
      this.servicio.obsService3$.pipe(filter(m => m != null)).subscribe(m => this.alumnoEditado.push(m[0]));
      this.editarBoton = this.data.boolean

      const fechaEditada = this.data.fecha.split("/")
      const nuveaFecha = new Date(`${fechaEditada[1]},${fechaEditada[0]},${fechaEditada[2]}`)
      this.aniosDate = this.data.anio;
      this.mesesDate = this.data.meses;
      this.imagenCargada = this.data.imagen;

      this.miFormulario.setValue({
        nombres: this.data.nombre,
        apellidoPaterno: this.data.apellidoPaterno,
        apellidoMaterno: this.data.apellidoMaterno,
        fecha: nuveaFecha,
        grado: this.data.grado
      })




    }
  }

  async ngOnInit(): Promise<any> {
    const grados = await this.servicio.obtenerGradoEstudiantes();
    this.arrays = grados;

    for(let i in this.arrays){
      if(this.arrays[i].Grado.includes('inicial')){
        this.inicial.push(this.arrays[i])
      }else if(this.arrays[i].Grado.includes('primaria')){
        this.primaria.push(this.arrays[i])
      }else{
        this.secundaria.push(this.arrays[i])
      }
    }
    this.ordenarArrays(this.inicial);
    this.ordenarArrays(this.primaria);
    this.ordenarArrays(this.secundaria);
    
    this.arrayCorregido= this.inicial.concat(this.primaria,this.secundaria)
    this.arrays = this.arrayCorregido;
    
    const obteniendoEstudidantesGet = await this.servicio.obtenerEstudiantes();
    this.obteniendoEstudiantes = obteniendoEstudidantesGet;

    this.obtenerDeuda = await this.servicio.obtenerDeudas();
    this.compararPrecio = { ...JSON.parse(JSON.stringify(this.obtenerDeuda)) }

    // this.freezeobject = [...this.compararPrecio ]
  }
  miFormulario = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidoPaterno: new FormControl('', Validators.required),
    apellidoMaterno: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    grado: new FormControl('', Validators.required),
  })

  ordenarArrays(array){
    array.sort(function(o1,o2){
      if( o1.Grado > o2.Grado ){
        return 1
      } else if( o1.Grado < o2.Grado){
        return -1
      } else {
        return 0
      }
    })
  }

  enviarDato(valor) {
    this.gradoEstudiante = valor;

  }
  onChange(event$) {
    //sale error not a function cuando usas getFullYear()
    // this.aniosDate = this.hoy.getFullYear() - event$.getFullYear();
    this.aniosDate = this.hoy.getFullYear() - event$._i.year;

    // this.mesesDate = this.hoy.getMonth()    - event$.getMonth();
    this.mesesDate = this.hoy.getMonth() - event$._i.month;

    if (this.hoy.getMonth() - event$._i.month < 0) {
      this.mesesDate = 12 + this.mesesDate;
      this.aniosDate = this.aniosDate - 1
    }

    if (this.hoy.getDate() - event$._i.date < 0) {
      this.mesesDate = this.mesesDate - 1;
    }


  }

  //enviar imagen base64

  handleUpload(event) {
    const file = event.target.files[0];
    this.reader.readAsDataURL(file);
    this.reader.onload = () => {
      this.nombreArchivo = file.name;
      this.imagenCargada = this.reader.result;
    };
  }

  //termina imagen

  async AgregarEstudiante(nombres, apellidoPatern, apellidoMater, datepiker): Promise<any> {
    let mespciker = datepiker.split("/");

    this.dia = 'marzo'

    let DeudasIniciales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.deudasAcomulada.push(DeudasIniciales);
    //asignando deudas por seccion
    if (this.gradoEstudiante.includes("inicial")) {
      this.deuda = this.compararPrecio[0];
      this.seccion = 0;
    } else if (this.gradoEstudiante.includes("primaria")) {
      //descuento por julio o diciembre
      this.deuda = this.compararPrecio[1];
      if (this.gradoEstudiante.includes("1ero") && this.aniosDate >= 6) {
        this.deuda["deuda"][5].monto -= 10;
        this.deudasAcomulada[0][5] += 10;

        this.deuda["deuda"][10].monto -= 10;
        this.deudasAcomulada[0][10] += 10;

      }
      this.seccion = 1;

    } else {
      this.deuda = this.compararPrecio[2];
      this.seccion = 2;
    }
    // if(this.obtenerDeuda[this.seccion]["deuda"][0].monto - this.deuda["deuda"][0].monto >= 100){

    // } else {}
    //descuento por cumpleaños validar enero y febrero
    if (mespciker[1] == 1 || mespciker[1] == 2) {
      this.deuda["deuda"][0].monto -= 50;
      this.deudasAcomulada[0][0] += 50;

    } else {
      let mesSeleccionado = this.deuda["deuda"][mespciker[1] - 2].concepto;
      this.deuda["deuda"][mespciker[1] - 2].monto -= 40;
      this.deudasAcomulada[0][mespciker[1] - 2] += 40;

    }

    //descuento por año par o impar
    if (mespciker[2] % 2 == 0) {

      for (let i = 1; i < this.deuda["deuda"].length; i++) {
        this.deuda["deuda"][i].monto -= 30;
        this.deudasAcomulada[0][i] += 30
      }

    } else {
      for (let i = 1; i < this.deuda["deuda"].length; i++) {
        this.deuda["deuda"][i].monto -= 25;
        this.deudasAcomulada[0][i] += 25

      }
    }
    //descuento por mes par o impar
    if (this.gradoEstudiante.includes("inicial")) {
      if (mespciker[1] % 2 == 0) {
        for (let i = 1; i < this.deuda["deuda"].length; i++) {
          this.deuda["deuda"][i].monto -= 30;
          this.deudasAcomulada[0][i] += 30
        }
      } else {
        for (let i = 1; i < this.deuda["deuda"].length; i++) {
          this.deuda["deuda"][i].monto -= 20;
          this.deudasAcomulada[0][i] += 20

        }
      }
    } else {
      if (mespciker[1] % 2 == 0) {
        for (let i = 1; i < this.deuda["deuda"].length; i++) {
          this.deuda["deuda"][i].monto -= 40;
          this.deudasAcomulada[0][i] += 40

        }
      } else {
        for (let i = 1; i < this.deuda["deuda"].length; i++) {
          this.deuda["deuda"][i].monto -= 25;
          this.deudasAcomulada[0][i] += 25;

        }
      }
    }




    console.log(this.deudasAcomulada)


    //this.deuda["deuda"][ide].monto + 
    // this.obtenerDeuda[this.seccion]["deuda"][ide].monto
    // for (let ide in this.deudasAcomulada[0]) {
    //   if (this.deudasAcomulada[0][ide] > 100) {
    //     console.log("sobrepase los 100")
    //   }
    // }
    for (let ide in this.deudasAcomulada[0]) {
      if (this.obtenerDeuda[this.seccion]["deuda"][ide].monto - this.deuda["deuda"][ide].monto > 100) {
        this.deuda["deuda"][ide].monto = this.obtenerDeuda[this.seccion]["deuda"][ide].monto - 100;
      }
    }


    this.base64 = this.signaturePad.toDataURL('imagen/png', 0.5);
    console.log(this.base64);

    const estudianteAgregar: Estudiante[] = [{
      nombre: nombres, apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater, fecha: datepiker, grado: this.gradoEstudiante,
      anio: this.aniosDate, meses: this.mesesDate, actual: this.fechaActual, imagen: this.reader.result, firma: this.base64, deudas: this.deuda
    }]

    if (this.obteniendoEstudiantes.length == 0) {
      const estudiantecreado = this.servicio.crearNuevoEstudiante(estudianteAgregar[0], datepiker);
      //agregando estudiante a array
      this.idestudiante = estudiantecreado;
      this.estudiantesArray.push({
        id: this.idestudiante.id, nombre: nombres,
        apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,
        fecha: datepiker, grado: this.gradoEstudiante,
        anio: this.aniosDate, meses: this.mesesDate,
        actual: this.fechaActual, imagen: this.reader.result,
        firma: this.base64, deudas: this.deuda
      });
      //transportando array a modulo card
      this.servicio.obsService$.next(this.estudiantesArray);
      this._dialogRef.close()
    } else {
      for (let i = 0; i < this.obteniendoEstudiantes.length; i++) {

        //agregarnoestudiante a bd
        if ((this.obteniendoEstudiantes[i].nombre).includes(nombres) &&
          (this.obteniendoEstudiantes[i].apellidoPaterno).includes(apellidoPatern) &&
          (this.obteniendoEstudiantes[i].apellidoMaterno).includes(apellidoMater)
        ) {
          this.servicio.invocarSnackBar('Este estudiante ya se encuentra registrado');

          break;
        } else if (i == this.obteniendoEstudiantes.length - 1) {

          const estudiantecreado2 = await this.servicio.crearNuevoEstudiante(estudianteAgregar[0], datepiker);
          this.idestudiante = estudiantecreado2;
          //agregando estudiante a array
          this.estudiantesArray.push({
            id: this.idestudiante.id, nombre: nombres,
            apellidoPaterno: apellidoPatern, apellidoMaterno: apellidoMater,
            fecha: datepiker, grado: this.gradoEstudiante,
            anio: this.aniosDate, meses: this.mesesDate,
            actual: this.fechaActual, imagen: this.reader.result,
            firma: this.base64, deudas: this.deuda
          })

          //transportando array a modulo card
          this.servicio.obsService$.next(this.estudiantesArray)
          this._dialogRef.close()
          break;
        }

      }
    }

  }

  editarEstudiante(nombre, apellidoPaterno, apellidoMaterno, datepiker) {


    this.base64 = this.signaturePad.toDataURL('imagen/png', 0.5)

    const firmaBlanca = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAAC+jCIaAAAAAXNSR0IArs4c6QAAAPJJREFUeF7t0jENAAAMw7CVP+mhyOcC6BF5ZwoEBRZ8ulTgwIIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOHydZADPuoqlPAAAAAElFTkSuQmCC'

    const grado = this.gradoEstudiante == undefined ? this.data.grado : this.gradoEstudiante;
    const anio = this.aniosDate == undefined ? this.data.anio : this.aniosDate;
    const meses = this.mesesDate == undefined ? this.data.meses : this.mesesDate;
    const imagen = this.reader.result == undefined ? this.data.imagen : this.reader.result;
    const firma = this.base64 == firmaBlanca ? this.data.firma : this.base64;

    const estudianteEditar = {
      nombre: nombre, apellidoPaterno: apellidoPaterno, apellidoMaterno: apellidoMaterno,
      fecha: datepiker, grado: grado, anio: anio,
      meses: meses, imagen: imagen, firma: firma, deudas: this.deuda
    }

    this.servicio.editarEstudiante(this.data.id, estudianteEditar).subscribe()

    this._dialogRef.close(estudianteEditar)

  }


  // }

}



interface Estudiante {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fecha?: string;
  grado?: string;
  anio: number;
  meses: number;
  actual?: string;
  imagen?: any;
  firma?: any;
  deudas: any;
}

interface Deudas {
  matricula: number;
  marzo: number;
  abril: number;
  mayo: number;
  junio: number;
  julio: number;
  agosto: number;
  septiembre: number;
  octubre: number;
  noviembre: number;
  diciembre: number;
}