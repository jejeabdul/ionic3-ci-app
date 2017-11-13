import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { ValidationService } from './../../components/validation.service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Injectable()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public myForm: any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public http: Http
  ) {

    this.myForm = fb.group({
      'email': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])]
    });

    // Check is already login or not
    storage.get('tokenSessionId').then((val) => {
      if (val) {
        this.navCtrl.setRoot(HomePage);
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goLogin(val: any) {
    return new Promise((resolve, reject) => {
      let apiUrl = "http://127.0.0.1:81/ci-rest-api/index.php/auth/login";

      let headers = new Headers({ 'Client-Service': 'frontend-client', 'Auth-key': 'simplerestapi', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
      headers.append('Access-Control-Expose-Headers', 'Authorization');
      headers.append("Access-Control-Allow-Origin", "*");
      headers.append("Access-Control-Allow-Methods", "*");
      headers.append("Access-Control-Allow-Headers", "Accept,Accept-Charset,Accept-Encoding,Accept-Language,Authorization,Connection,Content-Type,Cookie,DNT,Host,Keep-Alive,Origin,Referer,User-Agent,X-CSRF-Token,X-Requested-With");
      headers.append("Access-Control-Allow-Credentials", "true");
      let options = new RequestOptions({ method: RequestMethod.Post, headers: headers });

      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        spinner: 'hide',
        content: '<img src="assets/img/spin.gif" height="60px" width="60px">'
      });
      loading.present();
      const obj = {
        username: val.email,
        password: val.password
      }
      let body = JSON.stringify(obj);

      this.http.post(apiUrl, body, options)
        .subscribe(result => {
          let resdata = JSON.parse(JSON.stringify(result.json()));
          loading.dismiss().then(
            res => {
              this.storage.set('stUserId', result);
              this.storage.set('tokenSessionId', resdata.token);
              this.navCtrl.setRoot(HomePage);
              resolve(result);
            });
        }, (err) => {
          loading.dismiss().then(
            res => {
              reject(err);
            });
        });

    });

  }

}
