import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'candidateSkillsFilter'
})
export class CandidateSkillsFilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!args) {
            return value;
        }
        return value.filter((val) => {
            const rVal =
                (val.toString().includes(args)) ||
                (val.toLocaleLowerCase().includes(args));
            return rVal;
        });
    }
}
