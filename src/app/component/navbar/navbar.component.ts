import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private router: Router, private auth: AuthService) {}

  goTo(page: string) {
    this.router.navigate(['/' + page]);
  }

  async logout() {
    await this.auth.logout(); // เรียกออกจากระบบ
    this.router.navigate(['/login']); // กลับไปหน้า login
  }
}
