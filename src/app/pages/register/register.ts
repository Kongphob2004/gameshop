import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  selectedFile?: File;
  previewUrl: string | ArrayBuffer | null = null; // ✅ ตัวนี้ไว้แสดงรูปตัวอย่าง

  constructor(private auth: AuthService, private router: Router) {}

  // 📸 แสดงพรีวิวตอนเลือกไฟล์
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  // ✅ สมัครสมาชิก + อัปโหลดรูปไป Cloudinary (ผ่าน AuthService)
  async register() {
    try {
      await this.auth.register(
        this.email,
        this.password,
        this.name,
        this.selectedFile || undefined
      );
      alert('สมัครสมาชิกสำเร็จ!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert('สมัครไม่สำเร็จ: ' + err.message);
    }
  }
}
