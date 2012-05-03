Ext.define("ioExamples.view.Rooms", {
    extend: 'Ext.Panel',
    xtype: "rooms",
    requires: ["Ext.dataview.List", "Ext.form.Panel", "Ext.form.FieldSet"],
    config: {
        id: "roompanel",
        title: 'Rooms',
        iconCls: 'team',
        layout: "card",
        items: [
        {
            docked: 'top',
            xtype: 'titlebar',
            title: 'Rooms',
            items: [
            {
                text: "back",
                action: "roomsback",
                hidden: "true"
            },
            {
                iconMask: true,
                ui: 'plain',
                iconCls: 'add',
                action: "addRoom"
            },
            {
                action: "syncRooms",
                align: 'right',
                iconMask: true,
                ui: 'plain',
                iconCls: 'refresh'
            }
            ]
        },
        {
            xtype: "list",
            id: "roomList",
            styleHtmlContent: true,
            scrollable: true,
            itemTpl: "{name}",
            emptyText: 'No rooms'
        },
        
        {
          xtype: "panel",
          layout: "fit",
          items: [
              {
                  xtype: "list",
                  id: "roomchatlist",
                  cls: "groupchat",
                  styleHtmlContent: true,
                  scrollable: true,
                  scrollToTopOnRefresh: false,
                  disableSelection: true,
                  itemTpl: '{from} : {message}</div>',
                  emptyText: 'No Messages'
              },
              {
                  xtype: "toolbar",
                  docked: 'bottom',
                  scrollable: "none",

                  items: [
                  {
                      id: "groupmessagefield",
                      xtype: 'textfield',
                      name: 'message',
                      width: "90%",
                      placeHolder: 'Send a message'
                  }
                  ]

              }
            ]
          }
        ]
    }

});