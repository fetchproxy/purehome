if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
};

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("'beforeinstallprompt' event was fired.")
});