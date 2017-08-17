window.onload = function() {
			createAinsBlocks();
			


			var workspace = Blockly.inject('blocklyDiv',
		      {
		      	toolbox: document.getElementById('toolbox'),
				grid:
			         {spacing: 20,
			          length: 3,
			          colour: '#ccc',
			          snap: true},
			    trashcan: true,
			    horizontalLayout: false,
			    readOnly:false,
			    scrollbars:true,
			    //toolboxPosition:"start",
		      });
			// function myUpdateFunction(event) {
			// 	var code = Blockly.JavaScript.workspaceToCode(workspace);
			// 	document.getElementById('textarea').value = code;
			// }
			workspace.addChangeListener(function(event){
			 	if (event.type == Blockly.Events.MOVE) {
				 	var xml = Blockly.Xml.workspaceToDom(workspace);
					var xml_text = Blockly.Xml.domToPrettyText(xml);

					console.log(xml_text);
			 	}
			 	
			 });
			workspace.addChangeListener(onClicking);

			function onClicking(event) {
				if (event.type == Blockly.Events.UI && event.element == 'click') {
					//Using jQuery to create a dialog
					var blockId = event.blockId;
					var block = workspace.getBlockById(blockId);
					var inputList = block.inputList;
					console.log(block);
					console.log(inputList);

					if (block.type == 'ains_invoke') {
						var textData = inputList[0].fieldRow[1].text_;
						console.log(textData);
						//workspace.getBlockById(blockId).inputList[0].fieldRow[2].text_ = 'you clicked me, so text is changed';
					} else if (block.type == 'ains_if') {
						var ifCondition = inputList[0].fieldRow[1].text_;

						console.log(ifCondition);
						createDialog(ifCondition);

						// var textInput = 'you clicked me, so condition is changed';

						// //workspace.getBlockById(blockId).getField('condition').setText(textInput);
						// block.getField('condition').setText(textInput);


						 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].text_ = textInput;
						 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].textElement_.innerHTML = textInput;

					} else if (block.type == 'ains_while') {
						var whileCondition = inputList[0].fieldRow[1].text_;
						console.log(whileCondition);
						createDialog(whileCondition);

						// var textInput = 'you clicked me, so condition is changed';
						// block.getField('condition').setText(textInput);
					}
				}
				function createDialog(typeCondition) {

					$("#previousCondition").html(typeCondition);
					var $dialog = $("#dialogCondition").dialog({autoOpen: false,});

					
					$dialog.dialog("option","modal","true");
					$dialog.dialog("option","width",780);
					$dialog.dialog("option","height",400);
					$dialog.dialog("option","height","auto");
					$dialog.dialog("option","show",{effect:"blind",duration:200,});
					$dialog.dialog("option","hide",{effect:"blind",duration:200,});
					$dialog.dialog({open:function(event, ui){
						$('.ui-widget-overlay').bind('click',function(){
							$dialog.dialog('close');
						});
					}});



					$dialog.dialog({ buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ] });

					$dialog.dialog("open");


				}

			}

			// workspace.addChangeListener(Blockly.Events.Move, function(){
			// 	var xml = Blockly.Xml.workspaceToDom(workspace);
			// 	var xml_text = Blockly.Xml.domToPrettyText(xml);

			// 	console.log(xml_text);
			// });

			
			
		}
	  