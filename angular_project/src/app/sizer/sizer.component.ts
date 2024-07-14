import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sizer',
  standalone: true,
  imports: [RouterModule , AppComponent],
  templateUrl: './sizer.component.html',
  styleUrl: './sizer.component.css'
})
export class SizerComponent implements OnInit  {
  constructor() {
    this.size = 1; // default
  }
  ngOnInit(): void {
      this.size= 10;
  }
  @Input() size: number | string;
  @Output() sizeChange = new EventEmitter<number>()

  dec() {this.resize(-1)}
  inc() {this.resize(+1)}
  resize(delta:number){
    this.size = Math.min(40, Math.max(8, +this.size + delta));
this.sizeChange.emit(this.size);
  }
}
