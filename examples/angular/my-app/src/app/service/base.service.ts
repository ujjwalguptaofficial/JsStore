import { Injectable } from '@angular/core';
import { IdbService } from './idb.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() {
    // turn on jsstore log status - help you to debug
    this.connection.setLogStatus(true);
  }

  get connection() {
    return IdbService.idbCon;
  }
}
