// Code goes here

$(function () {
  var Model = Backbone.Model.extend({});

  var ModelView = Backbone.View.extend({
    initialize: function () {
      this.model.on('remove', this.hide, this);
      this.model.on('change', this.render, this);
      console.log('created model view and blank el for record #' + this.model.get('id'));
    },
    hide: function () {
      this.remove();
      console.log('removed model view and el for record #' + this.model.get('id') + ' from the DOM');
    },
    render: function () {
      this.$el.html('<p>' + this.model.get('id') + ': ' + this.model.get('title') + '</p>');
      console.log('changed model view el for record #' + this.model.get('id'));
      return this;
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model,
    myFetchOne: function () {
      var $nextId = $('#nextId');
      var index = $nextId.val();
      this.set([{id: index++, title: $('#title1').val()}
      ]);
      $nextId.val(index);
    },
    myFetch: function () {
      var $nextId = $('#nextId');
      var index = $nextId.val();
      this.set([
        {id: index++, title: $('#title1').val()},
        {id: index++, title: $('#title2').val()},
        {id: index++, title: $('#title3').val()}
      ]);
      $nextId.val(index);
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
    resetAll: function (options) {
      this.$el.html(null);
      console.log('cleared collection view el');
      this.collection.forEach(this.addOne, this);
    }
  });

  var collection = new Collection();
  var collectionView = new CollectionView({collection: collection});

  $("#clearOne").on('click', function () {
    collection.remove(collection.get($('#id').val()));
  });
  $("#clearAll").on('click', function () {
    collection.set([]);
  });
  $("#addOne").on('click', function () {
    var $nextId = $('#nextId');
    var index = $nextId.val();
    var model = new Model();
    model.set({id: index++, title: $('#title1').val()});
    collection.add(model);
    $nextId.val(index);
  });
  $("#setOne").click(collection.myFetchOne.bind(collection));
  $("#resetAll").on('click', function () {
    var $nextId = $('#nextId');
    var index = $nextId.val();
    collection.reset([
      {id: index++, title: $('#title1').val()},
      {id: index++, title: $('#title2').val()},
      {id: index++, title: $('#title3').val()}
    ]);
    $nextId.val(index);
  });
  $("#setAll").click(collection.myFetch.bind(collection));
  $("#changeOne").on('click', function () {
    var model = collection.get($('#id').val());
    model.set({title: $('#title').val()});
  });
});