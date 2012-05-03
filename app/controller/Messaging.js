Ext.define('ioExamples.controller.Messaging', {
    extend: 'Ext.app.Controller',


    config: {
        control: {
            userlist: {
                select: 'showUserMessages'
            },
            messagefield: {
                action: "sendMessage"
            },
            peoplebackBtn: {
                tap: 'doPeopleBack'
            },

            synchatstoreBtn: {
                tap: 'syncChatStore'
            }

        },

        refs: {
            usernamePanel: '#usernamePanel',
            userlist: '#userlist',
            peoplePanel: '#peoplepanel',
            messagefield: "#messagefield",
            peoplebackBtn: 'button[action=peopleback]',
            chatList: "#chatList",
            synchatstoreBtn: 'button[action=synchatstore]'
        }
    },
    
    
    
    init: function() {
      var self = this;
      this.getApplication().on('userAuth', function(user, group){
        console.log("messageing got user auth event", user, group);
        self.onAuth(user, group);
        return true;        
      });
      
      this.getApplication().on('userLogout', function(user){
         console.log("rooms got user logout event!");
         self.onLogout();
         return true;
       });
    
      
    },
    
    onAuth: function(user, group) {
    
      var chats = Ext.create("ioExamples.store.Chats",
      {
          storeId: 'chats'
      });
      chats.load();
      chats.sync(function() {
          console.log("chats sync callback", arguments);
      });

      var chatList = this.getChatList();
      chatList.setStore(chats);

      user.receive({
          callback: function(cb, bool, sender, message) {
              var userId = sender.getUserId();
              console.log("user got a message!", arguments, userId);

              var record = {
                  message: message,
                  userID: userId,
                  from: userId,
                  date: new Date().getTime()
              };
              console.log("saving message", record);
              chats.add(record);
              chats.sync();
              setTimeout(function() {
                  chatList.getScrollable().getScroller().scrollToEnd();
              },
              300);
          }
      });
      
      this.loadGroupMemebers(user, group);
      

    },
    
    
    
    onLogout: function() {
      
      
      // We need to clear out the local copy of the user's data on logout
      var chats = Ext.data.StoreManager.lookup('chats');
      console.log("chats", chats);
      if (chats) {
          chats.getProxy().clear();
      }

      //Same for the list of people in the group.
      var people = ioExamples.app.getStores("people")[0];
      if (people) {
          people.removeAll();
      }
      
      
    },
    
    
    loadGroupMemebers: function(currentUser, group) {
        var store = this.getApplication().getStores("people")[0];
        console.log('group store', store);
        group.findUsers({
            query: 'username:[aaa TO zzz]',
            success: function(users) {
                console.log("users", users);
                for (i in users) {
                    var user = users[i];
                    console.log('User Id:', user.key, user);
                    if (currentUser.key != user.key) {
                        store.add({
                            id: user.key,
                            name: user.data.username,
                            userObj: user
                        });
                    }
                }

            },
            failure: function() {
                console.log("failed to fetch group members");
            }
        });

    },
    
    

    showUserMessages: function(list, record) {
        this.selectedUser = record;

        console.log("showUserMessages", record, this.getPeoplePanel(), this.selectedUser);
        this.getPeoplePanel().setActiveItem(1);

        console.log("record.data.userID", record, record.data.id);
        
        var chatList = this.getChatList();
        var chats = chatList.getStore();
        
        chats.clearFilter(true);
        chats.filter("userID", record.data.id);

        this.getPeoplePanel().getAt(0).setTitle(this.selectedUser.data.name);
        this.getPeoplebackBtn().show();
    },

    sendMessage: function(msgField) {
        var message = msgField.getValue();
        console.log("sendMessage", message);
        var user = this.selectedUser.data.userObj;
        var chatList = this.getChatList();
        var self = this;
        user.send({
            message: message,
            callback: function() {
                console.log("sendMessage callback", arguments);
                var chats = Ext.data.StoreManager.lookup('chats');
                var record = {
                    message: message,
                    userID: user.key,
                    from: "ME",
                    date: new Date().getTime()
                };
                console.log("saving message", record);
                chats.add(record);
                self.scrollMessages();
                chats.sync();
                msgField.setValue("");
            }
        });
    },

    doPeopleBack: function() {
        this.getPeoplePanel().getAt(0).setTitle("People");
        this.getPeoplePanel().setActiveItem(0);

        this.getUserlist().deselectAll();
        this.getPeoplebackBtn().hide();
    },

    scrollMessages: function() {
        var chatList = this.getChatList();
        setTimeout(function() {
            chatList.getScrollable().getScroller().scrollToEnd();
        },
        300);
    },

    syncChatStore: function() {
        var chats = Ext.data.StoreManager.lookup('chats');
        var self = this;
        chats.sync(function() {
            self.scrollMessages();
            console.log("chat sync callback", arguments);
        });
    }


});