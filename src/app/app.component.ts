import { Component, Sanitizer } from '@angular/core';
import { UploadService } from './services/upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private DEFAULT_DISPLAY_VALUE = 'No file chosen';
  fileName: string;
  displayFileName: string;
  name: string;
  file: any;
  imageUrl: any;
  previewUrl: any;
  fileToUpload: File;
  showSuccessMessage: boolean;
  errorMessage: boolean;
  progress: number;

  constructor(private uploadService: UploadService, private sanitizer: DomSanitizer) {
    this.displayFileName = this.DEFAULT_DISPLAY_VALUE;
  }

  private resetForm() {
    this.displayFileName = this.DEFAULT_DISPLAY_VALUE;
    this.previewUrl = null;
    this.imageUrl = null;
  }

  submit(f: NgForm) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', this.fileToUpload);

    this.uploadService.upload(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = (Math.round(100 * event.loaded / event.total));
      } else if (event instanceof HttpResponse) {
        this.progress = 100;
        this.showSuccessMessage = true;
        this.hideSuccessMessage();
        f.resetForm();
        this.resetForm();
      }
    }, (errorResponse) => {
      this.errorMessage = errorResponse.error;
      this.hideErrorMessage();
      f.resetForm();
      this.resetForm();
    });
  }

  hideSuccessMessage() {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }
  hideErrorMessage() {
    setTimeout(() => {
      this.errorMessage = false;
    }, 5000);
  }

  preview(files) {
    this.fileToUpload = files[0];
    this.displayFileName = files[0].name;
    this.fileName = files[0].name;

    const reader =  new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('' + reader.result);
    };
  }

  showImage() {
    if (this.fileName != null) {
      this.uploadService.getImage(this.fileName).subscribe((response) => {
        const TYPED_ARRAY = new Uint8Array(response);

        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');

        const base64String = btoa(STRING_CHAR);
        this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64, ' + base64String);
      }, (error) => {
        console.log(error);
      });
    }
  }
}
