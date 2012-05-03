 Ext.define('ioExamples.model.Person', {
      extend: 'Ext.data.Model',
      config: {
          fields: [
              {name:"id", type:"String"},
              { name: 'name', type: 'string' },
              {name: "userObj", type: "object"}
          ]
      }
  });