import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../../component/navbar/navbar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfilePage {
  user: any = {};
  photoURL: string = '/assets/default.png'; // 🔹 ตั้งค่า default ไว้ก่อน

  constructor(private auth: AuthService, private router: Router) {
    // ✅ ดึงข้อมูลจาก sessionStorage แทน localStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.photoURL = this.user.photoURL || '/assets/default.png';
      console.log('✅ Loaded user:', this.user);
    } else {
      alert('กรุณาเข้าสู่ระบบก่อน');
      this.router.navigate(['/login']);
    }
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
