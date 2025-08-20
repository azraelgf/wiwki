(() => {
    "use strict";
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", function() {
            setTimeout(function() {
                document.documentElement.classList.add("loaded");
            }, 0);
        });
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                lockPaddingElements.forEach(lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                });
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach(lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            });
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    function spoilers() {
        const spoilersArray = document.querySelectorAll("[data-spoilers]");
        if (spoilersArray.length > 0) {
            const spoilersRegular = Array.from(spoilersArray).filter(function(item, index, self) {
                return !item.dataset.spoilers.split(",")[0];
            });
            if (spoilersRegular.length) initspoilers(spoilersRegular);
            let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach(mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", function() {
                    initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            function initspoilers(spoilersArray, matchMedia = false) {
                spoilersArray.forEach(spoilersBlock => {
                    spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spoilersBlock.classList.add("_spoiler-init");
                        initSpollerBody(spoilersBlock);
                        spoilersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spoilersBlock.classList.remove("_spoiler-init");
                        initSpollerBody(spoilersBlock, false);
                        spoilersBlock.removeEventListener("click", setSpollerAction);
                    }
                });
            }
            function initSpollerBody(spoilersBlock, hideSpollerBody = true) {
                let spollerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter(item => item.closest("[data-spoilers]") === spoilersBlock);
                    spollerTitles.forEach(spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoiler-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    });
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoiler]")) {
                    const spollerTitle = el.closest("[data-spoiler]");
                    const spoilersBlock = spollerTitle.closest("[data-spoilers]");
                    const oneSpoller = spoilersBlock.hasAttribute("data-one-spoller");
                    const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    if (!spoilersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoiler-active")) hidespoilersBody(spoilersBlock);
                        spollerTitle.classList.toggle("_spoiler-active");
                        _slideToggle(spollerTitle.nextElementSibling, spoilerspeed);
                    }
                    e.preventDefault();
                }
            }
            function hidespoilersBody(spoilersBlock) {
                const spollerActiveTitle = spoilersBlock.querySelector("[data-spoiler]._spoiler-active");
                const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                if (spollerActiveTitle && !spoilersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoiler-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spoilerspeed);
                }
            }
            const spoilersClose = document.querySelectorAll("[data-spoiler-close]");
            if (spoilersClose.length) document.addEventListener("click", function(e) {
                const el = e.target;
                if (!el.closest("[data-spoilers]")) spoilersClose.forEach(spollerClose => {
                    const spoilersBlock = spollerClose.closest("[data-spoilers]");
                    if (spoilersBlock.classList.contains("_spoiler-init")) {
                        const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                        spollerClose.classList.remove("_spoiler-active");
                        _slideUp(spollerClose.nextElementSibling, spoilerspeed);
                    }
                });
            });
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        });
    }
    function uniqArray(array) {
        return array.filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter(function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        });
        if (media.length) {
            const breakpointsArray = [];
            media.forEach(item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });
            let mdQueries = breakpointsArray.map(function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach(breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter(function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    });
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                });
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", function(e) {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);
    window.addEventListener("load", () => {
        if (window.matchMedia("(min-width: 991.98px)").matches) {
            document.querySelectorAll(".top-header__link_sub").forEach(wrap => {
                let hideT;
                const open = () => {
                    clearTimeout(hideT);
                    wrap.classList.add("_active");
                };
                const close = () => wrap.classList.remove("_active");
                wrap.addEventListener("mouseenter", open);
                wrap.addEventListener("mouseleave", () => {
                    hideT = setTimeout(close, 120);
                });
                wrap.querySelector(".top-header__link-btn")?.addEventListener("click", e => {
                    e.preventDefault();
                    wrap.classList.toggle("_active");
                });
            });
            document.querySelectorAll(".menu__item_has-submenu").forEach(wrap => {
                let hideT;
                const open = () => {
                    clearTimeout(hideT);
                    wrap.classList.add("_active");
                };
                const close = () => wrap.classList.remove("_active");
                wrap.addEventListener("mouseenter", open);
                wrap.addEventListener("mouseleave", () => {
                    hideT = setTimeout(close, 120);
                });
                wrap.querySelector(".menu__item_has-submenu .menu__link")?.addEventListener("click", e => {
                    e.preventDefault();
                    wrap.classList.toggle("_active");
                });
            });
        }
        const mql = window.matchMedia("(max-width: 1199.98px)");
        const header = document.querySelector(".header");
        const banner = document.querySelector(".info-banner");
        if (!header || !banner) return;
        const isVisible = el => {
            if (!el || !el.isConnected) return false;
            const cs = getComputedStyle(el);
            return cs.display !== "none" && cs.visibility !== "hidden" && !el.classList.contains("_hide");
        };
        function updateBannerState() {
            const visible = mql.matches && isVisible(banner);
            const h = visible ? Math.round(banner.getBoundingClientRect().height) : 0;
            header.style.setProperty("--banner-h", h + "px");
            header.classList.toggle("header_top", visible);
            return h;
        }
        updateBannerState();
        window.addEventListener("load", updateBannerState);
        window.addEventListener("resize", updateBannerState);
        mql.addEventListener ? mql.addEventListener("change", updateBannerState) : mql.addListener(updateBannerState);
        document.addEventListener("transitionend", e => {
            if (e.target.closest && e.target.closest(".info-banner")) updateBannerState();
        });
        if ("ResizeObserver" in window) new ResizeObserver(updateBannerState).observe(banner);
        if ("MutationObserver" in window) new MutationObserver(() => {
            updateBannerState();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
        window.getBannerHeight = () => updateBannerState();
    });
    addLoadedClass();
    menuInit();
    spoilers();
})();
