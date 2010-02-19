/*
 * jQuery optionTreeDefault Plugin
 * version: 1.0.1
 * @requires jQuery v1.2 or later
 * @requires jQuery.optionTree.js
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @version $Id: $
 * @author  Aurelien Fontaine <aurelien@attraktiv.fr>
 */
(function($){

    $.fn.optionTreeDefault = function(value)
    {

        var defaultTab = new Array;
        defaultTab['key'] = new Array;
        defaultTab['value'] = new Array;

        var depth = 0;

        var hasSelectable = function(value)
        {
            if($("option[value='"+value+"']").get(0) != undefined)
            {
              
                return true;

            }
         
            return false;
        }

        var selector = function(select,value)
        {
            if(hasSelectable(value))
            {
                $("option[value='"+value+"']").get(0).selected = true;               
                $("select:option[value='"+value+"']").change();
                return true;
            }
            else
            {
                return false;
            }
        }

        var treeSelectable = function(tree,value,elm)
        {
            
            
            $.each(tree,function(k,v)
            {
                if(v==value || k==value)
                {
                    
                    setDefault(k,v);
                    treeSelectable(elm.tree,tree,elm);
                }

                if(typeof v == "object")
                {
                    treeSelectable(v,value,elm);
                }
            });

        }

        var treeSelector = function (elm)
        {
           
            for(i = defaultTab['key'].length -1; i>=0;i--)
            {
                               
                        selector(elm,defaultTab['key'][i]);
               
            }

        }

        var setDefault = function(key,value)
        {
            defaultTab['key'][depth]=key;
            defaultTab['value'][depth]=value;
            depth++;
        }

        var getDefault = function(depth_in)
        {
            if(depth_in)
            return ({'key':defaultTab['key'][depth_in],'value':defaultTab['value'][depth_in]});
            else
            return ({'key':defaultTab['key'],'value':defaultTab['value']});
        }

        return this.each(function()
        {
           
            var $this = $(this);
            if(value==false) return;        
            $(this).extend($.fn.optionTree);
           
            
           
           treeSelectable(this.tree,value,this);
           treeSelector(this);
         
            
        });
    }
})(jQuery);




/******

    var depth = 0;
    var default_tab = new Array;
    default_tab['key'] = new Array;
    default_tab['value'] = new Array;
    var __tree = tree
    var tree_default = function(tree,value,name)
    {
        console.log("start tree ",name,' :',value);
        $.each(tree,function(k,v){
            if(typeof v== "object")
            {
                tree_default(v,value,'recursif '+k);
            }

            if(v==value)
            {
                default_tab['key'][depth]=k;
                default_tab['value'][depth]=v;
                console.log("level "+depth+" ",default_tab);
                indexOf = tree[k].valueOf();
                console.log(indexOf,tree,__tree);
                depth++;
                tree_default(__tree, indexOf -1,' too recursif');
            }
        })
    }   ;


    var defaultValue = function(select,value,tree_in,selected)
    {
        //???
        var __select = select;

        tree_default(tree_in,value);
        return ;


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
                    defaultValue(undefined,selected,tree_in);
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
 */