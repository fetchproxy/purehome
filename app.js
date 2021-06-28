const tagModel = [{
    name: "最新",
    url: "latest-updates",
}];

const videoModel = [{
    index: 0,
    time: "time",
    text: "",
    imgs: [],
    imgnum: 0,
}];

const appCache = {
    pages: {},
    videos: {}
};

const obj = {
    data() {
        return {
            sites: sites,
            tags: tagModel,
            videos: [],
            page: 1,
            pages: 1,
        };
    },
    mounted() {
        this.get();
    },
    updated() {
        closeLogo();
    },
    methods: {
        nextPage(event) {
            if (this.page < this.pages) {
                this.page += 1;
            } else {
                this.page = 1;
            }
            this.get();
        },
        prePage(event) {
            if (this.page > 1) {
                this.page--;
            } else {
                this.page = this.pages;
            }
            this.get();
        },
        async getHTML(url = "", proxy = false) {
            const worker = new Promise((resolve, reject) => {
                if (proxy == true) {
                    url = "https://online.getfetch.workers.dev/?url=" + url;
                }
                let request = new Request(url, { method: "GET" });
                if (document.cookie) {
                    request.headers.set("ccookie", document.cookie);
                    // console.log("request.ccookie", request.headers.get("ccookie"));
                }

                fetch(url).then(resp => {
                    let cookies = resp.headers.get("ccookie");
                    if (cookies) {
                        // console.log("response.ccookie", cookies);
                        setCookies(cookies);
                    };
                    return resp.text();
                }).then(text => {
                    resolve(text);
                }).catch((err) => {
                    console.error("fetch error", err);
                    resolve("");
                });
            });
            return await Promise.race([worker, this.timeout(10)]);
        },
        vague() {
            main.style.filter = "blur(3px)";
        },
        clear() {
            main.style.filter = "";
        },
        out(...args) {
            console.log(...args);
        },
        working(text = "") {
            working.style.display = "flex";
            message.textContent = text;
        },
        closeWorking() {
            working.style.display = "none";
            message.textContent = "";
        },
        getTime(duration) {
            let hzList = ["时长:", "分", "秒"];
            hzList.forEach(hz => {
                duration = duration.replace(hz, "");
            });
            duration = duration.trim();
            let list = duration.split(":");
            let flag = 3;
            if (list.length == 2) {
                flag = 2;
                if (list[0] > 60) {
                    let left = Math.floor(list[0] / 60);
                    let right = list[0] % 60;
                    duration = left + ":" + right + ":" + list[1];
                    flag = 3;
                }
            }
            let reg = /\d+/g;
            if (flag == 3) reg = /:\d+/g;
            duration = duration.replace(reg, (s) => {
                if (s.length == 1) s = "0" + s;
                return s;
            });
            return "时长 ▷ " + duration;
        },
        async changeTag() {
            this.page = 1;
            await this.get();
        },
        async changeSite() {
            this.tags = tagModel;
            tag.selectedIndex = 0;
            this.page = 1;
            await this.get();
        },
        changeImg(event) {
            let p = event.srcElement;
            let index = p.dataset.index;
            let parent = p.parentElement;
            let imgNumber = $$("div img", parent).length - 2;
            if (this.videos[index].imgnum < imgNumber) {
                this.videos[index].imgnum += 1;
            } else {
                this.videos[index].imgnum = 0;
            }
        },
        error(title = "", txt = "") {
            window.history.pushState(null, null);
            window.addEventListener("popstate", this.closeError, true);
            error.style.display = "flex";
            err_title.textContent = title;
            err_txt.innerHTML = txt;
        },
        closeError() {
            error.style.display = "none";
        },
        newPlay(event) {
            let ele = event.srcElement;
            let videoID = ele.dataset.video;
            let url = sites[site.value].url_video;
            url = url.replace("{url}", sites[site.value].url);
            url = url.replace("{video}", videoID);
            window.open(url, "_blank");
        },
        async play(event) {
            if (sites[site.value].inplay == false) {
                this.newPlay(event);
                return;
            }
            window.history.pushState(null, null);
            window.addEventListener("popstate", this.closePlay, true);
            play.style.display = "flex";
            let img = event.srcElement;
            let card = img.parentElement;
            let p = card.querySelector("p");
            let title = play.querySelector("p");
            title.textContent = p.textContent;
            let video = document.createElement("video");
            video.poster = img.src;
            video.controls = true;
            video.setAttribute("preload", "metadata");
            video.setAttribute("x-webkit-airplay", "allow");
            video.setAttribute("webkit-playsinline", "true");
            video.setAttribute("playsinline", "true");
            videoc.appendChild(video);
            let videoID = img.dataset.video;
            let url = sites[site.value].url_video;
            url = url.replace("{url}", sites[site.value].url);
            url = url.replace("{video}", videoID);

            if (appCache.videos[url] != undefined) {
                video.src = appCache.videos[url];
            } else {
                let html = await this.getHTML(url, sites[site.value].proxy);
                if (html != "") {
                    let src = await this.getVideoURL(html);
                    video.src = src;
                    if (src) {
                        appCache.videos[url] = src;
                    }
                }
            }
        },
        async timeout(long = 1) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("");
                }, long * 1000);
            });
        },
        async getVideoURL(html = "") {
            let div = $("#iframe");
            let iframe = document.createElement('iframe');
            iframe.muted = true;
            div.appendChild(iframe);
            let doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.write(html);
            doc.close();
            doc.cookie = document.cookie;
            // console.log("? document.cookie == iframe.cookie", doc.cookie == document.cookie);

            const run = new Promise((resolve, reject) => {
                if (html == "") resolve("");
                let redo = 0;
                let run_t1 = setInterval(() => {
                    redo = redo + 1;
                    if (redo == 200) {
                        clearInterval(run_t1);
                    }
                    let div = doc.querySelector("div[class='fp-ui']");
                    if (div) {
                        clearInterval(run_t1)
                        div.click();
                        let redo2 = 0;
                        let run_t2 = setInterval(() => {
                            redo2 = redo2 + 1;
                            if (redo2 == 200) clearInterval(run_t2);
                            let video = doc.querySelector('video');
                            if (video) {
                                clearInterval(run_t2);
                                video.muted = true;
                                div.click();
                                resolve(video.src);
                            }
                        }, 100);
                    }
                }, 100);
            });
            const avtb = new Promise((resolve, reject) => {
                if (html == "") resolve("");
                let redo = 0;
                let avtb_t1 = setInterval(() => {
                    redo = redo + 1;
                    if (redo == 200) clearInterval(avtb_t1);
                    let button = doc.querySelector('button');
                    if (button) button.click();
                    let video = doc.querySelector('video');
                    if (video) {
                        clearInterval(avtb_t1);
                        resolve(video.src);
                    }
                }, 100);
            });
            let src;
            switch (sites[site.value].name) {
                case "AV淘宝":
                    src = await Promise.race([avtb, this.timeout(10)]);
                    break;
                default:
                    src = await Promise.race([run, this.timeout(10)]);
            };
            iframe.remove();
            div.innerHTML = "";
            return src;
        },
        closePlay() {
            play.style.display = "none";
            let video = play.querySelector("video");
            video.remove();
        },
        openGotopage() {
            window.history.pushState(null, null);
            window.addEventListener("popstate", this.closeGotopage, true);
            this.vague();
            gotopage.style.display = "flex";
            inputPage.value = this.page;
        },
        closeGotopage() {
            this.clear();
            gotopage.style.display = "none";
        },
        async setupPage() {
            this.closeGotopage();
            let page = parseInt(inputPage.value);
            if (page >= 1 && page <= this.pages) {
                this.page = page;
                await this.get();
            } else {
                this.error("错 误", `输入页码${page}超出有效范围.`);
            }
        },
        getError() {
            this.clear();
            this.closeWorking();
            this.videos = [];
            let siteName = sites[site.value].name;
            let sitePub = sites[site.value].pub;
            let siteUrl = sites[site.value].url;
            let err = `获取 <a target="_blank" href="${siteUrl}">${siteName}</a> 错误`;
            err += `<br>查看 <a target="_blank" href="${sitePub}">地址发布页</a>`;
            this.error("错 误", err);
        },
        getURL() {
            let url;
            if (tag.value == 0) {
                url = sites[site.value].url_latest;
            } else {
                url = sites[site.value].url_tag;
            }

            if (this.page == 1) {
                switch (sites[site.value].name) {
                    case "青色阁":
                        url = url.replace("&page={page}", "");
                        break;
                    case "AV淘宝":
                        url = url.replace("/{latest}/", "");
                        url = url.replace("{page}/", "");
                        break;
                    default:
                        url = url.replace("{page}/", "");
                }
            }
            url = url.replace("{tag}", this.tags[tag.value].url);
            url = url.replace("{page}", this.page);
            url = url.replace("{time}", Date.now());
            url = url.replace("{url}", sites[site.value].url);
            url = url.replace("{latest}", sites[site.value].latest);
            return url;
        },
        getLastPage(select = "", doc = null) {
            let lastPage = $(select, doc);
            if (lastPage == null) {
                return;
            }
            switch (sites[site.value].name) {
                case "青色阁":
                    let txt = lastPage.textContent;
                    txt = txt.trim();
                    let qlist = txt.split("/");
                    this.pages = qlist[1];
                    break;
                case "AV淘宝":
                    let ele = lastPage.children[lastPage.children.length - 2];
                    let a = $("a", ele);
                    this.pages = a.textContent - 1;
                    break;
                default:
                    let list = lastPage.dataset["parameters"].split(":");
                    let pages = list[list.length - 1];
                    this.pages = pages - 1;
            }
        },
        getTags(select = "", doc = null) {
            if (tag.children.length == 1) {
                let tagList = [{
                    name: "最新",
                    url: "latest-updates"
                }];
                let tags = $$(select, doc);
                if (tags == null) {
                    this.getError();
                    return;
                }
                switch (sites[site.value].name) {
                    case "青色阁":
                        let arrayIndex = 2;
                        tags.forEach(tag => {
                            if (tag.getAttribute("href") == "/") {
                                return;
                            }
                            if (tag.getAttribute("href")[tag.getAttribute("href").length - 1] == "1") return;
                            tagList.push({ name: tag.textContent, url: arrayIndex });
                            arrayIndex++;
                        });
                        this.tags = tagList;
                        break;
                    case "SOAV":
                        break;
                    default:
                        tags.forEach(tag => {
                            let list = tag.getAttribute("href").split("/");
                            if (list[list.length - 2] == "tags") return;
                            switch (sites[site.value].name) {
                                case "久久热":
                                    let tagName = tag.innerText.replace(/\d*/g, "");
                                    tagName = tagName.substr(0, 5);
                                    tagList.push({ name: tagName, url: list[list.length - 2] });
                                    break;
                                default:
                                    tagList.push({ name: tag.innerText, url: list[list.length - 2] });
                            }
                        });
                        this.tags = tagList;
                }
            }
        },
        getVideos(select = "", doc = null) {
            let videos = $$(select, doc);
            if (videos == null) {
                this.videos = [];
                this.getError();
                return;
            }
            let videoList = [];
            videos.forEach(ele => {
                let list
                let videoID;
                switch (sites[site.value].name) {
                    case "青色阁":
                        let aList = $$("a", ele);
                        let a = aList[1];
                        videoID = a.getAttribute("href");
                        videoID = videoID.split("/");
                        videoID = videoID[videoID.length - 1];
                        break;
                    case "SOAV":
                        list = ele.getAttribute("href").split("/");
                        videoID = list[list.length - 2];
                        break;
                    default:
                        list = ele.getAttribute("href").split("/");
                        videoID = list[list.length - 3];
                }

                let title;
                switch (sites[site.value].name) {
                    case "青色阁":
                        let aList = $$("a", ele);
                        let a = aList[1];
                        title = a.children[0].textContent;
                        break;
                    default:
                        title = ele.getAttribute("title");
                }

                let img;
                let picNum;
                let imgURL;
                let imgList = [];
                switch (sites[site.value].name) {
                    case "青色阁":
                        picNum = 0;
                        let aList = $$("a", ele);
                        let a = aList[0];
                        let style = a.getAttribute("style");
                        let start = style.lastIndexOf("http");
                        let end = style.lastIndexOf(")");
                        imgURL = style.substr(start, end - start);
                        imgList.push(imgURL);
                        break;
                    default:
                        img = $("img", ele);
                        picNum = img.dataset['cnt'] || 5;
                        imgURL = img.dataset['original'] || img.src;
                        if (imgURL[0] == "/") {
                            imgURL = sites[site.value].url + imgURL;
                        }
                        let picUrl = imgURL;


                        let wz = picUrl.lastIndexOf(".");
                        let wz2 = picUrl.lastIndexOf("/");
                        let left = picUrl.substr(0, wz2 + 1);
                        let right = picUrl.substr(wz);
                        for (i = 1; i <= picNum; i++) {
                            imgList.push(left + i + right);
                        }
                }

                let duration;
                switch (sites[site.value].name) {
                    case "青色阁":
                        duration = document.createElement("div");
                        break;
                    case "AV淘宝":
                        duration = $("span[class='video-overlay badge transparent']", ele);
                        break;
                    default:
                        duration = $("div.duration", ele);
                }

                let videoOBJ = {};
                videoOBJ.time = this.getTime(duration.textContent);
                videoOBJ.text = title;
                videoOBJ.imgs = imgList;
                videoOBJ.imgnum = 0;
                videoOBJ.video = videoID;
                videoList.push(videoOBJ);
            });
            this.videos = videoList;
            if (videoList.length > 0) {
                appCache.pages[this.getURL()] = videoList;
            }
        },
        async get() {
            this.vague();
            this.working("获 取 视 频 资 源 ......")
            // 
            let url = this.getURL();
            if (appCache.pages[url] != undefined) {
                this.videos = appCache.pages[url];
                main.scroll(0, 0);
                this.clear();
                this.closeWorking();
                return;
            }

            let html = await this.getHTML(url, sites[site.value].proxy);
            if (html == "") {
                this.getError();
                return;
            }

            let doc = document.createElement("html");
            doc.innerHTML = html;
            //
            this.getLastPage(sites[site.value].lastPage, doc);
            //
            this.getTags(sites[site.value].tags, doc);
            //
            this.getVideos(sites[site.value].video, doc);
            //
            main.scroll(0, 0);
            this.clear();
            this.closeWorking();
        }
    }
};

const app = Vue.createApp(obj).mount(".view");
