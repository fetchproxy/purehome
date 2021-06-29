self.addEventListener("fetch", function (event) {
    let oldURL = event.request.url;
    newURL = new URL(oldURL);
    if (newURL.host.toLowerCase().includes("google.com")) {
        return fetch("https://search.getfetch.workers.dev/?url=" + oldURL, event.request);
    } else {
        return fetch(event.request);
    }
})
