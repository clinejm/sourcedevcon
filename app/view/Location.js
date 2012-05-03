Ext.define("ioExamples.view.Location", {
    extend: 'Ext.Panel',
    xtype: "location",
    requires: ["Ext.dataview.List", "Ext.form.Panel", "Ext.form.FieldSet"],
    config: {
        id: "locationpanel",
        title: 'locations',
        iconCls: 'locate',
        layout: "card",
        items: [
        {
            docked: 'top',
            xtype: 'titlebar',
            title: 'locations',
            items: [
              {
                  action: "publishLocation",
                  align: 'left',
                  iconMask: true,
                  ui: 'plain',
                  iconCls: 'locate'
              },              
              {
                  action: "syncLocation",
                  align: 'right',
                  iconMask: true,
                  ui: 'plain',
                  iconCls: 'refresh'
              }
            ]
        },
        {
            xtype: "map",
            id: "locationMap"
        }
        ]
    }

});