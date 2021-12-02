import { StorageService } from './../services/storage.services';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storege: StorageService, public alertCtrl: AlertController){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status){

              case 401: this.handle401();//Unauthorized(autenticação)
              break;

              case 403: this.handle403();//Forbidden(autorização)
              break;

              default:
                this.handleDefaultEror(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handle401() {
      let alert = this.alertCtrl.create({
          title: 'Erro 401: falha de autenticação',
          message: 'Email ou senha incorretos',
          enableBackdropDismiss: false,
          buttons: [
              {
                  text: 'Ok'
              }
          ]
      });
      alert.present();
  }

  handle403(){
    this.storege.setLocalUser(null);
  }

  handleDefaultEror(errorObj) {
      let alert = this.alertCtrl.create({
          title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
          message: errorObj.message,
          enableBackdropDismiss: false,
          buttons: [
              {
                  text: 'Ok'
              }
          ]
      });
      alert.present();
  }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};
