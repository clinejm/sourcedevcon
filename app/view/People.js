Ext.define("ioExamples.view.People", {
    extend: 'Ext.Panel',
    xtype: "exmaplespeople",
    requires: ["Ext.dataview.List", "Ext.form.Panel", "Ext.form.FieldSet"],
    config: {
        id: "peoplepanel",
        title: 'People',
        iconCls: 'user',
        layout: "card",
        items: [
        {
            docked: 'top',
            xtype: 'titlebar',
            title: 'People',
            items: [
            {
                text: "back",
                action: "peopleback",
                hidden: "true"
            },
            {
                action: "synchatstore",
                align: 'right',
                iconMask: true,
                ui: 'plain',
                iconCls: 'refresh'
            }
            ]
        },
        {
            xtype: "list",
            id: "userlist",

            styleHtmlContent: true,
            scrollable: true,
            store: "People",
            itemTpl: "{name}",
            emptyText: 'No people yet'
        },
        {
            xtype: "panel",
            layout: "fit",
            items: [
            {
                xtype: "list",
                id: "chatList",
                cls: "noline",
                styleHtmlContent: true,
                scrollable: true,
                scrollToTopOnRefresh: false,
                disableSelection: true,
                itemTpl: '<div class="{[values.from == "ME" ? "messageFromMe" : "messageFrom"]}">{message}</div>',
                emptyText: 'No Messages'
            },
            {
                xtype: "toolbar",
                docked: 'bottom',
                scrollable: "none",

                items: [
                {
                    id: "messagefield",
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