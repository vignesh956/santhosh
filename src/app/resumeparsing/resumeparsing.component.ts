import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-resumeparsing',
  standalone: true,
  imports: [],
  templateUrl: './resumeparsing.component.html',
  styleUrl: './resumeparsing.component.scss'
})
export class ResumeparsingComponent implements OnInit {
  resumeForm!: FormGroup;

  data = {
    "$id": "1",
    "$values": [
      {
        "$id": "2",
        "name": "Sai Shiva S",
        "education": null,
        "skills": "performance, delivering, Revenue Cycle Management, Denial Management, queries, billing, providing, Managing, impact, prioritize, communication, Interpersonal, learn, responsibility, deliver, Team Management, Monitoring, performance, implementing, strategies, cooperation, Planning, monitoring, queries, Education, ",
        "languages": null,
        "experience": " : daily,  : weekly,  : Monthly, Endeavour : daily, Endeavour : weekly, Endeavour : monthly, Lovely Professional University : 2018., ",
        "contactDetails": null,
        "certifications": null,
        "designation": "client, Physician, Payers, clients, client, clients, associates, team members, team members, ",
        "currentEmployeer": null,
        "location": null,
        "dob": null,
        "salary": null,
        "overview": null,
        "email": "Saishivasunnapoju@gmail.com, "
      },
      {
        "$id": "3",
        "name": null,
        "education": null,
        "skills": "Health Care, Work Allocation, Consolidation, Pending Logs, Billing, Payment, discuss, reports, delivery, training, coordinate, SOP, maintained, reports, auditing, Health Care, review, review, document, address, ",
        "languages": null,
        "experience": "Ispace software Solutions Pvt Ltd : 1.7 Years, Ispace software Solutions Pvt Ltd : December 2022 to till date, Ispace software Solutions Pvt Ltd : daily, Ispace software Solutions Pvt Ltd : monthly, Ispace software Solutions Pvt Ltd : weekly, Ispace software Solutions Pvt Ltd : monthly, Data Marshall Pvt Ltd : 2.10 Years, Data Marshall Pvt Ltd : January 2020 to October 2022, ",
        "contactDetails": null,
        "certifications": null,
        "designation": "Senior Associate, clients, client, management, client, client, insurance carrier, ",
        "currentEmployeer": null,
        "location": null,
        "dob": null,
        "salary": null,
        "overview": null,
        "email": null
      },
      {
        "$id": "4",
        "name": "Saishiva S",
        "education": null,
        "skills": "Technical, ",
        "languages": null,
        "experience": "Dentrix : Dec 1996, ",
        "contactDetails": null,
        "certifications": null,
        "designation": "Male, ",
        "currentEmployeer": null,
        "location": null,
        "dob": null,
        "salary": null,
        "overview": null,
        "email": null
      }
    ]
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.resumeForm = this.fb.group({
      resumes: this.fb.array(this.data.$values.map(entry => this.createResumeFormGroup(entry)))
    });
  }

  createResumeFormGroup(entry:any): FormGroup<any> {
    return this.fb.group({
      name: [entry.name],
      education: [entry.education],
      skills: [entry.skills],
      languages: [entry.languages],
      experience: [entry.experience],
      contactDetails: [entry.contactDetails],
      certifications: [entry.certifications],
      designation: [entry.designation],
      currentEmployer: [entry.currentEmployeer]
    });
  }

  get resumes(): FormArray<any> {
    return this.resumeForm.controls['resumes'] as FormArray<any>;
  }

  saveResume() {
    console.log(this.resumeForm.value);
  }

  cancel() {
    this.resumeForm.reset();
  }
}