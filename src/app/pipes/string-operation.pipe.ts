import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringOperat',
    standalone: true,
})
export class StringOperationPipe implements PipeTransform {
    transform(value: string, apply: boolean): unknown {
        if (!apply) return value;
        else return value.split(':')[1];
    }
}
