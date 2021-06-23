if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
};

var deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("'beforeinstallprompt' event was fired.")
});

async function installapp() {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`user response to the install prompt:${outcome}`);
};
