import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
   try {
      const user = await this.auth.login(this.email, this.password);

      if (user.role === 'admin') {
        alert('เข้าสู่ระบบสำเร็จ (Admin)');
        this.router.navigate(['/admin-home']);
      } else {
        alert('เข้าสู่ระบบสำเร็จ (User)');
        this.router.navigate(['/user-home']);
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      alert('เข้าสู่ระบบไม่สำเร็จ: ' + err.message);
    }
  
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
