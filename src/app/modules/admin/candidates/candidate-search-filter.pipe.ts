import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'candidateSearchFilter'
})
export class CandidateSearchFilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((val) => {
            const rVal =
                (val.Name.toString().includes(args.toLocaleLowerCase())) ||
                (val.Name.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.CurrentEmployer.toString().includes(args.toLocaleLowerCase())) ||
                (val.CurrentEmployer.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.Location.toString().includes(args.toLocaleLowerCase())) ||
                (val.Location.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.Email.toString().includes(args.toLocaleLowerCase())) ||
                (val.Email.toLocaleLowerCase().includes(args.toLocaleLowerCase()));
            return rVal;
        });
    }
}
