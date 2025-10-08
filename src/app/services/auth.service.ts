import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  constructor() {}

  // ✅ Upload รูปขึ้น Cloudinary
  private async uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    return data.secure_url;
  }
  // ✅ ดึงข้อมูลจาก Firestore
async getUserData(uid: string) {
  const userRef = doc(this.db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    const data = snap.data();
    console.log('📦 Firestore user data:', data);
    return data;
  }
  return null;
}

  // ✅ สมัครสมาชิก
  async register(email: string, password: string, name: string, file?: File) {
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);
  const user = cred.user;

  // 🔹 อัปโหลดรูปไป Cloudinary (หรือใช้ default)
  let photoURL = '/assets/default.png';
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) throw new Error('อัปโหลดรูปภาพล้มเหลว');
    const data = await res.json();
    photoURL = data.secure_url;
  }

  // 🔹 บันทึกข้อมูลใน Firestore
 await setDoc(doc(this.db, 'users', user.uid), {
  uid: user.uid,
  name,
  email,
  photoURL,
  role: 'user',
  createdAt: serverTimestamp(),
});

  // ✅ เก็บข้อมูลใน sessionStorage
  sessionStorage.setItem(
    'user',
    JSON.stringify({ uid: user.uid, name, email, photoURL, role: 'user' })
  );
  localStorage.setItem('user', JSON.stringify({ uid: user.uid, name, email, photoURL }));

  return user;
}
async login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(this.auth, email, password);
  const user = cred.user;
  let userData: any = null;

  // ✅ 1. ดึงข้อมูลจาก collection 'users'
  const userRef = doc(this.db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    userData = userSnap.data();
    console.log('👤 พบใน users:', userData);
  } else {
    // ✅ 2. ถ้าไม่พบใน users → ไปเช็กใน collection 'admin'
    const adminRef = doc(this.db, 'admin', 'admin');
    const adminSnap = await getDoc(adminRef);

   if (adminSnap.exists()) {
  const adminData: any = adminSnap.data(); // 👈 บอก Type ว่าเป็น any
  if (adminData['email'] === email) {      // 👈 ใช้ ['email'] แทน .email
    userData = { ...adminData, role: 'admin' };
    console.log('🛠️ พบใน admin:', userData);
  }
  localStorage.setItem('user', JSON.stringify(userData)); // ✅ เพิ่มตรงนี้
}

  }

  // ✅ ถ้ายังไม่เจอข้อมูลเลย
  if (!userData) {
    throw new Error('ไม่พบข้อมูลผู้ใช้ใน Firestore');
  }

  // ✅ เก็บข้อมูลลง sessionStorage
  sessionStorage.setItem('user', JSON.stringify(userData));
  console.log('✅ Login success:', userData);

  return userData;
}



  // ✅ อัปเดตโปรไฟล์
async updateUser(uid: string, name: string, email: string, file?: File) {
  try {
    console.log('🟢 updateUser called with:', { uid, name, email });

    if (!uid) {
      console.error('❌ UID is undefined');
      throw new Error('UID is undefined');
    }

    let photoURL = '';
    if (file) {
      photoURL = await this.uploadImageToCloudinary(file);
      console.log('✅ Uploaded new image:', photoURL);
    }

    const userRef = doc(this.db, 'users', uid);
    console.log('📍 Firestore path = users/' + uid);

    const updateData: any = {
      name,
      email,
      updatedAt: serverTimestamp(),
    };
    if (photoURL) updateData.photoURL = photoURL;

    console.log('📤 Sending data to Firestore:', updateData);

    await updateDoc(userRef, updateData);

    console.log('✅ Firestore updated successfully!');

    // ✅ อัปเดตใน sessionStorage
    const current = JSON.parse(sessionStorage.getItem('user') || '{}');
    const updatedUser = {
      ...current,
      name,
      email,
      photoURL: photoURL || current.photoURL,
    };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));

    console.log('✅ sessionStorage updated:', updatedUser);
  } catch (err) {
    console.error('❌ updateUser ERROR:', err);
    throw err;
  }
}

  logout() {
    signOut(this.auth);
    sessionStorage.clear();
  }

  isLoggedIn() {
    return !!sessionStorage.getItem('user');
  }
}
