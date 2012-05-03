sourcedevcon
============

sencha.io example for sourcedevcon




Register on developer.sencha.io
Create an application
Create a group
Assign the group to the application


This application assumes that sencha touch 2 can be found in sdk/src
and that the io library can be found in lib/io/src


download sdk and copy the src dir into lib/io/

download sencha touch 2 and copy its source dir into the root dir of this repo.


edit app/controller/Main.js

Change these to your keys from developer.sencha.io

appId: "xxxxxx",
appSecret: "xxxxx",
groupId: "xxxx",


edit app/stores/Rooms.js
		app/stores/Locations.js
		app/stores/Chats.js
		
change groupId to match your group id from developer.sencha.io