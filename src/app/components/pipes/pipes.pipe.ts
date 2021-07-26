import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class PipesPipe implements PipeTransform {

  transform(lista: any[], texto: string): any[] {
    if(!texto) return lista;
    return lista.filter(estudiante => estudiante.nombre.toLocaleLowerCase().includes(texto.toLocaleLowerCase()) || estudiante.apellidoPaterno.toLocaleLowerCase().includes(texto.toLocaleLowerCase()) || estudiante.apellidoMaterno.toLocaleLowerCase().includes(texto.toLocaleLowerCase()) )
  }

}
