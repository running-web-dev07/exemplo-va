﻿fl.outputPanel.clear();
var scriptName = fl.scriptURI.split('/').reverse()[0];// "fla_to_va.jsfl";
var scriptPath = fl.scriptURI.replace(scriptName,'');
	var srcPath = scriptPath + 'src/';
	var outPath = scriptPath + 'out/';
		var assetsPath = outPath + 'assets/'

var profString = '<profile version="1.0" name="SalesDriver" current="true">\
  <PublishFormatProperties enabled="true">\
    <defaultNames>0</defaultNames>\
    <jpeg>0</jpeg>\
    <oam>0</oam>\
    <jpegDefaultName>0</jpegDefaultName>\
    <oamDefaultName>1</oamDefaultName>\
    <jpegFileName>../out/assets/{FLA_NAME}/placeholder.jpg</jpegFileName>\
    <oamFileName>{FLA_NAME}.oam</oamFileName>\
    <publishFormat id="BBC1F406-65F2-4219-9304-FA48C7549E44">0</publishFormat>\
    <publishFormat id="C6B9CB0C-C6DC-4FBC-9805-93E9EB37A444">1</publishFormat>\
  </PublishFormatProperties>\
  <PublishJpegProperties enabled="true">\
    <Width>1024</Width>\
    <Height>768</Height>\
    <Progressive>1</Progressive>\
    <DPI>4718592</DPI>\
    <Size>0</Size>\
    <Quality>80</Quality>\
    <MatchMovieDim>1</MatchMovieDim>\
  </PublishJpegProperties>\
  <PublishOamProperties enabled="true">\
    <Width>1024</Width>\
    <Height>768</Height>\
    <CurrentFramePNG>1</CurrentFramePNG>\
    <CustomPNG>0</CustomPNG>\
    <PNGFilePath></PNGFilePath>\
    <Transparency>0</Transparency>\
  </PublishOamProperties>\
  <PublishProperties id="BBC1F406-65F2-4219-9304-FA48C7549E44" name="SVG Image" otf="true" enabled="true">\
    <Property name="copy">true</Property>\
    <Property name="default">true</Property>\
    <Property name="embed">false</Property>\
    <Property name="filename">{FLA_NAME}.svg</Property>\
    <Property name="imagesPath">images</Property>\
    <Property name="includeHiddenLayers">true</Property>\
    <Property name="optimizeForCH">false</Property>\
    <Property name="version">0.1</Property>\
  </PublishProperties>\
  <PublishProperties id="C6B9CB0C-C6DC-4FBC-9805-93E9EB37A444" name="JavaScript/HTML" otf="true" enabled="true">\
    <Property name="SiteUrl"> </Property>\
    <Property name="TPpngMaxSheetHeight">2048</Property>\
    <Property name="TPpngMaxSheetWidth">2048</Property>\
    <Property name="TextureBitDepth">8</Property>\
    <Property name="bitDepth">8</Property>\
    <Property name="centerOption">2</Property>\
    <Property name="centerStage">true</Property>\
    <Property name="compactPaths">true</Property>\
    <Property name="componentsPath">components/</Property>\
    <Property name="createjsNS">createjs</Property>\
    <Property name="default">false</Property>\
    <Property name="embedJS">true</Property>\
    <Property name="exportAsSpritesheet">true</Property>\
    <Property name="exportHTML">true</Property>\
    <Property name="exportImages">true</Property>\
    <Property name="exportImagesToFolder">true</Property>\
    <Property name="exportLibs">true</Property>\
    <Property name="exportLibsToFolder">true</Property>\
    <Property name="exportSounds">true</Property>\
    <Property name="exportSoundsToFolder">true</Property>\
    <Property name="filename">../out/assets/{FLA_NAME}/index.js</Property>\
    <Property name="frameBounds">false</Property>\
    <Property name="hostedLibs">false</Property>\
    <Property name="imageFormat">0</Property>\
    <Property name="imagesNS">images</Property>\
    <Property name="imagesPath">images/</Property>\
    <Property name="includeHiddenLayers">true</Property>\
    <Property name="includePreloader">false</Property>\
    <Property name="jpegBackground">#FFFFFF</Property>\
    <Property name="jpegMaxSheetHeight">8192</Property>\
    <Property name="jpegMaxSheetWidth">8192</Property>\
    <Property name="libNS">lib</Property>\
    <Property name="libraryPath">libs/</Property>\
    <Property name="loop">false</Property>\
    <Property name="makeResponsive">false</Property>\
    <Property name="optimizeExport">true</Property>\
    <Property name="optimizeImages">false</Property>\
    <Property name="pngBackground">#00000000</Property>\
    <Property name="pngMaxSheetHeight">8192</Property>\
    <Property name="pngMaxSheetWidth">8192</Property>\
    <Property name="preloaderName">Padrão</Property>\
    <Property name="quality">80</Property>\
    <Property name="resolution">2</Property>\
    <Property name="responsiveOption">2</Property>\
    <Property name="scaleOption">0</Property>\
    <Property name="scaleStage">false</Property>\
    <Property name="soundsPath">sounds/</Property>\
    <Property name="templateTitle">modelo-publicacao (Person.)</Property>\
    <Property name="textureConversion">true</Property>\
    <Property name="useStageGL">false</Property>\
    <Property name="version">0.1</Property>\
    <Property name="webfontEmbedCode">null</Property>\
  </PublishProperties>\
</profile>';
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

function exportToSalesDriverVA()
{
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
			//fl.getDocumentDOM().currentPublishProfile = AssertProfile("SalesDriver");

			fl.getDocumentDOM().publish();
			fl.getDocumentDOM().deletePublishProfile();
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