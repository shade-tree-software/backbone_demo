// Code goes here

$(function () {
  var Model = Backbone.Model.extend({});

  var ModelView = Backbone.View.extend({
    initialize: function () {
      this.model.on('remove', this.hide, this);
      this.model.on('change', this.redrawSmall, this);
      this.model.on('small', this.redrawSmall, this);
      this.model.on('large', this.redrawLarge, this);
      console.log('created model view and blank el for record #' + this.model.get('id'));
    },
    hide: function () {
      this.remove();
      console.log('removed model view and el for record #' + this.model.get('id') + ' from the DOM');
    },
    render: function () {
      this.redrawSmall();
      return this;
    },
    redrawSmall: function () {
      var id = this.model.get('id');
      this.$el.html('<p class="model' + id + '">' + id + ': ' + this.model.get('title') + '</p>');
      this.$el.on('click.small', function(){
        App.navigate("models/" + id, {trigger: true});
      });
      console.log('rendered small view for record #' + id);
    },
    redrawLarge: function () {
      var id = this.model.get('id');
      this.$el.html('<p>ID: ' + id + '</p><p>Title: ' + this.model.get('title') + '</p>');
      this.$el.off('click.small');
      console.log('rendered large view for record #' + id);
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model,
    focusOnItem: function (id) {
      console.log('clicked on el for model #' + id);
      var model = this.get(id);
      model.trigger('large');
      this.set([model]);
    },
    simulateFetch: function () {
      this.set([
        {id: $('#row1id').val(), title: $('#row1title').val()},
        {id: $('#row2id').val(), title: $('#row2title').val()},
        {id: $('#row3id').val(), title: $('#row3title').val()}
      ]);
    }
  });

  var CollectionView = Backbone.View.extend({
    el: '#myView',
    initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.resetAll, this);
    },
    addOne: function (item) {
      var modelView = new ModelView({model: item});
      this.$el.append(modelView.render().el);
      console.log('appended record #' + item.get('id') + ' model view el to collection view el');
    },
    redraw: function () {
      this.collection.forEach(function (model) {
        model.trigger('small');
      });
    },
    resetAll: function () {
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
    initialize: function(){
      this.collection = new Collection();
      this.collectionView = new CollectionView({collection: this.collection});
      this.collection.reset([
        {id: $('#row1id').val(), title: $('#row1title').val()},
        {id: $('#row2id').val(), title: $('#row2title').val()},
        {id: $('#row3id').val(), title: $('#row3title').val()}
      ]);
    },
    start: function(){
      Backbone.history.start();
    },
    index: function(){
      this.collectionView.redraw();
      this.collection.simulateFetch();
    },
    show: function(id){
      this.collection.focusOnItem(id);
    }
  }));

  App.start();
});