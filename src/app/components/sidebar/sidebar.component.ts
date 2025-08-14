import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getRole() {
    return this.authService.getRole();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['login']);
      }, error: () => {
        alert('Erreur lors de la deconnection.');
      }
    })
  }
}

