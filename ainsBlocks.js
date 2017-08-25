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

      var ainsInvoke = {
                "type": "ains_invoke",
                "message0": "Invoke %1",
                "args0": [
                  {
                    "type": "field_dropdown",
                    "name": "options",
                    "options": [
                      [
                        "option1",
                        "OPTIONNAME1"
                      ],
                      [
                        "option2",
                        "OPTIONNAME2"
                      ],
                      [
                        "option3",
                        "OPTIONNAME3"
                      ]
                    ]
                  }
                ],
                "inputsInline": false,
                "previousStatement": null,
                "nextStatement": null,
                "colour": '#ec9c13',
                "tooltip": "",
                "helpUrl": ""
              }

      Blockly.Blocks['ains_invoke'] = {
        init: function() {
          this.jsonInit(ainsInvoke);
          // Assign 'this' to a variable for use in the tooltip closure below.
          var thisBlock = this;
          this.setTooltip(function() {
            return 'Add a number to variable "%1".'.replace('%1',
                thisBlock.getFieldValue('VAR'));
          });
          this.data = 'AinsInvoke';
          //this.data2 = 'ains data 2';
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