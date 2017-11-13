import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCrudPage } from './my-crud';

@NgModule({
  declarations: [
    MyCrudPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCrudPage),
  ],
})
export class MyCrudPageModule {}
