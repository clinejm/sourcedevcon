Ext.Loader.setPath({
    'Ext': 'sdk/src',
    'Ext.io': 'lib/io/src/io',
    'Ext.cf': 'lib/io/src/cf'
});

/*
IO stores used:

rooms - group 
mychats - user list of rooms and user chats that I have
room-<name> - group
p-<uid>-<uid> - group  user to user chat room



*/

Ext.application({
    name: 'ioExamples',

    requires: [
        'Ext.MessageBox'
        , 'Ext.io.Io'             /* requires base Io singlton so that we can call Ext.io.init(); FIXME: simplify for the release. */
        , 'Ext.io.data.Proxy'
        , 'Ext.Map'
    ],

    views: ['Main', "Home", "Rooms", "People", "Location"],
    models: ['Person', "ChatMessage", "Room", "Location"],
    stores: ['People'],
    controllers: ['Main', "Messaging", "Rooms", "Location"],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
   
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
      
        // Initialize the main view
        Ext.Viewport.add(Ext.create('ioExamples.view.Main'));  
        
    },
   
    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
