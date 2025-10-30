// public/js/loadProfile.js
function chooseNearestSize(px) {
  const sizes = [16,32,64,128,256,512,1024,2048,4096];
  for (const s of sizes) if (s >= px) return s;
  return sizes[sizes.length-1];
}

async function waitForSelector(selector, timeout = 5000) {
  const found = document.querySelector(selector);
  if (found) return found;
  return new Promise((resolve) => {
    const start = Date.now();
    const iv = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(iv);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        resolve(null);
      }
    }, 100);
  });
}

async function loadProfile(){
  try{
    // also doesnt fucking work die
    const container = await waitForSelector('#profile-card', 5000);
    if(!container) return;

    const res = await fetch('https://discord-api.fetchprofile-api.workers.dev/', { cache: 'no-store' });
    if(!res.ok) return;
    const j = await res.json();

    const bannerImg = container.querySelector('.banner');
    const avatarImg = container.querySelector('.avatar');
    const usernameEl = container.querySelector('.username');

    if (bannerImg && j.banner) {
      const displayWidth = Math.max(1, Math.ceil(bannerImg.clientWidth * (window.devicePixelRatio || 1)));
      const size = chooseNearestSize(displayWidth);
      const url = j.banner.replace(/([?&])size=\d+/, `$1size=${size}`);
      bannerImg.src = url.includes('size=') ? url : j.banner + (j.banner.includes('?') ? '&' : '?') + 'size=' + size;
      bannerImg.src += '&v=' + Date.now();
    }

    if (avatarImg && j.avatar) {
      const displayWidth = Math.max(1, Math.ceil(avatarImg.clientWidth * (window.devicePixelRatio || 1)));
      const size = chooseNearestSize(displayWidth);
      const url = j.avatar.replace(/([?&])size=\d+/, `$1size=${size}`);
      avatarImg.src = url.includes('size=') ? url : j.avatar + (j.avatar.includes('?') ? '&' : '?') + 'size=' + size;
      avatarImg.src += '&v=' + Date.now();
    }

    if(usernameEl && j.username) usernameEl.textContent = j.username;
  }catch(e){ console.error(e); }
}

function runWhenReady(){
  // dom loading wait, doesnt work as i wanted it to though
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadProfile());
  } else {
    requestAnimationFrame(() => loadProfile());
  }
}

runWhenReady();