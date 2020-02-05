import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class DataService {

	headers: Headers;

	baseURL = 'https://epitech-hub-project-2020-api.herokuapp.com/';

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

	/* Users */

	getUsers(user_id) {
		let options = new RequestOptions({ headers: this.headers });
		return this.http.get(this.baseURL + '/users/' + user_id, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

	putUsers(user) {
		let body = JSON.stringify(user)
		let options = new RequestOptions({ headers: this.headers });
		return this.http.put(this.baseURL + '/users/' + user.id, body, options)
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
    let errMsg = (error.statusText) ? error.statusText :
    error._body ? `${error._body}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
