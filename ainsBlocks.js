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
       this.data = 'AinsIf';
        }
      };

		Blockly.Blocks['ains_invoke'] = {

		  init: function() {
			function dynamicOptions() {
				var options = [];
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
		        .appendField("Invoke:").appendField(dropdown,'options');
		        //.appendField(new Blockly.FieldDropdown([["option1","option1"], ["option2","option2"], ["option3","option3"]]), "options");
		    this.setInputsInline(false);
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		 this.setTooltip("");
		 this.setHelpUrl("");
		 this.setColour('#ec9c13');
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
          this.setColour('#4280d7');
       this.setTooltip("");
       this.setHelpUrl("");
       this.data = 'ainsWhile';
       this.setEditable(false);
        }
      };
		};