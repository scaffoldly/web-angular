import { Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() disabled = false;
  @Input() text = 'Submit';
  @Input() color = 'primary';
  @Input() errorColor = 'danger';
  @Input() form: NgForm;

  width: number;
  height: number;

  textRef: ElementRef;
  buttonRef: ElementRef;
  spinnerRef: ElementRef;
  checkRef: ElementRef;

  originalDisabled = false;

  constructor(private renderer: Renderer2) {}

  @ViewChild('textViewChild')
  set textViewChild(textRef: ElementRef) {
    this.textRef = textRef;
  }

  @ViewChild('buttonViewChild')
  set buttonViewChild(buttonRef: ElementRef) {
    this.buttonRef = buttonRef;
    this.width = buttonRef.nativeElement.offsetWidth;
    this.height = buttonRef.nativeElement.offsetHeight;
    this.renderer.addClass(buttonRef.nativeElement, `btn-${this.color}`);
  }

  @ViewChild('spinnerViewChild')
  set spinnerViewChild(spinnerRef: ElementRef) {
    this.spinnerRef = spinnerRef;
  }

  @ViewChild('checkViewChild')
  set checkViewChild(checkRef: ElementRef) {
    this.checkRef = checkRef;
  }

  ngOnInit(): void {
    this.originalDisabled = this.disabled;
  }

  click(): void {
    this.textRef.nativeElement.style.display = 'none';
    this.buttonRef.nativeElement.style.width = `${this.width}px`;
    this.buttonRef.nativeElement.style.height = `${this.height}px`;
    this.spinnerRef.nativeElement.style.display = 'inline';
    this.spinnerRef.nativeElement.style.width = `${this.height * 0.5}px`;
    this.spinnerRef.nativeElement.style.height = `${this.height * 0.5}px`;
    this.disabled = true;
    this.form.ngSubmit.emit();
  }

  reset(error = false): void {
    if (error) {
      this.renderer.addClass(this.checkRef.nativeElement, 'fa-times');
      this.renderer.addClass(this.checkRef.nativeElement, 'text-danger');
      this.checkRef.nativeElement.style.display = 'inline';
    } else {
      this.renderer.addClass(this.checkRef.nativeElement, 'fa-check');
      this.checkRef.nativeElement.style.display = 'inline';
    }

    this.spinnerRef.nativeElement.style.display = 'none';

    setTimeout(() => {
      this.checkRef.nativeElement.style.display = 'none';
      this.textRef.nativeElement.style.display = 'inline';
      this.renderer.removeClass(this.checkRef.nativeElement, 'fa-times');
      this.renderer.removeClass(this.checkRef.nativeElement, 'fa-check');
      this.renderer.removeClass(this.checkRef.nativeElement, 'text-danger');
      this.disabled = this.originalDisabled;
    }, 1000);
  }
}
