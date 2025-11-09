import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value) return '';
    return value.toString().charAt(0).toUpperCase() + value.toString().slice(1).toLowerCase();
  }

}
