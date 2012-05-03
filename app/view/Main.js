Ext.define("ioExamples.view.Main", {
    extend: 'Ext.tab.Panel',
    requires: ['Ext.TitleBar'],
    
    config: {
        tabBarPosition: 'bottom',
         fullscreen: true,
        items: [
           {xtype:"exmapleshome"},
           {xtype:"rooms"},
           {xtype:"exmaplespeople"},
           {xtype:"location"}
        ]
    }
});