"use strict";
/*  
LineByLine: A tool to practice language comprehension
Antonio Cigna 2024
license MIT: you can share and modify the software, but you must include the license file 
*/
/* jshint strict: true */
/* jshint esversion: 8 */
/* jshint undef: true, unused: true */
//----------------------------------------------
var currScript = document.currentScript.src; var bar1 = currScript.lastIndexOf("\\");var bar2 = currScript.lastIndexOf("/"); 
console.log("LOADED file SCRIPT " + currScript.substring( 1+Math.max(bar1,bar2) )) ;	
//----------------------------------------------------------------------------------------
// apice inverso ALT + 96 
//  il contenuto della stringa lev2htmp_endpage col prefisso di src variato, diventa la fine della pagina del file html di secondo livello    
//--------------------
const lev2html_endpage = `
<div id="page2" style="border:0px solid red; padding:0.2em;width:98%;height:95%;">	
	<div id="id_div_voices" style="border:0px solid green;margin:0;">lista delle voci</div> 	
	<div id="divTabHloop" style="display:none;width:100%;"> </div>
	<div id="page2_2" style="height:100%;border:0px solid pink;margin:0px; "></div>	
</div>
	  
<script src="§prefixScriptFile§LineByLineV3/lbl2_lineByLine_script3_GOHTML.js"         ></script>
<script>
var runByGo = false;
begin_lbl2(); 	
</script>

` ; // fixedHtmlPage





