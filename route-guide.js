Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  Posts.remove({});
  Posts.insert({
    _id: "hello-world",
    title: "Hello World Post",
    category: "test",
    content: "This is the content"
  });

  Meteor.publish('allPosts', function() {
    return Posts.find();
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
  Meteor.subscribe('allPosts');
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

  Template.blogHome.helpers({
    posts: function() {
      return Posts.find();
    },
    pathForPost: function() {
      var post = this;
      var params = {
        category: post.category,
        postId: post._id
      };
      var queryParams = {
        comments: "yes"
      };
      var routeName = "blogPost";
      var path = FlowRouter.path(routeName, params, queryParams);
      return path;
    }
  });

  Template.blogPost.helpers({
    postReady: function() {
      return Template.instance().ready.get();
    },
    post: function() {
      var postId = FlowRouter.getParam('postId');
      var post = Posts.findOne({
        _id: postId
      }) || {};
      return post;
    }
  });

  Template.onlyIfLoggedIn.helpers({
    authInProcess: function() {
      return Meteor.loggingIn();
    },
    canShow: function() {
      return !!Meteor.user();
    }
  });

  Template.login.events({
    'click button': function() {
      Accounts.createUser({
        email: Random.id(),
        password: Random.id()
      });
    }
  });

  Template.mainLayout.events({
    'click #logout': function() {
      Meteor.logout();
    }
  });

  Accounts.onLogin(function() {
    var path = FlowRouter.current().path;
    // we only do it if the user is in the login page
    if (path === "/login") {
      FlowRouter.go("/");
    }
  });
}
