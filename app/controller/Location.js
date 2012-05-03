Ext.define('ioExamples.controller.Location', {
    extend: 'Ext.app.Controller',

    requires: [
    "Ext.util.Geolocation"
    ],

    config: {
        control: {

            publishLocation: {
                tap: "sendLocation"
            },

            syncLocation: {
                tap: "syncLocation"
            }
        },

        refs: {
            locationMap: "#locationMap",
            publishLocation: "button[action=publishLocation]",
            syncLocation: "button[action=syncLocation]"
        }
    },


    init: function() {

        var self = this;
        
        this.markers = {};

        this.getApplication().on('userAuth',
        function(user, group) {
            self.onAuth();
        });

        this.geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo) {
                    console.log("locationupdate listener", geo);
                    self.updateLocation(geo);
                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    console.log("could not get location", arguments);
                }
            }
        });


    },

    onAuth: function(user, group) {


        var locations = Ext.create("ioExamples.store.Locations",
        {
            storeId: 'locations'
        });

        locations.load();

        locations.sync(function() {
            console.log("locations sync callback", arguments);
        });

        var self = this;
        this.getApplication().group.messaging.pubsub.subscribe('locations', 'newloc',
        function(cb, data) {
            console.log("location sync push", data.room)
            self.syncLocation(false);
        });


    },

    sendLocation: function() {
        this.geo.updateLocation();
    },

    updateLocation: function(geo) {
        console.log("updateLocation", geo);
        var locations = this.getLocationStore();
        var self = this;
        Ext.io.Io.getCurrentUser({
            callback: function(cb, isAuth, user) {
                locations.sync(function() {
                    console.log("location sync before update");
                    if (isAuth) {
                        self._updateLocation(user, geo);
                    }
                });
            }
        });
    },

    _updateLocation: function(user, geo) {
        var locations = this.getLocationStore();

        var record = locations.findRecord('userId', user.key);
        console.log("_updateLocation", locations, record, geo, user);
        
        var map = this.getLocationMap();
        var loc = new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());
        
        map.setMapCenter(loc);
        
        
        var marker = new google.maps.Marker({
              position: loc,
              map: map.getMap(),
              title:"ME!"
        });


        if (record) {

            record.set('lat', geo.getLatitude());
            record.set('long', geo.getLongitude());
            record.set('updated', new Date().getTime());

            console.log("updating");
        } else {
            console.log("creating");
            locations.add({
                username: user.data.username,
                userId: user.key,
                lat: geo.getLatitude(),
                long: geo.getLongitude(),
                updated: new Date().getTime()
            });
        }
        
        
        this.syncLocation(true);

    },
    
    updateMarkers: function() {
      
      var locations = this.getLocationStore();
      var all = locations.getData().all;
      
      var map = this.getLocationMap().getMap();
      
      for(var i =0, l = all.length; i<l;i++) {
        var record = all[i];
        if(record.data.username && record.data.lat && record.data.long) {
           var marker = this.markers[record.data.username];
           var loc = new google.maps.LatLng(record.data.lat, record.data.long);
           if(marker){
            
             marker.setPosition(loc);
             console.log("marker.pos", record.data.username, marker.getPosition());
           } else {
             marker = new google.maps.Marker({
                   position: loc,
                   map: map,
                   title:record.data.username
             });
             
             this.markers[record.data.username] = marker;
             
           }
        }
       
      }
      
    },

    getLocationStore: function() {
        return Ext.data.StoreManager.lookup('locations');
    },

    syncLocation: function(publishAfterSync) {
        var location = this.getLocationStore();
        var btn = this.getSyncLocation();
        var app = this.getApplication();
        btn.setDisabled(true);
        var self = this;
        location.sync(function() {
            btn.setDisabled(false);
            console.log("location sync callback", arguments);
            if (publishAfterSync === true) {
                app.group.messaging.pubsub.publish('locations', 'newloc', {});
            }
            self.updateMarkers();
        });
        globalMap = this.getLocationMap();
        console.log("map", this.getLocationMap());
    }

});