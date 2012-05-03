Ext.define('ioExamples.store.Locations', {
    extend: 'Ext.data.Store',
    config: {
        model: 'ioExamples.model.Location',
        proxy: {
            type: 'syncstorage',
            groupId: "xxxxx",
            id: 'locations'
        },
        autoload: true
    }
});