'use strict';

$.fn.select2.amd.require([
    'select2/selection/multiple',
    'select2/utils',
    'select2/dropdown',
    'select2/dropdown/search',
    'select2/dropdown/attachBody',
    'select2/results'
], function (MultipleSelection, Utils, Dropdown, DropdownSearch, AttachBody, Results) {

    var proto;

    //===============
    // Selection
    //===============
    function CustomSelection($element, options) {
        CustomSelection.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(CustomSelection, MultipleSelection);

    $.extend(CustomSelection.prototype, {
        render: function () {
            var $selection = MultipleSelection.__super__.render.call(this);
            $selection.addClass('select2-selection--multiple');
            $selection.html([
                '<i class="select2-selection__indicator fs-arrowdown"></i>',
                '<span class="select2-selection__rendered"></span>'
            ].join(''));
            return $selection;
        },
        update: function (data) {
            var that = this,
                html = [],
                $selection = that.$selection,
                $text = $selection.find('.select2-selection__rendered'),
                maxWidth = $text.outerWidth(),
                currentWidth = 0,
                removes = [],
                i;

            that.clear();

            if (data.length === 0) {
                $text.html('Add Tags');
                $container.addClass('select2-selection__rendered--empty');
                return;
            }

            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    html.push(data[i].text);
                }
            }

            $text.html(html.join(', '));
            currentWidth = $text[0].scrollWidth;

            while (html.length && currentWidth > maxWidth) {
                removes.push(html.pop());
                $text.html(html.join(', ') + ' + ' + removes.length.toString() + ' More...');
                currentWidth = $text[0].scrollWidth;
            }
        }
    });

    //===============
    // Search
    //===============
    DropdownSearch.prototype.render = function (decorated) {
        var $rendered = decorated.call(this);

        var $search = $(
          '<span class="select2-search select2-search--dropdown">' +
            '<input class="select2-search__field" type="search" tabindex="-1"' +
            ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
            ' placeholder="Enter Tag Name or select Tags below"' +
            ' spellcheck="false" role="textbox" />' +
          '</span>'
        );

        this.$searchContainer = $search;
        this.$search = $search.find('input');

        $rendered.prepend($search);

        return $rendered;
    };

    var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

    SearchableDropdown = Utils.Decorate(SearchableDropdown, AttachBody);

    //===============
    // Results
    //===============
    function CustomResults($element, options, dataAdapter) {
        CustomResults.__super__.constructor.call(this, $element, options, dataAdapter);
    }
    Utils.Extend(CustomResults, Results);

    CustomResults.prototype.append = function (data) {
        this.hideLoading();

        var $options = [];

        if (data.results == null || data.results.length === 0) {
            if (this.$results.children().length === 0) {
                this.trigger('results:message', {
                    message: 'noResults'
                });
            }
            return;
        }

        data.results = this.sort(data.results);

        for (var d = 0; d < data.results.length; d++) {
            var item = data.results[d];
            var $option = this.option(item);
            $options.push($option);
        }

        this.$results.append($options);
        Ps.initialize(this.$results[0]);


    };

    Results.prototype.displayMessage = function (params) {
        var escapeMarkup = this.options.get('escapeMarkup');

        this.clear();
        this.hideLoading();

        var $message = $(
            '<li role="treeitem" class="select2-results__option"></li>'
        );

        var message = this.options.get('translations').get(params.message);
        var msg = message(params.args);
        if (params.message === 'noResults') {
            msg += ', <a href="javascript:void(0);" class="select2-results__add">Add New?</a>';
            $message.addClass('select2-results__option--noresult');
        }

        $message.append(msg);

        this.$results.append($message);

    };

    //===============
    // Options
    //===============
    $('#example-selection-adapter').select2({
        selectionAdapter: CustomSelection,
        dropdownAdapter: SearchableDropdown,
        resultsAdapter: CustomResults,
        placeholder: 'Add Tags',
        templateResult: function (option) {
            var html = [
                '<label>',
                '    <span class="select2-results__checkbox">',
                '        <i class="fs fs-checkmark"></i>',
                '    </span>' + option.text,
                '</label>'
            ].join('');
            return $(html);
        }
    });

});
