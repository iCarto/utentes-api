# backbone-uilib

Backbone views, models and collections to help in composing UIs that minimize repaints and reflows.

Models and Collections:

-   [Backbone.UILib.Domain](#backboneuilibdomain)
-   [Backbone.UILib.DomainCollection](#backboneuilibdomaincollection)

Views:

-   [Backbone.UILib.BaseView](#backboneuilibbaseview)
-   [Backbone.UILib.ItemView](#backboneuilibitemview)
-   [Backbone.UILib.ListView](#backboneuiliblistview)
-   [Backbone.UILib.ModalView](#backboneuilibmodalview)
-   [Backbone.UILib.OptionView](#backboneuiliboptionview)
-   [Backbone.UILib.SelectView](#backboneuilibselectview)
-   [Backbone.UILib.WidgetsView](#backboneuilibwidgetsview)

## Backbone.UILib.Domain

A Backbone.Model to manage a close set of values for a specific item. We call it domains.

Dependencies:

-   Backbone.Model - extends this model.

API:

The default properties for this model are:

    defaults: {
        'category': '',
        'alias':    '',
        'text':     '',
        'order':    null,
        'parent':   '',
    }

## Backbone.UILib.DomainCollection

Dependencies:

-   Backbone.Collection - extends this collection.
-   Backbone.UILib.Domain - uses it as its model.

API:

<a name="Backbone.UILib.DomainCollection.new" href="#Backbone.UILib.DomainCollection.new">#</a> new DomainCollection()

    var domains = new Backbone.UILib.DomainCollection();
    domains.url = "/my-domains-api";
    domains.fetch();

<a name="Backbone.UILib.DomainCollection.byCategory" href="#Backbone.UILib.DomainCollection.byCategory">#</a> DomainCollection.byCategory(value)

    var domains = new Backbone.UILib.DomainCollection();
    domains.url = "/my-domains-api";
    domains.fetch();
    var filteredDomains = domains.byCategory(myCategory); // returns a new Backbone.UILib.DomainsCollection containing the models with 'category' property equals to 'myCategory'.

<a name="Backbone.UILib.DomainCollection.byParent" href="#Backbone.UILib.DomainCollection.byParent">#</a> DomainCollection.byParent(value)

    var domains = new Backbone.UILib.DomainCollection();
    domains.url = "/my-domains-api";
    domains.fetch();
    var filteredDomains = domains.byParent(myParent); // returns a new Backbone.UILib.DomainsCollection containing the models with 'parent' property equals to 'myParent'.

## Backbone.UILib.BaseView

Dependencies:

-   Backbone.View - extends this view.

API:

<a name="Backbone.UILib.BaseView.new" href="#Backbone.UILib.BaseView.new">#</a> new BaseView()

    var view = new Backbone.UILib.BaseView();

<a name="Backbone.UILib.BaseView.addView" href="#Backbone.UILib.BaseView.addView">#</a> BaseView.addView(Backbone.View)

    var view = new Backbone.UILib.BaseView();
    view.addView(new MyBackboneView()); // adds a Backbone.View as a subview to be rendered in render() method

<a name="Backbone.UILib.BaseView.render" href="#Backbone.UILib.BaseView.render">#</a> BaseView.render()

    var view = new Backbone.UILib.BaseView();
    view.addView(new MyBackboneView());
    view.render(); // renders all subviews

<a name="Backbone.UILib.BaseView.remove" href="#Backbone.UILib.BaseView.remove">#</a> BaseView.remove()

    var view = new Backbone.UILib.BaseView();
    view.addView(new MyBackboneView());
    view.render();
    ...
    view.remove(); // removes the view and its subviews

## Backbone.UILib.ItemView

Dependencies:

-   Backbone.View - extends this view.

API:

<a name="Backbone.UILib.ItemView.new" href="#Backbone.UILib.ItemView.new">#</a> new ItemView()

    var view = new Backbone.UILib.ItemView({
        model: myModel,
        template: myTemplate
    });

<a name="Backbone.UILib.ItemView.render" href="#Backbone.UILib.ItemView.render">#</a> ItemView.render()

    var view = new Backbone.UILib.ItemView({
        model: myModel,
        template: myTemplate
    });
    view.render(); // renders the model with the template provided

## Backbone.UILib.ListView

Dependencies:

-   Backbone.View - extends this view.
-   Backbone.UILib.ItemView - uses this view to render each model in the collection.

API:

<a name="Backbone.UILib.ListView.new" href="#Backbone.UILib.ListView.new">#</a> new ListView()

    var view = new Backbone.UILib.ListView({
        collection: myCollection,
        el: myEl,
        subviewTemplate: mySubviewTemplate
    });

<a name="Backbone.UILib.ListView.render" href="#Backbone.UILib.ListView.render">#</a> ListView.render()

    var view = new Backbone.UILib.ListView({
        collection: myCollection,
        el: myEl,
        subviewTemplate: mySubviewTemplate
    });
    view.render(); // renders the collection by creating subviews with the template provided

<a name="Backbone.UILib.ListView.update" href="#Backbone.UILib.ListView.update">#</a> ListView.update(Backbone.Collection)

    var view = new Backbone.UILib.ListView({
        collection: myCollection,
        el: myEl,
        subviewTemplate: mySubviewTemplate
    });
    view.render(); // renders the collection by creating subviews with the template provided
    view.update(myNewCollection); // adds new subviews for the new collection and removes the old ones

<a name="Backbone.UILib.ListView.remove" href="#Backbone.UILib.ListView.remove">#</a> ListView.remove()

    var view = new Backbone.UILib.ListView({
        collection: myCollection,
        el: myEl,
        subviewTemplate: mySubviewTemplate
    });
    view.render();
    ...
    view.remove(); // removes this view and its subviews

## Backbone.UILib.ModalView

Dependencies:

-   Backbone.View - extends it.
-   Bootstrap v3 - uses it to manage the modals.

API:

<a name="Backbone.UILib.ModalView.new" href="#Backbone.UILib.ModalView.new">#</a> new ModalView()

    // adds template to DOM
    var modal = new Backbone.UILib.ModalView({
        model: myModel,
        selectorTmpl: '#my-modal-tmpl',
    });

<a name="Backbone.UILib.ModalView.addAuxView" href="#Backbone.UILib.ModalView.addAuxView">#</a> ModalView.addAuxView(Backbone.View)

    var modal = new Backbone.UILib.ModalView({
        model: myModel,
        selectorTmpl: '#my-modal-tmpl',
    });
    modal.addAuxView(myAuxView); // adds subviews to be added and rendered on render() call

<a name="Backbone.UILib.ModalView.render" href="#Backbone.UILib.ModalView.render">#</a> ModalView.render()

    var modal = new Backbone.UILib.ModalView({
        model: myModel,
        selectorTmpl: '#my-modal-tmpl',
    });
    modal.addAuxView(myAuxView);
    modal.render(); // creates and render subviews, opens the modal

<a name="Backbone.UILib.ModalView.remove" href="#Backbone.UILib.ModalView.remove">#</a> ModalView.remove()

    var modal = new Backbone.UILib.ModalView({
        model: myModel,
        selectorTmpl: '#my-modal-tmpl',
    });
    modal.render();
    ...
    modal.remove(); // remove view and subviews

## Backbone.UILib.OptionView

Dependencies:

-   Backbone.View - extends it

API:

<a name="Backbone.UILib.OptionView.new" href="#Backbone.UILib.OptionView.new">#</a> new OptionView()

    var view = new Backbone.UILib.OptionView({
        model: myModel,
        text: myText
    });

<a name="Backbone.UILib.OptionView.render" href="#Backbone.UILib.OptionView.render">#</a> OptionView.render()

    var view = new Backbone.UILib.OptionView({
        model: myModel,
        text: myText
    });
    view.render(); // renders <option>myModel.get(myText)</option>

## Backbone.UILib.SelectView

Dependencies:

-   Backbone.View - extends it
-   Backbone.OptionView - uses it to render the children

API:

<a name="Backbone.UILib.SelectView.new" href="#Backbone.UILib.SelectView.new">#</a> new SelectView()

    new Backbone.UILib.SelectView({
        el: myEl,
        collection: myCollection
    }).render();

<a name="Backbone.UILib.SelectView.render" href="#Backbone.UILib.SelectView.render">#</a> SelectView.render

    var view = new Backbone.UILib.SelectView({
        el: myEl,
        collection: myCollection
    });
    view.render(); // renders the collection by creating subviews with OptionView

<a name="Backbone.UILib.SelectView.update" href="#Backbone.UILib.SelectView.update">#</a> SelectView.update(Backbone.Collection)

    var view = new Backbone.UILib.SelectView({
        el: myEl,
        collection: myCollection
    });
    view.render();
    ...
    view.update(myNewCollection); // removes old subviews and creates new ones for the models in the myNewCollection

<a name="Backbone.UILib.SelectView.remove" href="#Backbone.UILib.SelectView.remove">#</a> SelectView.remove()

    var view = new Backbone.UILib.SelectView({
        el: myEl,
        collection: myCollection
    });
    view.render();
    ...
    view.remove(); // removes view and subviews

## Backbone.UILib.WidgetsView

Dependencies:

-   Backbone.View - extends it
-   [formatter](https://github.com/iCarto/formatter) - uses it to format numbers and dates.

API:

<a name="Backbone.UILib.WidgetsView.new" href="#Backbone.UILib.WidgetsView.new">#</a> new WidgetsView()

    var view = new Backbone.UILib.WidgetsView({
        el: myEl,
        model: myModel
    });

<a name="Backbone.UILib.WidgetsView.render" href="#Backbone.UILib.WidgetsView.render">#</a> WidgetsView.render()

    var view = new Backbone.UILib.WidgetsView({
        el: myEl,
        model: myModel
    });
    view.render();
