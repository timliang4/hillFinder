const neLT = document.getElementById('NElt');
const neLNG = document.getElementById('NElng');
const swLT = document.getElementById('SWlt');
const swLNG = document.getElementById('SWlng');
const btn = document.getElementById('search');

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.780876, lng: -73.966765 },
      zoom: 8,
    });
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      rectangleOptions: {
          editable: true,
          draggable: true,
      }
    });
    
    google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
      swLT.value = rectangle.getBounds().getSouthWest().lat();
      swLNG.value = rectangle.getBounds().getSouthWest().lng();
      neLT.value = rectangle.getBounds().getNorthEast().lat();
      neLNG.value = rectangle.getBounds().getNorthEast().lng();
      btn.disabled = false;
      drawingManager.setOptions({
        drawingControl: false
      });
      drawingManager.setDrawingMode(null);
      google.maps.event.addListener(rectangle, 'bounds_changed', function() {
        swLT.value = rectangle.getBounds().getSouthWest().lat();
        swLNG.value = rectangle.getBounds().getSouthWest().lng();
        neLT.value = rectangle.getBounds().getNorthEast().lat();
        neLNG.value = rectangle.getBounds().getNorthEast().lng();
      });
      });
  
    drawingManager.setMap(map);
  }
  
  window.initMap = initMap;

  