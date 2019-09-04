import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import Overlay from 'ol/Overlay.js';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('mapRef') mapRef: ElementRef;
   geoLatitude: any;
   geoLongitude: any;
   pos:any
//   geoAccuracy:number;
//   geoAddress: string;

//   geoencoderOptions: NativeGeocoderOptions = {
//     useLocale: true,
//     maxResults: 5
//   };
//   private _currentLatLng: any;

//   private _map: any;

//   localty:string;
  constructor(
    private locationAccuracy:LocationAccuracy
//     public navCtrl: NavController,
     //private geolocation : Geolocation,
//    // private locationAccuracy: LocationAccuracy,
//     private nativeGeocoder: NativeGeocoder
    ) {
      

    }
      
      
//   }
   ionViewDidEnter() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            var view = new View({
              center: [0, 0],
              zoom: 13
            });
        
            var map = new Map({
              layers: [
                new TileLayer({
                  source: new OSM()
                })
              ],
              target: 'map',
              view: view
            });
              
            
            
            var geolocation = new Geolocation({
              // enableHighAccuracy must be set to true to have the heading value.
              trackingOptions: {
                enableHighAccuracy: true
              },
              projection: view.getProjection()
            });
            
            
              geolocation.setTracking(true);
              var accuracyFeature = new Feature();
              geolocation.on('change:accuracyGeometry', function() {
                accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
              });
              var positionFeature = new Feature();
              positionFeature.setStyle(new Style({
                image: new CircleStyle({
                  radius: 6,
                  fill: new Fill({
                    color: '#3399CC'
                  }),
                  stroke: new Stroke({
                    color: '#fff',
                    width: 2
                  })
                })
              }));
              geolocation.on('change:position', function() {
                var coordinates = geolocation.getPosition();
                var popup = new Overlay({
                  element: document.getElementById('popup')
                });
                popup.setPosition(coordinates);
                map.addOverlay(popup);
                map.getView().setCenter(geolocation.getPosition());
                positionFeature.setGeometry(coordinates ?
                  new Point(coordinates) : null);
              });
              new VectorLayer({
                map: map,
                source: new VectorSource({
                  features: [accuracyFeature, positionFeature]
                })
              });
          },
          error => console.log('Error requesting location permissions', error)
        );
      }
    
    });
   
    
     
   }



}
