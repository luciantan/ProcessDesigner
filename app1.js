window.onload = function(){
	//$.fn.modal.Constructor.prototype.enforceFocus = function() {};
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

	var processConfiguration = (function(){
		var $processConfiguration = $('#processConfiguration');
		var $processNameConfigure = $('#processNameConfigure');
		var $dataType = $('#dataType');

		var $inputTableSeed = $('#inputTableSeed');
		var $inputTableBody = $('#inputTableBody');
		var inputTableSeed = $inputTableSeed.parent().html();

		var $outputTableSeed = $('#outputTableSeed');
		var $outputTableBody = $('#outputTableBody');
		var outputTableSeed = $outputTableSeed.parent().html();

		var $processName = $('#processName');

		var $openConfigurationBtn = $('#openConfigurationBtn');
		var configuration = {};
		configuration.input = {};
		configuration.output = {};
		
		$processConfiguration.on('click','#addInputBtn', addInputVariableHandler);

		function addInputVariableHandler(){
			
			$inputTableBody.append($(inputTableSeed));
			
		};

		$processConfiguration.on('click','.deleteInputBtn', deleteInputVariableHandler);

		function deleteInputVariableHandler(event){
			var $tr = $(event.target).closest('tr');
			//update configuration.input
			//var deletedVal = $tr.find('input').val();
			//delete configuration.input[deletedVal];
			//setMethod.updateAvailableVariablesList();
			//update the UI
			if ($tr.siblings().length !== 0) {
				$tr.remove();
			} else {
				$inputTableBody.append($(inputTableSeed));
				$tr.remove();
			}
		};

		$processConfiguration.on('click','#addOutputBtn', addOutputVariableHandler);

		function addOutputVariableHandler(){
			$outputTableBody.append($(outputTableSeed));
		};

		$processConfiguration.on('click','.deleteOutputBtn', deleteOutputVariableHandler);

		function deleteOutputVariableHandler(event){
			var $tr = $(event.target).closest('tr');
			//update configuration.input
			//var deletedVal = $tr.find('input').val();
			//delete configuration.input[deletedVal];
			//setMethod.updateAvailableVariablesList();
			//update the UI
			if ($tr.siblings().length !== 0) {
				$tr.remove();
			} else {
				$outputTableBody.append($(outputTableSeed));
				$tr.remove();
			}
		};

		$processConfiguration.dialog({
			height:"auto",
			width: 800,
			modal: true,
			buttons:{
				"Complete Configuration": completeConfigurationHandler,
			}
		});

		function completeConfigurationHandler(){
			//Update the configurations and put the processName on the main page
			configuration.processName = $processNameConfigure.val();
			configuration.input = {};
			$inputTableBody.find("tr").each(function(rowIndex, c){
				var variableName = $(this).find('input').val();
				var dataType = $(this).find('select').val();
				configuration.input[variableName] = dataType;
			});
			configuration.output = {};
			$outputTableBody.find("tr").each(function(rowIndex, c){
				var variableName = $(this).find('input').val();
				var dataType = $(this).find('select').val();
				configuration.output[variableName] = dataType;
			});
			//Update the process name on the top
			$('#processName').html(configuration.processName);
			//update the input variables for the setMethod based on the configuration{} object.
			setMethod.updateAvailableVariablesList();
			$(this).dialog('close');
		};

		$openConfigurationBtn.on("click", function(){
			$processConfiguration.dialog("open");
		});

		return {
			configuration: configuration,
		}

	}());

	var AinsXml = (function(){
		var xml = null;
		var $xmlBox = $('#xmlBox');
		var $openXmlBoxBtn = $('#openXmlBoxBtn');
		var $xmlDisplay = $('#xmlDisplay');
		var $closeXmlBox = $('#closeXmlBox');
		var workspace = AinsBlockly.workspace;

		// workspace.addChangeListener(function(event){
		// 	if(event.type == Blockly.Events.MOVE){
		// 		updateXml();
		// 	}
		// });

		$openXmlBoxBtn.on('click',$openXmlBoxBtn,displayXmlHandler);

		function displayXmlHandler(){
			//$xmlBox.show();
			$xmlBox.dialog();
			updateXml();
		}

		$closeXmlBox.on('click',$closeXmlBox,closeXmlHandler);

		function closeXmlHandler(){
			$xmlBox.dialog('close');
		}


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
		var $setBox = $('#setBox');
		var $sendEmailBox = $('#sendEmailBox');

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
			} else if (selectedOption == 'set') {
				openSetBox();
			} else if (selectedOption == 'send email') {
				openSendEmailBox();
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

		function openSetBox(){
			setMethod.updateAvailableVariablesList();
			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$setBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		};

		function openSendEmailBox(){
			sendEmail.prepareTypeaheadOptions();
			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$sendEmailBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		}

		function getBackToInvokePanel($context){
			$context.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$invokeBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		}

		return {
			getBackToInvokePanel:getBackToInvokePanel,
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
			// $getFolderBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
			// 	$invokeBox.show({duration:250, effect:'slide', direction:'right'});
			// },});
			InvokeOptions.getBackToInvokePanel($getFolderBox);
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
		var ainsVariables = processConfiguration.configuration;

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
			// $setValueBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
			// 	$invokeBox.show({duration:250, effect:'slide', direction:'right'});
			// },});
			InvokeOptions.getBackToInvokePanel($setValueBox);
		
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

	var setMethod = (function(){
		var workspace = AinsBlockly.workspace;
		var $setBox = $('#setBox');
		var availableVars = {};
		var variables = {};

		var $addVarBtn = $('#addVarBtn');
		var $setTableBody = $('#setTableBody');
		var $setTableSeed = $('#setTableSeed');
		var setTableSeed = $setTableSeed.parent().html();

		var $submitVarsBtn = $('#submitVarsBtn');
		var $cancelSubmitVarsBtn = $('#cancelSubmitVarsBtn');

		var $availableVarsList = $('#availableVarsList');

		var $confirmVarBtn = $('#confirmVarBtn');



		$addVarBtn.on('click', $addVarBtn, addVarBtnHandler);
		//1. add another variable in table
		//2. update the availableVars{}
		//3. update the available variables list
		function addVarBtnHandler(){
			
			//_updateAvailableVarsList();
			_updateAvailableVarsList();
			$setTableBody.append($(setTableSeed));
		};

		function _updateAvailableVarsList(){
			var $tr = $setTableBody.find("tr");
			//empty the variables object and refill it with the current variables list
			variables = {};
			readConfiguration();

			$tr.each(function(){
				var variable = $(this).find("input.variable").val();
				var value = $(this).find("input.value").val();

				variables[variable] = value;
				availableVars[variable] = value;
			});

			addVariableListToAvailableVarsList();

		}

		// function _updateAvailableVarsList(){

		// 	var latestNewVariable = $setTableBody.find("tr:nth-last-child(1)").find('input.variable').val();
		// 	var latestNewValue = $setTableBody.find("tr:nth-last-child(1)").find('input.value').val();
		// 	availableVars[latestNewVariable] = latestNewValue;
		// 	$availableVarsList.append($('<tr>').append($('<td>').html(latestNewVariable)).append($('<td>').html("need check MH")).append($('<td>').html(latestNewValue)));
		// 	variables[latestNewVariable] = latestNewValue;
		
		// }


		$setBox.on('click','.deleteInputBtn', deleteInputVariableHandler);

		function deleteInputVariableHandler(event){

			var $tr = $(event.target).closest('tr');

			var deletedVar = $tr.find("input.variable").val();
			delete availableVars[deletedVar];
			delete variables[deletedVar];

			updateAvailableVariablesList();

			if ($tr.siblings().length !== 0) {
				// console.log($tr.html());
				$tr.remove();
			} else {

				$setTableBody.append($(setTableSeed));
				$tr.remove();

			}
		};

		$confirmVarBtn.on('click', $confirmVarBtn, confirmVarsBtnHandler);
		function confirmVarsBtnHandler(){
			_updateAvailableVarsList();
		};
		
		function readConfiguration(){
			$availableVarsList.empty();
			var configuration = processConfiguration.configuration;
			var inputs = configuration.input;
			
			//1. put input variables from the configuration to the available variables list
			//2. update the availableVars{}
			for (var key in inputs) {
				if (inputs.hasOwnProperty(key)) {
					availableVars[key] = inputs[key];
					$availableVarsList.append($('<tr>').append($('<td>').html(key)).append($('<td>').html(inputs[key])).append($('<td>').html('from input')));
				}
			}

			console.log(availableVars); 
		};

		//update the availableVarsList to configuration.input
		function _collectInputVars(){
			//$availableVarsList.empty();
			var configuration = processConfiguration.configuration;
			var inputs = configuration.input;

			//1. put input variables from the configuration to the available variables list
			//2. update the availableVars{}
			for (var key in inputs) {
				if (inputs.hasOwnProperty(key)) {
					availableVars[key] = inputs[key];
					$availableVarsList.append($('<tr>').append($('<td>').html(key)).append($('<td>').html(inputs[key])).append($('<td>').html('from input')));
				}
			}

		};

		function _collectVariableList(){

			//update availableVars list
			for (var key in variables) {
				availableVars[key] = variables[key];
				$availableVarsList.append($('<tr>').append($('<td>').html(key)).append($('<td>').html("discuss with MH")).append($('<td>').html(variables[key])));
			}
		}

		function updateAvailableVariablesList(){
			$availableVarsList.empty();
			_collectInputVars();
			_collectVariableList();
		}

		function addVariableListToAvailableVarsList() {
			readConfiguration();
			for (var key in variables) {
				availableVars[key] = variables[key];
				$availableVarsList.append($('<tr>').append($('<td>').html(key)).append($('<td>').html("discuss with MH")).append($('<td>').html(variables[key])));
			}
		}

		$submitVarsBtn.on('click', $submitVarsBtn, submitVarsBtnHandler);
		function submitVarsBtnHandler(){
			_updateAvailableVarsList();
			var data = JSON.stringify(variables);
			console.log("data:" + data);
			//update the data in the block:
			//1. get the current block
			var block = AinsBlockly.getSelectedBlock();
			//2. set the data inside of the block
			block.data = data;

			console.log("availableVars:" + JSON.stringify(getAvailableVars()));
			//close the current panel and return to the "invoke" right panel
			InvokeOptions.getBackToInvokePanel($setBox);

		};

		$cancelSubmitVarsBtn.on('click', $cancelSubmitVarsBtn, cancelSubmitVarsBtnHandler);
		function cancelSubmitVarsBtnHandler(){
			alert("cancel, is it necessary? should this be replaced with 'clear'?");
		};

		function getAvailableVars(){
			return availableVars;
		}

		return {
			updateAvailableVariablesList:updateAvailableVariablesList,
			getAvailableVars:getAvailableVars,
		}

	})();

	var sendEmail = (function(){
		var $sendEmailBox = $("#sendEmailBox");
		//$sendEmailBox.hide();
		var $sendEmailTarget = $("#sendEmailTarget");
		var $sendEmailSender = $("#sendEmailSender");
		var $sendEmailAttachment = $("#sendEmailAttachment");

		var $sendEmailCc = $("#sendEmailCc");
		var $sendEmailContent = $("#sendEmailContent");

		var $sendEmailBtn = $("#sendEmailBtn");

		var availableVars = {};

		// var sendEmailTargetList = {};
		// sendEmailTargetList["results"] = [];

		
		//var $dropDownParent = $("#dropDownParent");

		

		// $sendEmailCc.select2({
		// 	placeholder: 'Cc to:',
		// 	width : '100%',
		// });

		// // $sendEmailReceiver.select2({
		// // 	placeholder: 'Receiver Name'
		// // });

		// $sendEmailSender.select2({
		// 	placeholder: 'Sender Name',
		// 	width : '100%',
		// });	

		// $sendEmailAttachment.select2({
		// 	placeholder: 'Attachment:',
		// 	width : '100%',
		// });

		$sendEmailBtn.on('click', $sendEmailBtn, sendEmailBtnHandler);

		function sendEmailBtnHandler(){

			//addDataToBlock();

			addXMLDataToBlock();

			InvokeOptions.getBackToInvokePanel($sendEmailBox);

		};

		function prepareTypeaheadOptions(){

			_putAvailableVarsToOptions();

			// //separating these four functions because I may add further constrains to each one. 
			// _prepareSendEmailTarget();
			// _prepareSendEmainCc();
			// _prepareSendEmainSender();
			// _prepareSendEmainAttachment();

			_transferSelectToSelect2();
		}

		var $optionsSeed = $("<select>", {class:"form-control", multiple:"multiple"});

		function _putAvailableVarsToOptions() {
			$optionsSeed.empty();
			availableVars = setMethod.getAvailableVars();
			var index = 1;
			$.each(availableVars, function(variableName, typeOrValue) {
				var option = new Option(variableName, index);
				$optionsSeed.append(option);
				index++;
			});
		}

		function _transferSelectToSelect2() {

			$sendEmailTarget.empty().append($("<label/>").text("To:")).append($optionsSeed.clone());
			$sendEmailCc.empty().append($("<label/>").text("Cc:")).append($optionsSeed.clone());
			$sendEmailSender.empty().append($("<label/>").text("From:")).append($optionsSeed.clone());
			$sendEmailAttachment.empty().append($("<label/>").text("Attachment:")).append($optionsSeed.clone());

			var waitingList = [$sendEmailTarget, $sendEmailCc, $sendEmailSender, $sendEmailAttachment];
			$.each(waitingList, function(index, value){
				value.find('select').select2({
					placeholder : value.find("label").html(),
					width : '100%',
				});
			});
		}

		// function _prepareSendEmailTarget(){
		// 	// availableVars = setMethod.getAvailableVars();
		// 	// $sendEmailTarget.empty();
		// 	// var index = 1;
		// 	// $.each(availableVars, function(variableName, typeOrValue) {
		// 	// 	var option = new Option(variableName, index);
		// 	// 	$sendEmailTarget.append(option);
		// 	// 	index++;
		// 	// });

		// 	$sendEmailTarget.append($optionsSeed.clone());
		// 	// $sendEmailTarget.find('select').select2({
		// 	// 	placeholder : 'Send email to:',
		// 	// 	width : '100%',
		// 	// });
		// }

		// function _prepareSendEmainCc(){
		// 	// availableVars = setMethod.getAvailableVars();
		// 	// $sendEmailCc.empty();
		// 	// var index = 1;
		// 	// $.each(availableVars, function(variableName, typeOrValue) {
		// 	// 	var option = new Option(variableName, index);
		// 	// 	$sendEmailCc.append(option);
		// 	// 	index++;
		// 	// });

		// 	$sendEmailCc.append($optionsSeed.clone());
		// 	// $sendEmailCc.find('select').select2({
		// 	// 	placeholder : 'Send email to:',
		// 	// 	width : '100%',
		// 	// });
		// }

		// function _prepareSendEmainSender(){
		// 	// availableVars = setMethod.getAvailableVars();
		// 	// $sendEmailSender.empty();
		// 	// var index = 1;
		// 	// $.each(availableVars, function(variableName, typeOrValue) {
		// 	// 	var option = new Option(variableName, index);
		// 	// 	$sendEmailSender.append(option);
		// 	// 	index++;
		// 	// });

		// 	$sendEmailSender.append($optionsSeed.clone());
		// 	// $sendEmailSender.find('select').select2({
		// 	// 	placeholder : 'Send email to:',
		// 	// 	width : '100%',
		// 	// });

		// }

		// function _prepareSendEmainAttachment(){
		// 	// availableVars = setMethod.getAvailableVars();
		// 	// $sendEmailAttachment.empty();
		// 	// var index = 1;
		// 	// $.each(availableVars, function(variableName, typeOrValue) {
		// 	// 	var option = new Option(variableName, index);
		// 	// 	$sendEmailAttachment.append(option);
		// 	// 	index++;
		// 	// });

		// 	$sendEmailAttachment.append($optionsSeed.clone());
		// 	// $sendEmailAttachment.find('select').select2({
		// 	// 	placeholder : 'Send email to:',
		// 	// 	width : '100%',
		// 	// });
		// }

		var $sendEmailTestBtn = $("#sendEmailTestBtn");
		$sendEmailTestBtn.on('click', $sendEmailTestBtn, function(){
			//addDataToBlock();
			addXMLDataToBlock();
		});

		function addDataToBlock() {
			var data = {};
			data.from = "";
			data.to = "";
			data.cc = "";
			data.message = "";
			data.attachment = "";
			// var selectedInTarget = $sendEmailTarget.select2('data');
			var selectedInFrom = $sendEmailSender.find('select').select2('data');
			for (let i = 0; i < selectedInFrom.length; i++) {
				data.from += selectedInFrom[i].text;
				data.from += ",";
			}

			var selectedInTo = $sendEmailTarget.find('select').select2('data');
			for (let i = 0; i < selectedInTo.length; i++) {
				data.to += selectedInTo[i].text;
				data.to += ",";
			}

			var selectedInCc = $sendEmailCc.find('select').select2('data');
			for (let i = 0; i < selectedInCc.length; i++) {
				data.cc += selectedInCc[i].text;
				data.cc += ",";
			}

			var userTypedMessage = $sendEmailContent.val();
			data.message = userTypedMessage;

			var selectedInAttachment = $sendEmailAttachment.find('select').select2('data');
			for (let i = 0; i < selectedInAttachment.length; i++) {
				data.attachment += selectedInAttachment[i].text;
				data.attachment += ",";
			}


			var sData = JSON.stringify(data);
			var block = AinsBlockly.getSelectedBlock();
			block.data = sData;
			
		}

		$getXmlFromBlockBtn = $("#getXmlFromBlockBtn");
		$getXmlFromBlockBtn.on('click', $getXmlFromBlockBtn, getXmlFromBlockHandler);

		function getXmlFromBlockHandler(){
			// var block = AinsBlockly.getSelectedBlock();
			// var text = block.data;
			// console.log(text);
			var workspace = AinsBlockly.workspace;
			var xmlDom = Blockly.Xml.workspaceToDom(workspace);
			var xmlText = Blockly.Xml.domToText(xmlDom);
			var xmlPrettyText = Blockly.Xml.domToPrettyText(xmlDom);
			xml = xmlPrettyText;

			console.log(xmlText);

			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlText, "text/xml");
			console.log(xmlDoc);
			var data = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
			var dataDoc = parser.parseFromString(data, "text/xml");
			console.log(dataDoc);

		}

		function addXMLDataToBlock(){
		
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString("<EmailConfiguration></EmailConfiguration>", "text/xml");
			var from = xmlDoc.createElement("from");
			var to = xmlDoc.createElement("to");
			var cc = xmlDoc.createElement("cc");
			var message = xmlDoc.createElement("message");
			var attachment = xmlDoc.createElement("attachment");

			var elements = xmlDoc.getElementsByTagName("EmailConfiguration");
			elements[0].appendChild(from);
			elements[0].appendChild(to);
			elements[0].appendChild(cc);
			elements[0].appendChild(message);
			elements[0].appendChild(attachment);

			//var fromText = '', toText = '', ccText = '', messageText = '', attachentText = '';

			var selectedInFrom = $sendEmailSender.find('select').select2('data');
			for (let i = 0; i < selectedInFrom.length; i++) {
				let newNode = xmlDoc.createElement(selectedInFrom[i].text)
				let newText = xmlDoc.createTextNode(selectedInFrom[i].text);
				xmlDoc.getElementsByTagName("from")[0].appendChild(newNode);
				xmlDoc.getElementsByTagName("from")[0].getElementsByTagName(selectedInFrom[i].text)[0].appendChild(newText);
			}

			var selectedInTo = $sendEmailTarget.find('select').select2('data');
			for (let i = 0; i < selectedInTo.length; i++) {
				let newNode = xmlDoc.createElement(selectedInTo[i].text)
				let newText = xmlDoc.createTextNode(selectedInTo[i].text);
				xmlDoc.getElementsByTagName("to")[0].appendChild(newNode);
				//
				xmlDoc.getElementsByTagName("to")[0].getElementsByTagName(selectedInTo[i].text)[0].appendChild(newText);
			}

			var selectedInCc = $sendEmailCc.find('select').select2('data');
			for (let i = 0; i < selectedInCc.length; i++) {
				let newNode = xmlDoc.createElement(selectedInCc[i].text)
				let newText = xmlDoc.createTextNode(selectedInCc[i].text);
				xmlDoc.getElementsByTagName("cc")[0].appendChild(newNode);
				xmlDoc.getElementsByTagName("cc")[0].getElementsByTagName(selectedInCc[i].text)[0].appendChild(newText);
			}

			var userTypedMessage = $sendEmailContent.val();
			var newText = xmlDoc.createTextNode(userTypedMessage);
			xmlDoc.getElementsByTagName("message")[0].appendChild(newText);

			var selectedInAttachment = $sendEmailAttachment.find('select').select2('data');
			for (let i = 0; i < selectedInAttachment.length; i++) {
				let newNode = xmlDoc.createElement(selectedInAttachment[i].text)
				let newText = xmlDoc.createTextNode(selectedInAttachment[i].text);
				xmlDoc.getElementsByTagName("attachment")[0].appendChild(newNode);
				xmlDoc.getElementsByTagName("attachment")[0].getElementsByTagName(selectedInAttachment[i].text)[0].appendChild(newText);
			}

			//Transform the xmlDoc to string
			var serializer = new XMLSerializer();
			var xmlString = serializer.serializeToString(xmlDoc);

			//save xml string to block
			var block = AinsBlockly.getSelectedBlock();
			block.data = xmlString;

		}


		return {
			prepareTypeaheadOptions : prepareTypeaheadOptions,
		}

		//Commenting a way to produce the required data for Select2 by program
		// function _prepareTypeaheadList() {
		// 	_addAvailableVarsToTypeaheadList();
		// 	_addConfigurationToTypeaheadList();
		// }

		// function _addAvailableVarsToTypeaheadList() {
		// 	availableVars = setMethod.getAvailableVars();
		// 	sendEmailTangetList = {};
		// 	sendEmailTangetList["results"] = [];
		// 	var index = 1;
		// 	$.each(availableVars, function(variableName, typeOrValue) {
		// 		sendEmailTangetList.results.push({"id": index, "text" : variableName});
		// 		index++;
		// 	});
		// }
		// function _addConfigurationToTypeaheadList() {
		// 	sendEmailTangetList["pagination"] = {"more" : true};
		// }

	})();

};