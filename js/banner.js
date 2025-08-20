(() => {
    "use strict";
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
        const banner = document.querySelector(".info-banner");
        if (!banner) return;
        banner.addEventListener("click", e => {
            if (e.target.closest(".js-banner-close")) closeBanner(banner);
        });
    });
    function closeBanner(banner) {
        if (!banner.classList.contains("_hide")) {
            banner.classList.add("_hide");
            banner.addEventListener("transitionend", () => banner.remove(), {
                once: true
            });
        }
    }
})();
