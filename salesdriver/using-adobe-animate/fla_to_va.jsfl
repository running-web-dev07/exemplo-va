function main($){
	fl.outputPanel.clear();
	var scriptName = fl.scriptURI.split('/').reverse()[0];// "fla_to_va.jsfl";
	var scriptPath = fl.scriptURI.replace(scriptName,'');
		var srcPath = scriptPath + 'src/';
		var outPath = scriptPath + 'out/';
			var assetsPath = outPath + 'assets/'
				var thumbsPathTemplate = assetsPath + '{asset_name}/thumbs/'
		var rscPath = scriptPath + 'rsc/';
	var profString = FLfile.read(rscPath+'SD-publish-profile.xml');
	var htmlTemplatePath = rscPath + 'SD-canvas-publish-template.html';

	//fl.trace(scriptPath + "/rsc/lib/xJSFL/core/install/jsfl/no-install.jsfl");
	if(!xjsfl)
	{
		fl.runScript( scriptPath + "lib/xJSFL/core/install/jsfl/install-on-first-use.jsfl");
		return;
	}
	else
	{
		xjsfl.init(this);
	}
	//



	function AssertProfile(name)
	{
		var dom = fl.getDocumentDOM();
		var profIndex = dom.publishProfiles.indexOf(name);
		if(profIndex == -1)
		{
			profIndex = dom.importPublishProfile(fl.scriptURI.replace(scriptName,"html-profile.apr"));
		}
		return dom.publishProfiles[profIndex];
	}

	function exportPlaceHolder(assetName)
	{
		fl.getDocumentDOM().getTimeline().currentFrame = 0;  
		fl.getDocumentDOM().exportPNG(
			AssertThumbsFolder(assetName) + 'placeholder.png',
			true,
			true
		);
	}

	function exportThumb(width, height, assetName)
	{
		var dom = fl.getDocumentDOM();
		var selection = dom.selectAll();
		
		var docWidth = dom.width;
		var docHeight = dom.height;
		
		dom.getTimeline().currentFrame = 
			fl.getDocumentDOM().getTimeline().frameCount;
		dom.selectAll();
		
		dom.clipCopy();
		fl.createDocument();
		var domTemp = fl.getDocumentDOM();
		domTemp.width = dom.width;
		domTemp.height = dom.height;
		

		domTemp.clipPaste(true);
		domTemp.setStroke('#FFFFFF00', 1, 'hairline')
		domTemp.addNewRectangle(
			{left:0,top:0,right:docWidth,bottom:docHeight},
			0,
			true,
			false
		);
		
		//return;
		domTemp.width = width;
		domTemp.height = height;
		domTemp.setAlignToDocument(true);
		var ratio = width/docWidth;

		domTemp.selectAll();
		domTemp.convertToSymbol('movie clip', '', 'top left');
		domTemp.selectAll();
		domTemp.scaleSelection(ratio, ratio, "center");
		domTemp.align("vertical center", true);
		domTemp.align("horizontal center", true);

		domTemp.exportPNG( 
			AssertThumbsFolder(assetName) + 'thumb.png',
			true,
			true
		);
		domTemp.close(false);
	}
	function AssertThumbsFolder(assetName){
		var folderURI = thumbsPathTemplate.replace('{asset_name}',assetName);
		FLfile.createFolder(folderURI);
		return folderURI;
		
	}


	function exportToSalesDriverVA()
	{

		//fl.getDocumentDOM().xmlPanel( "file:///D:/GitHub/exemplo-va/salesdriver/using-adobe-animate/rsc/JSFL-AS.xml" );
		//fl.createDocument("htmlcanvas");
		var xul;
		try{
			//fl.getDocumentDOM().xmlPanel( rscPath + "dg-example.xml" );
			//fl.getDocumentDOM().xmlPanel( rscPath + "settings-ui.xml" );

			//  xul = XUL.factory( rscPath + "settings-ui.xml")
			// .saveAs('rsc/s.xul')
			// .show(
			// 	function(mm,aa,cc,dd,ee){
			// 		trace(mm);
			// 		trace(aa);
			// 		trace(this.controls);
			// 		for(var a in this.controls){
			// 			//trace(a);	
			// 			trace(this.controls[a].value);	
			// 		}		
			// 	}						
			//  );

			
			function browseForFolderURL(event)
			{
				//event["control"].value = fl.browseForFolderURL("Selecione uma pasta");
				//this.setValues('srcDir',);
				event.xul.controls.srcDir.value = fl.browseForFolderURL("Selecione uma pasta");
				
				//fl.browseForFolderURL("Selecione uma pasta");
			}
			xul = $.XUL.factory()
			//.setXML('<flash id="flash" width="520" height="60" src="logo.swf"  /><spacer/><separator/>')
			//.addFile('Fontes (.fla):','srcDir',{type:'open'})
			.addTextbox('Fontes (.fla):','srcDir')
			.addButton('Selecionar diretório','srcDirButton')
			.addFile('Diretório de resultado (VA):','outDir')
			.addEvent('srcDirButton','click',browseForFolderURL)
			.saveAs('rsc/s.xul')
			.show();
			//load("rsc/settings-ui.xml");
			
			
		}
		catch(e)
		{
			alert('não deu');
			trace(e);
			return;
		}finally {
			//fl.getDocumentDOM().close(false);	
			$.Output.inspect(xul.values);
		}
		
		return;
		
		var avoidRegex = /(RECOVER_|RECUPERAR_)/i;
		var files = FLfile.listFolder(srcPath + "*.fla", "Files.").filter(function(f){
			return !avoidRegex.test(f);
		});
		var total = files.length;
		
		var flaNameReplaceRegex = /\{FLA_NAME\}/igm;
		
		//fl.trace(files);
		//return;
		try
		{ 
			for (var i = 0;i < total; i++)
			{
				var assetName = files[i].replace(/\.fla/igm,'');
				fl.openDocument(srcPath  + files[i]);
				FLfile.createFolder(assetsPath+assetName)
				var idx = fl.getDocumentDOM().importPublishProfileString(profString.replace(flaNameReplaceRegex, assetName));
				fl.getDocumentDOM().currentPublishProfile = fl.getDocumentDOM().publishProfiles[idx];
				fl.getDocumentDOM().importCanvasPublishTemplate(htmlTemplatePath);
				

				fl.getDocumentDOM().publish();
				fl.getDocumentDOM().deletePublishProfile();
				exportThumb(120,90,assetName);
				exportPlaceHolder(assetName);
				fl.getDocumentDOM().close(false);
			}
		}
		catch(error)
		{
			fl.trace(files[i]);
			fl.trace(error);
			fl.trace("___________");
		}
	}


	exportToSalesDriverVA();
};
main(this);