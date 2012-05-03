Ext.define('ioExamples.model.MyChat', {
     extend: 'Ext.data.Model',
     config: {
         fields: [
             { name: 'name', type: 'string' },
             { name: 'type', type: 'string' } // user or room
         ]
     }
 });