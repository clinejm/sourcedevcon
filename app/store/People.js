/**
 * The Runs store. Contains a list of all Runs the user and their friends have made.
 */
Ext.define('ioExamples.store.People', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'ioExamples.model.Person',
        autoLoad: false
    }
});
