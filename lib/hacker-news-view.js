var hn = require('./hn'),
    open = require('open');

var HackerNewsView = function () {
    return HackerNewsView.__super__.constructor.apply(this, arguments);
};

(function (child, parent) {
    for (var key in parent) {
        if (parent.hasOwnProperty(key))
            child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
})(HackerNewsView, require('atom').SelectListView);

HackerNewsView.prototype.initialize = function () {

    var view = this;

    HackerNewsView.__super__.initialize.apply(this, arguments);

    atom.workspaceView.command('hacker-news:top', (function(_this) {

        return function () {
            // If this view already has a parent, dont do anything.
            if(_this.hasParent()) return;

            // Add the view to the workspace, then populate the list of
            // items from the last setItems call, then set the focus to
            // the filter editor.
            atom.workspaceView.append(_this);
            hn.loadTop(function (err, links) {
                if (err) {
                    view.setError('Error connecting to https://news.ycombinator.com/');
                    return;
                }
                view.setItems(links);
                view.populateList();
            });
            _this.focusFilterEditor();
        };

    })(this));

    this.addClass('overlay from-top');
    hn.loadTop(function (err, links) {
        if (err) {
            view.setError('Error connecting to https://news.ycombinator.com/');
            return;
        }
        view.setItems(links);
        view.populateList();
    });

    // Append to the workspace and then focus it.
    atom.workspaceView.append(this);

    return this.focusFilterEditor();

};

/**
 * Generate a view for a module.
 */
HackerNewsView.prototype.viewForItem = function (link) {
    return '<li class="two-lines">' +
                '<div class="primary-line">' + link.rank + '. ' + link.title + '</div>' +
                '<div class="secondary-line">' + link.domain + '</div>' +
            '</li>';
};

/**
 * Hook for when the SelectListView registers the user having selected an option
 */
HackerNewsView.prototype.confirmed = function (link) {
    if(link.url)
        open(link.url);
    this.cancel();
};

HackerNewsView.prototype.getFilterKey = function () { return 'title'; };

module.exports = HackerNewsView;
