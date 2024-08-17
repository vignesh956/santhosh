import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'jobSearchFilter'
})
export class JobSearchFilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((val) => {
            const rVal =
                (val.Title.toString().includes(args.toLocaleLowerCase())) ||
                (val.Title.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.JobStatus.toString().includes(args.toLocaleLowerCase())) ||
                (val.JobStatus.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.Location.toString().includes(args.toLocaleLowerCase())) ||
                (val.Location.toLocaleLowerCase().includes(args.toLocaleLowerCase())) ||
                (val.Description.toString().includes(args.toLocaleLowerCase())) ||
                (val.Description.toLocaleLowerCase().includes(args.toLocaleLowerCase()));
            return rVal;
        });
    }
}
