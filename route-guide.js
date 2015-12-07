Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  Posts.remove({});
  Posts.insert({
    _id: "hello-world",
    title: "Hello World Post",
    content: "This is the content"
  });
  Meteor.publish('singlePost', function(id) {
    check(id, String);
    // Make a delay manually to show the loading state
    Meteor._sleepForMs(1000);
    return Posts.find({
      _id: id
    });
  });
}

if (Meteor.isClient) {
  PostSubs = new SubsManager();

  Template.blogPost.onCreated(function() {
      var self = this;
      self.ready = new ReactiveVar();
      self.autorun(function() {
          var postId = FlowRouter.getParam('postId');
          var handle = PostSubs.subscribe('singlePost', postId);
          self.ready.set(handle.ready());
      });
  });

  Template.blogPost.helpers({
      postReady: function() {
          return Template.instance().ready.get();
      }
  });

  Template.blogPost.helpers({
    post: function() {
      var postId = FlowRouter.getParam('postId');
      var post = Posts.findOne({_id: postId}) || {};
      return post;
    }
  });
}
