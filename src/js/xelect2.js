/* jshint maxparams:7 */

'use strict';

var $ = require('jquery'),
    Ps = require('perfect-scrollbar');

require('select2');

$.fn.select2.amd.require([
    'select2/data/array',
    'select2/selection/multiple',
    'select2/utils',
    'select2/dropdown',
    'select2/dropdown/search',
    'select2/dropdown/attachBody',
    'select2/results'
], function (ArrayData, MultipleSelection, Utils, Dropdown, DropdownSearch, AttachBody, Results) {

    var data = [];

    //===============
    // Data
    //===============
    function CustomData ($element, options) {
        CustomData.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(CustomData, ArrayData);

    CustomData.prototype.query = function (params, callback) {
        var matchData = {results: []},
            i;
        if (!params.term || params.term.length < 2) {
            return;
        }
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                if (data[i].text.toLowerCase().indexOf(params.term.toLowerCase()) !== -1) {
                    matchData.results.push(data[i]);
                }
            }
        }
        if (matchData.results.length) {
            callback(matchData);
        }
    };


    //===============
    // Selection
    //===============
    function CustomSelection($element, options) {
        CustomSelection.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(CustomSelection, MultipleSelection);

    $.extend(CustomSelection.prototype, {

        // Add arrow-down icon
        render: function () {
            var $selection = MultipleSelection.__super__.render.call(this);
            $selection.addClass('select2-selection--multiple');
            $selection.html([
                '<i class="select2-selection__indicator fs-arrowdown"></i>',
                '<span class="select2-selection__rendered"></span>'
            ].join(''));
            return $selection;
        },

        // 1. Show placeholder text when it's empty
        // 2. Show text with the following format:
        //    "Option1, Option2, Option3 + n More..."
        update: function (data) {
            var that = this,
                html = [],
                $selection = that.$selection,
                $text = $selection.find('.select2-selection__rendered'),
                maxWidth = $text.outerWidth(),
                currentWidth = 0,
                removes = [],
                i, textEl;

            that.clear();

            if (data.length === 0) {
                // TODO - Need to be configurable
                $text.html('Add Tags');
                $selection.addClass('select2-selection__rendered--empty');
                return;
            }

            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    html.push(data[i].text);
                }
            }

            $text.html(html.join(', '));

            if (html.length > 1) {
                textEl = $text[0];
                currentWidth = textEl.scrollWidth;

                while (html.length && currentWidth > maxWidth) {
                    removes.push(html.pop());
                    $text.html(html.join(', ') + ' + ' + removes.length.toString() + ' More...');
                    currentWidth = textEl.scrollWidth;
                }
            }
        }
    });

    //===============
    // Search
    //===============
    var SearchableDropdown;

    // Add placeholder to search input textbox
    DropdownSearch.prototype.render = function (decorated) {
        var that = this,
            $search,
            $rendered = decorated.call(that);

        $search = $(
          '<span class="select2-search select2-search--dropdown">' +
            '<input class="select2-search__field" type="search" tabindex="-1"' +
            ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
            ' placeholder="Enter Tag Name or select Tags below"' +
            ' spellcheck="false" role="textbox" />' +
          '</span>'
        );

        that.$searchContainer = $search;
        that.$search = $search.find('input');

        $rendered.prepend($search);

        return $rendered;
    };
    SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);
    SearchableDropdown = Utils.Decorate(SearchableDropdown, AttachBody);

    //===============
    // Results
    //===============
    function CustomResults($element, options, dataAdapter) {
        CustomResults.__super__.constructor.call(this, $element, options, dataAdapter);
    }
    Utils.Extend(CustomResults, Results);

    $.extend(CustomResults.prototype, {

        // Apply PerfectScroll
        append: function (data) {
            var that = this,
                $options = [],
                d, item, $option;

            that.hideLoading();

            if (data.results === null || data.results.length === 0) {
                if (that.$results.children().length === 0) {
                    that.trigger('results:message', {
                        message: 'noResults'
                    });
                }
                return;
            }

            data.results = that.sort(data.results);

            for (d = 0; d < data.results.length; d++) {
                item = data.results[d];
                $option = that.option(item);
                $options.push($option);
            }

            that.$results.append($options);

            // Apply PerfectScroll
            Ps.initialize(that.$results[0]);
        },

        // Add link when search doesn't match anything
        displayMessage: function (params) {
            var that = this,
                $message,
                message,
                msg;

            that.clear();
            that.hideLoading();

            $message = $('<li role="treeitem" class="select2-results__option"></li>');

            message = that.options.get('translations').get(params.message);
            msg = message(params.args);

            // Add 'Add New' link
            if (params.message === 'noResults') {
                // TODO - Still needs to bind an event and provide callback
                msg += ', <a href="javascript:void(0);" class="select2-results__add">Add New?</a>';
                $message.addClass('select2-results__option--noresult');
            }

            $message.append(msg);
            that.$results.append($message);
        }
    });

    //===============
    // Options
    //===============
    $('#example-selection-adapter').select2({
        selectionAdapter: CustomSelection,
        //dataAdapter: CustomData,
        dropdownAdapter: SearchableDropdown,
        resultsAdapter: CustomResults,
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
