const neLT = document.getElementById('NElt');
const neLNG = document.getElementById('NElng');
const swLT = document.getElementById('SWlt');
const swLNG = document.getElementById('SWlng');
const btn = document.getElementById('search');
const drawBtn = document.getElementById('rect');
const clearBtn = document.getElementById('clear');
const alert = document.getElementById('alert');

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.780876, lng: -73.966765 },
    zoom: 10,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(pos);
        map.setZoom(13);
      },
    );
  } 

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: false,
    rectangleOptions: {
        editable: true,
        draggable: true,
    }
  });

  function toDrawRectMode() {
    drawingManager.setDrawingMode('rectangle');
    drawBtn.disabled = true;
    clearBtn.disabled = false;
  }
  
  function removeRect() {
    rect.setMap(null);
    btn.disabled= true;
    drawBtn.disabled = false;
    clearBtn.disabled = true;
  }

  drawBtn.addEventListener("click", toDrawRectMode);
  clearBtn.addEventListener("click", removeRect);
  
  google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
    rect = rectangle;
    const from = rectangle.getBounds().getSouthWest();
    const to = rectangle.getBounds().getNorthEast();
    swLT.value = from.lat();
    swLNG.value = from.lng();
    neLT.value = to.lat();
    neLNG.value = to.lng();

    if (google.maps.geometry.spherical.computeDistanceBetween(from, to) > 20000) {
      const heading = google.maps.geometry.spherical.computeHeading(from, to)
      const newTo = google.maps.geometry.spherical.computeOffset(from, 19600, heading);
      rectangle.setBounds({east: newTo.lng(), north: newTo.lat(), south: from.lat(), west: from.lng()})
      alert.style.display = 'Block';
      setTimeout(() => alert.style.display = 'none', 2000)
    }

    google.maps.event.addListener(rectangle, 'bounds_changed', function() {
      const from = rectangle.getBounds().getSouthWest()
      const to = rectangle.getBounds().getNorthEast()
      swLT.value = from.lat();
      swLNG.value = from.lng();
      neLT.value = to.lat();
      neLNG.value = to.lng();
      if (google.maps.geometry.spherical.computeDistanceBetween(from, to) > 20000) {
        console.log('in bounds changed bounds exceeded')
        const heading = google.maps.geometry.spherical.computeHeading(from, to)
        const newTo = google.maps.geometry.spherical.computeOffset(from, 19600, heading);
        rectangle.setBounds({east: newTo.lng(), north: newTo.lat(), south: from.lat(), west: from.lng()})
        alert.style.display = 'Block';
        setTimeout(() => alert.style.display = 'none', 2000)
      }
    });

    btn.disabled = false;
    drawingManager.setDrawingMode(null);
  });

  drawingManager.setDrawingMode(null);
  drawingManager.setMap(map);
}
