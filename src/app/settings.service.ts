import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private locationDataSubject = new BehaviorSubject<any>(null);
  locationData$ = this.locationDataSubject.asObservable();

  private _locationData: any;

  // Simulate an API call to get timezone data
  // This method should be replaced with an actual API call
  public getTimeZoneData() {
    return of({
      practiceLocation: {
        timeZone: {
          offsetMinutes: -360,
          timezoneId: 'CST',
        },
      },
    }).pipe(
      delay(2000),
      tap((locationData) => {
        console.log('Setting location data');

        this.setLocationData(locationData);
      })
    );
  }

  public getLocationData() {
    return this._locationData;
  }

  public getTimeZone() {
    return this._locationData?.practiceLocation?.timeZone;
  }

  public setLocationData(data: any) {
    this._locationData = data;
    this.locationDataSubject.next(data);
  }
}
