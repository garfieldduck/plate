var keystone = require('keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Audio = new keystone.List('Audio');

Audio.add({
    audio: {
        type: Types.GcsFile,
        initial: true,
        index: true,
        autoCleanup: true,
        datePrefix: 'YYYYMMDDHHmmss',
        // TODO move these settings to config
        bucket: 'twreporter-article.twreporter.org',
        destination: 'galleries/',
        publicRead: true,
    },
	heroImage: { type: Types.ImageRelationship, ref: 'Image' },
    author: {
        type: Types.Relationship,
        ref: 'Contact'
    },
    description: {
        type: String
    },
    tags: {
        type: Types.Relationship,
        ref: 'Tag',
        many: true
    },
});


transform.toJSON(Audio);
Audio.defaultColumns = 'audio, author, tags';
Audio.register();