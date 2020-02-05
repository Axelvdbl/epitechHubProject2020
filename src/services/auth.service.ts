import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

	headers: Headers;

	baseURL = 'https://epitech-hub-project-2020-api.herokuapp.com/auth_users';

  constructor (private http: Http) {
		this.setHeaders();
	}

	setHeaders() {
		this.headers = new Headers(
			{
				'Content-Type': 'application/json',
				'access_token': localStorage.getItem('access_token'),
				'client': localStorage.getItem('client'),
				'uid': localStorage.getItem('uid'),
				'expiry': localStorage.getItem('expiry'),
				'token-type': localStorage.getItem('token-type'),
			}
		);
	}

	loginUsers(email, password) {
		let body = JSON.stringify({ email: email, password: password });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(this.baseURL + '/sign_in', body, options)
										.map(this.extractData)
										.catch(this.handleError);
	}

	registerUsers(user) {
		let body = JSON.stringify(user)
		let options = new RequestOptions({ headers: this.headers });
		return this.http.post(this.baseURL, body, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	/* Handle response */

  private extractData(res: Response) {
    let headers = res.headers
    let body = res.json();
    return {body: body, headers: headers} || { };
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error._body ? `${error._body}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
