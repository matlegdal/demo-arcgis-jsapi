require([
    "esri/tasks/Locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Locate",
    "dojo/domReady!"
], function (Locator, Map, MapView, BasemapToggle, Locate) {
    const fujitsu = [-71.306222, 46.830545];
    const map = new Map({
        basemap: "streets",
    });
    const view = new MapView({
        container: "viewDiv",
        map,
        zoom: 11.2,
        center: fujitsu
    });

    // Widgets
    const basemapToggle = new BasemapToggle({
        view,
        nextBasemap: "hybrid"
    });
    view.ui.add(basemapToggle, {
        position: "bottom-right"
    });

    const locateWidget = new Locate({
        view
    });
    view.ui.add(locateWidget, {
        position: "bottom-left"
    });

    // Popup locator
    const locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });

    view.on("click", function (event) {
        event.stopPropagation();
        const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
        const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
        view.popup.open({
            title: `Reverse geocode: [${lon}, ${lat}]`,
            location: event.mapPoint
        });
        locatorTask.locationToAddress(event.mapPoint)
            .then(function (response) {
                view.popup.content = response.address;
            }).catch(function () {
                view.popup.content = "No address found for this location.";
            });
    });
});