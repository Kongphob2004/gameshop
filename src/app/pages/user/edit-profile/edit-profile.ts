import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { NavbarComponent } from '../../../component/navbar/navbar.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss'],
})
export class EditProfilePage {
  user = JSON.parse(sessionStorage.getItem('user') || '{}'); // ✅ เปลี่ยนเป็น sessionStorage
  name = this.user.name || '';
  email = this.user.email || '';
  previewUrl: string | null = this.user.photoURL || null;
  selectedFile?: File;

  constructor(
    private auth: AuthService,
    private upload: UploadService,
    private router: Router
  ) {
    // ✅ ตรวจสถานะการล็อกอิน
    if (!this.auth.isLoggedIn()) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      this.router.navigate(['/login']);
    } else {
      console.log('✅ Now Login as:', this.user?.email);
    }
  }

  // ✅ พรีวิวรูปใหม่
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) =>
        (this.previewUrl = (e.target as FileReader).result as string);
      reader.readAsDataURL(file);
    }
  }

  // ✅ บันทึกข้อมูลใหม่
  async save() {
    if (!this.user?.uid) {
      alert('ไม่พบ UID ของผู้ใช้ (session หมดอายุ)');
      console.error('❌ user.uid is undefined:', this.user);
      this.router.navigate(['/login']);
      return;
    }

    try {
      let photoURL = this.previewUrl;

      // 🔹 อัปโหลดรูปใหม่ (ถ้ามี)
      if (this.selectedFile) {
        const uploadedUrl = await this.upload.uploadImage(this.selectedFile);
        if (uploadedUrl) photoURL = uploadedUrl;
      }

      // 🔹 อัปเดตข้อมูลใน Firestore
      await this.auth.updateUser(
        this.user.uid,
        this.name,
        this.email,
        this.selectedFile || undefined
      );

      // 🔹 อัปเดตข้อมูล session ปัจจุบัน
      const updatedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
this.user = updatedUser;

      sessionStorage.setItem('user', JSON.stringify(updatedUser));

      alert('✅ อัปเดตข้อมูลสำเร็จ');
      this.router.navigate(['/user-profile']);
    } catch (err: any) {
      console.error('❌ Error while updating user:', err);
      alert('อัปเดตไม่สำเร็จ: ' + err.message);
    }
  }

  cancel() {
    this.router.navigate(['/user-profile']);
  }
}
