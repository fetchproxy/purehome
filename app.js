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
                fetch(url, {
                    referrer: "",
                    referrerPolicy: "no-referrer"
                }).then(resp => {
                    let cookies = resp.headers.get("ccookie");
                    let list = cookies.split("; ");
                    list.forEach(one => {
                        document.cookie = one;
                    })
                    return resp.text();
                }).then(text => {
                    resolve(text);
                }).catch(() => {
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
            // this.tag = this.tags[0].url;
            await this.get();
        },
        changeImg(event) {
            let p = event.srcElement;
            let index = p.dataset.index;
            if (this.videos[index].imgnum < 4) {
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
            let html = await this.getHTML(url, sites[site.value].proxy);
            if (html != "") {
                let src = await this.getVideo(html);
                console.log("video src:", src);
                video.src = src;
            }
        },
        async timeout(long = 1) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("");
                }, long * 1000);
            });
        },
        async getVideo(html = "") {
            let div = $("#iframe");
            let iframe = document.createElement('iframe');
            iframe.muted = true;
            div.appendChild(iframe);

            const run = new Promise((resolve, reject) => {
                if (html == "") resolve("");
                let doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.write(html);
                doc.close();

                let t1 = setInterval(() => {
                    let div = doc.querySelector("div[class='fp-ui']");
                    if (div) {
                        clearInterval(t1)
                        div.click();
                        let t2 = setInterval(() => {
                            let video = doc.querySelector('video');
                            if (video) {
                                clearInterval(t2);
                                video.muted = true;
                                div.click();
                                resolve(video.src);
                            }
                        }, 100);
                    }
                }, 100);
            });
            let src = await Promise.race([run, this.timeout(10)]);
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
        async get() {
            this.vague();
            this.working("获 取 视 频 资 源 ......")
            // 
            let url = this.getURL();
            let html = await this.getHTML(url, sites[site.value].proxy);
            if (html == "") {
                this.getError();
                return;
            }

            let doc = document.createElement("html");
            doc.innerHTML = html;
            //
            let elem = $(sites[site.value].lastPage, doc);
            if (elem != null) {
                switch (sites[site.value].name) {
                    case "AV淘宝":
                        let ele = elem.children[elem.children.length - 2];
                        let a = $("a", ele);
                        this.pages = a.textContent - 1;
                        break;
                    default:
                        let list = elem.dataset["parameters"].split(":");
                        let pages = list[list.length - 1];
                        this.pages = pages - 1;
                }
            } else {
                this.pages = 1;
            }

            //
            if (tag.children.length == 1) {
                switch (sites[site.value].name) {
                    case "SOAV":
                        break;
                    default:
                        let tagList = [{
                            name: "最新",
                            url: "latest-updates"
                        }];
                        let tags = $$(sites[site.value].tags, doc);
                        if (tags == null) {
                            this.getError();
                            return;
                        }
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

            //
            let videos = $$(sites[site.value].video, doc);
            if (videos == null) {
                this.videos = [];
                this.page = 1;
                this.pages = 1;
                this.getError();
                return;
            }
            let videoList = [];
            let videoCount = 0;
            videos.forEach(a => {
                let list = a.getAttribute("href").split("/");
                let videoID;
                switch (sites[site.value].name) {
                    case "SOAV":
                        videoID = list[list.length - 2];
                        break;
                    default:
                        videoID = list[list.length - 3];
                }

                let title = a.getAttribute("title");

                let img = $("img", a);
                let picNum = img.dataset['cnt'] || 5;
                let imgURL = img.dataset['original'] || img.src;

                if (imgURL[0] == "/") {
                    imgURL = sites[site.value].url + imgURL;
                }
                let picUrl = imgURL;

                let imgList = [];
                let wz = picUrl.lastIndexOf(".");
                let wz2 = picUrl.lastIndexOf("/");
                let left = picUrl.substr(0, wz2 + 1);
                let right = picUrl.substr(wz);
                for (i = 1; i <= picNum; i++) {
                    imgList.push(left + i + right);
                }

                let duration;
                switch (sites[site.value].name) {
                    case "AV淘宝":
                        duration = $("span[class='video-overlay badge transparent']", a);
                        break;
                    default:
                        duration = $("div.duration", a);
                }

                let videoOBJ = {};
                videoOBJ.time = this.getTime(duration.textContent);
                videoOBJ.text = title;
                videoOBJ.imgs = imgList;
                videoOBJ.imgnum = 1;
                videoOBJ.index = videoCount;
                videoCount += 1;
                videoOBJ.video = videoID;
                videoList.push(videoOBJ);
            });
            this.videos = videoList;
            main.scroll(0, 0);
            this.clear();
            this.closeWorking();
        }
    }
};

const app = Vue.createApp(obj).mount(".view");
