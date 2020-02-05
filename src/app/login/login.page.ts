import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AlertController, NavController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	private log: FormGroup;

	config: number = 0;
	passwordIcon: any = ["eye-off", "eye-off", "eye-off"];

  constructor(	private alertCtrl: AlertController,
								private navCtrl: NavController,
								private formBuilder: FormBuilder,
								private auth: AuthService,
								) { }

  ngOnInit() {
		console.log("Inspect Epitech logo and get his ID");
		this.createForm();
  }

	createForm() {
		this.log = this.formBuilder.group({
			email: ['axel.vandenabeele@epitech.eu', Validators.compose([Validators.email, Validators.required])],
			password: ['password', Validators.compose([Validators.minLength(4), Validators.required])],
			password_confirmation: ['password', Validators.compose([Validators.minLength(4), Validators.required])],
		});
	}

	showForm(value) {
		setTimeout(() => {
			var input = document.getElementById('inputLogin');
			input.className = 'inputsslidein post-title-form';
		}, 10);
		this.config = value;
	}

	viewPass(field, index) {
		var passLog = document.getElementById(field);
		if (passLog.attributes[5].value === "text") {
			passLog.setAttribute('type', 'password');
			this.passwordIcon[index] = "eye-off";
		} else if (passLog.attributes[5].value === "password") {
			passLog.setAttribute('type', 'text');
			this.passwordIcon[index] = "eye"
		}
	}

	async register() {
		await this.postUser()
		.then(success => {
			this.displaySuccessMessage();
		})
		.catch(error => {
			this.displayErrorMessage(error);
		})
	}

	async login() {
		await this.loginUser()
		.then(success => {
			this.navCtrl.navigateRoot('/user/' + success);
		})
		.catch(error => {
			this.displayErrorMessage(error);
		})
	}

	loginUser() {
		return new Promise((resolve, reject) => {
			this.auth.loginUsers(this.log.value.email, this.log.value.password)
								.subscribe(
									success => {
										resolve(success.body.data.id);
									},
									error => {
										reject(error);
									}
								)
		});
	}

	postUser() {
		return new Promise((resolve, reject) => {
			this.auth.registerUsers(this.log.value)
								.subscribe(
									success => {
										resolve();
									},
									error => {
										reject(error);
									}
								)
		});
	}

	async displaySuccessMessage() {
		const alert = await this.alertCtrl.create({
			header: 'Félicitation',
			message: 'Bienvenue à Epitech !',
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
