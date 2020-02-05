import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AlertController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

	private user: FormGroup;

	config: boolean = false;

  constructor(	private data: DataService,
								private alertCtrl: AlertController,
								private formBuilder: FormBuilder,
							) {}

	async ionViewWillEnter() {
		await this.getUsers()
		.then(success => {
			this.updateForm(success);
		})
		.catch(error => {
			this.displayErrorMessage(error);
		})
	}

	updateForm(data) {
		this.user = this.formBuilder.group({
			id: [data.id],
			lastname: [data.lastname, Validators.required],
			firstname: [data.firstname, Validators.required],
			section: [data.section, Validators.required],
			birthday_date: [data.birthday_date, Validators.required],
			profile_picture: [data.profile_picture],
		});
	}

	getUsers() {
		return new Promise((resolve, reject) => {
			this.data.getUsers(decodeURI(document.URL.split('/')[document.URL.split('/').length - 1]))
								.subscribe(
									success => {
										resolve(success.body);
									},
									error => {
										reject(error)
									}
								)
		})
	}

	savePicture() {
		this.user.value.profile_picture = (<HTMLInputElement>document.getElementById("profile-picture")).value;
	}

	async save() {
		await this.putUsers()
		.then(success => {
			this.displaySuccessMessage();
		})
		.catch(error => {
			this.displayErrorMessage(error);
		})
	}

	putUsers() {
		return new Promise((resolve, reject) => {
			this.data.putUsers(this.user.value)
								.subscribe(
									success => {
										resolve();
									},
									error => {
										reject(error);
									}
								)
		})
	}

	async displaySuccessMessage() {
		const alert = await this.alertCtrl.create({
			header: '',
			message: 'Enregistrement effectué !',
			buttons: ['ok']
		});
		return await alert.present();
	}

	async displayErrorMessage(message) {
		console.log(message);
		const alert = await this.alertCtrl.create({
			header: 'Erreur',
			message: 'Une erreur est survenue, merci de réessayer ultérieurement',
			buttons: ['ok']
		});
		return await alert.present();
	}

}
