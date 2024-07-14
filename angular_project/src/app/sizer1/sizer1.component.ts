import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sizer',
  standalone: true,
  imports: [],
  templateUrl: './sizer1.component.html',
  styleUrl: './sizer1.component.css'
})
export class Sizer1Component implements OnInit {
  constructor() {
    this.size = 10;
  }
  ngOnInit() {
    this.size = 10;
  }
  @Input() size: number | string;
  @Output() sizeChange = new EventEmitter<number>();
  dec() { this.resize(-1); }
  inc() { this.resize(+1); }
  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }

}
