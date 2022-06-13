const sites = [{
    name: "AV淘宝",
    url: "http://www.avtb2177.com",
    pub: "http://www.avtbdizhi.org/",
    email: "",
    latest: "recent",
    url_latest: "{url}/{latest}/{page}/",
    video: "ul.videos li a",
    lastPage: "ul[class='pagination pagination-lg']",
    tags: "div[class='panel-body'] a",
    url_tag: "{url}/tag/{tag}/{page}/",
    url_video: "{url}/embed/{video}",
    inplay: true,
    proxy: true
},{
    name: "六九堂",
    url: "http://www.69t79.com",
    pub: "http://69tang.cc",
    email: "69tangdizhi@gmail.com",
    latest: "latest-updates",
    url_latest: "{url}/{latest}/{page}/",
    video: "div.item a",
    lastPage: "li.last a",
    tags: "div[class='box tags-cloud'] a",
    url_tag: "{url}/tags/{tag}/{page}/",
    url_video: "{url}/embed/{video}/",
    inplay: true,
    proxy: true
}, {
    name: "久久热",
    url: "http://www.99b61.com",
    pub: "https://www.ebay.co.uk/usr/yi-4298/",
    email: "99recom@gmail.com",
    latest: "latest-updates",
    url_latest: "{url}/{latest}/{page}/",
    video: "div.item a",
    lastPage: "li.last a",
    tags: "ul.list li a",
    url_tag: "{url}/categories/{tag}/{page}/",
    url_video: "{url}/embed/{video}/",
    inplay: true,
    proxy: true
}, {
    name: "SOAV",
    url: "https://www.ssp66.xyz",
    pub: "https://github.com/soavinfo/dizhi/wiki/1",
    email: "soavinfo@gmail.com",
    latest: "latest-updates",
    url_latest: "{url}/{latest}/{page}/",
    video: "div.item a",
    lastPage: "li.last a",
    tags: "div[class='box tags-cloud'] a",
    url_tag: "{url}/tags/{tag}/{page}/",
    url_video: "{url}/embed/{video}/1024",
    inplay: false,
    proxy: true
},  {
    name: "麻花传媒",
    url: "http://www.mahua03.com",
    pub: "",
    email: "",
    latest: "latest-updates",
    url_latest: "{url}/{latest}/{page}/",
    video: "div.item a",
    lastPage: "li.last a",
    tags: "div[class='box tags-cloud'] a",
    url_tag: "{url}/tags/{tag}/{page}/",
    url_video: "{url}/embed/{video}/",
    inplay: false,
    proxy: true
},  {
    name: "蝌蚪窝",
    url: "https://www.xiaobi077.com",
    pub: "https://www.ebay.com/usr/ke-6383",
    email: "kedou.xxx@gmail.com",
    latest: "latest-updates",
    url_latest: "{url}/{latest}/{page}/",
    video: "div.item a",
    lastPage: "li.last a",
    tags: "div[class='box tags-cloud'] a",
    url_tag: "{url}/tags/{tag}/{page}/",
    url_video: "{url}/embed/{video}/",
    inplay: true,
    proxy: true
}, ];

const siteModel = {
    name: "", //名称
    url: "", //地址
    pub: "", //发布页
    email: "", //邮箱
    latest: "latest-updates", //最新页
    url_latest: "{url}/{latest}/{page}/", //最新页地址
    video: "", //视频项目列表
    lastPage: "", //最后页
    tags: "", //类别列表
    url_tag: "{url}/tags/{tag}/{page}/", //类别页地址
    url_video: "{url}/embed/{video}/", //播放地址页
    inplay: false, //是否在页面内播放
    proxy: false //是否使用代理
}
