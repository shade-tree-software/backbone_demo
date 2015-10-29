// Code goes here

$(function () {
  var Model = Backbone.Model.extend({
    initialize: function () {
      var id = this.get('id');
      console.log('model: #' + id + ' initialize');
    },
    simulateFetch: function () {
      var id = this.get('id');
      console.log('model: #' + id + ' simulateFetch');
      if ($('#row1id').val() === id) {
        this.set({id: id, title: $('#row1title').val()});
      } else if ($('#row2id').val() === id) {
        this.set({id: id, title: $('#row2title').val()});
      } else if ($('#row3id').val() === id) {
        this.set({id: id, title: $('#row3title').val()});
      }
    }
  });

  var SmallModelView = Backbone.View.extend({
    initialize: function () {
      var id = this.model.get('id');
      console.log('small model view: #' + id + ' initialize');
      this.model.on('remove', this.hide, this);
      this.model.on('change', this.render, this);
      console.log('created small model view and blank el for record #' + id);
    },
    hide: function () {
      var id = this.model.get('id');
      console.log('small model view: #' + id + ' hide');
      this.remove();
      console.log('removed small model view and el for record #' + id + ' from the DOM');
    },
    render: function () {
      var id = this.model.get('id');
      console.log('small model view: #' + id + ' render');
      this.$el.html('<p class="model' + id + '">' + id + ': ' + this.model.get('title') + '</p>');
      this.$el.click(function () {
        App.navigate("models/" + id, {trigger: true});
      });
      console.log('rendered small model view for record #' + id);
      return this;
    }
  });

  var LargeModelView = Backbone.View.extend({
    initialize: function () {
      var id = this.model.get('id');
      console.log('large model view: #' + id + ' initialize');
      this.model.on('remove', this.hide, this);
      this.model.on('change', this.render, this);
      console.log('created large model view and blank el for record #' + id);
    },
    hide: function () {
      var id = this.model.get('id');
      console.log('large model view: #' + id + ' hide');
      this.remove();
      console.log('removed large model view and el for record #' + id + ' from the DOM');
    },
    render: function () {
      var id = this.model.get('id');
      console.log('large model view: #' + id + ' render');
      this.$el.html('<p>ID: ' + id + '</p><p>Title: ' + this.model.get('title') + '</p>');
      console.log('rendered large model view for record #' + id);
      return this;
    }
  });

  var Collection = Backbone.Collection.extend({
    initialize: function(){
      console.log('collection: initialize');
    },
    model: Model,
    simulateFetch: function () {
      console.log('collection: simulateFetch');
      this.set([
        {id: $('#row1id').val(), title: $('#row1title').val()},
        {id: $('#row2id').val(), title: $('#row2title').val()},
        {id: $('#row3id').val(), title: $('#row3title').val()}
      ]);
    }
  });

  var CollectionView = Backbone.View.extend({
    initialize: function () {
      console.log('collection view: initialize');
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.resetAll, this);
      this.collection.forEach(this.addOne, this);
    },
    addOne: function (item) {
      console.log('collection view: addOne');
      var smallModelView = new SmallModelView({model: item});
      this.$el.append(smallModelView.render().el);
      console.log('appended record #' + item.get('id') + ' small model view el to collection view el');
    },
    resetAll: function () {
      console.log('collection view: resetAll');
      this.$el.html(null);
      console.log('cleared collection view el');
      this.collection.forEach(this.addOne, this);
    }
  });

  var App = new (Backbone.Router.extend({
    routes: {
      "": "index",
      "models/:id": "show"
    },
    initialize: function () {
      console.log('app: initialize');
      this.collection = new Collection();
    },
    start: function () {
      console.log('app: start');
      Backbone.history.start();
    },
    index: function () {
      console.log('app: index');
      var collectionView = new CollectionView({collection: this.collection});
      this.collection.simulateFetch();
      $('#myView').html(collectionView.el);
    },
    show: function (id) {
      console.log('app: show');
      var model = new Model({id: id});
      var largeModelView = new LargeModelView({model: model});
      model.simulateFetch();
      $('#myView').html(largeModelView.el);
    }
  }));

  App.start();
});