FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "blogHome"
    });
  }
});

FlowRouter.route('/blog/:category/:postId', {
  name: 'blogPost',
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "blogPost"
    });
  }
});

FlowRouter.route('/add-new-post', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "addNewPostPage"});
  }
});

FlowRouter.route('/login', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "login"});
  }
});
