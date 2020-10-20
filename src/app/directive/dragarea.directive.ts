import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[dragarea]'
})
export class DragareaDirective {

  @HostListener('dragenter') onDragEnter(){
    console.warn('Hello World');
    this.isHovering = true;
  }

  @HostListener('dragleave') onDragOut(){
    console.warn('Hello World');
    this.isHovering = false;
  }
  
  private isHovering : boolean = false;
  constructor() { }

}
