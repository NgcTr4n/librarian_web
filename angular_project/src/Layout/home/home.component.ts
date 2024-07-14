import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent} from '../sidebar/sidebar.component';
import { ContainerComponent } from '../container/container.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BookComponent } from '../book/book.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, ContainerComponent, RouterOutlet, RouterModule, BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
