/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

import { AuthenticationService } from "../../../services/authentication.service";
 
imports: [
    AuthenticationService
];

let candidateId ="";
//debugger;
 if(AuthenticationService.getLoggedInformation() != null)
 {
    //debugger;
    candidateId = AuthenticationService.getLoggedInformation().candidateId;
 }

export const defaultNavigation: FuseNavigationItem[] = [
    
    {
        id   : 'myprofile',
        title: 'My Dashboard',
        type : 'basic',
        icon : 'person',
        link : '/myprofile/edit-candidate/' + candidateId,
       
    },
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'dashboard',
        link : '/dashboard'
    },
    {
        id   : 'jobs',
        title: 'Jobs',
        type : 'basic',
        icon : 'layers',
        link : '/jobs'
    },
    {
        id   : 'candidates',
        title: 'Candidates',
        type : 'basic',
        icon : 'card_travel',
        link : '/candidates'
    },
    {
        id   : 'evaluation',
        title: 'Evaluation',
        type : 'basic',
        icon : 'card_travel',
        link : '/evaluation'
    },
    {
        id   : 'questionnaire',
        title: 'Questionnaire',
        type : 'basic',
        icon : 'card_travel',
        link : '/questionnaire'
    },
    {
        id: 'config',
        title: 'Configuration',
        type: 'collapsable',
        icon: 'card_travel',
        children:[
            {
                id   : 'company',
                title: 'Company',
                type : 'basic',
                icon : 'format_paint',
                link : '/configuration/company',
            },
            {
                id   : 'jobs',
                title: 'Jobs',
                type : 'basic',
                icon : 'card_travel',
                link : '/configuration/jobs',
            }
        ]
    },
    {
        id   : 'users',
        title: 'Users',
        type : 'basic',
        icon : 'person',
        link : '/users'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
