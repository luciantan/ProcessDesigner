function createAinsBlocks(){
	var ainsIfJson = {
					  "type": "ains_if",
					  "message0": "If:  %1 |         // %2 %3 Then: %4",
					  "args0": [
					    {
					      "type": "field_input",
					      "name": "condition",
					      "text": "condition"
					    },
					    {
					      "type": "field_input",
					      "name": "comments",
					      "text": "comments"
					    },
					    {
					      "type": "input_dummy"
					    },
					    {
					      "type": "input_statement",
					      "name": "then"
					    }
					  ],
					  "previousStatement": null,
					  "nextStatement": null,
					  "colour": 255,
					  "tooltip": "",
					  "helpUrl": ""
					};
			Blockly.Blocks['ains_if'] = {
			  init: function() {
			    this.jsonInit(ainsIfJson);
			    // Assign 'this' to a variable for use in the tooltip closure below.
			    var thisBlock = this;
			    this.setTooltip(function() {
			      return 'Add a number to variable "%1".'.replace('%1',
			          thisBlock.getFieldValue('VAR'));
			    });
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
							  "colour": 230,
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

			var ainsWhileJson = {
								  "type": "ains_while",
								  "message0": "while %1 |      // %2 %3 do %4",
								  "args0": [
								    {
								      "type": "field_input",
								      "name": "condition",
								      "text": "condition"
								    },
								    {
								      "type": "field_input",
								      "name": "comments",
								      "text": "comments"
								    },
								    {
								      "type": "input_dummy"
								    },
								    {
								      "type": "input_statement",
								      "name": "NAME"
								    }
								  ],
								  "inputsInline": false,
								  "previousStatement": null,
								  "nextStatement": null,
								  "colour": 345,
								  "tooltip": "",
								  "helpUrl": ""
								}

			Blockly.Blocks['ains_while'] = {
			  init: function() {
			    this.jsonInit(ainsWhileJson);
			    // Assign 'this' to a variable for use in the tooltip closure below.
			    var thisBlock = this;
			    this.setTooltip(function() {
			      return 'Add a number to variable "%1".'.replace('%1',
			          thisBlock.getFieldValue('VAR'));
			    });
			    this.data = 'AinsWhile';
			    this.setEditable(false);
			  }
			};

			var mathChangeJson = {
			  "message0": "change %1 by %2",
			  "args0": [
			    {"type": "field_variable", "name": "VAR", "variable": "item"},
			    {"type": "input_value", "name": "DELTA", "check": "Number"}
			  ],
			  "previousStatement": null,
			  "nextStatement": null,
			  "colour": 230
			};

			Blockly.Blocks['math_change'] = {
			  init: function() {
			    this.jsonInit(mathChangeJson);
			    // Assign 'this' to a variable for use in the tooltip closure below.
			    var thisBlock = this;
			    this.setTooltip(function() {
			      return 'Add a number to variable "%1".'.replace('%1',
			          thisBlock.getFieldValue('VAR'));
			    });
			  }
			};

		};