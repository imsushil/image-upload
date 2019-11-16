import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  upload(data) {
    return this.httpClient.post<any>(this.apiUrl + 'submit', data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImage(fileName): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'file/' + fileName, {
      responseType: 'arraybuffer'
    });
  }
}
