if (!window.extTranslatorBySailorMax && (window.location.href.indexOf("widget://") != 0))	// don't need load in widgets/extensions/unite-applications
{
	new function()
	{
		var scriptCfg = window.extTranslatorBySailorMax = {};

		// setup userJS_UUID
			var S4 = function() { return (((1+Math.random())*0x10000)|0).toString(16).substring(1) };
			scriptCfg.userJS_UUID = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());

		// save last active input and selection
			scriptCfg.lastActiveInput = null;
			scriptCfg.currentSelection = "";
			var lastActiveInputHandler = function(evt)
			{
				var lastActiveInput = evt.srcElement;
				var selection = window.getSelection().toString();
				if (!selection.length && lastActiveInput && lastActiveInput.value && (lastActiveInput.selectionStart || lastActiveInput.selectionEnd))
					selection = lastActiveInput.value.substring(lastActiveInput.selectionStart, lastActiveInput.selectionEnd);

				if (((scriptCfg.currentSelection == "") || (selection == "")) && (scriptCfg.currentSelection != selection))
					opera.extension.postMessage({action:"selection_changed", selection:selection, uuid:scriptCfg.userJS_UUID}); 

				scriptCfg.lastActiveInput = lastActiveInput;
				scriptCfg.currentSelection = selection;
			}
			window.addEventListener('keyup', lastActiveInputHandler, false);
			window.addEventListener('mouseup', lastActiveInputHandler, false);

		// setup_active_tab
			// TODO: detect is this page is in focus. On slow connection page can start load after user leave it => active_page.userJS_UUID != last sended "setup_active_tab".userJS_UUID
			opera.extension.postMessage({action:"setup_active_tab", selection:scriptCfg.currentSelection, uuid:scriptCfg.userJS_UUID});
			window.addEventListener('focus', function(){
				opera.extension.postMessage({action:"setup_active_tab", selection:scriptCfg.currentSelection, uuid:scriptCfg.userJS_UUID});
			}, false);

		// setup messages listener
			opera.extension.onmessage = function(request)
			{
				if ((request.data.action == "get_active_page_data") && (scriptCfg.userJS_UUID == request.data.uuid))
				{
					var pageInfo = {
						action:		"set_active_page_data",
						url:		document.location.href,
						title:		document.title,
						selection:	scriptCfg.currentSelection,
						uuid:		scriptCfg.userJS_UUID
					};

					opera.extension.postMessage(pageInfo);
				}
			}
	}();
}
