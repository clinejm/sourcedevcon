Ext.define('ioExamples.controller.Rooms', {
    extend: 'Ext.app.Controller',

    config: {
        control: {

            addRoom: {
                tap: "addRoom"
            },

            syncRooms: {
                tap: "syncRooms"
            },
            
            roomList: {
                select: 'showRoom'
            },
            
            roomBack: {
                tap: 'doRoomBack'
            },
            
            messagefield: {
                action: "sendMessage"
            },
            
        },

        refs: {
            roomList: "#roomList",
            addRoom: "button[action=addRoom]",
            syncRooms: "button[action=syncRooms]",
            roomBack: "button[action=roomsback]",
            roomChatList: "#roomchatlist",
            roomPanel: "#roompanel",
            messagefield: "#groupmessagefield",
            
        }
    },
    
    
    
    init: function() {
      var self = this;
      this.getApplication().on('userAuth', function(user){
        console.log("rooms got user auth event!");
        self.onAuth(user);
        return true;
      });
      
    },
    
    onAuth: function(user) {
        var self = this;
        var rooms = Ext.create("ioExamples.store.Rooms",
        {
            storeId: 'rooms'
        });

        rooms.load();

        this.getRoomList().setStore(rooms);

        rooms.sync(function() {
            console.log("rooms sync callback", arguments);
        });
        
         this.getApplication().group.messaging.pubsub.subscribe('rooms', 'newmsg', function(cb, data) {
           
           console.log("new room message for", data.room)
           
           if(data && data.room) {
             var store = Ext.data.StoreManager.lookup(data.room);
             console.log("store for ", data.room, store);
             if(store) {
               store.sync(function(){
                 console.log("room chat store sync", arguments);
                 self.scrollMessages();
               }); 
             }
                
           }
           
         });
      
    },
    
    
    onLogout: function() {
      
    },

    addRoom: function() {
        console.log("add room!");
        Ext.Msg.prompt(
        'Create Room',
        "",
        function(buttonId, value) {
            console.log("room name", buttonId, value);
            if (buttonId == "ok") {
                this.createRoom(value);
            }
        },
        this,
        false,
        null,
        {
            autoCapitalize: true,
            placeHolder: 'Room Name'
        }
        );


    },

    createRoom: function(roomName) {
        if (!roomName || roomName.length < 1) {
            return;
        }
        var rooms = this.getStore();

        rooms.add({
            name: roomName
        });

        this.syncRooms();
    },

    getStore: function() {
        return Ext.data.StoreManager.lookup('rooms');
    },

    syncRooms: function() {
        var rooms = this.getStore();
        var btn = this.getSyncRooms();
        btn.setDisabled(true);
        rooms.sync(function() {
          btn.setDisabled(false);
          console.log("room sync callback", arguments);
        });
    },
    
    showRoom: function(list, record) {
      
      var name = record.get('name')
      var store = this.getRoomStore(record.get('name'));
      console.log("showRoom", store);
      
      this.currentRoom = name;
      
      this.getRoomPanel().getAt(0).setTitle(name);
      this.getRoomChatList().setStore(store);
      this.getRoomPanel().setActiveItem(1);
      this.getRoomBack().show();
      this.getAddRoom().hide();
      this.getSyncRooms().hide();
      
      
    },
    
    doRoomBack: function() {
         this.getRoomPanel().getAt(0).setTitle("Rooms");
         this.getRoomPanel().setActiveItem(0);
         this.getRoomList().deselectAll();
         this.getRoomBack().hide();
         this.getAddRoom().show();
         this.getSyncRooms().show();
     },
    
    getRoomStore: function(name) {
      
      var store = Ext.data.StoreManager.lookup(name);
      console.log("room store ", name, store);
      if(!store) {
         store = Ext.create('Ext.data.Store',
          {
            id: name,
            model: 'ioExamples.model.ChatMessage',
            proxy: {
                type: 'syncstorage',
                groupId: "H2CP1N3mZst4IqZuEHytuUyepp0",
                id: 'rooms-'+ name,
            },
            sorters: ['date'],
            autoload: true
         });        
      }
      store.load();
      store.sync(function(){console.log("roomstore callback", name, arguments)});
      return store;
    },
    
    sendMessage: function(msgField) {
        var message = msgField.getValue();
        console.log("sendMessage", message);
        var chats = this.getRoomChatList().getStore();
        var app = this.getApplication();
        
        console.log("app.user", app.user);
        
        var username = app.user.data.username;
        
        var self = this;
        var record = {
          message: message,
          from: username,
          date: new Date().getTime()
        };
        console.log("saving message", record);
        chats.add(record);
        //self.scrollMessages();
        chats.sync(function(){
          console.log("room sync callback", arguments, app, app.group);
          
          if(app.group) {
            self.scrollMessages();
            app.group.messaging.pubsub.publish('rooms', 'newmsg', {room: self.currentRoom});
          } else {
            console.log("No group for app.");
          }
                    
        });
        msgField.setValue("");    
    },
    
    
    scrollMessages: function() {
        var chatList = this.getRoomChatList();
        setTimeout(function() {
            chatList.getScrollable().getScroller().scrollToEnd();
        },
        300);
    },

    

});