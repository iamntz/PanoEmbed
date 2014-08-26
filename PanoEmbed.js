(function( $, document ){
  var PanoEmbed = {
    init: function( pano ){
      this.pano = $( pano );

      this.options = $.extend({
        panoZoom   :0,
        panoHeading:0,
        panoPitch  :0
      }, this.pano.data());

      Mustache.tags = ['<%', '%>'];

      this.template = $('#embedTemplate').html();
      Mustache.parse( this.template );

      this.bindEvents();
    } // init


    ,bindEvents: function(){
      this.pano.on('click.panoEmbed', $.proxy( this.open, this ) );
    }//bindEvents


    ,bindSecondSetOfEvents: function(){
      var embed = $('.embed');
      embed.on('click.panoEmbed', '.js-close', $.proxy( this.close, this ) );
      embed.on('click.panoEmbed', '.js-zoomin', $.proxy( this.zoomin, this ) );
      embed.on('click.panoEmbed', '.js-zoomout', $.proxy( this.zoomout, this ) );
      embed.on('click.panoEmbed', '.js-related', $.proxy( this.openRelated, this ) );
      embed.on('click.panoEmbed', '.js-floor', $.proxy( this.openFloor, this ) );
      embed.on('click.panoEmbed', '.js-closeHelp', $.proxy( this.closeHelp, this ) );
      embed.on('click.panoEmbed', '.js-switchToMap', $.proxy( this.switchToMap, this ) );
      $(document).on('navigation-activated', $.proxy( this.close, this ) );
    }//bindSecondSetOfEvents


    ,switchToMap: function( event ){
      var el = $( event.currentTarget );
      el.addClass('active').siblings().removeClass('active');

      var action = el.data('toggleView');

      if( action == 'map' ){
        $('body').addClass('map-is-visible');
        this.vectorMapInstance = vectorMap();
      }

      if( action == 'embed' && this.vectorMapInstance ){
        $('body').removeClass('map-is-visible');
        destroyVectorMap( this.vectorMapInstance );
      }

      return false;
    }//switchToMap


    ,closeHelp: function( event ){
      $( event.currentTarget ).fadeOut(function(){
        $('body').addClass('embedHelp-was-visible');
      });
      return false;
    }//closeHelp

    ,zoomin: function( event ){
      this.zoom( 1 );
      return false;
    }//zoomin


    ,zoomout: function( event ){
      this.zoom( -1 );
      return false;
    }//zoomout


    ,zoom: function( direction ){
      this.panorama.setZoom( this.panorama.getZoom() + direction );
    }//zoom


    ,open: function( event ){
      $('.js-switchToMap[data-toggle-view="embed"]').click();
      $('.embed').remove();
      var embed = $('<div class="embed" />').appendTo('body');
      var i18nItems = window.i18nItems || {};
      var templateOptions = {
        related: this.parseRelated( this.getRelated() ),
        floors : this.parseRelated( this.getFloors(), 'panoFloorname' ),
        i18n : i18nItems
      };

      if( !this.getFloors() ){
        embed.addClass( 'no-floors' );
      }

      embed.append( Mustache.render( this.template, templateOptions ) );

      this.openPanorama();
      this.bindSecondSetOfEvents();
      return false;
    }//open


    ,openPanorama: function(){
      this.panorama = new google.maps.StreetViewPanorama( $('#embedWrapper')[0] );

      this.panorama.setPano( this.options.panoId );
      window.currentPano =  this.options.panoId;

      this.panorama.setOptions({
        pov: {
          heading: this.options.panoHeading,
          pitch  : this.options.panoPitch,
          zoom   : this.options.panoZoom
        },
        addressControl: false,
        zoomControl   : false,
        panControl    : false,
      });
    }//openPanorama


    ,close: function( event ){
      window.currentPano = null;
      $('.embed').off('.panoEmbed').remove();
      $(document).off('navigation-activated');
      return false;
    }//close


    ,openRelated: function( event ){
      var $this = this;
      var related = this.getRelated();
      related.filter(function(){
        return $( event.currentTarget ).data('panoId') == $(this).data('panoId');
      }).trigger('click');
    }//openRelated


    ,parseRelated: function( related, name ){
      var $this = this;
      var parsedRelated = [];

      name = name || 'panoName';

      $( related ).each(function( i, rel ){
        parsedRelated.push({
          'name'      : $( rel ).data( name ),
          'is_active?': $( rel ).data('panoId') == $this.options.panoId,
          'pano_id'   : $( rel ).data('panoId')
        });
      });

      return parsedRelated;
    }//parseRelated


    ,getRelated: function(){
      var related = null;

      if( this.options.panoRelated ) {
        related = $('[data-pano-related="'+ this.options.panoRelated +'"]');
      }

      return related;
    }//getRelated


    ,openFloor: function( event ){
      var $this = this;
      var floors = this.getFloors();
      floors.filter(function(){
        return $( event.currentTarget ).data('panoId') == $(this).data('panoId');
      }).trigger('click');
    }//openFloor


    ,getFloors: function(){
      var floors = null;

      if( this.options.panoBuilding ) {
        floors = $('[data-pano-building="'+ this.options.panoBuilding +'"]');
      }

      return floors;
    }//getFloors
  };


  $.fn.panoEmbed = function() {
    return this.each(function(){
      var obj = Object.create( PanoEmbed );
      obj.init( this );
    });
  };
})( jQuery, document );
