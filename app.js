window.onload = function() {



	createAinsBlocks();

	var blocklyArea = document.getElementById('blocklyArea');
	var blocklyDiv = document.getElementById('blocklyDiv');

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
			    //scrollbars:true,
			    //toolboxPosition:"start",
			});
	var onresize = function(e){
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
	window.addEventListener('resize', onresize, false);
	onresize();
	Blockly.svgResize(workspace);

	AinsXML = {};
	AinsXML.xml = null;
	AinsXML.$xmlDisplay = $('#xmlDisplay');
	

	workspace.addChangeListener(function(event){
		if (event.type == Blockly.Events.MOVE) {
			var xmlDom = Blockly.Xml.workspaceToDom(workspace);
			var xmlText = Blockly.Xml.domToText(xmlDom);
			var xmlPrettyText = Blockly.Xml.domToPrettyText(xmlDom);

			//var removeNext = Blockly.Xml.deleteNext(xmlText);
			//console.log(removeNext);
			AinsXML.xml = xmlPrettyText;
			AinsXML.$xmlDisplay.text(AinsXML.xml);
			console.log(xmlDom);
			console.log(xmlPrettyText);
		}

	});


	var AinsBlocks = {
		selectedBlock : null,
		//$conditionBox : $('#conditionBox'),
		//$previousCondition : $('#previousCondition'),
		// $previousComment : $('#previousComment'),
		// $addConditionBtn : $('#addConditionBtn'),
		// $newCondition : $('newCondition'),
		// $newComment : $('#newComment'),
	};
	var AinsVariables = {

	};


	//AinsBlocks.selectedBlock = null;
	var $invokeBox = $('#invokeBox');
	var $currentOption = $('#currentOption');
	var $optionsList = $('#options');
	var $optionBtn = $('#changeOptionBtn');

	var $getFolderBox = $('#getFolderBox');
	var $folderId = $('#folderId');
	var $variable = $('#variableName');
	var $getFolderBtn = $('#getFolderBtn');

	var $setValueBox = $('#setValueBox');
	var $selectVariables = $('#selectVariables');
	var $setValueBtn = $('#setValueBtn');
	var $properties = $('#properties');

	var $conditionBox = $('#conditionBox');
	var $previousCondition = $('#previousCondition');
	var $previousComment = $('#previousComment');
	var $addConditionBtn = $('#addConditionBtn');
	var $newCondition = $('#newCondition');
	var $newComment = $('#newComment');

	$optionBtn.on('click', $optionBtn, function(){
		var block = AinsBlocks.selectedBlock;
		var field = block.getField('options');
		var selectedOption = $optionsList.val();
		field.setValue(selectedOption);
		if (selectedOption == 'getFolder()') {
			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$getFolderBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		} else if (selectedOption == 'setValue()') {
			//update the variables dropdown selector
			$selectVariables.empty();
			$.each(AinsVariables, function(key, value){
				$selectVariables.append($('<option>',{text:key}));
			});
			var variable = $selectVariables.val();
			updateProperties_(variable);
			// $properties.closest("tr").next().remove();
			// $properties.closest("tr").next().remove();
			// $.each(AinsVariables[variable],function(key,value){
			// 	$properties.closest("tr").after($('<tr>').append($('<td>',{text:key})).append($('<td>').append($('<input>',{type:'text',value:value}))));
			// });

			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$setValueBox.show({duration:250, effect:'slide', direction:'right'});
			},});
		}
	});
	function updateProperties_(variable){
		$properties.closest("tr").next().remove();
		$properties.closest("tr").next().remove();
		$.each(AinsVariables[variable],function(key,value){
			$properties.closest("tr").after($('<tr>').append($('<td>',{text:key})).append($('<td>').append($('<input>',{type:'text',value:value}))));
		});
	};

	$getFolderBtn.on('click', $getFolderBtn,function(){
		var folderId = $folderId.val();
		var variable = $variable.val();
		AinsVariables[variable] = {'folderId':folderId,'type':'folder'};

		console.log(AinsVariables);
		$getFolderBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
			$invokeBox.show({duration:250, effect:'slide', direction:'right'});
		},});
	});

	$setValueBtn.on('click', $setValueBtn, function(){

		$setValueBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
			$invokeBox.show({duration:250, effect:'slide', direction:'right'});
		},});
	});

	$selectVariables.on('change', $selectVariables, function(){
		var variable = $selectVariables.val();
		updateProperties_(variable);
	});

	$addConditionBtn.on('click',$addConditionBtn, function(){
		addConditionHandler(AinsBlocks.selectedBlock);
	});
	function addConditionHandler(block){
		var conditionField = block.getField('condition'); //For the condition field in the block
		var newCondition = $newCondition.val();
		conditionField.setText(newCondition);
		$previousCondition.html(newCondition);		

		var commentField = block.getField('comments'); //For the comment field in the block
		var newComment = $newComment.val();
		commentField.setText('//'+newComment);

		//commentField.getSvgRoot().setAttribute('style','fill: #3fdc54;');

		$previousComment.html(newComment);
		block.data = newComment;

		var xml = Blockly.Xml.workspaceToDom(workspace);
		var xml_text = Blockly.Xml.domToPrettyText(xml);
		AinsXML.xml = xml_text;
		AinsXML.$xmlDisplay.text(AinsXML.xml);
	};



	workspace.addChangeListener(onClickingBlocks);
	workspace.addChangeListener(onChangingOptions);


	function onChangingOptions(event){
		if (event.type == Blockly.Events.CHANGE && event.name == 'options') {
			var blockId = event.blockId;
			var block = workspace.getBlockById(blockId);
			AinsBlocks.selectedBlock = block;
			var field = block.getField('options');
			var value = field.getText();

			$currentOption.html(value);
		}
	};
	function onClickingBlocks(event) {
		

		if (event.type == Blockly.Events.UI && event.element == 'click') {
			//$('#conditionBox').toggle("slide",{direction:"right"}, 500);
			//Using jQuery to create a dialog
			var blockId = event.blockId;
			var block = workspace.getBlockById(blockId);
			AinsBlocks.selectedBlock = block;
			var inputList = block.inputList;

			if (block.type == 'ains_invoke') {
				$conditionBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
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
				console.log($optionsList.html());
				console.log(options);

				//var textData = inputList[0].fieldRow[1].text_;
				$currentOption.html(value);
				//console.log(field.getOptions());
				
				//workspace.getBlockById(blockId).inputList[0].fieldRow[2].text_ = 'you clicked me, so text is changed';
			} else if (block.type == 'ains_if') {
				$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
					$conditionBox.show({duration:250, effect:'slide', direction:'right'});
				},});
				$newCondition.val('');
				$newComment.val('');

				var conditionField = block.getField('condition');
				var commentField = block.getField('comments');
				conditionField.maxDisplayLength = 8;
				commentField.maxDisplayLength = 20;

				var previousCondition = AinsBlocks.selectedBlock.getField('condition').getText();
				$previousCondition.html(previousCondition);

				var previousComment = AinsBlocks.selectedBlock.getField('comments').getText().slice(2);
				$previousComment.html(previousComment);

				
				 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].text_ = textInput;
				 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].textElement_.innerHTML = textInput;

			} else if (block.type == 'ains_while') {
				$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
					$conditionBox.show({duration:250, effect:'slide', direction:'right'});
				},});
				$newCondition.val('');
				$newComment.val('');

				var conditionField = block.getField('condition');
				var commentField = block.getField('comments');
				conditionField.maxDisplayLength = 8;
				commentField.maxDisplayLength = 20;

				var previousCondition = AinsBlocks.selectedBlock.getField('condition').getText();
				$previousCondition.html(previousCondition);

				var previousComment =  AinsBlocks.selectedBlock.getField('comments').getText().slice(2);
				$previousComment.html(previousComment);
			}

		}
	}
			
}
