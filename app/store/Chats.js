Ext.define('ioExamples.store.Chats', {
    extend: 'Ext.data.Store',
    config: {
        model: 'ioExamples.model.ChatMessage',
        proxy: {
            type: 'syncstorage',
            groupId: "xxxxxx",
            id: 'groupchat3'
        },
        sorters: ['date'],
        autoload: true
    }
});