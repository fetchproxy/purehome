self.addEventListener("install",function(event){
    console.log("Service workers install.");
});

self.addEventListener("fetch",function(event){
    return fetch(event.request);
})