import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject, from, Subscription, Observable } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';
import { bufferDebounceTime } from './bufferDebounceTimeOperator';

interface ToastData {
  message: string,
  color: string,
  duration: number
}

@Injectable({
  providedIn: 'root'
})
export class SmartToastService implements OnDestroy {

  toastSubject: Subject<ToastData> = new Subject<ToastData>();
  groupedByDebounceSubscription: Subscription;
  debouncedSubscription: Subscription;

  constructor(private toastCtrl: ToastController) {

    this.toastSubject = new Subject<ToastData>();
    const toastObservable: Observable<ToastData> = this.toastSubject.asObservable();

    this.groupedByDebounceSubscription = toastObservable
      .pipe(
        bufferDebounceTime(500),
        filter(x => x.length > 0),
        concatMap(x => this.present({
          message: x.map(i => i.message).join('\n'),
          duration: x[0].duration,
          color: x[0].color
        })),
      )
      .subscribe();


  }

  ngOnDestroy(): void {
    this.groupedByDebounceSubscription.unsubscribe();
  }


  show(message: string, color: string = null, duration: number = 3000) {
    this.toastSubject.next({
      message,
      color,
      duration
    })
  }

  async present(x: ToastData) {
    const toast = await this.toastCtrl.create({
      message: x.message,
      duration: x.duration,
      color: x.color,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ],
    });

    await toast.present();
    const t = await toast.onDidDismiss();
    console.log('didDismiss:', t);
    return true;

  }

}
