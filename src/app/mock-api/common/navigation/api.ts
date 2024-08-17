import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    menuItems = [];
    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                this.menuItems = [];
                this._defaultNavigation.forEach((defaultNavItem,index) => {
                    if (JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'Candidate') {
                        if(defaultNavItem.title != 'Users' && defaultNavItem.title != 'Dashboard' && defaultNavItem.title != 'Questionnaire' && defaultNavItem.title != 'Candidates' && defaultNavItem.title != 'Configuration' && defaultNavItem.title != 'Company' && defaultNavItem.title != 'Job Functions'  ) 
                            {
                                this.menuItems.push(defaultNavItem);
                            }
                    }
                    else if (JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'Hiring Manager' || JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'HR Manager') {
                        if (defaultNavItem.title != 'Users'  && defaultNavItem.title != 'Configuration' && defaultNavItem.title != 'Company' && defaultNavItem.title != 'Job Functions'&& defaultNavItem.title != 'My Dashboard') {
                            this.menuItems.push(defaultNavItem);
                        }
                    }
                    else if (JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'Administrator') {
                        if (defaultNavItem.title != 'My Dashboard') {
                            this.menuItems.push(defaultNavItem);
                        }
                    }
                    else if (JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'Interviewer') {
                        if (defaultNavItem.title != 'Users'  && defaultNavItem.title != 'Configuration' 
                        && defaultNavItem.title != 'Company' && defaultNavItem.title != 'Job Functions'
                        && defaultNavItem.title != 'My Dashboard' && defaultNavItem.title != 'Candidates'
                        && defaultNavItem.title != 'Questionnaire' && defaultNavItem.title != 'Jobs') {
                            this.menuItems.push(defaultNavItem);
                        }
                    }
                    else if (JSON.parse(localStorage.getItem("loggedinfo")).role.trim() == 'Recruiter') {
                        if (defaultNavItem.title != 'Users'  && defaultNavItem.title != 'Configuration' 
                        && defaultNavItem.title != 'Company' && defaultNavItem.title != 'Job Functions'
                        && defaultNavItem.title != 'My Dashboard' && defaultNavItem.title != 'Candidates'
                        && defaultNavItem.title != 'Questionnaire' && defaultNavItem.title != 'Jobs') {
                            this.menuItems.push(defaultNavItem);
                        }
                    }
                });
                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) => {
                    this.menuItems.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this.menuItems.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this.menuItems.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                // Return the response
                return [
                    200,
                    {
                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(this.menuItems),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation)
                    }
                ];
            });
    }
}
