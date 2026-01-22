document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('yoinkBtn');
  const status = document.getElementById('status');
  let iframeSrc = null;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      status.textContent = 'No active tab found.';
      return;
    }

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const iframe = document.querySelector('iframe');
        return iframe ? iframe.src : null;
      }
    });

    if (result && result[0] && result[0].result) {
      iframeSrc = result[0].result;
      btn.textContent = 'YOINK IT!';
      btn.disabled = false;
      status.textContent = 'Target acquired for yoinking!';
    } else {
      btn.textContent = 'No Loot Found';
      status.textContent = 'Nothing to yoink here (no iframes).';
      status.classList.add('error');
    }
  } catch (err) {
    status.textContent = 'Yoink failed: ' + err.message;
    status.classList.add('error');
    console.error(err);
  }

  btn.addEventListener('click', () => {
    if (iframeSrc) {
      chrome.tabs.create({ url: iframeSrc });
    }
  });
});
