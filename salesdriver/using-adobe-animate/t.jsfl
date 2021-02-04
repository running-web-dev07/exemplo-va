var scriptName = fl.scriptURI.split('/').reverse()[0];
var scriptPath = fl.scriptURI.replace(scriptName,'');
fl.runScript( scriptPath + "lib/xJSFL/core/install/jsfl/install-on-first-use.jsfl");

function onEvent(event)
{
	clear();
	this.xml = this.content = '[HIDDEN]'; // remove for clarity
	Output.inspect(event, 'Event', {'function':false}, 2);
	if(event.control)
	{
		Output.inspect(event.control.value, 'Value');
	}
}


//"var maria = {};try{xjsfl.init(maria, [ 'URI', 'File', 'XML', 'String', 'XULControl', 'XULEvent', 'JSFLInterface','Table','PropertyResolver']);}catch(e){/*Output.inspect(e);*/}";


// XUL
//     .factory()
//     .setXML('<s id="ooo"><script id="z"> alert("b");      xjsfl.ui.handleEvent(0, "initialize");    </script></s>')
// 	.add('Text,color:Color,list:Options=[1,2,3],dropdown:Values=[a,b,c],button:Click Me!')
//     .addEvent('initialize', onEvent)
//     .addEvent('text color', 'change', onEvent)
//     .addEvent('options values', 'change onsetfocus', onEvent)
//     .addEvent('clickme', 'click', onEvent)
//     .addEvent('initialize',function(){alert('me')})
//     .show();

function onChange(event)
{
    event.xul.controls.word.visible = false;
    event.xul.controls.word.value = words[event.control.value - 1]; // see note about using "this"
}

var words = ['hello','there','squire'];
var xul = XUL
    .factory('dropdown:Options=[1,2,3],text:Word')
    .addEvent('options', 'change', onChange)
    .show();