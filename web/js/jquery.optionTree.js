/*
 * jQuery optionTree Plugin
 * version: 1.0.1
 * @requires jQuery v1.2 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @version $Id: jquery.optionTree.js 3 2009-03-03 00:06:13Z kkotowicz $
 * @author  Krzysztof Kotowicz <kkotowicz at gmail dot com>
 */

/**
 * Converts passed JSON option tree into dynamically created <select> elements allowing you to
 * choose nested options.
 *
 * @param String tree options tree
 * @param array options additional options (optional)
 */
(function($){
$.fn.optionTree = function(tree, options) {


    
    options = $.extend({
        choose: 'Choose...',
        preselect: {},
        default_value: false,
        select_class: '',
        leaf_class: 'final',
        empty_value: ''
    }, options || {});

    

    var cleanName = function (name) {
        return name.replace(/_*$/, '');
    };

    var removeNested = function (name) {
        $("select[name^='"+ name + "']").remove();
    };

    var setValue = function(name, value) {
        $("input[name='" + cleanName(name) + "']").val(value).change();
    };


    var recursifDefaultValue = function(select,value,tree_in)
    {
        defaultValue(select,value,tree_in);
        if($("option[value='"+selected+"']").get(0) == undefined)
        recursifDefaultValue(select,value,tree_in);
    };

    var defaultValue = function(select,value,tree_in,selected)
    {
        //???
        var __select = select;

        //Debug Start
        console.log("start : ",select,value,tree_in,selected);

        $.each(tree_in, function(k, v) {
            console.log("___Each :",v,value,k,value==v,value==k,selected);
            if(typeof v == "object" && value != k)
            {
               console.log("recursif call");
               defaultValue(__select,value,v,k);
            }
            else if(
                        (selected != undefined &&  value == v)||
                        (selected != undefined &&  value == k)
                    )
            {
                //valuer à selectionner
                console.log("not recursif_call but ...");
                if($("option[value='"+selected+"']").get(0) == undefined)
                {
                    console.log("selected undefined :",__select,selected,tree_in);
                    recursifDefaultValue(undefined,selected,tree_in);
                    //return ;
                }

                 console.log("selected defined and exist",select,selected);
                 $("option[value='"+selected+"']").get(0).selected = true;
                __select.change();
          
                if($("option[value='"+value+"']") )
                {
                    var opt=false;
                    if(typeof value ==  "string")
                    {
                         opt = value;
                    }
                    else
                    {
                       $.each(tree_in,function(mk,mv){
                            
                           if(mv == value)
                           opt = mk;
                       });
                    }
                    //var opt = tree[value];
                    console.log("On y est presque ::",opt, typeof value );
                    $("option[value='"+opt+"']").get(0).selected = true;
                    }
            }
        })
    }

    return this.each(function() {

        var name = $(this).attr('name') + "_";

        // remove all dynamic options of lower levels
        removeNested(name);

        if (typeof tree == "object") { // many options exists for current nesting level

            // create select element with all the options
            // and bind onchange event to recursively call this function

            var $select = $("<select>").attr('name',name)
            .change(function() {
                if (this.options[this.selectedIndex].value != '') {
                        $(this).optionTree(tree[this.options[this.selectedIndex].value], options);
                } else {
                       removeNested(name + '_');
                       setValue(name, options.empty_value);
                }
            });

            if ($(this).is('input'))
                $select.insertBefore(this);
            else
                $select.insertAfter(this);

            if (options.select_class)
                $select.addClass(options.select_class);
            
            //HACK AF
            if(options.choose!="clear")
                $("<option>").html(options.choose).val('').appendTo($select);

           

            $.each(tree, function(k, v) {
                var o = $("<option>").html(k)
                    .attr('value', k);
                var clean = cleanName(name);
                    if (options.leaf_class && typeof v != 'object') // this option is a leaf node
                        o.addClass(options.leaf_class);

                    o.appendTo($select);
                    if (options.preselect && options.preselect[clean] && options.preselect[clean] == v) {
                        o.get(0).selected = true;
                        $select.change();
                    }
            });

        } else { // single option is selected by the user (function called via onchange event())
            setValue(name, tree);
        }


         if($select && options.choose=="clear")
         {
               $select.change();
         }

         setTimeout(function(){defaultValue($select,8,tree)},400);

    });

}
})(jQuery);