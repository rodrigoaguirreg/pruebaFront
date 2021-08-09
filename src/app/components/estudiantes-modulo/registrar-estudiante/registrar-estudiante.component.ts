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

  cantDescuento;
  
  datepickerArray;

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
   
    this.datepickerArray = datepiker.split("/");
    //descuentos
    this.DescuentosGeneral(this.datepickerArray);
    //finaliza descuetos

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
//comienzan descuentos
  DescuentosGeneral(datepicker){
   const dia = 0;
   const mes = 1;
   const anio = 2;

   //constantes de meses
   const enero = 1;
   const febrero = 2;

   //constante por id
   const matricula = 0;
   const marzo = 1;
   const abril = 2;
   const mayo = 3;
   const junio = 4;
   const julio = 5;
   const agosto = 6;
   const septiembre = 7;
   const octubre = 8;
   const noviembre = 9;
   const diciembre = 10;

   //descuentos variables
    let descuentoMesTrue = 0;
    let descuentoMesFalse = 0;

    let descuentoAnioTrue = 30;
    let descuentoAnioFalse = 25;

    let descuentoEneroOFebrero = 50;
    let descuentoCumpleanio = 40;

   
   let datepickerFuncion = datepicker;

   //descuento para matriculo(enero o febrero) || mes(datepickerArray[mes]-2)
   let mesEneroOFebreroBoolean = (datepickerFuncion[mes] == enero || datepickerFuncion[mes] == febrero);
   let descuentoMatriculaOCumpleanio = (mesEneroOFebreroBoolean ? descuentoEneroOFebrero : descuentoCumpleanio);
   let descuentoMatriculaOMeses = (mesEneroOFebreroBoolean ? matricula : (datepickerFuncion[mes] - 2))

   //calculando si es anio par o impar
   let anioPar = (datepickerFuncion[anio] % 2 == 0);
   //calculando descuento si es anio par o impar
   let descuentoAnio = anioPar ? descuentoAnioTrue : descuentoAnioFalse;
   
   //calculando si es mes par o impar
   let mesPar  = (datepickerFuncion[mes] % 2 == 0)
   //calculando descuento si es mes par o impar

    let DeudasIniciales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    this.deudasAcomulada.push(DeudasIniciales);
    //asignando deudas por seccion
    if (this.gradoEstudiante.includes("inicial")) {
      this.seccion = 0;
    //descuento por mes par o impar para inicial
      descuentoMesTrue = 30;
      descuentoMesFalse = 20;
    } else if (this.gradoEstudiante.includes("primaria")) {
      this.seccion = 1;
      //descuento por mes par o impar para primaria
      descuentoMesTrue = 40;
      descuentoMesFalse = 25;
      
    } else {
      this.seccion = 2;
      //descuento por mes par o impar para secundaria
      descuentoMesTrue = 40;
      descuentoMesFalse = 25;
    }

   let descunetoMes  = mesPar ? descuentoMesTrue : descuentoMesFalse;

    //asignando por seccion
    this.deuda = this.compararPrecio[this.seccion];
    //descuento por mes
    this.descuentoPorMesParOImpar(descunetoMes);
    
    //descuento por julio o diciembre
    this.descuentoPrimeroYmayorSeisAños(julio,diciembre,10);
    
    //descuento por cumpleaños validado enero y febrero
    this.descuentoCumpleaños(descuentoMatriculaOMeses,descuentoMatriculaOCumpleanio);

    //descuento por año par o impar
    this.descuentoPorAñoParOImpar(descuentoAnio);

    
    //limite de descuento
    this.deudasAcomulada[0].map( (x,id) => {
      if(x > 100){
        this.deuda["deuda"][id].monto = this.obtenerDeuda[this.seccion]["deuda"][id].monto - 100;
      }
    })
    console.log(this.deudasAcomulada[0])

  }

  //descuento por mes de cumpleaños (enero || febrero = matricula)
  descuentoCumpleaños(matriculaOMes,descuento){
      this.deuda["deuda"][matriculaOMes].monto -= descuento;
      this.deudasAcomulada[0][matriculaOMes] += descuento;
  }

  descuentoPorAñoParOImpar(descuento){
    //datepickerPar = datepickerArray[2] % 2 == 0
    this.loopDescuento(1,descuento);

  }

  descuentoPorMesParOImpar(descuento){
    //datepickerPar = datepickerArray[1] % 2 == 0
    this.loopDescuento(1,descuento);

  }
  //primerMes = julio,segundoMes = diciembre
  //descuento si esta en primero y es mayor a 6 años 
  descuentoPrimeroYmayorSeisAños(primerMes,segundoMes,descuentos){
    if ( this.gradoEstudiante.includes("1ero primaria") && this.aniosDate >= 6) {
      this.deuda["deuda"][primerMes].monto -= descuentos;
      this.deudasAcomulada[0][primerMes] += descuentos;

      this.deuda["deuda"][segundoMes].monto -= descuentos;
      this.deudasAcomulada[0][segundoMes] += descuentos;
    }

  }

  //loop que descuenta desde la posicion inicio 
  loopDescuento(inicio,cantidadDescuento){

    for (let i = inicio; i < this.deuda["deuda"].length; i++) {
      this.deuda["deuda"][i].monto -= cantidadDescuento;
      this.deudasAcomulada[0][i] += cantidadDescuento;
    }

  }
// finalizan descuentos

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