function createAinsBlocks(){

 Blockly.Blocks['ains_if'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("If: ")
          .appendField(new Blockly.FieldTextInput("condition"), "condition")
          //.appendField("//")
          .appendField('//comments','comments');
      this.appendStatementInput("then")
          .setCheck(null)
          .appendField("Then:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#855cd6');
     this.setTooltip("");
     this.setHelpUrl("");
     this.setEditable(false);
     this.commentMessage = '//comments';
    }
  };

	Blockly.Blocks['ains_do'] = {

	  init: function() {
		function dynamicOptions() {
			var options = [];
      options.push(['set','set']);
      options.push(['send email','send email']);
			options.push(['getFolder()','getFolder()']);
			options.push(['setValue()','setValue()']);
			// var now = Date.now();
			// for (var i = 0; i < 7; i++) {
			// 	options.push([String(new Date(now)).substring(0,3), 'DAY' + i]);
			// 	now += 24 * 60 * 60 * 1000;
			// }
			return options;
		}
		var dropdown = new Blockly.FieldDropdown(dynamicOptions);
		//input.appendField(dropdown, 'DATE');

	    this.appendDummyInput()
	        .appendField("Do:").appendField(dropdown,'options')
          .appendField('//comments','comments');
	        //.appendField(new Blockly.FieldDropdown([["option1","option1"], ["option2","option2"], ["option3","option3"]]), "options");
	    this.setInputsInline(false);
	    this.setPreviousStatement(true, null);
	    this.setNextStatement(true, null);
	 this.setTooltip("");
	 this.setHelpUrl("");
   //this.setColour('#ec9c13');
	 this.setColour('#4280d7');
	 this.commentMessage = '//comments';
	  }
	};

  Blockly.Blocks['ains_while'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("while:")
          .appendField(new Blockly.FieldTextInput("condition"), "condition")
          //.appendField("//")
          .appendField('//comments','comments');
      this.appendStatementInput("NAME")
          .setCheck(null)
          .appendField("do");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      // this.setColour('#4280d7');
      this.setColour('#ec9c13');
   this.setTooltip("");
   this.setHelpUrl("");
   this.commentMessage = '//comments';
   this.setEditable(false);
    }
  };

  Blockly.Blocks['foreach'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("ForEach")
          .appendField(new Blockly.FieldTextInput("default"), "NAME")
          .appendField('//comments','comments');
      this.appendStatementInput("NAME")
          .setCheck(null)
          .appendField("do:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
   this.commentMessage = '//comments';
    }
  };
  Blockly.Blocks['error'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Error:")
          .appendField(new Blockly.FieldTextInput("default"), "NAME")
          .appendField('//comments','comments');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#ff4d6a");
   this.setTooltip("");
   this.setHelpUrl("");
   this.commentMessage = '//comments';
    }
  };
};