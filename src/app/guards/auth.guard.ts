import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    // ✅ ตรวจว่ามี session อยู่ไหม
    if (this.auth.isLoggedIn()) {
      return true; // มี session → เข้าได้
    } else {
      alert('กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้'); // แจ้งเตือน
      this.router.navigate(['/login']); // เด้งกลับ login
      return false; // ไม่มี session → ห้ามเข้า
    }
  }
}
