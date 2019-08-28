import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircuitService } from './services/circuit/circuit.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CircuitService
  ]
})
export class SharedModule { }
