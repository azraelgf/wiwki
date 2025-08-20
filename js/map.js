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
    ymaps.ready(init);
    function init() {
        var map = new ymaps.Map("map", {
            center: [ 53.419572, 27.366663 ],
            zoom: 15,
            controls: []
        });
        map.setType("yandex#map");
        var placemark = new ymaps.Placemark([ 53.419572, 27.366663 ], {
            balloonContent: "Д. Загорщина, Узденский район"
        });
        map.geoObjects.add(placemark);
    }
    window["FLS"] = false;
})();
