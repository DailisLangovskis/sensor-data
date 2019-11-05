export default ['Core', 'hs.utils.service', '$rootScope', '$http',
    function (Core, utils, $rootScope, $http) {
        var me = {
            getGeonameAtCoordinate(coordinate) {
                return new Promise((resolve, reject) => {
                    var point = {
                        lon: coordinate[0].toFixed(2),
                        lat: coordinate[1].toFixed(2)
                    };
                    $http.get(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${point.lat}&lng=${point.lon}&username=raitis`)
                        .then((r) => {
                            resolve(r.data.geonames[0].name)
                        });
                })
            },
            getMeteoblueImage: function (p, service, name) {
                return new Promise((resolve, reject) => {
                    var data = {
                        apikey: '8vh83gfhu34g',
                        lat: p[1],
                        lon: p[0],
                        asl: 258,
                        tz: 'Europe/Athens',
                        city: name || ''
                    };
                    if (service == 'meteogram_agroSowing') data.look = 'all';
                    var params = Object.keys(data).map(function (k) {
                        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
                    }).join('&');
                    var url = utils.proxify(`http://my.meteoblue.com/visimage/${service}?${params}`, false);
                    resolve(url);
                })
            }
        };
        return me;
    }
]