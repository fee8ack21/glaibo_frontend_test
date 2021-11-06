import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
export class HttpService {
    url: string = environment.APIUrl;
    constructor(private http: HttpClient) {
    }

    get<T>(path: string) {
        return this.http.get<T>(this.url + path)
    }
}
