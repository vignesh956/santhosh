import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent  {

  title: string = ""
  message: string = ""
  cancelButtonText = "Cancel"
  constructor(
     //private data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>) {
    //if (data) {
    //  this.title = data.title || this.title;
    //  this.message = data.message || this.message;
    //  if (data.buttonText) {
    //    this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    //  }
    //}
    this.dialogRef.updateSize('300vw','300vw')
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
