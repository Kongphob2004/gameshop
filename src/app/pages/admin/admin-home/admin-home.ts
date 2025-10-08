import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.scss'],
})
export class AdminHomePage {
  constructor(private router: Router, private auth : AuthService) {
        if (this.auth.isLoggedIn()) {
          console.log("ADMIN Login");
      return ; // เข้าได้
    } else {
      this.router.navigate(['/login']); // เด้งไปหน้า login
      alert("Pls Login");
      return ;
    }
      }

      async logout() {
    await this.auth.logout(); // เรียกออกจากระบบ
    this.router.navigate(['/login']); // กลับไปหน้า login
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
