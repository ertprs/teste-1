import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {

  @HostListener('dragenter') onDragEnter(){
    console.warn('Hello World');
    this.isHovering = true;
  }

  @HostListener('dragleave') onDragOut(){
    console.warn('Hello World');
    this.isHovering = false;
  }
  
  private isHovering: boolean;
  
  constructor() { }
}
