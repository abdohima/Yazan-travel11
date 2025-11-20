// app.js - main app logic (module)
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Upload to Catbox
export async function uploadToCatbox(file) {
  if (!file) return '';
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', file);

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  if (!text || !text.startsWith('http')) throw new Error('Upload failed: '+text);
  return text;
}

// Destination form
document.addEventListener('DOMContentLoaded', () => {
  // Music play on first interaction
  const audio = document.getElementById('music');
  if (audio) {
    audio.volume = 0.2;
    const play = () => { audio.play().catch(()=>{}); document.removeEventListener('click', play); document.removeEventListener('touchstart', play); };
    document.addEventListener('click', play, { once: true });
    document.addEventListener('touchstart', play, { once: true });
  }

  const destForm = document.getElementById('addDestinationForm');
  if (destForm) destForm.addEventListener('submit', handleAddDestination);

  const hotelForm = document.getElementById('addHotelForm');
  if (hotelForm) hotelForm.addEventListener('submit', handleAddHotel);
});

// Handle add destination
async function handleAddDestination(e) {
  e.preventDefault();
  try {
    const title = document.getElementById('destTitle').value.trim();
    const location = document.getElementById('destLocation').value.trim();
    const desc = document.getElementById('destDesc').value.trim();
    const file = document.getElementById('destImage').files[0];

    let imageUrl = '';
    if (file) imageUrl = await uploadToCatbox(file);

    await addDoc(collection(db, 'destinations'), {
      title, location, desc, image: imageUrl, createdAt: serverTimestamp()
    });

    alert('تمت إضافة الوجهة بنجاح');
    document.getElementById('addDestinationForm').reset();
  } catch (err) {
    console.error(err);
    alert('حصل خطأ أثناء الإضافة: ' + (err.message || err));
  }
}

// Handle add hotel
async function handleAddHotel(e) {
  e.preventDefault();
  try {
    const name = document.getElementById('hotelName').value.trim();
    const location = document.getElementById('hotelLocation').value.trim();
    const desc = document.getElementById('hotelDesc').value.trim();
    const price = document.getElementById('hotelPrice').value.trim();
    const file = document.getElementById('hotelImage').files[0];

    let imageUrl = '';
    if (file) imageUrl = await uploadToCatbox(file);

    await addDoc(collection(db, 'hotels'), {
      name, location, desc, price, image: imageUrl, createdAt: serverTimestamp()
    });

    alert('تمت إضافة الفندق بنجاح');
    document.getElementById('addHotelForm').reset();
  } catch (err) {
    console.error(err);
    alert('حصل خطأ أثناء الإضافة: ' + (err.message || err));
  }
}

// Simple fetch displays (placeholder)
export async function fetchDestinations() {
  const el = document.getElementById('dest-list');
  el.textContent = 'جارٍ التحميل...';
  // fetching code can be added here
}
