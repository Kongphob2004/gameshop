import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { NavbarComponent } from './../../../component/navbar/navbar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent], // ✅ ต้องมีตรงนี้
  templateUrl: './user-home.html',
  styleUrls: ['./user-home.scss']
})
export class UserHomePage {
  constructor(private auth : AuthService, private router:Router){
    if (this.auth.isLoggedIn()) {
      console.log("Now Login");
  return ; // เข้าได้
} else {
  this.router.navigate(['/login']); // เด้งไปหน้า login
  alert("Pls Login");
  return ;
}
  }
}
