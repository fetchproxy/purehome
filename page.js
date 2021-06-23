function openLogo() {
    logo.style.display = "flex";
    let timeout = setTimeout(() => {
        closeLogo(timeout);
    }, 4 * 1000);
};

function closeLogo(timeout = 0) {
    logo.style.display = "none";
    let view = document.querySelector(".view");
    view.style.display = "grid";
    clearTimeout(timeout);
};

function showBody() {
    let msg = `body ${document.body.offsetHeight} * ${document.body.offsetWidth} , `;
    msg = msg + `screen ${screen.height} * ${screen.width}`;
    alert(msg);
};

async function installapp() {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`user response to the install prompt:${outcome}`);
};