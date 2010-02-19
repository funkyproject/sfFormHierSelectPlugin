<?php
/**
 * A widget of hierarchical select
 *
 * @package     sfFormHierSelect
 * @subpackage  widget
 * @author      Aurelien Fontaine <aurelien@attraktiv.fr>
 * @version     SVN: $Id:$
 */
class sfWidgetFormHierSelect extends  sfWidgetFormInput
{

  /**
   *  Available options:
   *

   *  * choices      :     The array choices (required)
   *  * choose       :     This value will be inserted int <input> element if client reverts from choosing an option by going up in the tree
   *  * select_class :     HTML class of created select elements
   *  * leaf_class   :     HTML class of leaf node <option> element
   *
   * @param array $options     An array of options
   * @param array $attributes  An array of default HTML attributes
   *
   * @see sfWidget
   */
  protected function configure($options = array(), $attributes = array())
  {
        $this->addRequiredOption('type');
        $this->addRequiredOption('choices');        
        $this->setOption('type', 'hidden');
        $this->addOption('choose','clear');
        $this->addOption('empty_value','');
        $this->addOption('select_class','');
        $this->addOption('leaf_class','final');
  }


  /**
   * @param  string $name        The element name
   * @param  string $value       The date displayed in this widget
   * @param  array  $attributes  An array of HTML attributes to be merged with the default HTML attributes
   * @param  array  $errors      An array of errors for the field
   *
   * @return string An HTML tag string
   *
   * @see sfWidgetForm
   */
  public function render($name, $value = null, $attributes = array(), $errors = array())
  {
        return $this->renderTag('input', array('type' => 'hidden', 'name' => $name, 'value' => $value)).
        sprintf(<<<EOF
 <script type="text/javascript">
   var  %s = {
            %s
        };
   var options = {select_class : '%s', leaf_class: '%s', empty_value : '%s', choose : '%s' %s};

   jQuery(document).ready(function(){
       
        jQuery('#%s').optionTree(%s, options)
        .optionTreeDefault(%s);
   });

</script>

EOF
                ,
      $this->generateId('js_'.$name),
      $this->renderJs($this->getOption('choices')),
      $this->getOption('select_class'),
      $this->getOption('leaf_class'),
      $this->getOption('empty_value'),
      $this->getOption('choose'),
      (isset($value) && !is_null($value))?',preselect : '.$this->getPreselect($value,$name).'':'',
      $this->generateId($name),
      $this->generateId('js_'.$name),
      (is_null($value))?'false':$value

      );
  }


  protected function getPreselect($value,$name)
  {
      
      $choices = $this->getOption('choices');
      return "{}";

  }

  /**
   * Parse array php to js
   *
   * @param array $choices
   * @return string An javascript string
   */
  protected function renderJs(array $choices)
  {
   
      foreach($choices as $opt => $values)
      {
      
          $out[]="\"$opt\" :  {";
           foreach($values as $key => $val)
          {
              if(!is_array($val))
              {
                $out[]="\" $val \" : $key ,";
              }
              else
              $out[] = $this->renderJs(array($key=>$val));
          }
          $out[]= "},";
      }

      return implode("\n",$out);
  }

  /**
   * Gets the JavaScript paths associated with the widget.
   *
   * @return array An array of JavaScript paths
   */
  public function getJavascripts()
  {
        return array('/sfFormHierSelectPlugin/js/jquery.optionTree.js','/sfFormHierSelectPlugin/js/jquery.optionTreeDefault.js');
  }

}