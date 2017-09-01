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

		var selectedBlock_ = null;


		return {
			workspace: workspace,
			getSelectedBlock : function(){return selectedBlock_},
			setSelectedBlock: function(block){selectedBlock_ = block},
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

		workspace.addChangeListener(clickingDoBlockHandler);
		function clickingDoBlockHandler(event){
			if (event.type == Blockly.Events.UI && event.element == 'click'){
				var blockId = event.blockId;
				var block = workspace.getBlockById(blockId);
				AinsBlockly.setSelectedBlock(block);
				if (block.type == 'ains_do'){
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
	
					$currentOption.html(value);
				}
			}
		};

		$optionBtn.on('click', $optionBtn, function(){
			var block = AinsBlockly.getSelectedBlock();
			var field = block.getField('options');
			var selectedOption = $optionsList.val();
			field.setValue(selectedOption);
			$currentOption.html(selectedOption);
			if (selectedOption == 'getFolder()'){
				getFolderHandler();
			};
		});

		function getFolderHandler(){
			$invokeBox.hide({duration:250,effect:'slide', direction:'right', complete:function(){
				$getFolderBox.show({duration:250, effect:'slide', direction:'right'});
			},});
			
		};

	})();







};