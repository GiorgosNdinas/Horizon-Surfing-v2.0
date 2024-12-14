import { IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SignaturePad, SignaturePadModule } from 'angular2-signaturepad';


@Component({
  selector: 'app-sign-pad',
  standalone: true,
  imports: [
    CommonModule,
    SignaturePadModule,
    IonButton
  ],
  template: `
    <div class="signPad">
      <signature-pad 
        [options]="signaturePadOptions" 
        (onBeginEvent)="drawStart()" 
        (onEndEvent)="drawComplete()">
      </signature-pad>
      <ion-button style="position: absolute; top: 0; right: 0;" (click)="drawClear()">
       Clear 
      </ion-button>
    </div>
  `,
  styleUrl: './sign-pad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignPadComponent implements AfterViewInit { 

  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  @Output() signature: EventEmitter<string> = new EventEmitter()

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  ngAfterViewInit() {
    this.drawClear();
    this.canvasResize();
  }

  canvasResize(){
    let canvas = document.querySelector('canvas');
    canvas!.width = window.innerWidth - 20;
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.signature.emit(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  drawClear(){
    this.signaturePad.clear();
    this.signature.emit('');
  }
}
