Ext.define('ioExamples.controller.Main', {
    extend: 'Ext.app.Controller',

    requires: ["ioExamples.view.Login", "ioExamples.store.Chats", "ioExamples.store.Rooms", "ioExamples.store.Locations"],

    /**
    * Enter app and group id from dev console.
    */
    appId: "xxxxxx",
    appSecret: "xxxxx",
    groupId: "xxxx",


    config: {
        control: {
            loginButton: {
                tap: 'checkLogin'
            },
            logoutButton: {
                tap: 'doLogout'
            },
            siologinBtn: {
                tap: "doAuth"
            },
            
            sioShowRegisterBtn: {
              tap: "showRegForm"
            },

            sioRegisterBtn: {
              tap: "registerUser"
            },
            
            cancelloginBtn: {
              tap: "hideLogin"
            }
            
        },

        refs: {
            loginButton: 'button[action=login]',
            logoutButton: 'button[action=logout]',
            usernamePanel: '#usernamePanel',
            siologinBtn: 'button[action=siologin]',
            sioRegisterBtn: 'button[action=sioRegister]',
            cancelloginBtn: "button[action=cancellogin]",
            sioShowRegisterBtn: 'button[action=showRegister]',
            siologinForm: '#siologinform',
        }
    },

    init: function() {

        console.log("controller init.");
        
        Ext.io.Io.setup({
            appId: this.appId,
            appSecret: this.appSecret,
            url: "http://msg.sencha.io:80" 
        });


        var self = this;

        Ext.io.Io.init(function() {
            Ext.io.Io.getGroup({
                id: self.groupId,
                callback: function(options, success, group) {
                    console.log("got group", group);
                    self.group = group;
                    self.getApplication().group = group;
                    self.checkUser();
                    
                    
                }
            });
        });


    },

    checkUser: function() {
        var self = this;
        Ext.io.Io.getCurrentUser({
            callback: function(cb, isAuth, user) {

                console.log("getcurrentuser", arguments);

                if (!isAuth) {
                    console.log("no user, we need to auth.", user);
                    self.showLogin();

                } else {
                    console.log("User authenticated already", user);
                    self.onAuth(user);
                }
            }
        });
    },

    showLogin: function() {
        console.log("showLogin", this.loginPanel);
        if (!this.loginPanel) {
            this.loginPanel = Ext.create("ioExamples.view.Login");
            console.log("showLogin2", this.loginPanel);

            var panel = this.loginPanel.query(".formpanel")[0];
            Ext.Viewport.add(this.loginPanel);
        }
        
        
        this.getSiologinBtn().show();
        this.getSioRegisterBtn().hide();
        var form = this.getSiologinForm();
        var email = form.query('.emailfield')[0];
        email.hide();
        
        Ext.Viewport.setActiveItem(this.loginPanel);

    },
    
    
    hideLogin: function(){
       this.getLoginButton().setDisabled(false);
       this.getLogoutButton().setDisabled(true);
      
       Ext.Viewport.setActiveItem(0);
    },

    checkLogin: function() {
        // called whenever the Login button is tapped
        console.log("check?", this);
        this.getUsernamePanel().setHtml("<h3>checking login...</h3>");
        this.checkUser();

    },


    doAuth: function() {
        // called whenever the Login button is tapped
        var self = this;
        var form = self.getSiologinForm();
        var values = form.getValues();
        console.log("doAuth", form, form.getValues(), this);


        self.group.authenticate({
            params: {
                username: values.username,
                password: values.password
            },
            callback: function(opts, isAuth, user) {
                console.log("user authed?", arguments);

                if (isAuth) {
                    self.onAuth(user);
                } else {
                    //TODO login errors!
                }
            }
        });

    },



    onAuth: function(user) {
        var usernamePanel = this.getUsernamePanel();
        
        this.hideLogin();
        
        
        this.getLoginButton().setDisabled(true);
        this.getLogoutButton().setDisabled(false);

        
        this.getApplication().user = user;

        usernamePanel.setHtml("<h3>" + user.data.username + "</h3>");
        
        //Tell the other controllers they can create their stores etc. 
        this.getApplication().fireEvent('userAuth', user, this.group);
        

    },

    doLogout: function() {
        console.log("doloutout");
        var self = this;
        
        //Tell the other controllers its time to delete user data.
        this.getApplication().fireEvent('userLogout');


        Ext.io.Io.getCurrentUser({
            callback: function(cb, isAuth, user) {
                console.log("have user to logout", isAuth, user);
                if (isAuth && user) {
                    user.logout();

                    self.getLoginButton().setDisabled(false);
                    self.getLogoutButton().setDisabled(true);
                    self.getUsernamePanel().setHtml("<h3>Please login</h3>");
                }
            }
        });
    },
    
    
    showRegForm: function(){
      var form = this.getSiologinForm();
      console.log("hello", form);
      var email = form.query('.emailfield')[0];
      email.show();
      this.getSiologinBtn().hide();
      this.getSioRegisterBtn().show();
    },
    
    
    registerUser: function() {
       var form = this.getSiologinForm();
       var values = form.getValues();
       console.log("register", form, values);
       var self = this;
       
       if(values.username.length > 0 && values.password.length > 0 && values.email.length > 0 ){
         
         this.group.register({
         			params: {
   							username: values.username,
   							password: values.password,
   							email: values.email
   						},
   						callback: function(obj, suc, user) {
   							console.log("register arguments", arguments);
   							
   							if(suc && user){
   							  self.onAuth(user);
   							}
   						}
   				});
   
         
         
       } else {
         //TODO error handling.
       }
       
       
    }

});