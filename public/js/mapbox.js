// console.log('Hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

// const displayMap = locations => {

    mapboxgl.accessToken = 'pk.eyJ1IjoibnVudXNkZiIsImEiOiJjbGN4bHFuM3IyNGMwM3BtczE4cXg1eWNsIn0.ChJ3MjqPV1SUTmrXVph-Eg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/nunusdf/cld1m9swc000u01lctteik4po',
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 4,
        // interactive: false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    

    locations.forEach(loc => {
        // Create Marker
        const el =  document.createElement('div');
        el.className = 'marker';
        
        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
    
        // Add PopUp
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
    
    
        // Include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: { 
            top: 150,
            bottom: 150,
            left: 100,
            right: 100
        }
     });
// }


