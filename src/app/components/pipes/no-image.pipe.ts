import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImage'
})
export class NoImagePipe implements PipeTransform {

  transform(noImage: string): string {
    if (noImage) {
      return `${noImage}`
    }
    else {
      return '../assets/noImage.png'
    }
  }


}
