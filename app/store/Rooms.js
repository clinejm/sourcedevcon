Ext.define('ioExamples.store.Rooms', {
    extend: 'Ext.data.Store',
    config: {
        model: 'ioExamples.model.Room',
        proxy: {
            type: 'syncstorage',
            groupId: "xxxx",
            id: 'roomsDevCon'
        },
        sorters: ['name'],
        autoload: true
    }
});