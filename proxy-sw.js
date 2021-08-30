self.addEventListener("install", function (event) {
    console.log("Service workers install.");
});

const proxy = "https://proxy.getfetch.workers.dev/?url=";

const sites = [
    "google.com",
    "t66y.com"
]

self.addEventListener("fetch", function (event) {
    let url = new URL(event.request.url)
    let host = url.hostname;
    let target = "";
    for (let site of sites) {
        if (host.includes(site)) {
            target = proxy + url.href;
            break;
        }
    }
    if (target == "") {
        target = url.href;
    }
    return fetch(target, event.request);
})