Or just use google way:

```

  <script type="text/javascript">
    google.maps.event.addDomListener(window, 'load', function(){
      var div      = document.getElementById('panoramadiv');
      var panorama = new google.maps.StreetViewPanorama(div);

      panorama.setPano('MioXOHJzlLYAAAAGO0rYeQ');

      panorama.setOptions({
        pov: {
          heading:0.509258,
          pitch:1.014175,
          zoom:0
        },
        addressControl: false,
        zoomControl   : false,
        panControl    : false,
      });

      $('<span class="zoomControl">-</span>').on('click', function(){
        panorama.setZoom( panorama.getZoom() - 1 );
        return false;
      }).appendTo( '#panoramadiv' );

      $('<span class="zoomControl">+</span>').on('click', function(){
        panorama.setZoom( panorama.getZoom() + 1 );
        return false;
      }).appendTo( '#panoramadiv' );
    });
  </script>

```