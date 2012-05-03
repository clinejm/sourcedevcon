Ext.define('ioExamples.model.ChatMessage', {
     extend: 'Ext.data.Model',
     config: {
         fields: [
             { name: 'message', type: 'string' },
             /*
             *  Either a userID or "ME" if this is a message sent by the user.
             */
             { name: 'from', type: 'string' },
             { name: 'date', type: 'int' },
             /*
               All messages in the is store are chats with other users.
               We keep them all in one store for simplicity. 
               That may not work for all apps but it is good enough for demos
               We will filter on userID. If the user sends a message to userA then userA will
               be the userID.  If userA sends a message to the user then userA will be the value
               of userID.  This way we can display all the messages with a simple filter.
             */
             { name: 'userID', type: 'string' } 
         ]
     }
 });