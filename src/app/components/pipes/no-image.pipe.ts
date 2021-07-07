import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImage'
})
export class NoImagePipe implements PipeTransform {

  transform(noImage: string): string {
    if (this.get_extension(noImage)) {
      return `${noImage}`
    }
    else {
      return '../assets/noImage.png'
    }
  }

  get_extension(filename) {
    return filename.slice(0, 5);
  }
}
