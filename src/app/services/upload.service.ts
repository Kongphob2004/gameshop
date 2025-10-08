import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  async uploadImage(file: File): Promise<string | null> {
    const url = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  }
}
