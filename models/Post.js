var keystone = require('twreporter-keystone');
var transform = require('model-transform');
var Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	autokey: { path: 'slug', from: 'name', unique: true },
});

Post.add({
	name: { type: String, required: true },
    title: { type: String, require: true, default: 'untitled' },
    subtitle: { type: String, require: false },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Date, index: true, dependsOn: { state: 'published' }, default: Date.now },
	writters: { type: Types.Relationship, ref: 'Contact', many: true },
	photographers: { type: Types.Relationship, ref: 'Contact', many: true },
	designers: { type: Types.Relationship, ref: 'Contact', many: true },
	engineers: { type: Types.Relationship, ref: 'Contact', many: true },
	heroImage: { type: Types.ImageRelationship, ref: 'Image' },
    heroImageSize: { type: Types.Select, options: 'extend, normal, small', default: 'normal', dependsOn: { heroImage: {'$regex': '.+/i'}}},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
    copyright: { type: Types.Select, options: 'Creative-Commons, Copyrighted', default: 'Copyrighted', index: true },
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	style: { type: Types.Select, options: 'article, topic, review', default: 'article', index: true },
    topic: { type: Types.Relationship, ref: 'Post', many: false, filters: { style: 'topic' }, dependsOn: { style: 'article' } },
    relateds: {type: Types.Relationship, ref: 'Post', many: true },
    og_title: { type: String, require: false},
    og_description: { type: String, require: false},
	og_image: { type: Types.ImageRelationship, ref: 'Image' },
	isFeatured: { type: Boolean, index: true },
    createTime: { type: Date, default: Date.now },
});

Post.relationship({ ref: 'Post', refPath: 'relateds' });

Post.schema.virtual('content.full').get(() => {
	return this.content.extended || this.content.brief;
});

transform.toJSON(Post);
Post.defaultColumns = 'title, name, state|20%, author|20%, categories|20%, publishedDate|20%';
Post.register();
