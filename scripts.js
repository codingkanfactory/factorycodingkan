import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get, push, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMcax3DSMbwCdf6ilMStGr7-wL3GVf8-Q",
  authDomain: "codingkan.firebaseapp.com",
  databaseURL: "https://codingkan-default-rtdb.firebaseio.com",
 projectId: "codingkan",
  storageBucket: "codingkan.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userNameInput = document.getElementById('user-name');
const userClassInput = document.getElementById('user-class');
const userTokenInput = document.getElementById('user-token');
const submitTokenBtn = document.getElementById('submit-token-btn');

const dialogOverlay = document.getElementById('dialog-overlay');
const customDialog = document.getElementById('custom-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogCloseBtn = document.getElementById('dialog-close-btn');

function showDialog(title, message, type) {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialogOverlay.style.display = 'block';
  customDialog.style.display = 'block';

  // Set dialog color based on type
  customDialog.classList.remove('success', 'error', 'warning');
  customDialog.classList.add(type);
}

function hideDialog() {
  dialogOverlay.style.display = 'none';
  customDialog.style.display = 'none';
}

dialogCloseBtn.addEventListener('click', hideDialog);

// Submit token
submitTokenBtn.addEventListener('click', async () => {
  const userName = userNameInput.value.trim();
  const userClass = userClassInput.value.trim();
  const userToken = userTokenInput.value.trim();

  if (!userName || !userClass || !userToken) {
    showDialog('Field Kosong', 'Harap isi semua field!', 'warning');
    return;
  }

  const tokenSnapshot = await get(ref(db, 'codes/current_code'));
  if (tokenSnapshot.exists() && tokenSnapshot.val() === userToken) {
    const attendanceRef = ref(db, `classes/${userClass}/users`);
    await push(attendanceRef, {
      name: userName,
      attendance: new Date().toISOString(),
      token: userToken
    });

    const newToken = generateToken();
    await update(ref(db, 'codes'), { current_code: newToken });

    showDialog('Absen Berhasil', 'Token berhasil digunakan!', 'success');
    userNameInput.value = '';
    userClassInput.value = '';
    userTokenInput.value = '';
  } else {
    showDialog('Token Tidak Valid', 'Harap periksa kembali token Anda.', 'error');
  }
});

// Generate random code
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Initialize Feather Icons
feather.replace();