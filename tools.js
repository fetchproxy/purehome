const $ = (select = "", parent = null) => {
    if (parent == null) {
        return document.querySelector(select);
    }
    return parent.querySelector(select);
};

const $$ = (select = "", parent = null) => {
    if (parent == null) {
        return document.querySelectorAll(select);
    }
    return parent.querySelectorAll(select);
};

const cookie = (name = "") => {
    let allcookies = document.cookie;
    let start = allcookies.indexOf(name);
    let value = "";

    if (start != -1) {
        start += name.length + 1;
        let end = allcookies.indexOf(";", start);
        if (end == -1) {
            end = allcookies.length;
        }

        value = unescape(allcookies.substring(start, end));
    }
    return value;
};

const run = (name = "", fn, ...args) => {
    try {
        return fn.call(null, ...args);
    } catch (error) {
        let stack = error.stack;
        let errList = stack.split("\n")
        let errLine = errList[1].replace(")", "");
        errLine = errLine.split(":");
        let line = errLine[errLine.length - 2];
        let column = errLine[errLine.length - 1];
        console.log(`${name}(${[...args]}) at line ${line} column ${column} : ${error.message}`);
    }
};

const setCookies = (cookies = "") => {
    document.cookie = cookies;
}
