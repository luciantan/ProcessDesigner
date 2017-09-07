window.onload = function(){

	var AinsBlockly = (function(){
		createAinsBlocks();
		var blocklyArea = document.getElementById('blocklyArea');
		var blocklyDiv = document.getElementById('blocklyDiv');

		var workspace = Blockly.inject('blocklyDiv',{
			toolbox: document.getElementById('toolbox'),
			grid:{
				spacing:20,
				length:3,
				colour:'#ccc',
				snap:true,
			},
			trashcan:true,
			horizontalLayout:false,
			readOnly:false,
		});

		function onresize(e) {
			var element = blocklyArea;
			var x = 0;
			var y = 0;
			do {
				x += element.offsetLeft;
				y += element.offsetTop;
				element = element.offsetParent;
			} while (element);
			blocklyDiv.style.left = x + 'px';
			blocklyDiv.style.top = y + 'px';
			blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
			blocklyDiv.style.top = blocklyArea.offsetHeight + 'px';
		};

		window.addEventListener('resize',onresize, false);
		onresize();
		Blockly.svgResize(workspace);

		//var selectedBlock_ = workspace.newBlock();
		var selectedBlock_ = null;


		return {
			workspace: workspace,
			getSelectedBlock : function(){return selectedBlock_},
			setSelectedBlock: function(block){selectedBlock_ = block},
			//selectedBlock_: selectedBlock_,
		};

	})();

	var AinsXml = (function(){
		var xml = null;
		var $xmlDisplay = $('#xmlDisplay');
		var workspace = AinsBlockly.workspace;

		workspace.addChangeListener(function(event){
			if(event.type == Blockly.Events.MOVE){
				updateXml();
			}
		});

		function updateXml(){
			var xmlDom = Blockly.Xml.workspaceToDom(workspace);
			var xmlText = Blockly.Xml.domToText(xmlDom);
			var xmlPrettyText = Blockly.Xml.domToPrettyText(xmlDom);
			xml = xmlPrettyText;
			$xmlDisplay.text(xml);
			console.log(xmlPrettyText);
		}
		return {
			updateXml:updateXml,
			xml:xml,
			$xmlDisplay:$xmlDisplay,
		};
	})();

	var conditionEditor = (function(){
		var workspace = AinsBlockly.workspace;
		var $conditionBox = $('#conditionBox');
		var $previousCondition = $('#previousCondition');
		var $previousComment = $('#previousComment');
		var $addConditionBtn = $('#addConditionBtn');
		var $newCondition = $('#newCondition');
		var $newComment = $('#newComment');
		var $invokeBox = $('#invokeBox');

		workspace.addChangeListener(clickingConditionBlockHandler);
		function clickingConditionBlockHandler(event){
			if (event.type == Blockly.Events.UI && event.element == 'click'){
				var blockId = event.blockId;
				var block = workspace.getBlockById(blockId);
				AinsBlockly.setSelectedBlock(block);
				if (block.type == 'ains_if' || block.type == 'ains_while'){
					$invokeBox.hide({duration:250, effect:'slide', direction:'right', complete:function(){
						$conditionBox.show({duration:250, effect:'slide', direction:'right'});
					},});
					$newCondition.val('');
					$newComment.val('');

					var conditionField = block.getField('condition');
					var commentField = block.getField('comments');
					conditionField.maxDisplayLength = 8;
					commentField.maxDisplayLength = 20;

					var previousCondition = AinsBlockly.getSelectedBlock().getField('condition').getText();
					$previousCondition.html(previousCondition);

					var previousComment = AinsBlockly.getSelectedBlock().getField('comments').getText().slice(2);
					$previousComment.html(previousComment);
				}
			}
		};

		$addConditionBtn.on('click', $addConditionBtn, function(){
			addConditionHandler(AinsBlockly.getSelectedBlock());
		});
		function addConditionHandler(block){
			var conditionField = block.getField('condition');
			var newCondition = $newCondition.val();
			conditionField.setText(newCondition);
			$previousCondition.html(newCondition);
			var commentField = block.getField('comments');
			var newComment = $newComment.val();
			commentField.setText('//'+newComment);
			$previousComment.html(newComment);
			block.data = newComment;
			AinsXml.updateXml();
		};
	})();

	var InvokeOptions = (function(){

		var workspace = AinsBlockly.workspace;
		var $invokeBox = $('#invokeBox');
		var $currentOption = $('#currentOption');
		var $optionsList = $('#options');
		var $optionBtn = $('#changeOptionBtn');
		var $conditionBox = $('#conditionBox');
		var $getFolderBox = $('#getFolderBox');
		var $setValueBox = $('#setValueBox');

		workspace.addChangeListener(clickingDoBlockHandler);
		function clickingDoBlockHandler(event){
			if (event.type == Blockly.Events.UI && event.element == 'click'){
				var blockId = event.blockId;
				var block = workspace.getBlockById(blockId);
				AinsBlockly.setSelectedBlock(block);
				if (block.type == 'ains_do'){
					$conditionBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
						$getFolderBox.hide({duration:250,effect:'slide', direction:'right'});
						$setValueBox.hide({duration:250,effect:'slide', direction:'right'});
						$invokeBox.hide({duration:250, effect:'slide', direction:'right'});
						$invokeBox.show({duration:250, effect:'slide', direction:'right'});
					},});
					var field = block.getField('options');
					var value = field.getText();
					var options = field.getOptions();
					$optionsList.empty();
					for (var i = 0; i < options.length; i++) {
						var option = options[i];
						$optionsList.append($('<option>', {
							value: option[1],
							text: option[0],
						}));
					}
					$optionsList.val(value);
					$currentOption.html(value);
				}
			}
		};

		$optionsList.on('change', $optionsList, changeOptionListHandler);
		function changeOptionListHandler(){
			var option = $optionsList.val();
			$currentOption.html(option);
			var block = AinsBlockly.getSelectedBlock();
			var field = block.getField('options');
			field.setText(option);

		};

		// $selectVariables.on('change', $selectVariables, changeVariableHandler);
		// function changeVariableHandler(){
		// 	var variable = $selectVariables.val();
		// 	updateProperties_(variable);
		// }

		$optionBtn.on('click', $optionBtn, function(){
			var block = AinsBlockly.getSelectedBlock();
			var field = block.getField('options');
			var selectedOption = $optionsList.val();
			field.setValue(selectedOption);
			$currentOption.html(selectedOption);
			if (selectedOption == 'getFolder()'){
				openGetFolderBox();
			} else if (selectedOption == 'setValue()') {
				openSetValueBox();
			};
		});

		function openGetFolderBox(){
			getFolderMethod.updateGetFolderBox();
			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$getFolderBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		};

		function openSetValueBox(){
			//update the variables dropdown options
			setValueMethod.updateVariableOptions();

			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$setValueBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		}

	})();

	var getFolderMethod = (function(){
		var $getFolderBox = $('#getFolderBox');
		var $folderId = $('#folderId');
		var $variable = $('#variableName');
		var $getFolderBtn = $('#getFolderBtn');
		var $invokeBox = $('#invokeBox');
		// var ainsVariables = {};

		$getFolderBtn.on('click',$getFolderBox, getFolder);
		function getFolder(){
			var folderId = $folderId.val();
			var variable = $variable.val();
			var block = AinsBlockly.getSelectedBlock();
			var oData = {"folderName":variable,"folderId":folderId,"type":"folder"};
			block.data = JSON.stringify(oData);
			console.log(block.data);
			AinsBlockly.setSelectedBlock(block);
			$getFolderBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$invokeBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		};

		function updateGetFolderBox(){
			var block = AinsBlockly.getSelectedBlock();
			var data = block.data;
			console.log(data);
			if (data == 'ainsDo') {
				$folderId.val('');
				$variable.val('');
			} else {
				oData = JSON.parse(data);
				$folderId.val(oData.folderId);
				$variable.val(oData.folderName);
			}
			
		};

		return {
			updateGetFolderBox : updateGetFolderBox,
		}
	})();

	var setValueMethod = (function(){
		var workspace = AinsBlockly.workspace;
		var $setValueBox = $('#setValueBox');
		var $selectVariables = $('#selectVariables');
		var $setValueBtn = $('#setValueBtn');
		var $properties = $('#properties');
		var $invokeBox = $('#invokeBox');
		var ainsVariables = {};

		$setValueBtn.on('click', $setValueBtn, setValueBtnHandler);
		function setValueBtnHandler() {
			// var block = AinsBlockly.getSelectedBlock();
			// var rootBlock = block.getRootBlock();
			// var currentBlock = rootBlock;

			// while (currentBlock.id != block.id) {
			// 	ainsVariables.append(currentBlock.data);
			// 	currentBlock = currentBlock.getNextBlock();
			// }
			//console.log(selectedBlockId);
			// console.log(AinsBlockly.getSelectedBlock().getRootBlock().data);
			//console.log(rootBlock);
			//console.log(block.data);
			// var block = AinsBlockly.getSelectedBlock();
			// var rootBlock = block.getRootBlock();
			// var currentBlock = rootBlock;
			var $selectVariables = $('#selectVariables');
			var folderName = $selectVariables.val();
			var $blockIdField = $('#setValueBox > table > tbody > tr:nth-child(4) > td:nth-child(2) > input[type="text"]');
			var chosedBlockId = $blockIdField.val();
			var chosedBlock = workspace.getBlockById(chosedBlockId);
			var newId = $('#setValueBox > table > tbody > tr:nth-child(6) > td:nth-child(2) > input[type="text"]').val();
			//update the properties of the selected block
			var oData = {"folderName":folderName,"folderId":newId,"type":"folder"};
			console.log(JSON.stringify(oData));
			if (chosedBlock) {
				chosedBlock.data = JSON.stringify(oData);
			}
			
			updateVariableOptions();

			console.log(chosedBlock);
			console.log(ainsVariables);
			$setValueBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$invokeBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		
		}

		$selectVariables.on('change', $selectVariables, changeVariableHandler);
		function changeVariableHandler(){
			var variable = $selectVariables.val();
			updateProperties_(variable);
		}

		//When folder is changed, or before the setValueBox is opened, update the properties input table. 
		function updateProperties_(variable){
			$properties.closest("tr").next().remove();
			$properties.closest("tr").next().remove();
			$properties.closest("tr").next().remove();
			//$properties.closest("tr").next().remove();
			$.each(ainsVariables[variable],function(key,value){
				$properties.closest("tr").after($('<tr>').append($('<td>',{text:key})).append($('<td>').append($('<input>',{type:'text',value:value}))));
			});
		}

		function updateVariableOptions() {
			//update the available variables 
			ainsVariables = {};
			var block = AinsBlockly.getSelectedBlock();
			var rootBlock = block.getRootBlock();
			if (block.getSurroundParent()) {
				rootBlock = block.getSurroundParent().getChildren()[0];
			}
			var currentBlock = rootBlock;
			var variable = '';
			while (currentBlock.id != block.id) {
				//If current block is not a do block or getFolder block
				if (currentBlock.getField('options') == null || currentBlock.getField('options').getText() != 'getFolder()') {
					currentBlock = currentBlock.getNextBlock();
				}
				console.log(currentBlock);
				var data = currentBlock.data;
				if (data == 'ainsDo') {
					alert('some block above is not initiated');
					break;
				} else {
					var oData = JSON.parse(data);
				}
				
				variable = oData['folderName'];
				
				ainsVariables[variable] = {'folderId' : oData['folderId'], 'type' :oData['type'], 'blockId': currentBlock.id};
				currentBlock = currentBlock.getNextBlock();
			}
			//update the options dropdown selector
			$selectVariables.empty();
			$.each(ainsVariables, function(key, value){
				$selectVariables.append($('<option>',{text:key}));
			});
			var variable = $selectVariables.val();
			updateProperties_(variable);
		}

		return {
			updateVariableOptions: updateVariableOptions,
		}
	})();








};