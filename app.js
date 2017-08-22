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
			var xml = Blockly.Xml.workspaceToDom(workspace);
			var xml_text = Blockly.Xml.domToPrettyText(xml);
			AinsXML.xml = xml_text;
			AinsXML.$xmlDisplay.text(AinsXML.xml);

			console.log(xml_text);
		}

	});
	var AinsBlocks = {
		selectedBlock : null,
		$conditionBox : $('#conditionBox'),
		$previousCondition : $('#previousCondition'),
		// $previousComment : $('#previousComment'),
		// $addConditionBtn : $('#addConditionBtn'),
		// $newCondition : $('newCondition'),
		// $newComment : $('#newComment'),

	};
	// AinsBlocks.selectedBlock = null;
	// AinsBlocks.$conditionBox = $('#conditionBox');
	//AinsBlocks.$previousCondition = $('#previousCondition');
	var $previousComment = $('#previousComment');
	var $addConditionBtn = $('#addConditionBtn');
	var $newCondition = $('#newCondition');
	var $newComment = $('#newComment');


	$addConditionBtn.on('click',$addConditionBtn, function(){
		addConditionHandler(AinsBlocks.selectedBlock);
	});
	function addConditionHandler(block){
		var conditionField = block.getField('condition'); //For the condition field in the block
		var newCondition = $newCondition.val();
		conditionField.setText(newCondition);
		AinsBlocks.$previousCondition.html(newCondition);		

		var commentField = block.getField('comments'); //For the comment field in the block
		var newComment = $newComment.val();
		commentField.setText(newComment);
		$previousComment.html(newComment);
	};



	workspace.addChangeListener(onClickingBlocks);



	function onClickingBlocks(event) {
		

		if (event.type == Blockly.Events.UI && event.element == 'click') {
			//$('#conditionBox').toggle("slide",{direction:"right"}, 500);
			//Using jQuery to create a dialog
			var blockId = event.blockId;
			var block = workspace.getBlockById(blockId);
			AinsBlocks.selectedBlock = block;
			var inputList = block.inputList;

			if (block.type == 'ains_invoke') {
				//var textData = block.getField('')
				AinsBlocks.$conditionBox.hide("slide",{direction:"right"}, 500);
				var textData = inputList[0].fieldRow[1].text_;
				console.log(textData);
				//workspace.getBlockById(blockId).inputList[0].fieldRow[2].text_ = 'you clicked me, so text is changed';
			} else if (block.type == 'ains_if') {
				AinsBlocks.$conditionBox.show("slide",{direction:"right"}, 500);
				$newCondition.val('');
				$newComment.val('');

				var conditionField = block.getField('condition');
				var commentField = block.getField('comments');
				conditionField.maxDisplayLength = 8;
				commentField.maxDisplayLength = 8;

				var previousCondition = AinsBlocks.selectedBlock.getField('condition').getText();
				AinsBlocks.$previousCondition.html(previousCondition);

				var previousComment = AinsBlocks.selectedBlock.getField('comments').getText();
				$previousComment.html(previousComment);

				 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].text_ = textInput;
				 // workspace.getBlockById(blockId).inputList[0].fieldRow[1].textElement_.innerHTML = textInput;

			} else if (block.type == 'ains_while') {
				AinsBlocks.$conditionBox.show("slide",{direction:"right"}, 500);
				$newCondition.val('');
				$newComment.val('');

				var conditionField = block.getField('condition');
				var commentField = block.getField('comments');
				conditionField.maxDisplayLength = 8;
				commentField.maxDisplayLength = 8;

				var previousCondition = AinsBlocks.selectedBlock.getField('condition').getText();
				AinsBlocks.$previousCondition.html(previousCondition);

				var previousComment =  AinsBlocks.selectedBlock.getField('comments').getText();
				$previousComment.html(previousComment);
			}
		}
	}
			
}
