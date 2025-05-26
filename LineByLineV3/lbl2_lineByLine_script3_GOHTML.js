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
console.log("LOADED file SCRIPT " + currScript.substring( 1+Math.max(bar1,bar2) )) ;	// ... script3_GOHTML

//----------------------------------------------------------------------------------------

// charList constant contains a list of alphabetic characters to add to the ascii a-z
// got from google German, Italian, French, Spanish, Portuguese, Swedish, Norwegian, Danish, Hungarian  virtual keyboard.

const charList = 'äöüß' + 'àéèòù' + 'ç' + 'ñº' + '~' + 'å' + 'øæå' + 'őúűéá' ; 

//----------------------------------------------

const DURATA_TRADUZIONE = 2 * 1000;    // tempo di permanenza in milliSecondi di visibilità della traduzione
const listaTipi = ",Tr00,Tr10,Tr20,Tr21,Tr22,Tg00,Tg10,Tg20,Tg21,Tg22,Tg30,Tg31,Tg32," ;  // row and group
const typeList = listaTipi.split(",").slice(1); 
var audioCtx ; // sound effect
var sw_audioCtx_not_active = true;  
let begin_fromNumRow = 0;
//-----------------------------------------------
let ele_inp1     = document.getElementById("inp1"); 
let numRowInput = 0; 
let numWordBase = 0 ;
let numRowForWordBase = 0; 

let ele_div_voices = document.getElementById("id_div_voices"); 
//--------------------------------------------

//let clock_timer_symb = "&#x23f1;";
//let playLoop_symb = "&infin;";
let speakinghead_symb = "&#128483;";
let magnifyingGlass_symb = "&#128270;";
let pause_symb = "&#x23F8;";
//let play_symb = "&#x23F5;";
let word_pause_symb = "&#x1d110;"; 

let openbook_symb    = "&#128214;";
let closedbook_symb  = "&#128213;";
let left_arrow_symb  = "&#8592;";
let right_arrow_symb = "&#8594;";
//let breakwords_symb  = "/|/";
//let loop_symb        = "&#x27F3;";
let loop_symb2       = "&#x1F501;";
let stop_symb        = "&#x23F9;" ; 



let hide_translation_symb = '<span style="font-weight:bold;min-width:4em;">t?</span></span>';
let show_translation_symb = '<span style="font-weight:bold;">T</span></span>';


//let note_arrow1 = '<span style="font-size:2em;width:auto;height:1.4em;">' + right_arrow_symb + '</span>';
//let note_arrow2 = '<span style="font-size:2em;width:auto;height:1.4em;">' + left_arrow_symb + '</span>';
//let note_speaking = '<span style="font-size:2em;width:auto;height:1.4em;">' + speakinghead_symb + '</span>';

//let note_magnifyingGlass_symb = '<span style="font-size:2em;width:auto;height:1.4em;">' + magnifyingGlass_symb + '</span>';

//let note_loop_speaking = '<span style="font-size:2em;width:auto;height:1.4em;">' + loop_symb + '</span>';
//let note_loop_speaking = '<span style="font-size:2em;width:auto;height:1.4em;">' + loop_symb2 + '</span>';
//let note_loop_speaking = '<span style="font-size:2em;width:auto;height:1.4em;">' + playLoop_symb + '</span>';

//let note_hide_sub = '<span style="font-size:2em;width:auto;height:1.4em;">' + openbook_symb + '</span>';
//let note_show_sub = '<span style="font-size:2em;width:auto;height:1.4em;">' + closedbook_symb + '</span>';
//let note_show_tran = '<span style="font-size:2em;width:auto;height:1.4em;">' + show_translation_symb + '</span>';
//let note_hide_tran = '<span style="font-size:2em;width:auto;height:1.4em;">' + hide_translation_symb + '</span>';
//let note_breakwords = '<span style="font-size:2em;width:auto;height:1.4em;">' + breakwords_symb + '</span>';
//let note_clock_timer_symb = '<span style="font-size:2em;width:auto;height:1.4em;">' + clock_timer_symb + '</span>';

	//----------------------------
//let parser, xmlDoc;
//let DEFAULT_language_test =  "_antonio_test_"; 
let myLocalLanguage = "";  



//----------------------------------------------------------------
let cbc_LOCALSTOR_key = "LineByLineV3";
//  the LS_... variables here after have their values stored in window.localStorage so that they can be retrieved in the next sessions 
//  all this value are put in a list and saved in one variable the name of which contains the title of the page (each page has its own values)  


//let LS_voice_index = -1;
//let LS_fromVoice; 
//let LS_fromLanguage; 
//--------------------------------

//let listVox0 = [];   // selected voices only   
//let listVox1 = [];   // selected voices only   

let listVoxL = [null,null];
let listVoxL_selVoxIx = [0,0] ;  // indice della voce scelta nella lista delle voci listVoxL

//let voiceList2=[]; 
let totNumSelVoices    = [0,0]; 
let lastNumSelVoice    = [0,0]; 
//let lastWordNumVoice=0;
//------------------

//let totNumMyLangVoices=0; 
//let lastNumVoice = 0; 

//---------------------
let sel_voice_ix        = [ 0, 0];              // eg. 65 	 
let sel_voiceName       = ["",""];              // eg. Microsoft David - English (United States)"; 	
let	sel_voiceLangRegion = ["",""];              // eg. en-us	
let	sel_voiceLang2      = ["",""];              // eg. en
let sel_numVoices       = [ 0, 0]; 
let sel_voice_rotate    = [false, false];      
let sel_voice_exclude   = [false, false];      
let sel_loopTypeSet     = ["","","","","","","","","","","",""];  
let sel_loopTypeSet_str = "";
let sel_begin_fromNumRow_str = "0";  
let sw_told_group_row_list = [];
//---------------------
//let maxNumVoices = 9999; // 9

//let last_pitch = 1;
//let last_rate  = 1;
//let last_volume = 1;
//--------------
//let ele_voxDisplay1 = document.getElementById("id_voxDisplay1"); 
//let ele_voxLangDisplay1 = document.getElementById("id_voxLangDisplay1");

//let ele_voxDisplay2 = document.getElementById("id_voxDisplay2"); 
//let ele_voxLangDisplay2 = document.getElementById("id_voxLangDisplay2");

//--------------------------
//let voice_toUpdate_speech = [null,null];
/**
let speech_volume = 1;
let speech_rate = 1;
let speech_pitch = 1;
**/

let speechVolume = [1,1];
let speechRate   = [1,1];
let speechPitch  = [1,1];
//-----------
const VV00=0;  
const VV01=1; 
const VV02=2;  
const VV03=3;   
const VV04=4;  
const VV05=5; 
const VV06=6;  
const VV07=7; 
const VV08=8;  
const VV09=9;
//--
const VV10=10; 
const VV11=11; 
const VV12=12;  
const VV13=13;   
const VV14=14;  
const VV15=15; 
const VV16=16;  
const VV17=17; 
const VV18=18;  
const VV19=19;
//--
const VV20=20;
const VV21=21;
//-----------
 
//let utteranceList = [];
//-----------------
//let textLines = [];
//-----------------------------
//let speech = new SpeechSynthesisUtterance();
let synth  = window.speechSynthesis;
//let ele_last_play;
//----------



//---------------------

//------------
//let lastRow = -1;
//let lastCol = -1;
//let lastBoldCell;
//let last_blue_cell;


let sw_active_show_lastSpokenLineTranslation = false;

//const ele_outTitle = document.getElementById("id_outTitle") ;

//let startTime;
//let txt_length; 
let sw_pause = false; 
let sw_cancel = false;
//let time_limit = 15; // in seconds  //  it seems that  an utterance can't last more     
//let ELAPSED_TIME_SPEECH_LIMIT = 1000 * ( time_limit - 1) ;  
//let x1_line = 0;


//let tot_norm_time = 0;
//let tot_txt_len =0;	
//let tot_norm_mill_char = 0; 	  
//let tot_norm_str_leng_limit = 0;	 
//let TXT_SPEECH_LENGTH_LIMIT = 80; // initial value is updated according to the actual duration runs
//----
//let TTS_LOOP_begix=-1;
//let	TTS_LOOP_endix=-1; 
//let	TTS_LOOP_swLoop=false; 	
//let TTS_LOOP_elem;   
//--------------------------
//let last_objtxt_to_speak;

//====================================================
//let sw_word_script=false; 
//let word_last_BoldRow;
//-------------------------------------------
var pLastBold_ix1 = -1; // phrase
var pLastBold_ix2 = -1;
var wLastBold_ix1 = -1; // word
var wLastBold_ix2 = -1;
//---------------------


//let ele_ctl_playpause = document.getElementById("id_ctl_playpause");
//ele_ctl_playpause.children[0].innerHTML = ele_ctl_playpause.children[0].innerHTML.replace("§play_symb§", play_symb);
//ele_ctl_playpause.children[1].innerHTML = ele_ctl_playpause.children[1].innerHTML.replace("§pause_symb§", pause_symb);
//let ele_ctl_slider = document.getElementById("id_ctl_slider");
//let ele_ctl_value = document.getElementById("id_ctl_value");
//let ctl_slider_maxValue_hhmm = 0;
//let myLang = navigator.language; // eg.  it-IT
//let decimal_point = (0.123).toLocaleString(myLang).toString().substr(1, 1);


//-----------------------------

//let word_fromIxToIxLimit = [-1, -1];
//let word_fromIxToIxButtonElement = [null, null];


//----------------------------------------------

//let clip_reset_BG_color = "white";
//let clip_somerow_BG_color = "lightgrey";


let begix, endix;
let fromIxToIxLimit = [-1, -1];
let salvaSel_fromIxToIxLimit = [-1, -1]; 
let fromIxToIxButtonElement = [null, null];

let save_last_oneOnlyRow = "";
let save_last_oneOnly_idtr = "";
save_last_oneOnlyRow = "";
save_last_oneOnly_idtr = "";

let last_BoldRow;
//-----------------------------------------------

let numLoadVoiceIteration=0 ;

//===========================================  



//-----------------------------------
function colorConsole() {
	console.log(
		'Nothing here %cHi Cat %cHey Bear', // Console Message
	  'color: blue',
	  'color: red', // CSS Style
	);
}
function consoleRed0( msgRed ) {
	console.log('%c' + msgRed, 'color: red');
}
function consoleRed( msg1, msgColor1 ) {
	if (msgColor1) console.log(msg1 + '%c' + msgColor1, 'color: red');
}

function consoleGreen( msg1, msgColor1 ) {
	if (msgColor1) console.log(msg1 + '%c' + msgColor1, 'color: green');
}
//------------------------------------------
function fcommon_load_all_voices() {

	//console.log("xxxxxxxxxxxxxxxxxxxx  load_all_voices:  interation "  + (1+numLoadVoiceIteration) );  
	//---------------------------------
	function voices_load_ok(voices) {		
		var numLocal =0;
		var numRemote =0;
		for(var g=0; g < voices.length; g++) {
			//console.log(voices[g].name); 
			if (voices[g].localService) {
				numLocal ++;
			} else {
				numRemote++;
			}
		}
		//----------
		console.log( voices.length + " voices loaded: " + numLocal + " local, " + numRemote + " remote" );
		
		if ((numLocal < 1) || (numRemote < 1)) {
			if (numLoadVoiceIteration < 2) {
				numLoadVoiceIteration++ ;
				setTimeout(fcommon_load_all_voices, 500);
			} else {
				// too many unsuccessful attempts, get what there is; 
				use_the_voices();
			}
		} else {   
			//console.log("== ok == " + numLoadVoiceIteration); 
			use_the_voices();
		}
	} // end of load_ok
	//---------------------------------
	function voices_load_error(error) {
		console.log("error in loading voices  ", error); 
	}
	//---------------------------------
	const allVoicesObtained = new Promise(
					function(resolve, reject) {
						  voices = window.speechSynthesis.getVoices();
						  if (voices.length !== 0) {
							resolve(voices);
						  } else {
							window.speechSynthesis.addEventListener("voiceschanged", function() {
							  voices = window.speechSynthesis.getVoices();
							  resolve(voices);
							});
						  }
					}
			);
	allVoicesObtained.then(
		function(voices) { voices_load_ok(voices);   },
		function(error)  { voices_load_error(error);}
	);
	//----------------------------------
	function use_the_voices() {
		/**
			console.log("cbc_voices_getVoices.js --> use_the_voices   \nXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXX\n")
		for(var g=0; g < voices.length; g++) {
			console.log("\t" + voices[g].lang + " " + voices[g].name + " \t localService=" + voices[g].localService); 
		}
		**/
		
		tts_1_toBeRunAfterGotVoices(); 

	}	
	//-----------------------------
} // end of load_all_voices()
//==============================================================
//----------------------------------------------------------------------------------------
 // apice inverso ALT + 96 
 
 //--------------------------------
let div_voices =  ` 
	
	<div id="page0Lang" style="display: block; border: 0px solid blue;width:100%;">
         <div id="id_h01"  class="centerFlex" style="margin:auto; text-align:center;width:100%;    font-weight:bold;">
			<div>
				
				<span id="id_h1a" style="font-size:1.0em; color:blue">Line By Line V3</span>				
<span style="font-size:0.5em;font-weight:bold;line.height:80%;"><br>uno strumento per la comprensione e la memorizzazione di una lingua straniera</span>
				<br> <span id="id_h11a" style="font-size:0.5em;">Antonio Cigna 2024</span>
			</div>
         </div>
		 <!-- <button onclick="onclick_showtabLoop('id_show_voices')">show/hide parameters</button><br> -->
		 <div id="id_show_voices" class="centerFlex" style="text-align:center;width:100%;display:block;"> \n
			<div> \n
			 <table id="id_tb12" style="border:1px solid black;border-bottom: 0; bord-collapse:collapse;width:100%;">  
				<tbody>
				<tr>
					<td></td>
					<td>
							<label for="id_voices1">
							<b><span id="m135aa" class="xxf_blue">Prima Lingua</span></b>	
							</label> 
					</td>
					<td>
							<label for="id_voices2">
							<b><span id="m135ab" class="xxxf_blue">Seconda Lingua</span></b>	
							</label> 
					</td>	
				</tr>	
				<tr>
					<td style="text-align:left;vertical-align:bottom; font-size:80%;">Voce</td>
					<td>				
							<select id="id_voices1" class="seleVox" onchange="onclick_tts_get_oneLangVoice3(this,0,'select id_voice1')">    
							</select>
					</td>	
					<td>				
							<select id="id_voices2" class="seleVox" onchange="onclick_tts_get_oneLangVoice3(this,1,'select id_voice2')">    
							</select>
					</td>	
				</tr>	
				
				<tr style="display:none;"> <td>id_myLang</td><td id="id_myLang1"></td>   <td id="id_myLang2"></td> </tr> 
				<tr style="display:none;"> <td>id_langIx</td><td id="id_langIx1">0</td>   <td id="id_langIx2">0</td> </tr> 
				<tr style="display:none;"> <td>id_lang2 </td><td id="id_lang21" ></td>   <td id="id_lang22" ></td> </tr> 
				<tr style="display:none;"> <td>id_ext_language</td><td id="id_ext_language1"></td> <td id="id_ext_lamguage2"></td> </tr> 				
				<tr style="display:none;"> <td>id_voxLangDisplay</td> <td><div id="id_voxLangDisplay1" style="margin-top:0.5em;"></div></td>  <td><div id="id_voxLangDisplay2" style="margin-top:0.5em;"></div></td> </tr> 
				
				<tr>
					<td style="text-align:left;vertical-align:top;">Escludi voci</td>
					<td style="text-align:left;vertical-align:top;">
						<button class="buttonWhite" style="width:100%;" onclick="onclick_show_chosenVoices(this)">lista le voci della prima lingua</button>
						<div style="display:none;padding-left:2em;text-align:left;font-size:0.8em;">							
							<span >togli la spunta alle voci non desiderate</span><br>
							<table id="id_chosenVox0"  style="text-align:left;">								
							</table>
						</div>
					</td>	
					<td style="text-align:left;vertical-align:top;">
						<button class="buttonWhite" style="width:100%;" onclick="onclick_show_chosenVoices(this)">lista le voci della seconda lingua</button>	
						<div style="display:none;padding-left:2em;text-align:left;font-size:0.8em;">							
							<span >togli la spunta alle voci non desiderate</span><br>
							<table id="id_chosenVox1"  style="text-align:left;">								
							</table>
						</div>
					</td>	
				</tr>	
				<tr style="font-size:80%;" >
					<td>Voce da usare</td>
					<td>
						<label>la voce scelta<input type="radio" name="radio1"  onclick="onclick_chgVoxRotate()" id="origSelVox"></label>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label>tutte a rotazione<input type="radio" name="radio1"  onclick="onclick_chgVoxRotate()" id="origSelVox2"  checked="checked"></label>
					
					</td>
					<td >
					  <label>la voce scelta<input type="radio" name="radio2"  onclick="onclick_chgVoxRotate()"  id="tranSelVox"></label>
					  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <label>tutte a rotazione<input type="radio" name="radio2"  onclick="onclick_chgVoxRotate()"  id="tranSelVox2"  checked="checked"></label>						
					</td>					
				</tr>	
				
				<tr> 
					<td> </td>
					<td>
						<div class="centerFlex" style="width:100%;">
						<table>
								<tr>
									<td id="m126" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Tono</span></td>
									<td>
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input  id="id_inpPitch0" type="range" min="0.0" max="2" value="1.0" step="0.1" oninput="onclick_tts_changePitch(this,0)">
										</span>
									</td>								
								</tr>
								<tr> 
									<td id="m126x" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Volume</td>
									<td>
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input  id="id_inpVol0" type="range" min="0.0" max="2" value="1.0" step="0.1" oninput="onclick_tts_changeVolume(this,0)">
										</span>
									</td>									
								</tr>							
								<tr style="border:1px solid black;"> 
									<td id="m127" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Velocità</td>
									<td>					
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input id="id_inpRate0" type="range" min="0.0" max="2" value="1.0" step="0.1" oninput="onclick_tts_changeRate(this,0)">
										</span>	
									</td>												
								</tr>
						</table>
						</div>
					</td>
					<td>
						<div class="centerFlex" style="width:100%;">
						<table>
								<tr>
									<td id="m126" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Tono</span></td>		
									<td>				
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input  id="id_inpPitch1" type="range" min="0.0" max="2" value="1.0" step="0.1" oninput="onclick_tts_changePitch(this,1)">
										</span>
									</td>
								</tr>
								<tr> 
									<td id="m126x" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Volume</td>
									<td>
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input  id="id_inpVol1" type="range" min="0.0" max="2" value="0.8" step="0.1" oninput="onclick_tts_changeVolume(this,1)">
										</span>
									</td>
								</tr>								
								<tr style="border:1px solid black;"> 									
									<td id="m127" class ="msg" style="text-align:left;vertical-align:bottom; font-size:80%;">Velocità</td>
									<td>
										<span style="width:0.5em;padding:0;">1.0</span>
										<span style="width:0.5em;padding:0;">
														  <input  id="id_inpRate1" type="range" min="0.0" max="2" value="1.0" step="0.1" oninput="onclick_tts_changeRate(this,1)">
										</span>
									</td>				
								</tr>
						</table>
						</div>
					</td>
				</tr>
				<!--  xxxxxxxxxxxxx  -->
				
				
				<tr style="border:1px solid black;"> 
					<td ></td>
					<td>					
						<label  class="header_1" >start from line number</span>
							<input type="number" id="id_toSave_fromNum" min="0" value="0" onchange="onclickSaveFromNum(this,true)" style="width:4em;text-align:right;">
						</label>
					</td>
					<td>
						
					</td>				
				</tr>
				</tbody>
			</table> 	
			<!--
			<div id="divTabHloop" style="width:100%;"> 
			-->
		   </div>
		</div>				
	</div>	
	
 ` ; // end of div_voices
 
 
 //===================================================================
 var page2_content = `   	

<!-- page2_content -->
<div style="display:none;">
   <button onclick="onclick_printBilingual()">testo stampabile</button>
</div>
<style>
   .tabHparm {	border:1px solid black;vertical-align:middle;border-collapse: collapse;   }					 
   .tabHtd   {	border:1px solid black;vertical-align:middle;}
   .tabHloopInput { background-color:yellow;	text-align:right; width:3em; }
   .bott1 { border-bottom: 1px solid black;}
   .bordLeft{ border-left: 1px solid black;}
   .bordRight{ border-right: 1px solid black;}
   .buttonSpeak { height:7em;border:2px solid green;"  }
   .sticky { position: sticky;  top: 0; background-color: yellow;}
</style>

<div  style="display:flex;justify-content: center;  width:100%;  height:100%;
   text-align:left;  
   border:0px solid violet;">
   
   <div id="id_section_row" style="margin: auto;text-align:center;   margin:0;
     xcxdisplay:flex;justify-content: center;   width:100%;	
	    height:99%;
		overflow: auto;
      border:0px solid blue; ">
      <table id="id_tabSub" class="orig_txt" 
         style="display: block; text-align: left; vertical-align: top;  border:0px solid red; 
         width:100%;
         background-color: rgb(243, 200, 157);"> 
         <colgroup>
            <col id="col_1_2_arrow"      span="2" >
            <col id="col_3_showHideOrig" span="1" >
            <col id="col_4_showHideTran" span="1" >
            <col id="col_5_splitwords"   span="1" >
            <col id="col_6_subText" 	 span="1"  style="width:100%;">
			<col id="col_ttsLoop" 		 span="1" >
            <col id="col_ttsVoice0" 	 span="1" >
            <col id="col_ttsVoice0x" 	 span="1" >            
            <col id="col_ttsWord" 		 span="1" >
			<col id="col_tts_pause" 	 span="1" >
			<col id="col_tts_cancel" 	 span="1" >
            <col id="col_numSub" 		 span="1" >
         </colgroup>
         <thead id="id_tabSub_th" >
            <tr id="id_tr_row_zero1" style="background-color:lightgrey;">
               <th id="m005x" class="msg header_1" style="border:0px solid green;" colspan="2">gruppo di righe</th>
               <th id="m007" class="msg header_1 bott1" rowspan="2"   >mostra / nascondi<br>testo</th>
               <th id="m008" class="msg header_1 bott1" rowspan="2">mostra / nascondi<br>ascolta traduzione</th>
               <th id="m013" class="msg header_1 bott1" rowspan="2">parola<br>per<br>parola</th>
               <th id="id_h_textCol00" class="bordLeft borderRight sticky" style="text-align:center;  vertical-align:bottom;color:black;font-weight:bold; border:0px solid black;"  >
                  
				<div style="width:60%; border:0px solid blue;background-color: var(--main-bg-color);margin-left:20%;margin-right:20%;
					border-radius:0.8em;">
					<div style="display: inline-block; width:30%;text-align:right;">
						<button class="buttonTD" style="width:100%;text-align:center;" onclick="onclick_showtabLoop('id_show_voices')">hide/change<br>voice parameters</button>
					</div>
					<div style="display: inline-block; width:30%;text-align:left;">
						<button class="buttonTD" style="width:100%;text-align:center;" onclick="onclick_showtabLoop('id_tabLoopShow')">hide/change<br>loop parameters</button>
					</div>
				</div>
					
				
			   </th>	
               <th id="m123c" class="msg header_1  bott1 bordLeft" rowspan="2">Tipo Loop <small>click to change</small></th>
               <th id="m123a" class="msg header_1  bott1 bordLeft  c_m1g" rowspan="2">Play Orig</th>
               <th id="m123b" class="msg header_1  bott1 c_m1g" rowspan="2">Play Orig + Tran</th>
               <th id="m124d" class="msg header_1  bott1 c_m1g"  rowspan="2">Play pausa tra le parole</th>
			   <th id="m124e" class="msg header_1  bott1 bordLeft" rowspan="2">Pause Resume</th>
			   <th id="m124f" class="msg header_1  bott1" rowspan="2">Cancel</th>
               <th id="m125e" class="msg header_1  bott1 bordLeft" rowspan="2">N.</th>
            </tr>
			
			
            <tr id="id_tr_row_zero2" style="background-color:lightgrey;">
               <th id="xm005" class="msg header_1 bott1">selez. prima riga</th>
               <th id="xm006" class="msg header_1 bott1">selez. ultima riga</th>
			
				<th id="id_h_textCol" class="bott1 bordLeft borderRight"  style="text-align:center;  vertical-align:bottom;        color:black;font-weight:bold;">		
			      <div  class="centerFlex"   style="width:100%;border:0px solid brown;">
                     <div  style="border:0px solid green; font-size:0.5em;width:100%;">	
                        <table style="border:0px solid blue;font-size:90%;width:100%;">
                           <tr>
                              <td style="border:0px solid violet; vertical-align:top;" >                                
                              </td>
                              <td style="border:0px solid violet;">							  
                              </td>
                           </tr>
                           <tr>
                              <td colspan="2" id="showVoice_0" style="text-align:left;" ></td>
                           </tr>
                           <tr>
                              <td colspan="2" id="showVoice_1" style="text-align:left;" ></td>
                           </tr>
						    <tr>
                              <td colspan="2" id="id_showLoop" style="text-align:left;" ></td>
                           </tr>
                        </table>
                     </div>
                  </div>
               </th>			   
			 
			 
            </tr>
         </thead>
         <tbody id="id_tabSub_tbody"></tbody>
      </table>
      <!-- end of id_tabSub -->   	
   </div>
</div>


</div>
</div>
<!--  end of page2 -->
</div>
</div>
</div>
	  
	` ;	 // end of page2 content 
	
//====================================================
 // apice inverso ALT + 96 
 
 //--------------------------------
var table_read_rowspeed = `   
								<table style="text-align:center; border:0px solid red;">
									<tr style="background-color:lightgrey;">
										<td id="§§_headSpe" style="text-align:left;" rowspan="2"></td>
										<td colspan="10">numero lettura</td>
									</tr>
									<tr style="background-color:lightgrey;">	
										<td>n.1</td><td>n.2</td><td>n.3</td><td>n.4</td><td>n.5</td><td>n.6</td><td>n.7</td><td>n.8</td><td>9</td><td>altre</td>
									</tr>									
									<tr id="§§_spRedSw">
										<td style="text-align:left;">
											<span>ascolta testo a velocità ridotta</span> 
											<input type="number" value="80"  min="50" max="100" style="width:3em;text-align:right;" onchange='onclick_refresh_loopParms("§§","spRedSw" , true,this)'>%</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' checked ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
									</tr>  
									<tr id="§§_wbwSw">
										<td style="text-align:left;">
											<span>parole separate e velocità ridotta</span> 
											<input type="number" value="80"  min="50" max="100" style="width:3em;text-align:right;" onchange='onclick_refresh_loopParms("§§","wbwSw" , true,this)'>%</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' checked ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
									</tr>  
									
									<tr id="§§_showOrigSw">
										<td style="text-align:left;">mostra testo</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>  
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
									</tr>  
									<tr id="§§_tranSw">
										<td style="text-align:left;">ascolta traduzione</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
									</tr>  
									<tr id="§§_showTranSw">
										<td style="text-align:left;">mostra traduzione</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' checked></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' checked></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","showTranSw"  )' checked></td>
									</tr>  
								</table>
 `  ; // end of table_read_rowspeed
 
 var table_tran_rowspeed = `   
								<table style="text-align:center;border:0px solid green;">
									<tr style="background-color:lightgrey;">
										<td id="§§_headSpe" style="text-align:left;" rowspan="2"></td>
										<td colspan="10">numero lettura</td>
									</tr>
									<tr style="background-color:lightgrey;">	
										<td>n.1</td><td>n.2</td><td>n.3</td><td>n.4</td><td>n.5</td><td>n.6</td><td>n.7</td><td>n.8</td><td>9</td><td>altre</td>
									</tr>
									
									<tr id="§§_spRedSw" >
										<td style="text-align:left;">
											<span>ascolta testo a velocità ridotta</span> 
											<input type="number" value="80"  min="50" max="100" style="width:3em;text-align:right;" onchange='onclick_refresh_loopParms("§§","spRedSw" , true,this)'>%</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","spRedSw" )' ></td>
									</tr>  
									<tr id="§§_wbwSw" >
										<td style="text-align:left;">
											<span>parole separate e velocità ridotta</span> 
											<input type="number" value="80"  min="50" max="100" style="width:3em;text-align:right;" onchange='onclick_refresh_loopParms("§§","wbwSw" , true,this)'>%</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","wbwSw" )' ></td>
									</tr>  
									<tr id="§§_showOrigSw">
										<td style="text-align:left;">mostra testo</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","showOrigSw"  )' checked></td>
									</tr>  
									<tr id="§§_tranSw">
										<td style="text-align:left;">ascolta traduzione</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","tranSw"  )' checked></td>
									</tr>  
									
									<tr id="§§_showTranSw">
										<td style="text-align:left;">mostra traduzione</td>
										<td><input type="checkbox" value="1"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="2"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="3"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' ></td>  
										<td><input type="checkbox" value="4"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' ></td>
										<td><input type="checkbox" value="5"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' ></td>
										<td><input type="checkbox" value="6"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' checked></td>
										<td><input type="checkbox" value="7"  onchange='onclick_refresh_loopParms("§§","showTranSw"  )' checked></td>
										<td><input type="checkbox" value="8"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' checked></td>  
										<td><input type="checkbox" value="9"  onchange='onclick_refresh_loopParms("§§","showTranSwSw")' checked></td>
										<td><input type="checkbox" value="10" onchange='onclick_refresh_loopParms("§§","showTranSw"  )' checked></td>
									</tr>  
								</table>
 `  ; // end of table_tran_rowspeed
//----------------------------------
var table_idTabHloop = `   		
		<div id="divTabHloop" style="width:100%;margin:auto;border:0px solid black;  ">	
			<!--
			<button onclick="onclick_showtabLoop('id_tabLoopShow')">show/change loop parameters</button><br>
			-->
			<div id="id_tabLoopShow"   style="display:none;">
				<div id="idTabHloop" class="tabHparm" style="border:0px solid black;  font-size:80%;text-align:left;">                           
						
					
						<div style="border:1px solid black;  font-size:80%;text-align:left;">      
							Le righe del testo possono essere lette ripetutamente dalle voci sintentiche e per facilitare la comprensione  con voci diverse, a velocità ridotta e parola per parola.
							<br>
							I parametri per la lettura delle singole righe sono specificati nella sezione <b>loop r1</b> e <b>loop r2</b>, quelli per la lettura in gruppo (più righe insieme) nella sezione <b>loop g1</b> e <b>loop g2</b>.
							<br>
							La parte destra di ogni sezione permette di modificare il modo di riprodurre una riga in ogni nuova lettura.  				   
							
						</div> 
						
				<table id="idTabHloop1" class="tabHparm" style="border:1px solid black;  font-size:80%;text-align:left;border-collapse:collapse; margin-top:2em; ">                           
					<colgroup>
						<col span="1" style="width:1%; text-align.left;border:1px solid black;">
						<col span="1" style="width:15%;text-align.left;border:1px solid black;border-right:0px solid black;">
						<col span="1" style="width:15%;text-align.left;border:1px solid black;border-left:0px solid black;">
						<col span="1" style="border:1px solid black;">
					</colgroup>						   
					<tbody>			
						<tr>
							<th colspan="4" style="border-bottom:1px solid black"></th>
						</tr>  
						<tr style="margin-top:5em;">
							<th colspan="4" style="border:1;margin-top:5em;padding:0.5em;vertical-align:top;"></th>
						</tr>
						<tr style="margin-top:5em;">
							<th colspan="4" style="text-align:center;border:1;margin-top:5em;padding:0.5em;vertical-align:top;">LOOP RIGHE</th>
						</tr>
						<tr style="margin-top:5em;">
							<th colspan="4" style="border:0;margin-top:5em;padding:0.5em;vertical-align:top;"></th>
						</tr>
						
						
						<tr style="display:none;" >
							<th id="Tr0_rLoop" colspan="4" style="text-align:center;font-size:1.2em;border:1px solid black;border-top:2px solid black;">no&nbsp;loop</th>
						</tr>
						<tr style="display:none; text-align:left;">
							<td></td>
							<td>ripete 
								<input id="Tr00_rLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tr00')">&nbsp;<span>volta</span>
							</td>
							<td style="padding-bottom:0.5em;">la riga richiesta
								<input id="Tr00_nrLoop" class="tabHloopInput" type="number" value="1"  onchange="onclick_refresh_loopParms('Tr00')" style="display:none;">
							</td>
							<td id="Tr00_read_rowspeed"></td>
						</tr>
						
						
						<!--    -->						
						<tr style="margin-top:5em;">
						<th colspan="4" style="border:0;margin-top:5em;padding:0.5em;vertical-align:top;"></th>
						</tr>
						<tr>
							<th id="Tr1_rLoop" colspan="4" style="padding-top:1em;text-align:center;font-size:1.2em;border:1px solid black;border-top:2px solid black;">loop r1</th>
						</tr>
						<tr style="text-align:left;">
							<td></td>
							<td>ripete 
								<input id="Tr10_rLoop" class="tabHloopInput" type="number" value="10" onchange="onclick_refresh_loopParms('Tr10')">&nbsp;<span>volte</span>
							</td>
							<td style="padding-bottom:0.5em;">la riga richiesta 
								<input id="Tr10_nrLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tr10')" style="display:none;">
							</td>
							<td id="Tr10_read_rowspeed">                                    
							</td>
						</tr>
						<tr>
							<th id="Tr2_rLoop" colspan="4" style="padding-top:1em;text-align:center;border:1px solid black;border-top:2px solid black;">
								<span style="font-size:1.2em;">loop r2</span>	
								<span style="font-size:0.8em;"><br>vengono eseguiti 3 loop di lettura, uno sulla riga richiesta e gli altri anche con le righe precedenti</span>
							</th>
						</tr>						
						<tr style="text-align:left;">
							<td>1)</td>
							<td>ripete <input id="Tr20_rLoop" class="tabHloopInput" type="number" value="10" 
								onchange="onclick_loopType_change()">&nbsp;<span>volte</span>
							</td>
							<td style="padding-bottom:0.5em;">la riga richiesta 
								<input id="Tr20_nrLoop" class="tabHloopInput" type="number" value="1"  onchange="onclick_refresh_loopParms('Tr20')" style="display:none;">
							</td>
							<td id="Tr20_read_rowspeed">                                 
							</td>							 
						</tr>
						<tr style="text-align:left;">
							<td>2)</td>
							<td>ripete <input id="Tr21_rLoop" class="tabHloopInput" type="number" value="7" onchange="onclick_refresh_loopParms('Tr21')">&nbsp;<span>volte</span></td>
							<td style="padding-bottom:0.5em;">
								prima le ultime <input id="Tr21_nrLoop" class="tabHloopInput" type="number" value="3" onchange="onclick_refresh_loopParms('Tr21')"> 
								<br>righe precedenti<br>e poi quella richiesta
							</td>
							<td id="Tr21_read_rowspeed"></td>
						</tr>
						<tr style="text-align:left;">
							<td>3)</td>
							<td>ripete <input id="Tr22_rLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tr22')">&nbsp;<span>volta</span></td>
							<td style="padding-bottom:0.5em;">
								prima le ultime <input id="Tr22_nrLoop" class="tabHloopInput" type="number" value="5" onchange="onclick_refresh_loopParms('Tr22')"> 
								<br>righe precedenti<br>e poi quella richiesta
							</td>
							<td id="Tr22_read_rowspeed"></td>
						</tr>
						<tr>
							<th colspan="4" style="border-bottom:1px solid black"></th>
						</tr>  
						
					</tbody>
				</table>
				<br><br><br>		
						
				<table id="idTabHloop2" class="tabHparm" style="border:1px solid black;  font-size:80%;text-align:left;border-collapse:collapse;">                           
					<colgroup>
						<col span="1" style="width:1%; text-align.left;border:1px solid black;">
						<col span="1" style="width:15%;text-align.left;border:1px solid black;border-right:0px solid black;">
						<col span="1" style="width:15%;text-align.left;border:1px solid black;border-left:0px solid black;">
						<col span="1" style="border:1px solid black;">
					</colgroup>						   
					<tbody>			
						
						
						<tr style="margin-top:5em;">
							<th colspan="4" style="text-align:center;border:0;margin-top:5em;padding:0.5em;vertical-align:top;">LOOP GRUPPI</th>
						</tr>
						<tr style="display:none; margin-top:5em;">
							<th colspan="4" style="border:0;margin-top:5em;padding:0.5em;vertical-align:top;"></th>
						</tr>
						<tr style="display:none;" >
							<th id="Tg0_rLoop" colspan="4" style="text-align:center;font-size:1.2em;border:1px solid black;border-top:2px solid black;">no&nbsp;loop</th>
						</tr>
						<tr style="display:none; text-align:left;">
							<td></td>
							<td>ripete 
								<input id="Tg00_rLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tg00')">&nbsp;<span>volta</span>
							</td>
							<td style="padding-bottom:0.5em;">il gruppo richiesto
								<input id="Tg00_nrLoop" class="tabHloopInput" type="number" value="1"  onchange="onclick_refresh_loopParms('Tg00')" style="display:none;">
							</td>
							<td id="Tg00_read_rowspeed"></td>
						</tr>
						<tr style="margin-top:5em;">
							<th colspan="4" style="border:0;margin-top:5em;padding:0.5em;vertical-align:top;"></th>
						</tr>
						<tr>
							<th id="Tg1_rLoop" colspan="4" style="padding-top:1em;text-align:center;font-size:1.2em;border:1px solid black;border-top:2px solid black;">loop g1</th>
						</tr>
						<tr style="text-align:left;">
							<td></td>
							<td>ripete 
								<input id="Tg10_rLoop" class="tabHloopInput" type="number" value="10" onchange="onclick_refresh_loopParms('Tg10')">&nbsp;<span>volte</span>
							</td>
							<td style="padding-bottom:0.5em;">il gruppo richiesto 
								<input id="Tg10_nrLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tg10')" style="display:none;">
							</td>
							<td id="Tg10_read_rowspeed"></td>
						</tr>

						<tr>
							<th id="Tg2_rLoop" colspan="4" style="padding-top:1em;text-align:center;font-size:1.2em;border:1px solid black;border-top:2px solid black;">loop g2								
							</th>
						</tr>				
						
						<tr style="text-align:left;">
							<td></td>
							<td>ripete <input id="Tg20_rLoop" class="tabHloopInput" type="number" value="4" 
								onchange="onclick_loopType_change()">&nbsp;<span>volte</span>
							</td>
							<td style="padding-bottom:0.5em;">
								<input id="Tg20_nrLoop" class="tabHloopInput" type="number" value="1"  onchange="onclick_refresh_loopParms('Tg20')" style="display:none;">
								ogni riga del gruppo 
													
							    <input id="Tg21_nrLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tg21')" style="display:none;">
								<input id="Tg21_rLoop" class="tabHloopInput" type="number" value="3" onchange="onclick_refresh_loopParms('Tg21')">&nbsp;<span>volte</span>
							</td>
							<td id="Tg21_read_rowspeed"></td>
						</tr>
					
					<tr>
							<th id="Tg3_rLoop" colspan="4" style="padding-top:1em;text-align:center;border:1px solid black;border-top:2px solid black;">
								<span style="font-size:1.2em;">loop g3 (loop di loop r2)</span>	
								<span style="font-size:0.8em;"><br>vengono eseguiti 3 loop di lettura, uno sulla riga richiesta e gli altri anche con le righe precedenti</span>
							</th>
						</tr>	
						<tr style="text-align:left;">
							<td colspan="4" style="padding-top:0.5em;padding-bottom:0.5em;">
								Ripete <input id="Tg30_loopR2" class="tabHloopInput" type="number" value="999">
								volte per ogni riga del gruppo il set di loop R2
							</td>
						</td>
						<tr style="text-align:left;">
							<td></td>
							<td>1) ripete <input id="Tg30_rLoop" class="tabHloopInput" type="number" value="10" 
								onchange="onclick_loopType_change()">&nbsp;<span>volte</span>
							</td>
							<td style="padding-bottom:0.5em;">la riga richiesta 
								<input id="Tg30_nrLoop" class="tabHloopInput" type="number" value="1"  onchange="onclick_refresh_loopParms('Tg30')" style="display:none;">
							</td>
							<td id="Tg30_read_rowspeed">                                 
							</td>							 
						</tr>
						<tr style="text-align:left;">
							<td></td>
							<td>2) ripete <input id="Tg31_rLoop" class="tabHloopInput" type="number" value="7" onchange="onclick_refresh_loopParms('Tg31')">&nbsp;<span>volte</span></td>
							<td style="padding-bottom:0.5em;">
								prima le ultime <input id="Tg31_nrLoop" class="tabHloopInput" type="number" value="3" onchange="onclick_refresh_loopParms('Tg31')"> 
								<br>righe precedenti<br>e poi quella richiesta
							</td>
							<td id="Tg31_read_rowspeed"></td>
						</tr>
						<tr style="text-align:left;">
							<td></td>
							<td>3) ripete <input id="Tg32_rLoop" class="tabHloopInput" type="number" value="1" onchange="onclick_refresh_loopParms('Tg32')">&nbsp;<span>volta</span></td>
							<td style="padding-bottom:0.5em;">
								prima le ultime <input id="Tg32_nrLoop" class="tabHloopInput" type="number" value="5" onchange="onclick_refresh_loopParms('Tg32')"> 
								<br>righe precedenti<br>e poi quella richiesta
							</td>
							<td id="Tg32_read_rowspeed"></td>
						</tr>
						<tr>
							<th colspan="4" style="border-bottom:1px solid black"></th>
						</tr>  
					</tbody>
				</table>
				</div>
				<br><br>
			</div>
		</div>	
 `  ; // end of table_idTabHloop		 
 
 //-------------------------------------------------
 // apice inverso ALT + 96 

//--------------------

 function tts_1_toBeRunAfterGotVoices() {
	 
	//console.log("tts_1_toBeRunAfterGotVoices() 0000 le voci sono state appena caricate" )	
	
	loadVoicesOnPage();
	
	//console.log("tts_1_toBeRunAfterGotVoices  fine di loadVoicesOnPage()")
	
	//plus_initial_from_localStorage_values();
	
	//console.log("tts_1_toBeRunAfterGotVoices  lista situazione iniziale local_storage")
	
	//plus_list_localStorageItems();	
	
	/**
	console.log("tts_1_toBeRunAfterGotVoices() ",
		"\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n")
	**/
	
 } // end of toBeRunAfterGotVoices() 
  
 //---------------------------------------------------------- 
  
 function loadVoicesOnPage() {	 
	  //console.log("loadVoicesOnPage()" ); 
      if (voices.length < 1) return;

      voices.sort(
          function(a, b) {
              return ((a.lang + a.name) > (b.lang + b.name)) ? 1 : -1;
          }
      );
      var pLang2 = "??";
      var pLang4 = "";
      var numL2 = 0;
      var numL4 = 0;
	  var langName;
      var ixSele = -1;
	  var sele_str = "";
	  //var selected_yes="selected"; 
	  var swSele=false; 
	  
	  
	  ixSele = parseInt("0" + document.getElementById("id_langIx1").innerHTML); 

	  //console.log("carica la lista voci sulla pagina per potere scegliere la voce richiesta")
	  
	  //-------------------------------------------------
      for (var z1 = 0; z1 < voices.length; z1++) {
		  swSele = false; 
          var lang = voices[z1].lang;
          var lang2 = lang.substr(0, 2);
		  //var keyVox = lang+ " " + voices[z1].name;  
		  //if (z1 < 3) { console.log("voces[",z1,"]=" , voices[z1].name) }
          if (lang != pLang4) {
              //console.log(lang);
              numL4++;
              if (lang2 != pLang2) {
				  langName = get_languageName(lang).split("-")[0].trim(); 
                  numL2++;
                  sele_str += '   </optgroup> \n';
                  sele_str += '   <optgroup label="' + lang2 + ' ' + langName + '"> \n';
              }
          }  
		  /**
		  if (keyVox == LS_fromVoice) {	  
			if (ixSele < 0) {
				ixSele=z1;
			}	
		  }
		  ***/
		  if (ixSele == z1) {
				sele_str += '      <option value="' + z1 + '" selected>' + lang + " " + voices[z1].name +  '</option> \n';
		  } else {
			  sele_str += '      <option value="' + z1 + '">' + lang + " " + voices[z1].name +  '</option> \n';
		  }		
		 
          pLang4 = lang;
          pLang2 = lang2;
      }	  
	  //pLang4 = lang;
      sele_str += '   </optgroup> \n';
	  
      let voiceSelect1 = document.getElementById("id_voices1");
      voiceSelect1.innerHTML = sele_str;    // riempie la colonna 1 
	    
      let voiceSelect2 = document.getElementById("id_voices2");
      voiceSelect2.innerHTML = sele_str;    // riempie la colonna 2 
	  
	  // test se l'indice memorizzato nella volta scorsa corrisponde alla lingua
	  
	  voiceSelect1.value = get_voice_index_previousRun(0);	 
	  voiceSelect2.value = get_voice_index_previousRun(1);	 
	 
	 //console.log("le voci sono state caricate sulla pagina"); 
	  
	  onclick_tts_get_oneLangVoice3(  voiceSelect1,0,"loadVoicesOnPage orig");	// lingua 0  lingua originale  
	  onclick_tts_get_oneLangVoice3(  voiceSelect2,1,"loadVoicesOnPage tran");	// lingua 1  lingua traduzione
	  
	  //console.log("loadVoicesOnPag() " , " 3 sel_voiceLangRegion[0]=", sel_voiceLangRegion[0] )
	  
	 // if (sw_2Level) {		  
		  //tts_2_fill_the_voices_1();
		  
	tts_2_fill_the_voices_OneLanguage( 0 , voiceSelect1);  
	
	// console.log("listVoxL[",0,"] length=", listVoxL[0].length)	  
	
	tts_2_fill_the_voices_OneLanguage( 1 , voiceSelect2);  
	

  
   }  // end of loadVoicesOnPage  

  //===============
 
//------------------------------
function go_fill_voice_ixZero() {  // usata nel caso LineByLine sia richiamato dal program go
	var ix1=0; var ix2=0; 
	  
	if (parm_language1_2 == false) return; 
	if (parm_language2_2 == false) return; 
	//console.log("    antonio fill_voice_ixZero() parm_language1_2=",parm_language1_2,  " parm_language2_2=",parm_language2_2 );
	if (parm_language1_2 == "") return ; 
	if (parm_language2_2 == "") return ;
	var f;
	for(f=0; f < voices.length; f++) {
		//console.log("       antonio fill_voice_ixZero() voices[",f,"]=", voices[f].lang.substr(0,2)    )	
		if (voices[f].lang.substr(0,2) == parm_language1_2.substring(0,2) ) ix1 = f;
		if (voices[f].lang.substr(0,2) == parm_language2_2.substring(0,2) ) ix2 = f; 
	}
	//console.log("       antonio fill_voice_ixZero() ==> ix1=", ix1, " ix2=", ix2);	
		
	sel_voice_ix[0]        =  ix1; 	
	sel_voiceLangRegion[0] =  voices[ix1].lang	;
	sel_voiceLang2[0]      =  voices[ix1].lang.substr(0,2);
	sel_voiceName[0]       =  voices[ix1].name;
		
	sel_voice_ix[1]        =  ix2; 	
	sel_voiceLangRegion[1] =  voices[ix2].lang	;
	sel_voiceLang2[1]      =  voices[ix2].lang.substr(0,2);
	sel_voiceName[1]       =  voices[ix2].name;
} // end of go_fill_voice_ixZero()
//-------------------------------------------------------- 
  
function get_voice_index_previousRun( numLang )  {	
	/**
		if the voice index of the previous run addresses the correct language id, returns this index
		otherwise return an index corresponding  to the language of the previous run
		If nothing corresponds, return 0 (ie. the beginning of the voice list)
	**/
	
	//console.log("ANTONIO ", " numLang=", numLang, " sel_voice_ix.length=", sel_voice_ix.length, " sel_voice_ix=", sel_voice_ix); 
	if (sel_voice_ix.length < 1) sel_voice_ix = [0,0];
	if ((sel_voice_ix[0] == 0) && (sel_voice_ix[1] == 0)) {
		go_fill_voice_ixZero(); 
		//console.log("ANTONIO  get_voice_index_previousRun ==> ","sel_voice_ix.length=", sel_voice_ix.length,	 " sel_voice_ix[0]=", sel_voice_ix[0], " sel_voice_ix[1]=", sel_voice_ix[1]); 
	}	
		
    if (sel_voice_ix.length <= numLang) {
		return 0; 
	}	
	var prevIndiceVoce = sel_voice_ix[numLang];
	
	listVoxL_selVoxIx[numLang] = prevIndiceVoce;
	lastNumSelVoice[numLang]   = prevIndiceVoce;			
	
	//console.log( "get_voice_index_previousRun numLang=", numLang, " lastNumSelVoice[numLang] =",  lastNumSelVoice[numLang] );
	//console.log("check_voice_index_previousRun() " , " numLang=", numLang, " sel_voice_ix[numLang]=", sel_voice_ix[numLang], " prevIndiceVoce=" + prevIndiceVoce + "<==")
	
	//console.log("check_voice_index_previousRun() " , " voice lang=", voices[prevIndiceVoce].lang, " name=",   voices[prevIndiceVoce].name)
	
	if (sel_voiceLang2[numLang] ==  voices[prevIndiceVoce].lang.substr(0,2) ) { 	
		// a indice eguale, la lingua corrisponde,  se poi la voce è diversa non c'è problema	
		//console.log("check_voice_index_previousRun() " ,"trovato indice ", prevIndiceVoce , " per la lingua ",  sel_voiceLang2[numLang]);
		return prevIndiceVoce; 		
	} 
	
	/**
	console.log("check_voice_index_previousRun() " ,"l'indice voce non corrisponde alla lingua, cerca un altro indice:" ,
		"\n\tsel_voiceLang2[numLang]="+sel_voiceLang2[numLang]+",voices[prevIndiceVoce].lang.substr(0,2)="+ voices[prevIndiceVoce].lang.substr(0,2) +"<=="    )
	**/
	console.log("		sel_voiceName[",numLang,"] = ", sel_voiceName[numLang]   );
	for(let v=0; v < voices.length; v++) {
		if (sel_voiceName[numLang]       ==  voices[prevIndiceVoce].name) return v;	
	}
	console.log("		sel_voiceLangeRegion[",numLang,"] = ", sel_voiceLangRegion[numLang]   );
	for(let v=0; v < voices.length; v++) {
		if (sel_voiceLangRegion[numLang] ==  voices[prevIndiceVoce].lang) return v;	
	}
	console.log("		sel_voiceLang2[",numLang,"] = ", sel_voiceLang2[numLang]   );
	for(let v=0; v < voices.length; v++) {
		if (sel_voiceLang2[numLang]      ==  voices[prevIndiceVoce].lang.substr(0,2) ) return v	;
	}
	console.log("              return 0");  
	return 0;

} // end of  check_voice_index_previousRun()
//----------------------------------------------------------------

function onclick_tts_get_oneLangVoice3(this1, numLang) {
	if (sel_voice_ix.length < 1) sel_voice_ix = [0,0];
	if ((sel_voice_ix[0] == 0) && (sel_voice_ix[1] == 0)) {
		fill_voice_ixZero(); 
		//console.log("ANTONIO  onclick_tts_get_oneLangVoice3 ==> ","sel_voice_ix.length=", sel_voice_ix.length,	 " sel_voice_ix[0]=", sel_voice_ix[0], " sel_voice_ix[1]=", sel_voice_ix[1]); 
	}	
		
    if (sel_voice_ix.length <= numLang) {
		return; 
	}	
	
	let indiceVoce = this1.value; // indice scelto 
	
	if (voices.length <= indiceVoce) { indiceVoce = 0; }
	
	/**
	console.log("1indiceVoce=", indiceVoce)
	console.log("numLang=", numLang)
	console.log("listVoxL=", listVoxL)
	**/
	
	if (listVoxL[numLang]) {
		if (listVoxL[numLang].length > 0) {  
			tts_2_fill_the_voices_OneLanguage( numLang , this1);
			//console.log("listVoxL[", numLang,"]  length=", listVoxL[numLang].length)
		}
	}
	
	//var langRegion = get_languageName( voices[indiceVoce].lang ) ;   // voce appena caricata 
	//var langname = langRegion.split("-")[0]; 
	
	//console.log("3 oonclick_tts_get_oneLangVoice3() numLang=", numLang, " indiceVoce=", indiceVoce," langRegion=", langRegion, " langname=", langname);
	
	let myVoice0 = voices[indiceVoce].lang + " " + voices[indiceVoce].name;    // voce appena caricata 
	myVoice = myVoice0.replace("Natural) -", "Natural) <br>");
	
	
	sel_voice_ix[numLang]        =  indiceVoce; 	
	sel_voiceLangRegion[numLang] =  voices[indiceVoce].lang	;
	sel_voiceLang2[numLang]      =  voices[indiceVoce].lang.substr(0,2);
	sel_voiceName[numLang]       =  voices[indiceVoce].name;
	
	if (listVoxL[numLang]) {
		for(var f=0; f < listVoxL[numLang].length; f++) {
			if (listVoxL[numLang].name == voices[indiceVoce].name) {
				listVoxL_selVoxIx[numLang] = f; 			
				break;		
			}	
		} 
	}
	
	plus_set_localStorage_var(2);
	
	//plus_list_localStorageItems();
	
	
	
	//tts_3_show_speakingVoiceFromVoiceLangName(sel_voiceLangRegion[numLang], sel_voiceName[numLang],numLang);
	 
	
	
	
	//console.log("onclick_tts_get_oneLangVoice() " + " selected_voice_ix=" + sel_voice_ix[0] + "  id_my_lang = myVoice =" + myVoice);  
	
	//tts_1_get_languagePlayer(indiceVoce,numLang); 
	   
} // end of onclick_tts_get_oneLangVoice3

//--------------------------------------------------
 
function onclickSaveFromNum(this1,salva) {
	var tabEle = document.getElementById("id_tabSub_tbody"); 
	if (tabEle == null) return;
	var numTrMax = tabEle.children.length; 
	
	begin_fromNumRow = 0;
	try{ 
		begin_fromNumRow = parseInt(this1.value); 
		if (begin_fromNumRow<0) begin_fromNumRow=0; 
	} catch(e1) {		
	}
	if (begin_fromNumRow >= numTrMax) {
		begin_fromNumRow = numTrMax - 1; 
		this1.value = begin_fromNumRow; 
	}
	scroll_row_intoView( begin_fromNumRow );  	
	sel_begin_fromNumRow_str = begin_fromNumRow;
	if (salva) plus_set_localStorage_var(6);
	
} // end of onclickSaveFromNum

//======================================	
function tts_2_fill_the_voices_OneLanguage( numLang , voiceSelect) { 
	var indiceScelto = voiceSelect.value;
	var listVoxS_selected = 0; 
		//console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nxx tts_2_fill_the_voices( numLang=", numLang , " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
	
	var numTotVoices = voices.length;
	
	//console.log("voices.length=" + numTotVoices); 
	//console.log("   sel_voiceName[",numLang,"] = ", sel_voiceName[numLang] )
		
	for(var ix=0; ix < numTotVoices; ix++) {		
		if (sel_voiceName[ numLang] == voices[ix].name) {
			sel_voice_ix[       numLang] = ix; 	
			//console.log("fill the voice ", numLang, "  ix=",ix, "  ",  voices[ix].name,  "  sel_voice_ix[numLang]=" , sel_voice_ix[numLang]);  
			sel_voiceLangRegion[numLang] = voices[ix].lang	;
			sel_voiceLang2[     numLang] = sel_voiceLangRegion[numLang].substr(0,2);
			break;
		}		
	}
	
	var vox;
	let listVoxS = [];
	
	//firstly the chosen language-voice
	
	vox = voices[ sel_voice_ix[numLang] ];
	 
	listVoxS.push( [vox.lang , vox, true] );  
	
	if (sel_voiceLangRegion[numLang] != vox.lang) {
		console.log("tts_2_fill_the_voices() " + "   numLang=", numLang, "\n\tsel_voice_ix[numLang]=" + sel_voice_ix[numLang] + 
			"\n\tsel_voiceName[numLang] = " + sel_voiceName[numLang] +
			"\n\tsel_voiceLangRegion[numLang] = " + sel_voiceLangRegion[numLang] +
			"\n\tsel_voiceLang2[numLang] = " + sel_voiceLang2[numLang]); 
		console.log("ERROR vox.lang (from voices[sel_voice_ix]) = " + vox.lang  + 
				" vs " + "sel_voiceLangRegion[numLang] =" +sel_voiceLangRegion[numLang]);  
		console.log(signalError(0));		
	}
	var v2;
	//------------------------------------------
	// secondly the same language-region 
	for(v2=0; v2 < voices.length; v2++) {
		vox = voices[v2];
		if (v2 == sel_voice_ix[numLang]) continue; 
		
		if (sel_voiceLangRegion[numLang] != vox.lang ) continue;	
		
		listVoxS.push( [vox.lang , vox,true] );  
		if (v2==indiceScelto) {
			listVoxS_selected = listVoxS.length-1; 			
		}
	}
	//---------------------------------	
	// thirdly the same language
	for(v2=0; v2 < voices.length; v2++) {
		vox = voices[v2];
		if (sel_voiceLangRegion[numLang] == vox.lang ) continue;	
		if (sel_voiceLang2[numLang] != vox.lang.substr(0,2) ) continue;				
		listVoxS.push( [vox.lang , vox,true] );  
	}
	//---------------------------------	
	/**
	//  LISTA VOCI CARICATE
	for(var v3=0; v3 < listVoxS.length; v3++) {		
		var vv1, vv2; 
		[vv1,vv2,vv3] = listVoxS[v3]
		console.log("listVoxS[" +v3 + "] = " + vv1 + " " + vv2.name);
	}
	**/
	//----------
	// load the chosen voice names on the html page
	
	var nomeL, nomeL1, nomeL2, l1;
	var mod1 = '<tr><td><input  type="checkbox" id="cho§ix§§nV§" value="§ix§" checked onclick="onclick_chkChosenVox(this,§nV§)"></td><td><label for="cho§ix§§nV§">§voxName1§</label></td><td><label for="cho§ix§§nV§"> §voxName2§</label></td></tr>\n';
	
	//var str1 = "<table>\n<tbody> \n"; 
	var str1 = ""; var g;
	for(g=0;g<listVoxS.length;g++) {
		nomeL = listVoxS[g][1].name.trim(); 
		//str1+= mod1.replace( '§ix§', g ).replace( '§voxName§', nomeL ); 
		l1= nomeL.lastIndexOf("-"); 
		if (l1 < 0) {nomeL1 = nomeL;  nomeL2=""; }
		else {nomeL1 = nomeL.substring(0,l1);  nomeL2= nomeL.substring(l1+1); }  	
		str1+= mod1.replaceAll( '§ix§', g ).replaceAll( '§voxName1§', nomeL1 ).replaceAll( '§voxName2§', nomeL2 ).replaceAll("§nV§",numLang);   
	}  	
	//str1 += "</tbody>\n </table> \n";
	document.getElementById("id_chosenVox" + numLang).innerHTML = str1; 
	//-------------------
	var voxName_scelto= voices[indiceScelto].name; 
	var index2 = 0; 
	var chList = sel_voice_exclude[numLang]; 
	for(g=0;g<listVoxS.length;g++) {
		if (g < chList.length) document.getElementById("cho"+ g + numLang).checked = chList[g];
		else document.getElementById("cho"+ g + numLang).checked = true;
		listVoxS[g][2] = chList[g];
		if(listVoxS[g][1].name == voxName_scelto) index2 = g; 
	}

	//----------------	
	//var chosenIxVox=0;
	//-----------
	if (listVoxS.length == 0) {
		listVoxL[numLang] = []; 
	}
	
	//console.log("listVoxS length=" + listVoxS.length); 

	//voice_toUpdate_speech[numLang] = listVoxS[0][1] ;
	totNumSelVoices[numLang]    = listVoxS.length;
	listVoxL[numLang]           = listVoxS;
	listVoxL_selVoxIx[numLang]  = listVoxS_selected ;

	lastNumSelVoice[numLang] = index2;
	
	//console.log( "fill_the_voices_OneLanguage numLang=", numLang, " lastNumSelVoice[numLang] =",  lastNumSelVoice[numLang] );

} // end of fill_the_voices_OneLanguage()




//-------------
 // apice inverso ALT + 96 
 
	//-------------------------------------------------------------------

	let prototype_tr_m2_tts = ` 
		<tr id="idtr_§1§_m2" style="display:none;background-color:lightgrey;height:1.5em;">
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>  
            <td class="c_m2"></td>
			<td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="c_m2"></td>
			<td class="c_m2"></td>
            <td class="c_m2"></td>
         </tr>
	` ; // end of prototype_tr_m2_tts

	//--------------------------------
	let prototype_tr_m1_tts = ` 
         <tr id="idtr_§1§_m1" class="playBut1" style="display:none; background-color:lightgrey;margin-top:10em;">
            <td class="c_m2"></td>
            <td class="c_m2"></td>
            <td class="playBut1 c_m2"><button class="buttonTD2" id="idb_§1§_m" onclick="onclick_tts_OneClipRow_showHide_sub( this, true)">
               <span style="display:block;font-size:2em;">${openbook_symb}</span>
               <span style="display:none;font-size:2em;">${closedbook_symb}</span></button>
            </td>
            <td class="playBut1 c_m2">
				<button class="buttonTD2" id="idbT_§1§_m" onclick="onclick_tts_OneClipRow_showHide_tran( this, true)">				
					<span style="display:none;font-size:2em;height:1.4em; "><span><span style="font-weight:bold;">${show_translation_symb}</span></span></span>
					<span style="display:block;font-size:2em;height:1.4em;padding:0 0.1em;">
					<span><span style="font-weight:bold;min-width:4em;">${hide_translation_symb}</span></span></span>
				</button>
            </td>
			<td class="playBut1 c_m2"></td>
            <td class="c_m2" style="font-size:80%;color:black;text-align:center; ">				
				<b>gruppo §1§-<span id="id_end_§1§"></span></b>
				<br>
				<button onclick="printOrigText()"   class="buttonTD" style="width:20em;">Testo Stampabile</button> 
				<button onclick="printBilingual()"  class="buttonTD" style="width:20em;">Traduzione interlineare stampabile</button>
				<br>
				<div id="resetHideForNow_§1§" style="display:none;background-color:yellow;">
				<button  onclick="onclickResetHideForNow('§1§')"   class="buttonTD" style="width:20em;">Mostra di Nuovo tutte le righe</button> 
				</div>
			</td>		
			
			<td class="playBut1 c_m2 bordLeft">
               <button class="buttonWhite buttonSpeak" onclick="onclick_anotherLoopType(this,true,true)" style="text-align:center;">						
					<span id="tyLoop§1§_m1" style="display:none;">0</span>
					<span style="font-size:2em;height:1.4em; display:none;">${loop_symb2}</span>
					<span>no&nbsp;loop</span> 
					<div style="font-size:1.5em;"></div> 
					
               </button>			   
			   <!--<div style="font-size:0.5em;line-height: 80%;"></div> -->
            </td>    
			<td class="playBut1 bordLeft c_m2">
               <button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_group(§1§,false,false,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span><span style="font-size:0.9em;">Orig</span>
               </button>
            </td>	
			<td class="playBut1 c_m2">
               <button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_group(§1§,true,false,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span><span style="font-size:0.9em;">Orig + Tran</span>
               </button>
            </td>		
			<td class="playBut1 c_m2">
				<!--
				<button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_group(§1§,true,true,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span><span style="font-size:0.9em;">${word_pause_symb}</span>
               </button>
				-->
            </td>	
            
			<td class="playBut1 c_m2 bordLeft">
               <button class="buttonWhite buttonSpeak" onclick="onclick_tts_speech_pause2()">
					<span style="font-size:2em;height:1.4em;">${pause_symb}</span>
               </button>			   
            </td>
			<td class="playBut1 c_m2">
               <button class="buttonWhite buttonSpeak" onclick="onclick_tts_speech_cancel()">
					<span style="font-size:2em;height:1.4em;">${stop_symb}</span>
               </button>			   
            </td>
            <td class="playBut1 c_m2 bordLeft"></td>
         </tr>
	` ; //	end of prototype_tr_m1_tts		
	//---------------------------------------  
	let prototype_tr_tts = `		 
         <tr id="idtr_§1§" style="background-color: lightgrey;width:100%;">
            <td class="arrow12"><button class="buttonFromToIx" id="b1_§1§" onclick="onclick_tts_arrowFromIx(this, §1§)">
               <span style="font-size:1em;height:1.4em;">${right_arrow_symb}</span></button>
            </td>
            <td class="arrow12"><button class="buttonFromToIx" id="b2_§1§" onclick="onclick_tts_arrowToIx(  this, §1§)">
               <span style="font-size:1em;height:1.4em;">${left_arrow_symb}</span></button>
            </td>		
            <td class="playBut1">
               <button class="buttonTD2" id="idb_§1§" onclick="onclick_tts_show_row( this, §1§)">
				   <span style="display:none;font-size:2em;height:1.4em;">${openbook_symb}</span>
				   <span style="display:block;font-size:2em;height:1.4em;">${closedbook_symb}</span>
               </button>
            </td>
            <td class="playBut1">
               <button class="buttonTD2" id="idbT_§1§" onclick="onclick_tts_show_row(this, §1§)">
				   <span style="display:none;font-size:2em;height:1.4em; "><span><span style="font-weight:bold;">${show_translation_symb}</span></span></span>
				   <span style="display:block;font-size:2em;height:1.4em;padding:0 0.1em;"><span>
				   <span style="font-weight:bold;min-width:4em;">${hide_translation_symb}</span></span></span>
               </button>
            </td>
            <td class="playBut1">
               <button class="buttonTD2" id="idG_§1§" onclick="onclick_tts_seeWords3(this, §1§)">
					<span style="font-size:2em;height:1.4em;padding:0 0.1em;"><span>${magnifyingGlass_symb}</span></span>
			   </button>
            </td>            
			<td class="playBut1 bordLeft" > 
				<div class="divRowText" style="padding:50%:">
					<div class="suboLine"     style="display:none;" id="idc_§1§">§4txt§</div>
					<div class="cl_paradigma" style="display:none;" id="iddf_§1§">§5dftxt§</div>	
					<div class="tranLine"     style="display:none;" id="idt_§1§">§5txt§</div>				
					<div class="tranLine2"    style="display:none;" id="idt2_§1§">§52txt§</div>				
					<div id="idw_§1§"></div> 
					<div style="display:none;" id="idtts§1§">§ttstxt§</div>
				</div>
			</td>		
			<td class="playBut1 bordLeft" >
               <button class="buttonWhite buttonSpeak" onclick="onclick_anotherLoopType(this,false,true)" >					
					<span id="tyLoop§1§" style="display:none;">0</span>
					<span style="font-size:2em;height:1.4em; display:none;">${loop_symb2}</span>
					<span>no&nbsp;loop</span> 
					<span style="font-size:1.5em;"></span> 
               </button>			   
			   <!--<div style="font-size:0.5em;line-height: 80%;"></div> -->
            </td>          
			
			<td class="playBut1 bordLeft  c_m1g" >
               <button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_row(§1§,false,false,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span><span style="font-size:0.9em;">Orig</span>
               </button>
            </td>
			<td class="playBut1  c_m1g">
               <button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_row(§1§,true,false,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span><span style="font-size:0.9em;">Orig + Tran</span>
               </button>
            </td>
			
            <td class="playBut1  c_m1g">
               <button class="buttonWhite buttonSpeak" onclick="onclick_play_Orig_and_Tran_row(§1§,false,true,§swAlfaHtml§)">
					<span style="font-size:2em;height:1.4em;">${speakinghead_symb}</span>
					<span style="font-size:0.9em;">${word_pause_symb}</span>
					<br><span style="font-size:0.5em;">§spelling§</span>
               </button>			   
            </td>			
			<td class="playBut1 bordLeft">
               <button class="buttonWhite buttonSpeak" onclick="onclick_tts_speech_pause2()">
					<span style="font-size:2em;height:1.4em;">${pause_symb}</span>
               </button>	
            </td>
			<td class="playBut1">
               <button class="buttonWhite buttonSpeak" onclick="onclick_tts_speech_cancel()">
					<span style="font-size:2em;height:1.4em;">${stop_symb}</span>
               </button>			   
            </td>		
            <td class="timerow1 bordLeft">§1§</td>
         </tr>
		 
		 
	` ; // end of prototype_tr_tts
	
	//**
	let prototype_tr_ttsWord = prototype_tr_tts;
	let toFind  = 'style="display:none;" id="idc_§1§">§4txt§</div>';
	let toRepl  = `style="display:block;" id="idc_§1§"><button onclick="onclickSelectWord(1,'§x1§','§4txt§')" class="but_word">§4txt§</button></div>` ;
	
	if (prototype_tr_ttsWord.indexOf( toFind) < 0) {
			console.log("%cerrore prototype word not found", "color:red;"); 
			console.log( errore );	
	} else {
		prototype_tr_ttsWord = prototype_tr_ttsWord.replaceAll(toFind, toRepl); 
	}	
	/**
	console.log("prototype_tr_ttsWord=", prototype_tr_ttsWord); 
	console.log("toFind=", toFind)
	console.log("toRepl=", toRepl)
	**/
//=====================================

	let string_tr_xx = "";		
	let string_tr_xxWord = "";
	
	
	//------------------------
	
	

//-------------------------

//===============================================================================
/*
removeKey(cbc_LOCALSTOR_key)

**
plus_initial_from_localStorage_values();
plus_list_localStorageItems();	

*/
//------------------------------------------------------------------------


function plus_initial_from_localStorage_values() {	
	if (runByGo) console.log("%cGO ENVIRONMENT = " + runByGo, "color:red; font-size:1.5em; font-weight:bold;");  
	else { console.log("%cGO ENVIRONMENT = " + "false", "color:red; font-size:1.5em; font-weight:bold;"); }	
    //----------------------
    // the LS_ ... default values are replaced by the those of the previous session ( if they exist)

    // from localStorage to variables LS_... 
	

    var stored_cbc_localStor;
	try{
		stored_cbc_localStor = JSON.parse(localStorage.getItem(cbc_LOCALSTOR_key)); //get them back
	} catch(e1) {
		stored_cbc_localStor = ""; 
	}
	
	
	
	//console.log("\nXXXXXXXXXXXXXXXXXXXXXXX  INITIAL LOCAL_STORAGE  XXXXXXXXXXXXXXXX, \nplus_initial_from_localStorage_values() ") ;
	//console.log("stored_cbc_localStor.length=", stored_cbc_localStor.length, " VV21=", VV21);
	
	var lenS=0; let nFields = 6; 
	if (stored_cbc_localStor) {
		lenS = stored_cbc_localStor.length; 
		if (lenS > VV21) {  
			//console.log("lenS > VV21=", VV21); 
			sel_voice_ix[0]        = stored_cbc_localStor[VV00];        
			sel_voiceName[0]       = stored_cbc_localStor[VV01];                  
			sel_voiceLangRegion[0] = stored_cbc_localStor[VV02];                   	
			sel_voiceLang2[0]      = stored_cbc_localStor[VV03];                     
			sel_numVoices[0]       = stored_cbc_localStor[VV04];       
			sel_voice_rotate[0]    = stored_cbc_localStor[VV05];   
			sel_voice_exclude[0]   = stored_cbc_localStor[VV06];    
			
			sel_voice_ix[1]        = stored_cbc_localStor[VV10];        
			sel_voiceName[1]       = stored_cbc_localStor[VV11];                  
			sel_voiceLangRegion[1] = stored_cbc_localStor[VV12];                   	
			sel_voiceLang2[1]      = stored_cbc_localStor[VV13];                     
			sel_numVoices[1]       = stored_cbc_localStor[VV14];       
			sel_voice_rotate[1]    = stored_cbc_localStor[VV15]; 			
			sel_voice_exclude[1]   = stored_cbc_localStor[VV16];  
		
			sel_loopTypeSet_str    = stored_cbc_localStor[VV20];   
			sel_begin_fromNumRow_str = stored_cbc_localStor[VV21];  
			//console.log("esegue load_sel_loopTypeSet ()");
			load_sel_loopTypeSet(sel_loopTypeSet_str);  
			
			//console.log("plus initial sel_loopTypeSet_str=", sel_loopTypeSet_str , "\n\t" + " sel_loopTypeSet [0]=",   sel_loopTypeSet.join("\n\t\t") );   
		}
	}

	if (lenS < 1) {
		plus_set_localStorage_var(3);
	}	
	
	//-------------------------------
	
    //plus_list_localStorageItems();	
	if (lenS > 0) set_var_voice_rotate_from_localStore();
	
	try{
		begin_fromNumRow = sel_begin_fromNumRow_str;
	} catch(e1) {
		begin_fromNumRow = 0;
	}	
	document.getElementById("id_toSave_fromNum").value = begin_fromNumRow; 
	scroll_row_intoView( begin_fromNumRow );  	

} // end of initial_from_localStorage_values()
//-------------------------
function scroll_row_intoView( numId ) {
	if (numId < 10) return; 	
	var rowEle = document.getElementById("idtr_" + (numId-1) ); 
	if (rowEle) { 
		rowEle.scrollIntoView();
	} 
	document.getElementById("id_inpRate0").scrollIntoView(); 
} // end of scroll_row_intoView
//----------------------------------------------------------------

function load_sel_loopTypeSet( set_str) {
	
	var mioJ1 = set_str.indexOf("==loop_Tr10") ; var mioJ2 = set_str.indexOf("==loop_", mioJ1) ; 
	//console.log("load_sel_loopTypeSet ()"  , " set_str= ...", mioJ1, " ", mioJ2, " " , set_str.substring(mioJ1, mioJ2) ); 
	set_str = set_str.trim();
	if (set_str == "") return;  
	
	
	
	var index, j2, loopTypeId; 
	
	var mbr = sel_loopTypeSet_str.replaceAll("\n"," ").replaceAll("==loop_","\n"+"==loop_").split("\n"); 
	
	// eg. ==loop_Tr21 ix=3 ::1n=loop r2 ::2r=1 ::3r=1  ::4s= ::5r= ::6t=
								  
	sel_loopTypeSet = [];
	var storeLoop;
	
	for(var f=0; f < mbr.length;f++) {
		storeLoop = mbr[f].trim();		
		
		if (storeLoop == "") continue;		
		if (storeLoop.substring(0,7) != "==loop_") {
			signalError(11);
			continue;
		}													
		j2= storeLoop.indexOf(" ");		
		
		loopTypeId = storeLoop.substring(7,j2);
		//console.log("loopTypeId=", loopTypeId, " ", storeLoop)
		index = loopIndexOfType( loopTypeId );
		if (index < 0) {
			console.log( "load_sel_loopTypeSet () " , storeLoop);
			continue;
		}  
		
		sel_loopTypeSet[index] = storeLoop;
		
		//if (index==1) console.log( "load_sel_loopTypeSet () " , loopTypeId, " index=", index, " ==> sel_loopTypeSet [index] = ", sel_loopTypeSet [index]);		
		
	}
	
} // end of load_sel_loopTypeSet

//------------------------------------------------------------------------

function plus_set_localStorage_var(xx, ltid, sw00, this11) {
	
    var swShow = (xx == 1);
	
	
	if (sel_voiceName == null) return;
	if (sel_voiceName.length < 1) return;
	if (sel_voiceName[0] == "") return;	
	
	//console.log("%cplus_set_localStorage_var", "color:blue;"); console.log("plus_set_localStorage_var(",xx, ") loopTypeId=", ltid , " sw=",sw00, " this1=",this11);  	
	//console.log("sel_voiceName=", sel_voiceName);
	
	var preL = "==loop_" + "num " + sel_loopTypeSet.length + " " ;  
	//console.log("preL=", preL); 
	sel_loopTypeSet_str = preL + sel_loopTypeSet.join(" "); 
	//console.log("sel_loopTypeSet_str=", sel_loopTypeSet_str);

	var cbc_LOCALSTOR_val_list = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
	
	cbc_LOCALSTOR_val_list[ VV00 ] =   sel_voice_ix[0]       ;            
	cbc_LOCALSTOR_val_list[ VV01 ] =   sel_voiceName[0]      ;                            
	cbc_LOCALSTOR_val_list[ VV02 ] =   sel_voiceLangRegion[0];                         	
	cbc_LOCALSTOR_val_list[ VV03 ] =   sel_voiceLang2[0]     ;                             
	cbc_LOCALSTOR_val_list[ VV04 ] =   sel_numVoices[0]      ;    
	cbc_LOCALSTOR_val_list[ VV05 ] =   sel_voice_rotate[0]   ;
	cbc_LOCALSTOR_val_list[ VV06 ] =   sel_voice_exclude[0]  ; 

	cbc_LOCALSTOR_val_list[ VV10 ] =   sel_voice_ix[1]       ;            
	cbc_LOCALSTOR_val_list[ VV11 ] =   sel_voiceName[1]      ;                            
	cbc_LOCALSTOR_val_list[ VV12 ] =   sel_voiceLangRegion[1];                         	
	cbc_LOCALSTOR_val_list[ VV13 ] =   sel_voiceLang2[1]     ;                             
	cbc_LOCALSTOR_val_list[ VV14 ] =   sel_numVoices[1]      ;    
	cbc_LOCALSTOR_val_list[ VV15 ] =   sel_voice_rotate[1]   ;
	cbc_LOCALSTOR_val_list[ VV16 ] =   sel_voice_exclude[1]  ; 
    
	cbc_LOCALSTOR_val_list[ VV20 ] =   sel_loopTypeSet_str;   
	cbc_LOCALSTOR_val_list[ VV21 ] =   sel_begin_fromNumRow_str;

	//if (sel_loopTypeSet_str.indexOf(":50") < 0) { console.log("ERRORE no .:50") }  else { console.log("Esiste anocra :50") }	
	/***
	for(var z1=0; z1 < sel_voice_ix.length; z1++) { 	
		cbc_LOCALSTOR_val_list.push( sel_voice_ix[z1]       );            
		cbc_LOCALSTOR_val_list.push( sel_voiceName[z1]      );                            
		cbc_LOCALSTOR_val_list.push( sel_voiceLangRegion[z1]);                         	
		cbc_LOCALSTOR_val_list.push( sel_voiceLang2[z1]     );                             
		cbc_LOCALSTOR_val_list.push( sel_numVoices[z1]      );    
		cbc_LOCALSTOR_val_list.push( sel_voice_rotate[z1]   );    
    }
	
	cbc_LOCALSTOR_val_list.push( sel_loopTypeSet_str );
	***/
	
	if (runByGo) {
		//console.log("esegue 'scrive su local storage' localStorage_setItemFile(cbc_LOCALSTOR_key, cbc_LOCALSTOR_val_list =" ,  cbc_LOCALSTOR_val_list); 
		localStorage_setItemFile(cbc_LOCALSTOR_key, cbc_LOCALSTOR_val_list );   // vedi _localStorage_routine.js	
	} else { 	
		localStorage.setItem(cbc_LOCALSTOR_key, JSON.stringify(cbc_LOCALSTOR_val_list));
	}
	//console.log("plus_set_localStorage_var () esegue  ocalStorage_setItemFile() "); 
    
	//if (swShow) plus_list_localStorageItems(swShow);

} // end of plus_set_localStorage_var
//------------------------------------------------------------------------------	

function removeKey(key) {
    localStorage.removeItem(key);
	plus_list_localStorageItems();
}
//---------------------------
function remove_localStorageItems() {
	//let cbc_LOCALSTOR_key = "LineByLineV3";
    try {
        for (var i = 0, len = localStorage.length; i < len; i++) {
            var key = localStorage.key(i);
			//console.log("remove key=" + key  + ", cbc_LOCALSTOR_key=" + cbc_LOCALSTOR_key);  
			if (key == cbc_LOCALSTOR_key) {
				console.log("remove key=" + key  + ", cbc_LOCALSTOR_key=" + cbc_LOCALSTOR_key);  
				localStorage.removeItem(key);
				return;
			}	
        }
    } catch (e1) {}
	
} // end of remove_localStorageItems()

//-------------------------------------------------
//remove_localStorageItems()
//list_localStorageItems();
//------------------------------------
function plus_list_localStorageItems(sw1) {	
	if (sw1) 
		try {
			for (var i = 0, len = localStorage.length; i < len; i++) {
				var key = localStorage.key(i);
				if (key == cbc_LOCALSTOR_key) { 
					var value = localStorage[key];
					console.log("localStorage key=" + key + "\t = " + value.split("==loop_").join("\n\t") );
					//console.log("localStorage key=" + key + "\t = " + (value.split(",")).join("\t")  );
					return; 
				}
			}
		} catch (e1) {}
} // end of list_localStorageItems()
//-------------------------------------------------

function set_var_voice_rotate_from_localStore() {
	
	document.getElementById( "origSelVox" ).checked = sel_voice_rotate[0]; 
	document.getElementById( "tranSelVox" ).checked = sel_voice_rotate[1]; 
	
	if (sel_voice_rotate[0]) document.getElementById( "origSelVox" ).checked = true; 
	else document.getElementById( "origSelVox2" ).checked = true; 
		
	if (sel_voice_rotate[1]) document.getElementById( "tranSelVox" ).checked = true; 
	else document.getElementById( "tranSelVox2" ).checked = true; 

	/**
	console.log("XXX PROVA set_var_voice_rotate_FROM_localStore  ", " sel_voice_rotate[0]=" + sel_voice_rotate[0] + 
		", document.getElementById( 'origSelVox' ).checked =" +  document.getElementById( "origSelVox" ).checked ,
		", document.getElementById( 'origSelVox2' ).checked =" +  document.getElementById( "origSelVox2" ).checked , 
	"\n\t sel_voice_rotate[1]=" + sel_voice_rotate[1] + 
		", document.getElementById( 'tranSelVox' ).checked =" +  document.getElementById( "tranSelVox" ).checked ,
		", document.getElementById( 'tranSelVox2' ).checked =" +  document.getElementById( "tranSelVox2" ).checked 	); 
	**/	
} // end of set_var_voice_rotate_from_localStore

//------------

function set_var_voice_rotate_to_localStore() {
	
	sel_voice_rotate[0] = document.getElementById( "origSelVox" ).checked; 
	sel_voice_rotate[1] = document.getElementById( "tranSelVox" ).checked; 

	/**
	console.log("XXX PROVA set_var_voice_rotate_TO_localStore  ", " sel_voice_rotate[0]=" + sel_voice_rotate[0] + 
		", document.getElementById( 'origSelVox' ).checked =" +  document.getElementById( "origSelVox" ).checked ,
			", document.getElementById( 'origSelVox2' ).checked =" +  document.getElementById( "origSelVox2" ).checked 	, 
		"\n\t sel_voice_rotate[1]=" + sel_voice_rotate[1] + 
			", document.getElementById( 'tranSelVox' ).checked =" +  document.getElementById( "tranSelVox" ).checked ,
			", document.getElementById( 'tranSelVox2' ).checked =" +  document.getElementById( "tranSelVox2" ).checked 	); 
	**/

	plus_set_localStorage_var(4);
	
}
//------------
	

//--------------------------------------
function sayVoiceNum(textX, numLang, ixVoice, volumeX, rateX, pitchX) {
	
	return new Promise((resolve) => {
		//console.log("sayVoiceNum promise ", textX, ixVoice, volumeX, rateX, pitchX);
		
		//if (elemsg) elemsg.innerHTML = "lettura nn." + z
		
		let objtxt_to_speak = new SpeechSynthesisUtterance(textX);
		
		//console.log("sayVoiceNum()" ," numLang=", numLang, " ixVoice=", ixVoice);
		//console.log(" listVoxL[numLang][ixVoice]=",  listVoxL[numLang][ixVoice])
		
		
		var myVoice = listVoxL[numLang][ixVoice][1];  // [vox.lang, vox]
 	
		//let voice_lang2 = myVoice.lang.substr(0, 2);
		objtxt_to_speak.voice = myVoice;
		objtxt_to_speak.volume = volumeX;
		objtxt_to_speak.rate = rateX;
		objtxt_to_speak.pitch = pitchX;
		synth.speak(objtxt_to_speak);
		/**
		console.log("sayVoceNum (", textX, " numLang=", numLang," ixVoice=", ixVoice, " volume=", volumeX, " rate=", rateX, " pitch=", pitchX,
							" rate input range=", document.getElementById("id_inpRate0").value, 
							" inner=", document.getElementById("id_inpRate0").parentElement.parentElement.innerHTML, " speechRate=", speechRate);  
		**/
		objtxt_to_speak.onend = function() {
			//nn++;
			//console.log("resolve " + nn +" "+ msg5    +" " +  "  finito di leggere ", textX);
			resolve();
		};
		
	});
} // end of sayVoiceNum

//---------------------------------------------

	
//-------------------------------------------
	
function rotateVoice( numLang ) {
	
	let listIdSelVox = ["origSelVox","tranSelVox"];		
	let ixVoice0V = 0;
	
	//console.log( "onclick_play_Orig_and_Tran_row ()    totNumSelVoices=", totNumSelVoices); 
	var voice_ix; 
	let v = numLang;
	
	//console.log("rotateVoice  v=", v);  
	//console.log('listVoxL[",v,"] lenght=', listVoxL[v].length);   
	if (document.getElementById( listIdSelVox[v] ).checked) {  // if only the selected voice
		ixVoice0V = listVoxL_selVoxIx[v];		// indice della voce scelta (riga Seleziona) nella lista delle voci listVoxL	
	} else {
		var maxN  = totNumSelVoices[v];
		var nowIx = lastNumSelVoice[v]; 
		//if (v==1) console.log("\n1 rotateVoice ", " totNumSelVoices[v] =",   totNumSelVoices[v], " = maxN, nowIx = lastNumSelVoice[v] =",  lastNumSelVoice[v]);  
		if (nowIx >= maxN) nowIx=0;
		ixVoice0V = nowIx;	
		
		for(var h=0; h < maxN; h++) {
			//console.log("nowIx=", nowIx); console.log("listVoxL[v][nowIx].length=", listVoxL[v][nowIx].length);   
			if (listVoxL[v][nowIx][2]) {  // eg. [ en-En, voiceObject, checked/unchecked ]     checked false ==> the voice cannot be used 
				lastNumSelVoice[v] = nowIx;	
				//if (v==1) console.log("   2 rotateVoice ", " h=", h, "  lastNumSelVoice[v] =",  lastNumSelVoice[v]);  
				ixVoice0V = nowIx;	
				//if (v==1) console.log("   3 rotateVoice ", " h=", h, "  voce usata ",  listVoxL[v][nowIx][1].name , "   ixVoice0V =", ixVoice0V); 
				//console.log(" voce USATA ",  listVoxL[v][nowIx][1].name ) 
				break;
			} 
			//console.log(" SCARTATA voce ",  listVoxL[v][nowIx][1].name ) 
			nowIx++;					
			if (nowIx >= maxN) nowIx=0;
			//if (v==1) console.log("   4 rotateVoice ", " nowIx =", nowIx)
		}
		lastNumSelVoice[v] = (1+nowIx); 
		//if (v==1) console.log("   5 rotateVoice ", " lastNumSelVoice[v] =",  lastNumSelVoice[v]);  
	}
	var g1= ixVoice0V;
	//if (v==1) console.log("   6 rotateVoice ", " ixVoice0V=", g1) 
	var voice_g = listVoxL[v][g1][1];  // [vox.lang, vox, checked/unchecked]
	document.getElementById("showVoice_" + v).innerHTML = voice_g.name; 
	//console.log("voce indice =", ixVoice0V, " per ", ["orig","tran"][v] );  
		
	return ixVoice0V; 
	
} // end of rotateVoice

//--------------
function boldWord( word1 ) {
	return '\n<span class="cl_evidWord">' + word1 + '</span>\n';
}
//-----------------------------------------------------------------
function trovataUnaParola(ele_orText, unaParola) {
	// <div class="suboLine" style="display:block;" id="idc_502">RIGA TRE Du Uno siehst schlecht  aus! Was hast uno du?</div>
	if (unaParola == undefined) return;	
	if (unaParola == "") return;		
	
	var rigaOrig = ele_orText.innerHTML;	
	var rigaEvid = rigaOrig;		
	
	if (ele_orText.children.length == null) {  // la riga in questa sessione non è mai stata elaborata 
			ele_orText.innerHTML = '<span style="display:none;">' + rigaOrig + "</span>\n" + '<span>' + rigaEvid + "</span>";  
	} else {
		if (ele_orText.children.length < 2) {
			ele_orText.innerHTML = '<span style="display:none;">' + rigaOrig + "</span>\n" + '<span>' + rigaEvid + "</span>"; 
		} else { // la riga in questa sessione è già stata elaborata ( una o più parole sono state già evidenziate)	
			rigaOrig =  ele_orText.children[0].innerHTML;	
			rigaEvid =  ele_orText.children[1].innerHTML;
		}	
	}	
	
	rigaEvid  = highlight_aWord_inText(rigaEvid, unaParola, "cl_evidWord", charList); 
	/**
	
	var unaParolaLw   = unaParola.toLowerCase() ; 
	var unaParolaUpUp = unaParola.toUpperCase();  
	var unaParolaUp1  = unaParola.substr(0,1).toUpperCase() + unaParola.substring(1).toLowerCase();   
	var evidLw    = boldWord(unaParolaLw  ) ;
	var evidUpUp  = boldWord(unaParolaUpUp) ;
	var evidUp1   = boldWord(unaParolaUp1 ) ;
		
	if (rigaEvid.indexOf(evidLw)   < 0) rigaEvid = rigaEvid.replaceAll( unaParolaLw,   evidLw   );
	if (rigaEvid.indexOf(evidUpUp) < 0) rigaEvid = rigaEvid.replaceAll( unaParolaUpUp, evidUpUp );
	if (rigaEvid.indexOf(evidUp1)  < 0) rigaEvid = rigaEvid.replaceAll( unaParolaUp1,  evidUp1  );
	**/
	ele_orText.children[0].innerHTML = rigaOrig;	
	ele_orText.children[1].innerHTML = rigaEvid;
	//console.log(" trovata ", unaParola,  " in ", rigaOrig); 
	
} // end of trovataUnaParola
//-----------------------------------------------
function getInner_idc( ele_orText ) {
	var origText; 
	try{ 
		if (ele_orText.children.length > 0) {
			origText = ele_orText.children[0].innerHTML.toLowerCase();
			//console.log(ele_orText.id + " children origText children[0] =", origText);  
		} else {
			origText = ele_orText.innerHTML.toLowerCase();	
			//console.log(ele_orText.id + " NO children origText =", origText);  
		}
	} catch(e1) {
		console.log("%cerrore in getInner_idc ","color:red;");
		console.log("ele_orText=", ele_orText); 
		console.log(errore); // provoca ERRORE
		return ""; 	
	}
	return origText; 
}
//------------------------------------------
function onclickSelectWord(tipo,id1,unaParola) {
	/*
	tipo=1,   una sola parola da cercare
	tipo=2,   unaParola e altreParole sono id di textarea che contengono lista di parole  	
	*/
	//console.log("onclickSelectWord(tipo=", tipo, " id1=",id1," unaParola=", unaParola,  "  fromIxToIxLimit = ", fromIxToIxLimit[0] +", " +  fromIxToIxLimit[1] );
	if (salvaSel_fromIxToIxLimit[0] < 0) salvaSel_fromIxToIxLimit = fromIxToIxLimit.slice(); 

	var wordLista1 = "", wordLista2=""; 
	var ele_lista1 , ele_lista2;  
	
	var idMsg = "err_" + id1;
	var eleMsg = document.getElementById(idMsg);  
	if (eleMsg)  eleMsg.style.display ="none";
	
	if (tipo == 2) {
		var id_wordLista1 = "idwS1_" + id1; 
		var id_wordLista2 = "idwS2_" + id1; 
		ele_lista1 = document.getElementById(id_wordLista1);  
		ele_lista2 = document.getElementById(id_wordLista2);  
		if (ele_lista1) wordLista1 = ele_lista1.value;
		if (ele_lista2) wordLista2 = ele_lista2.value;	
	} 
	if (tipo == 1) {
		wordLista1 = unaParola; 	
	} 
	//console.log("1 wordLista1  = ", wordLista1 , "\n", "1 wordLista2  = ", wordLista2);  
	/**
	wordLista1 = wordLista1.toLowerCase().replaceAll("\t"," ").replaceAll("\r"," ").replaceAll("\n"," ").replaceAll(","," ").replace(/\s+/g, " ").trim();  
	wordLista2 = wordLista2.toLowerCase().replaceAll("\t"," ").replaceAll("\r"," ").replaceAll("\n"," ").replaceAll(","," ").replace(/\s+/g, " ").trim(); 
	if (wordLista1 == "") paroleDaCercare1 = [];
	if (wordLista2 == "") paroleDaCercare2 = [];	
	**/
	var paroleDaCercare1 = getListOfWords_inText(wordLista1, charList);
	var paroleDaCercare2 = getListOfWords_inText(wordLista2, charList);		
	var numParole1 = paroleDaCercare1.length;
	var numParole2 = paroleDaCercare2.length;
	//console.log("paroleDaCercare 1:[", paroleDaCercare1.join(". ") , "]  2:[", paroleDaCercare2.join(". ") , "]" ); 
	
	var tabBody = document.getElementById("id_tabSub_tbody");
	var numRows = tabBody.children.length;
	var numFirst = -1, numLast = -1;
	var swSomeFound1 = false; var swSomeFound2 = false; 
	//---------------	
	for(var v = 0; v < numRows; v++) {
		//console.log("v=", v); 
		var eleRow = tabBody.children[v];
		if (eleRow == null) continue;
		
		//eleRow.classList.add("hideForNow");   
		var idtr1 = eleRow.id; 
		if (idtr1.substr(0,5) != "idtr_") continue;   
		var tr_num = idtr1.substring(5);
		if (tr_num.indexOf("_m") > 0) {
			eleRow.style.display = "none";
			continue;
		}	
		eleRow.classList.add("hideForNow");   
		
		var ele_orText = document.getElementById( "idc_" + tr_num );  
		var origText = getInner_idc( ele_orText ); 
		
		/**
		var orig_riga3 = origText.toLowerCase().replace(/[.,?!<>()]/g, " ").replace(/\s+/g, " ").trim();  		
		var paroleDellaFrase = orig_riga3.split(" ");  
		**/
		var paroleDellaFrase = getListOfWords_inText(origText, charList);
	
		var swFound1=false; var swFound2 = false; 
		
		if (numParole1 == 0) {swFound1 = true; swSomeFound1 = true; } 
		if (numParole2 == 0) {swFound2 = true;; swSomeFound2 = true; }  
		var targWord1, targWord2; 
		var w1, w2; var unaParolaDellaFrase;
		if (swFound1 == false) {
			for(var p=0; p < paroleDellaFrase.length; p++) {
				unaParolaDellaFrase = paroleDellaFrase[p]; 			
				for (w1=0;w1 < numParole1; w1++) {
					if ( paroleDaCercare1[w1] == unaParolaDellaFrase) {targWord1= unaParolaDellaFrase; swFound1=true; break; }
				}  
				if (swFound1) { //console.log(" trovata parola1 ",unaParolaDellaFrase ); 
					swSomeFound1 = true; 
					break; 
				}
			} 
		}
		if (swFound2 == false) {
			for(var p=0; p < paroleDellaFrase.length; p++) {
				unaParolaDellaFrase = paroleDellaFrase[p]; 			
				for (w2=0;w2 < numParole2; w2++) {
					if ( paroleDaCercare2[w2] == unaParolaDellaFrase) {targWord2 = unaParolaDellaFrase; swFound2=true; break; }
				} 	
				if (swFound2) { //console.log(" trovata parola2 ",unaParolaDellaFrase ); 
					swSomeFound2 = true; 					
					break; 
				}
			} 
		}
		//console.log("1 swFound1=", swFound1 , "   ", " swFound2=", swFound2, " swFound1 && swFound2=", (swFound1 && swFound2) ) 
		if ((swFound1 && swFound2) == false) {
			if ((numParole1 == 1) && (numParole2 > 0)) {
				swFound1 = false; 
				swFound2 = false; 
				var parola11 = paroleDaCercare1[0]; 
				for(var p=0; p < paroleDellaFrase.length; p++) {
					unaParolaDellaFrase = paroleDellaFrase[p]; 	// es. ab + gegangen = abgegangen		
					for (w2=0;w2 < numParole2; w2++) {
						if ( parola11 + paroleDaCercare2[w2] == unaParolaDellaFrase) {  
							//console.log(" trovata parola1+parola2 ",unaParolaDellaFrase , " ( parola1=" + parola11 , " + " + paroleDaCercare2[w2] ); 
							targWord2 = unaParolaDellaFrase;  
							swFound2=true; 
							break; 
						}
					} 	
					if (swFound2) {
						break; 
					}
				} 
				if (swFound2) {swFound1 = true}  
			} 
		}	
		
		//console.log("2 swFound1=", swFound1 , "   ", " swFound2=", swFound2, " swFound1 && swFound2=", (swFound1 && swFound2) ) 
		if (swFound1 && swFound2) {
			//console.log("la frase ", tr_num, " contiene le parole richieste: ", origText);	
		} else {
			continue;
		}
		
		var eleW   = document.getElementById( "idw_" + tr_num );  
		//console.log("3 swFound1=", swFound1 ,  " swSomeFound1=", swSomeFound1); 
		
		var eleW   = document.getElementById( "idw_" + tr_num );  
	
		if (eleW) eleW.innerHTML = "";
		
		if (swFound1) trovataUnaParola(ele_orText, targWord1);	
		if (swFound2) trovataUnaParola(ele_orText, targWord2);	
		
		//if (eleRow.style.display == "none")  eleRow.style.display = "table-row";
		if (eleRow.classList.remove("hideForNow")) 
		ele_orText.style.display = "block"; 	
		if (numFirst < 0) numFirst = tr_num; 
		numLast = tr_num;
		//console.log("5 v=", v, "  idtr1=", idtr1, " tr_num=", tr_num, " numFirst=", numFirst, "  numLast=", numLast); 
		//var eleRowM2 = document.getElementById( idtr1 + "_m2"); 
		//var eleRowM1 = document.getElementById( idtr1 + "_m1"); 
	}	
	//---------------------
	var msgErr="";
	if (swSomeFound1 == false)  {
		if (wordLista1 != "") 
			if (ele_lista1){ 
				ele_lista1.value = wordLista1 + " XXX  NOT FOUND XXX"; 
				msgErr+=  wordLista1 + "  NOT FOUND "; 
			}
	} 
	if (swSomeFound2 == false)  {
		if (wordLista2 != "") 
			if (ele_lista2) { 
				ele_lista2.value = wordLista2 + " XXX  NOT FOUND XXX"; 
				msgErr+=  "<br>" + wordLista2 + " NOT FOUND "; 
			}	
	} 
	if (msgErr != "") {		
		if (eleMsg) {
			eleMsg.innerHTML = msgErr;
			eleMsg.style.display ="block";
		}				
	}
	
	//--------------
	if (numFirst < 0) {
		onclickResetHideForNow(-1);
		return;
	}		
	//console.log("numRows=", numRows, "  numFirst=", numFirst, "  numLast=", numLast); 
	if (document.getElementById("b1_" + numFirst) == null) console.log("errore manca id  b1_" + numFirst); 
	if (document.getElementById("b2_" + numLast ) == null) console.log("errore manca id  b2_" + numLast ); 
	onclick_tts_arrowFromIx(  document.getElementById("b1_" + numFirst), numFirst) ; 
	onclick_tts_arrowToIx(    document.getElementById("b2_" + numLast ), numLast ) ; 
	
	//document.getElementById("idtr_" + numFirst).style.display = "table-row"; 
	document.getElementById("idtr_" + numFirst).classList.remove("hideForNow");  
	if (document.getElementById("resetHideForNow_" + numFirst) ) {
		document.getElementById("resetHideForNow_" + numFirst).style.display = "block"; 
	}
	
	document.getElementById( "idtr_" + numFirst + "_m1").scrollIntoView();
	
} // end of onclickSelectWord
//--------------------------------
function onclickResetHideForNow(numId1) {
	var tabBody = document.getElementById("id_tabSub_tbody");
	var numRows = tabBody.children.length;
	var ele_numEndGr; 
	if (numId1 >=0) { 
		ele_numEndGr = document.getElementById("id_end_" + numId1);
		//console.log("ele_numEndGr=", ele_numEndGr.innerHTML); 
		document.getElementById("resetHideForNow_" + numId1).style.display = "none"; 
		document.getElementById("idtr_" + numId1+ "_m2").style.display = "none"; 
		document.getElementById("idtr_" + numId1+ "_m1").style.display = "none"; 
	}
	if (salvaSel_fromIxToIxLimit[0] >= 0) {
		//console.log("resetHide    numId1=", numId1, " salvaSel_fromIxToIxLimit=", salvaSel_fromIxToIxLimit[0], " ", salvaSel_fromIxToIxLimit[1] ); 
		fromIxToIxLimit = salvaSel_fromIxToIxLimit.slice();
		salvaSel_fromIxToIxLimit = [-1, -1];
	}
	var oldFrom, oldTo;
	[oldFrom, oldTo] = fromIxToIxLimit; 
	
	//console.log("onclickResetHideForNow  oldFrom=", oldFrom, " oldTo=", oldTo);
	
	document.getElementById("idtr_" + oldFrom + "_m2").style.display = "table-row"; 
	document.getElementById("idtr_" + oldFrom + "_m1").style.display = "table-row";  
	
	//if (document.getElementById("idtr_" + oldTo + "_m2") )  document.getElementById("idtr_" + oldTo + "_m2").style.display = "table-row"; 
	
	var oldDisplay0 = document.getElementById("idb_" + oldFrom + "_m").children[0].style.display; 
	var oldDisplay1 = document.getElementById("idb_" + oldFrom + "_m").children[1].style.display; 
	
	//console.log("oldDiplay0=", oldDisplay0) ; console.log("oldDiplay1=", oldDisplay1) 
	
	if (numId1 >=0) { 
		if (ele_numEndGr) {
			var idEnd = 1 + 1*ele_numEndGr.innerHTML; 
			if (idEnd >= numRows) idEnd = numRows-1; 
			var ele_endGr = document.getElementById("idtr_" + idEnd + "_m2");
			if (ele_endGr) ele_endGr.style.display = "none"; 
		}
	}
	document.getElementById("id_showLoop").innerHTML = ""; 
	
	//onclick_tts_arrowFromIx(  document.getElementById("b1_" + oldFrom), oldFrom) ; 
	//onclick_tts_arrowToIx(    document.getElementById("b2_" + oldTo  ), oldTo  ) ; 	
	//-----------------
	for(var v = 0; v < numRows; v++) {
		var eleRow = tabBody.children[v];
		if (eleRow == null) continue;		
		if (eleRow.classList.contains("hideForNow")) {
			eleRow.classList.remove("hideForNow");   
		} 
		/**
		if (( v < oldFrom) || (v > oldTo)) continue;
		
		document.getElementById("idb_" + v).children[0].style.display = oldDisplay0; 
		document.getElementById("idb_" + v).children[1].style.display = oldDisplay1; 
		
		if (eleRow.id.indexOf("_m") >= 0) continue;
		
		var idcId = "idc_" + eleRow.id.substring(5);
		var eleTxt = document.getElementById( idcId );				
		if (eleTxt == null) continue;
		
		if (eleTxt.children.length > 0) { // il testo è diviso in due sezione: la prima col testo originale ed il secondo con parole evidenziate
			eleTxt.innerHTML = eleTxt.children[0].innerHTML; 
		}	
		eleTxt.style.display = oldDisplay0; 	
		**/			
	} // end for v 
	//----
	onclick_tts_arrowFromIx(  document.getElementById("b1_" + oldFrom), oldFrom) ; 
	onclick_tts_arrowToIx(    document.getElementById("b2_" + oldTo  ), oldTo  ) ; 	
	
	var ele1_from = document.getElementById("idb_" + oldFrom + "_m"); 
	//console.log("1 ele1_from.outer=", ele1_from.outerHTML); 
	
	ele1_from.children[0].style.display	= oldDisplay1; // display scambiato perchè il click è alternato 
	//console.log("2 ele1_from.outer=", ele1_from.outerHTML); 	
	onclick_tts_OneClipRow_showHide_sub( ele1_from, true);
	//console.log("3 ele1_from.outer=", ele1_from.outerHTML); 	
	//------------------------------------------
	var numView=0; 
	try{ numView = document.getElementById("id_toSave_fromNum").value; } catch(e1) {}
	if (oldFrom > numView) numView = oldFrom;
	scroll_row_intoView( numView );  	
	
	
} // end of onclickResetHideForNow 

//-------------------------------------------------
function onclick_tts_changeRate(this1,nVox) {
	var rate = parseFloat(this1.value).toFixed(1);
	if(rate < 0.30) rate = 0.30;	
	//console.log(["voce lingua orig","voce traduzione"][nVox] , " " , " rate=", rate); 
	//last_rate = rate;
	this1.value = rate;
	speechRate[nVox] = rate;
	var thisTD = this1.parentElement.parentElement;
	thisTD.children[0].innerHTML = rate; 
	//if(last_objtxt_to_speak) last_objtxt_to_speak.rate = rate;
	//var thisTD = this1.parentElement;
	//var preTD = thisTD.parentElement.children[1];
	//preTD.innerHTML = rate;
}

//---------------------------------------

function onclick_tts_changeVolume(this1,nVox) {
	var volume = parseFloat(this1.value).toFixed(1);
	//console.log(["voce lingua  orig","voce traduzione"][nVox] , " " , "volume=", volume)
	speechVolume[nVox] = volume;  
	var thisTD = this1.parentElement.parentElement;
	thisTD.children[0].innerHTML = volume; 
} //	

//---------------------------------------
function onclick_tts_changePitch(this1,nVox) {
	var pitch = parseFloat(this1.value).toFixed(1);
	//console.log(["voce lingua orig","voce traduzione"][nVox] , " " , "pitch=", pitch)
	if(pitch < 0.1) { pitch = 0.1; 	this1.value = pitch;}
	//speech_pitch = pitch;
	speechPitch[nVox] = pitch;
	var thisTD = this1.parentElement.parentElement;
	thisTD.children[0].innerHTML = pitch; 
	//if(last_objtxt_to_speak) last_objtxt_to_speak.rate = pitch;	
	//var preTD = thisTD.parentElement.children[1];
	//preTD.innerHTML = pitch;
}
//----------------------------------
function onclick_tts_speech_pause2() {
	if (sw_pause) {	
		window.speechSynthesis.resume();
		synth.resume();
		sw_pause = false;
	} else {
		if(synth.speaking) {
			sw_pause = true;
			synth.pause();
		}	
	} 
} // end of onclick_tts_speech_pause2
//--------------------------------------------

//---------------------
function onclick_tts_speech_resume() {
	//console.log("resume"); 
	sw_pause = false;
	window.speechSynthesis.resume();
	synth.resume();
}
//----------------------
function onclick_tts_speech_cancel() {
	//console.log("*** cancel ***"); 
	sw_cancel = true;
	if(synth.speaking) {
		synth.cancel();
	}
}

//----------------------------------------------------------------------------------------


	
	const IX_ORIG = 0;
	const IX_TRAN = 1;
	const IX_SOUND   = 8;
	const IX_SetMSG  = 9;
	
	var tot_ixsound=0, tot_ixorig=0, tot_ixtran=0, tot_ixsetmsg=0;
	
	const soundFreq = [130, 146, 164, 174, 195, 220, 246, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.9, 523.7, 587.3, 659.3 ];  
	
//let eleRadioTmsg;
//let radioT_buttons ;
//let radioT_msgList = [];

let righeDaLeggere = [];

//let thisLineList_nRepeat = [3,3,2,1] ;
//let thisLineList_nRighe;
//let thisLineList_nRepeat;
//let thisLineList_nome;

let thisLineList_loopType0		= "";  
let thisLineList_nome0    		= "";  
let thisLineList_nRighe0  		= 0; 
let thisLineList_nRepeat0 		= 0;
//let thisLineList_swSepar0 		= [];  
let thisLineList_swSpeedReduce0	= [];  
let thisLineList_swWordByWord0	= [];  
let thisLineList_swTran0  	    = []; 
let thisLineList_swShowOrig0   	= []; 	
let	thisLineList_swShowTran0   	= []; 	

let thisLineList_loopType1		= "";  
let thisLineList_nome1    		= "";  
let thisLineList_nRighe1  		= 0; 
let thisLineList_nRepeat1 		= 0;
//let thisLineList_swSepar1 		= [];  
let thisLineList_swSpeedReduce1	= []; 
let thisLineList_swWordByWord1	= [];  
let thisLineList_swTran1  	    = []; 
let thisLineList_swShowOrig1   	= []; 	
let	thisLineList_swShowTran1   	= []; 	

let thisLineList_loopType2		= "";  
let thisLineList_nome2    		= "";  
let thisLineList_nRighe2  		= 0; 
let thisLineList_nRepeat2 		= 0;
//let thisLineList_swSepar2 		= [];  
let thisLineList_swSpeedReduce2	= [];  
let thisLineList_swWordByWord2	= [];  
let thisLineList_swTran2  	    = []; 
let thisLineList_swShowOrig2   	= []; 	
let	thisLineList_swShowTran2   	= []; 	

//let ele_say ;

//-------------------------
//let spaz="&nbsp;&nbsp;&nbsp;"; 

 
//let nn=0;
//let voices; 

//=================================
/**
let eleTabHloop ;
let ele_rLoopT0 ; 
let ele_rLoopT1 ; 
let ele_rLoopT2  ; 
let ele_rLoopTg0  ; 
let ele_rLoopTg1  ; 
let ele_rLoopTg2  ; 
let rLoopT_listEle;  // 5 elements = 3 riga + 3 gruppo
//let rLoopT_list ;    // 5 elements = 3 riga + 3 gruppo
let rLoopT_listHButt ;    // 5 elements = 3 riga + 3 gruppo
***/
//let rLoopT_limit;

let txLoopT_limit_nome    = [];
let txLoopT_limit_loopType = [];
let txLoopT_limit_nRighe  = []; 
let	txLoopT_limit_nRepeat = []; 	

//let	txLoopT_limit_swSepar       = []; 
let	txLoopT_limit_swSpeedReduce = [];
let	txLoopT_limit_swWordByWord  = [];
let	txLoopT_limit_swTran        = []; 	
let	txLoopT_limit_swShowOrig    = []; 	
let	txLoopT_limit_swShowTran    = []; 

let  listRadioPF;
//-----------------------------------	
function setNew_varLoop_and_PF() {	
	//set_var_loop1() ;
	//set_var_rLoopT();
	//set_var_loop2()
	
	load_loop_parameters_fromHTML_to_vars(2);
	
	listRadioPF = document.getElementsByName('radioPF');	
	setInitVarVoice();		
}	

//===================
/**
function set_var_loop1() {
	//console.log("2set_var_loop1  idTabHloop  ", document.getElementById("idTabHloop").innerHTML )
	

	eleRadioTmsg = document.getElementById("rLoopMsg");
	radioT_buttons = document.getElementsByName('radioT');
	radioT_msgList = [
		"legge la riga una sola volta",
		"ripete la lettura della riga", 
		"ripete la lettura della riga e poi ripete anche con righe precedenti"	
	] ;

	for(let i = 0; i < radioT_buttons.length; i++){
		radioT_buttons[i].addEventListener('change', function(){
			eleRadioTmsg.innerHTML =  radioT_msgList[i];
		});
	}
	for(let i = 0; i < radioT_buttons.length; i++){
		if (radioT_buttons[i].checked) {
			eleRadioTmsg.innerHTML =  radioT_msgList[i];
			break;
		}
	}	
}// end of 	set_var_loop1
***/
//--------------------------------------------
function setInitVarVoice() {
	
	onclick_tts_changeRate(   document.getElementById("id_inpRate0" ), 0) ;
	onclick_tts_changeRate(   document.getElementById("id_inpRate1" ), 1) ;
	
	onclick_tts_changeVolume( document.getElementById("id_inpVol0"  ), 0) ;
	onclick_tts_changeVolume( document.getElementById("id_inpVol1"  ), 1) ;
	
	onclick_tts_changePitch(  document.getElementById("id_inpPitch0"), 0) ;
	onclick_tts_changePitch(  document.getElementById("id_inpPitch1"), 1) ;
}	

//--------------------------------------

function onclick_play_Orig_and_Tran_row(numId0,swOrigAndTran, swPause,swAlfa) {   


	let numId = parseInt(numId0);
	
	let eleTyLoop = document.getElementById("tyLoop" + numId);
	let eleTyLoop_button = eleTyLoop.parentElement;
	
	let ele_showWh = eleTyLoop_button.children[3];
	
	
	onclick_anotherLoopType( eleTyLoop_button, false, false);             // get type loop and copy to thisLineList_nRepeat0, ...  
	
	//console.log( "tran_row (1) ",   thisLineList_nome1, " thisLineList_nRighe1=", thisLineList_nRighe1, " tr20 (2) ",   thisLineList_nome2," thisLineList_nRighe2=", thisLineList_nRighe2);
	
	
	var typL = eleTyLoop_button.children[0].innerHTML;	
	var tXXX = typeList[ parseInt( typL )  ];
	
	//console.log("%conclick_play_Orig_and_Tran_row () ","color:blue;"); console.log("\nxxxx ROW onclick_play_Orig_and_Tran_row (numId=", numId,  " typL =" + typL + "<==   tXXX="  + tXXX + "<==");  

	
	righeDaLeggere = [];
	tot_ixsound=0; tot_ixorig=0; tot_ixtran=0; tot_ixsetmsg=0;
	
	
	//var mms1;
	var minNumId = numId ;	
	let ele_txtOrig = document.getElementById("idc_" + numId);
	let ele_txtTran = document.getElementById("idt_" + numId);
	
	//console.log("onclick ...   numid=", numId, "  thisLineList_swShowOrig0=", thisLineList_swShowOrig0, "  thisLineList_swShowOrig1=", thisLineList_swShowOrig1, "  thisLineList_swShowOrig2=", thisLineList_swShowOrig2 ); 
	
	switch (tXXX) {
		case "Tr00":	
			minNumId = numId ;			
			/**
			console.log("%conclick_play_Orig_and_Tran_row ()  Tr00 noLoop ", "color:blue;");  	
			console.log("accumRowToPlay(0, ", "minNumId, numId0, swOrigAndTran=", swOrigAndTran, " swPause=",swPause, " swAlfa=",swAlfa,  
							"thisLineList_loopType0=", thisLineList_loopType0,  " thisLineList_nome0=", thisLineList_nome0, 
							thisLineList_nRighe0, 
							" thisLineList_nRepeat0=",thisLineList_nRepeat0, 
							" thisLineList_swSpeedReduce0=", thisLineList_swSpeedReduce0, 
							" thisLineList_swWordByWord0=", thisLineList_swWordByWord0, 
							" thisLineList_swTran0=", thisLineList_swTran0,
							thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG" );		
			**/					
			accumRowToPlay(0, minNumId, numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType0,  thisLineList_nome0, 
							thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, thisLineList_swTran0,
							thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG",
							0, 0, 0,0);
			play_accum(7,"TR00", swOrigAndTran);				
			return;	
		case "Tr10":	
			minNumId = numId ;	
			/**
			console.log("%conclick_play_Orig_and_Tran_row ()  Tr10 r1 ", "color:blue;");  			
			console.log("accumRowToPlay(1, ", "minNumId, numId0, swOrigAndTran=", swOrigAndTran, " swPause=",swPause, " swAlfa=",swAlfa,  
							"thisLineList_loopType0=", thisLineList_loopType0,  " thisLineList_nome0=", thisLineList_nome0, 
							thisLineList_nRighe0, 
							" thisLineList_nRepeat0=",thisLineList_nRepeat0,  
							" thisLineList_swSpeedReduce0=", thisLineList_swSpeedReduce0, 
							" thisLineList_swWordByWord0=", thisLineList_swWordByWord0, 
							" thisLineList_swTran0=", thisLineList_swTran0,
							thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG" );		
			**/
			accumRowToPlay(1, minNumId, numId0, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType0,  thisLineList_nome0, 
							thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, thisLineList_swTran0,
							thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG",
							0, 0, 0, 0);
			play_accum(8,"Tr10", swOrigAndTran);				
			return;	
		case "Tr20":	
			row_r20();
			break;
		default:
			return;	
	} // end of switch
	//---------------	
	async function row_r20() {
		// qui siamo al tipo R2 che comprende 3 elabor. 
		minNumId = numId ;	
		//mms1 = thisLineList_nRepeat0 + " volte "; 
		//if (thisLineList_nRepeat0 == 1) mms1 = "1 volta "; 
		accumRowToPlay(1, minNumId, numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType0,  thisLineList_nome0, 
								thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, thisLineList_swTran0 , 
								thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG",
								0, 0, 0 ,0);
		
		minNumId = numId - thisLineList_nRighe1;  
		if (minNumId < 0) { 
			minNumId = 0;  		
		}
		
		//mms1 = thisLineList_nRepeat1 + " volte "; 
		//if (thisLineList_nRepeat1 == 1) mms1 = "1 volta "; 
		accumRowToPlay(2, minNumId, numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType1,  thisLineList_nome1, 
								thisLineList_nRighe1, thisLineList_nRepeat1, thisLineList_swSpeedReduce1, thisLineList_swTran1 ,  
								thisLineList_swShowOrig1, thisLineList_swShowTran1,"BEG",
								0, 0,  0, 0 );
		
		minNumId = numId - thisLineList_nRighe2;  
		if (minNumId < 0) { minNumId = 0;}
		
		//mms1 = thisLineList_nRepeat2 + " volte "; 
		//if (thisLineList_nRepeat2 == 1) mms1 = "1 volta "; 
		accumRowToPlay(2, minNumId, numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType2,  thisLineList_nome2, 
								thisLineList_nRighe2, thisLineList_nRepeat2, thisLineList_swSpeedReduce2, thisLineList_swTran2 ,  
								thisLineList_swShowOrig2, thisLineList_swShowTran2,"BEG",
								0, 0, 0, 0);	
		play_accum(9,"r20", swOrigAndTran);		
	
	} // end of tr20
	
	
	
} // end of playManyRows
//------------------------------------------
let last_eleObjToSpeak = null; 
let last_TranObj = null; 
//------------------------------------

function bold_spoken_line(eleObjToSpeak, swShow) {
	//---
	async function tranTimerDisplay() {
				//console.log("%c  timer display", "color:green;");
				let hideTrad4 = new Promise(function(resolve) { 
							setTimeout(function() {resolve( eleObjToSpeak.style.display = "none");}, DURATA_TRADUZIONE);
					});
				await hideTrad4;
	}
	//----
	if (last_TranObj) { last_TranObj.style.display = "none";} 
	
	if (eleObjToSpeak == null) { return; } 
	if (last_eleObjToSpeak) {
		last_eleObjToSpeak.style.backgroundColor = null;
		last_eleObjToSpeak.parentElement.parentElement.style.border = null;
		//eleObjToSpeak.style.display = "none";
	}
	eleObjToSpeak.style.backgroundColor = "lightcyan";
	eleObjToSpeak.parentElement.parentElement.style.border = "2px solid red";
	if (swShow)	{		
		eleObjToSpeak.style.display = "block";
		
		//console.log("%celeObjToSpeak.id=" + eleObjToSpeak.id, "color:red;");
		
		if (eleObjToSpeak.id.substr(0,4) == "idt_") {		//  mostra la traduzione soltanto per alcuni secondi  				
			tranTimerDisplay();	
		}
	}  else {
		eleObjToSpeak.style.display = "none";	
	}	
	last_eleObjToSpeak = eleObjToSpeak;	
} // end of bold_spoken_line 
//----------------------------

//----------------------------------------
async function play_accum(num123, tipo123, swOrigAndTran, bigLoop00) {
	
	//console.log("%c  play_accum", "color:red; font-size:2em;"); console.log("  play_accum(", num123, " ", tipo123, " swOrigAndTran=", swOrigAndTran, " bigLoop00=", bigLoop00); 
	
	//console.log("%cplay_accum", "color:red; font-size:2em;");
		//if (swShowOrig[z]) ele_txtOrig.style.display = "block"; else ele_txtOrig.style.display = "none";
		//if (swShowTran[z]) ele_txtTran.style.display = "block"; else ele_txtTran.style.display = "none";
		//console.log("   loop z=", z, " swShowOrig[z]=", swShowOrig[z], "  ele_txtOrig display=", ele_txtOrig.style.display); 
	let bigLoop = "";  
	if (bigLoop00) bigLoop = bigLoop00;

	let ltr_vox, ltr_txt, ltr_speedP, eleObjToSpeak, swShow;
	var msgLog=""; var g;
	for(g=0; g < righeDaLeggere.length; g++) {
		[ltr_vox, ltr_txt,ltr_speedP, eleObjToSpeak, swShow] = righeDaLeggere[g]; //    
		//console.log("play_.. righe da leggere  UNO g=",g, " ltr_speedP=", ltr_speedP, " swShow=", swShow)
		if (ltr_vox == IX_SetMSG) {
			if (ltr_txt == "") continue;	   
			msgLog = bigLoop + ltr_txt; 
			break; 
		}
	}
	if (msgLog.indexOf("loop g") > 0) {	
		msgLog = ridOutOfSpan( msgLog) ; 
		//consoleGreen( msgLog, " *** " , righeDaLeggere.length + " righe da leggere" + " tot. sound=" + tot_ixsound + ", orig=" + tot_ixorig + ", tran=" + tot_ixtran + ", msg=" + tot_ixsetmsg); 
		var jm = msgLog.indexOf("loop g"); 
		var jm2 = msgLog.indexOf(" giro ", jm); 
		if (jm2 > 0) {
			var msgLog2 = (msgLog.substring(jm2+6)).trim();
			var numG = msgLog2.split(" ")[0]; 		
			var msgLog3 = msgLog.substring(0, jm2+6) + " " + numG;  
			consoleGreen( "", msgLog3 );
		}
	}	
	
	for(g=0; g < righeDaLeggere.length; g++) {
		[ltr_vox, ltr_txt,ltr_speedP, eleObjToSpeak, swShow] = righeDaLeggere[g]; // 
		//console.log("play_.. righe da leggere  DUE g=",g, " ltr_vox=",ltr_vox, " ltr_txt=", ltr_txt, " ltr_speedP=", ltr_speedP, " swShow=", swShow)
		if (ltr_vox == IX_SetMSG) {
			if (ltr_txt == "") continue;	 
			document.getElementById("id_showLoop").innerHTML = bigLoop + ltr_txt;				
			//consoleGreen( "", ridOutOfSpan(ltr_txt) ); 
			
			continue; 
		}
		if (ltr_vox == IX_SOUND) {
			//let frequency = ltr_speedP; 
			await soundEffect(  ltr_speedP );
			continue;
		}
			
		let ixVoice0X ;
		
		//if (swOrigAndTran) { document.getElementById("showVoice_1").style.display = "block";} else {document.getElementById("showVoice_1").style.display = "none";}
		
		if (ltr_vox == 	IX_TRAN) {
			/**
			if (swOrigAndTran == false) {
				await bold_spoken_line(eleObjToSpeak, swShow);						
				continue;
			}	
			**/
			last_TranObj = eleObjToSpeak;
			ixVoice0X = rotateVoice(1);   
			document.getElementById("showVoice_0").style.display = "none";  // orig. voice			
			document.getElementById("showVoice_1").style.display = "block"; // transl. voice 
		} else {
			 ixVoice0X = rotateVoice(0);   	
			 document.getElementById("showVoice_0").style.display = "block";  // orig. voice
			 document.getElementById("showVoice_1").style.display = "none";   // transl. voice 
		}		
		
		await bold_spoken_line(eleObjToSpeak, swShow);
		if (ltr_speedP > 0) { 
			await sayVoiceNum( ltr_txt, ltr_vox, ixVoice0X, speechVolume[ltr_vox], ltr_speedP, speechPitch[ltr_vox]); // un gruppo"); 
			//await sayVoiceNum( ltr_txt, ltr_vox, ixVoice0X, speechVolume[ltr_vox], ltr_speedP * speechRate[ltr_vox], speechPitch[ltr_vox]); // un gruppo"); 		
		}
	} // end for g	
	
	righeDaLeggere = [];
	tot_ixsound=0; tot_ixorig=0; tot_ixtran=0; tot_ixsetmsg=0;
	
} // end of play_accum

//-----------------------------------------------------
function ridOutOfSpan(ww) {
	var wwSp = ww.split("<span "); 
	var str="";
	for (var f=0; f < wwSp.length; f++) {
		var ww2 = wwSp[f].replaceAll("</span>",""); 
		var wwIx = ww2.indexOf(">");
		if (wwIx >0) ww2 = ww2.substring(wwIx+1);
		str+= ww2.replaceAll("&nbsp;"," "); 	
	}
	return str;  
}	
//--------------------------	
function showUpperMsg( idLoop, loopType0 , groupLimit, numPrec, numId, numRiga, totGiri1, numGiro1, totGiri20, numGiro20) {
	
	function bmBig(ww) {
		return '<span style="font-weigth:bold; font-size:1.5em;">' + ww + "</span>";
	}
	function bmSmall(ww) {
		return '<span style="font-weigth:bold; font-size:0.8em;">' + ww + "</span>";
	}
	function bm(ww) {
		return '<span style="font-weigth:bold; font-size:1em;">' + ww + "</span>";
	}
	//-----------
	
	var spazio = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ;
	var xxx_msgText1;
	
	numGiro20++;
	numGiro1++;	
	
	switch(idLoop) {
		case "Tr00": return "riga " + numRiga;  
		case "Tr10": return bm(loopType0) + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio +  "riga " + numRiga;  
		case "Tr20": return bm(loopType0) + " (1)" + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga; 
		case "Tr21": return bm(loopType0) + " (2)" + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga + spazio + bmSmall( "(" + numPrec + " righe precedenti)" ); 			
		case "Tr22": return bm(loopType0) + " (3)" + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga + spazio + bmSmall( "(" + numPrec + " righe precedenti)" ) ; 			
		case "Tg00": return bm("gruppo") + " righe " + groupLimit + " " + spazio +  "riga " + numRiga;		
		case "Tg10": return bm("gruppo") + " righe " + groupLimit + " " + spazio + bm("loop g1") + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga; 		
		/**
		case "Tg20": return bm("gruppo") + " righe " + groupLimit + " " + spazio + bm("loop g2") + "(1)" + spazio + " giro " + bmBig(numGiro20) + "/" + totGiri20 + spazio + "riga " + numRiga;
		**/
		case "Tg21": return bm("gruppo") + " righe " + groupLimit + " " + spazio + bm("loop g2") + spazio + " giro " + bmBig(numGiro20) + "/" + totGiri20 + spazio + 
					" loop " + "riga " + numRiga + spazio + " giro " + bm(numGiro1 + "/" + totGiri1);  			
		
		case "Tg30": return bm("gruppo") + " righe " + groupLimit + spazio + " (r2.1) " + numId + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga; 
		case "Tg31": return bm("gruppo") + " righe " + groupLimit + spazio + " (r2.2) " + numId + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga + spazio + bmSmall( "(" + numPrec + " righe precedenti)" ); 			
		case "Tg32": return bm("gruppo") + " righe " + groupLimit + spazio + " (r2.3) " + numId + spazio + " giro " + bmBig(numGiro1) + "/" + totGiri1 + spazio + "riga " + numRiga + spazio + bmSmall( "(" + numPrec + " righe precedenti)" ) ; 			
						
		default:     return "idLoop=" + idLoop + ",  sconosciuto";
	}
	
} // end of showUpperMsg

//----------------------------
//--------------------------------------------------
function accumRowToPlay( type1, minIndice, numId, swOrigAndTran, swPause, swAlfa, thisLineList_loopTypeX, thisLineList_nomeX, 
			thisLineList_nRigheX, thisLineList_nRepeatX,
			thisLineList_swSpeedReduceX,  thisLineList_swWordByWordX,
			thisLineList_swTranX, 
			thisLineList_swShowOrigX,
			thisLineList_swShowTranX,
			charSep, 
			begix, endix, numGiro20, totGiri20	) {
				
	var groupLimit = begix + "-" + endix; 
	var numPrec = thisLineList_nRigheX;
	var totGiri1 =  thisLineList_nRepeatX;	
	var numGiro1 = 0; 
	
	var sw_NO_LOOP = (thisLineList_loopTypeX == "Tr00"); 
	//-------------------------------------
	let numeroDiRipetizioni = thisLineList_nRepeatX	;     // numero di ripetizioni richieste  nelle righe r1, r2 o nei gruppi g1, g2, g3
	
	
	//let numeroDiRighe       = thisLineList_nRigheX	; // il numero di righe da leggere
	//console.log("accumRowToPlay( ... type1=", type1, " numId=", numId, " swOrigAndTran=", swOrigAndTran, " thisLineList_nRigheX=",thisLineList_nRigheX, "_swShowOrigX=",thisLineList_swShowOrigX, " [0]=",thisLineList_swShowOrigX[0]  ); 
	/**
	var minIndice; 
	if (type1 < 2) minIndice = numId
	else minIndice = numId - numeroDiRighe;  
	if (minIndice < 0) { minIndice = 0;}
	**/
	//console.log("%c  accum...  thisLineList_loopTypeX=" + thisLineList_loopTypeX + " numeroDiRipetizioni=" + numeroDiRipetizioni + " lenLis=" + thisLineList_swSpeedReduceX.length, "color:green;");
	//----------------------	
	
	let swSpeedReduce	  = [false]; 
	let swWordByWord	  = [false]; 
	let swTranslation     = [true ];
	let swShowOrig        = [false ];
	let swShowTran        = [false ];
	//------------
	
	let perc_speed_reduce = 100; 
	let perc_speed_reduce_Sp = 100;
	let perc_speed_reduce_Wb  = 100;
	var lenLis = thisLineList_swSpeedReduceX.length; // numero di colonne previste nelle righe r1, r2 e gruppi g1,g2,g3   (può essere maggiore o minore di numeroDiRipetizioni  
	if  ( lenLis > 1)  {
			if (thisLineList_swSpeedReduceX[0]) {    
				if (thisLineList_swSpeedReduceX[0] != "_")	perc_speed_reduce_Sp = parseInt( thisLineList_swSpeedReduceX[0] ); 	
			}
			if (thisLineList_swWordByWordX[0]) {    
				if (thisLineList_swWordByWordX[0] != "_")	perc_speed_reduce_Wb = parseInt( thisLineList_swWordByWordX[0] ); 	 	
			}
	}	
	if (sw_NO_LOOP == false) {
		if  ( lenLis < 1)  {
			console.log("%cErrore numero di colonne in r1 r2 g1 g2 g3 DEVE essere maggiore di 1", "color:red;");   
		}	
		if  ( lenLis > 1)  {			
			swSpeedReduce	  = thisLineList_swSpeedReduceX.slice(1) ; 
			swWordByWord	  = thisLineList_swWordByWordX.slice(1) ; 
			swTranslation     = thisLineList_swTranX.slice(1)        ; 
			swShowOrig        = thisLineList_swShowOrigX.slice(1)    ;  		
			swShowTran        = thisLineList_swShowTranX.slice(1)    ;  
		}
	} 
	
	lenLis = swSpeedReduce.length;
		
	
	for(var a=lenLis; a < numeroDiRipetizioni; a++) {
		if (a < 1) {break;}
		swSpeedReduce[a] = swSpeedReduce[lenLis-1];
		swWordByWord[a]  = swWordByWord[ lenLis-1];
		swTranslation[a] = swTranslation[lenLis-1];
		swShowOrig[a]    = swShowOrig[   lenLis-1];
		swShowTran[a]    = swShowTran[   lenLis-1];
	}
		
	//ele_showWh.innerHTML = "";	
	
	let ele_txtOrig;  //= document.getElementById("idc_" + numId);
	let ele_txtTran;  //= document.getElementById("idt_" + numId);
	
	//if (type1 == 0) { // play no loop, leave swShow... according to the already existing text display   
	if (sw_NO_LOOP) {  // play no loop, leave swShow... according to the already existing text display   
		ele_txtOrig = document.getElementById("idc_" + numId);
		ele_txtTran = document.getElementById("idt_" + numId);
		swShowOrig[0] = (ele_txtOrig.style.display == "block");
		swShowTran[0] = (ele_txtTran.style.display == "block");
		//console.log("anto accumRowToPlay orig ", "swShowOrig=", swShowOrig, " style.display=" + ele_txtOrig.style.display + " =>"+ ele_txtOrig.innerHTML)
	}
	//let shL;	
	let speed0 = speechRate[0];
	
	let speed1 = speechRate[1];
	
	
	//-------------------------------------------------
	var speedRed = 1;
	var msg_ix_set = ""; 
	var msg_ix_set2= ""; 
	var minimo = 0;
	var module = 1 + endix - begix;
	
	
	//--------------------
	for(let z=0; z < numeroDiRipetizioni; z++) {
	  
		switch( thisLineList_loopTypeX ) {
			case "Tg10": 
				if (z > 0) {
					righeDaLeggere.push( [IX_SOUND,null, soundFreq[0], z] ); 
					tot_ixsound++; 
				} 
				break;
			case "Tr20": 
				break; 				
			case "Tr21":	
			case "Tr22":
			case "Tg31":	
			case "Tg32":
				minimo = begix; 
				righeDaLeggere.push( [IX_SOUND,null, soundFreq[0], z ] );  
				tot_ixsound++;   
				break;
			default: break;	
		}
		
		if (swWordByWord[z]) {
			perc_speed_reduce = perc_speed_reduce_Wb * speed0/100;     
		} else {
			if (swSpeedReduce[z]) {
				perc_speed_reduce = perc_speed_reduce_Sp * speed0/100;     
			} else {
				perc_speed_reduce = speed0;
			}
		}
		 
		
		let swTran1 = swTranslation[z];
		let swSep1  = swWordByWord[z];   //   
		
		if (sw_NO_LOOP) { 
			//if (swPause) {	swSep1  = true; }			
			swTran1 = swOrigAndTran;
			swSep1  = swPause; 
			if (swSep1) perc_speed_reduce = perc_speed_reduce_Wb * speed0/100;   
			//console.log("  sw_NO_LOOP=",sw_NO_LOOP, " swSep1=", swSep1, " perc_speed_reduce_Wb=", perc_speed_reduce_Wb,  " perc_speed_reduce=",  perc_speed_reduce); 
		}
		
		//console.log("  ripetiz. z=", z, "  swTranslation[z]=", swTranslation[z], " swTran1=", swTran1 , " XX swWordByWord[z]=", swWordByWord[z], " swSep1=", swSep1 , " perc_speed_reduce=",perc_speed_reduce);  
		var f; 
		//console.log("accumRowToPlay ( , thisLineList_loopTypeX=", thisLineList_loopTypeX, "minIndice=", minIndice, " numId=", numId, " minimo=", minimo,  " begix=", begix, "  endix=", endix, "module=", module);  
		for(var f1=minIndice; f1 <= numId; f1++) {
			f = f1;  
			if (f < minimo) {
				if (thisLineList_loopTypeX <= "Tg30") continue; 
				var f2 =  moduleNormalize( f, begix, module);  // va a prendere dalla fine del gruppo 
				if (sw_told_group_row_list[f2]) {
					f = f2; 
				} else {
					continue; // non legge righe in coda se non sono già state lette almeno una volta
				}				
			}
			ele_txtOrig = document.getElementById("idc_" + f);		
			if (ele_txtOrig.parentElement.parentElement.parentElement.classList.contains("hideForNow") ) continue; 
			
			//console.log("              f1=", f1,  "  f=",f, " ele_txtOrig=", ele_txtOrig); 
			
			if (ele_txtOrig == null) {
				continue;
			} 
		
			numGiro1 = z;
			
			msg_ix_set2 = showUpperMsg( thisLineList_loopTypeX, thisLineList_nomeX,  groupLimit, numPrec,numId, f, totGiri1, numGiro1, totGiri20, numGiro20); 
			//console.log("msg_ix_set2=", msg_ix_set2); 
			//righeDaLeggere.push( [IX_SetMSG, msg_ix_set2,swOrigAndTran,null ] ) ;  // set msg under loop type button
			tot_ixsetmsg++;  
			
			
			
			if (swSep1) {
				speedRed = perc_speed_reduce;	
				//if (swAlfa) speedRed = 0.8; // swAlfA=TRUE solo in spezza_righe3 ( esplosione riga in parole)
				if (swAlfa) speedRed = perc_speed_reduce_Wb * speed0/100;     // swAlfA=TRUE solo in spezza_righe3 ( esplosione riga in parole)	
				var txtOrigW= get_words_fromRow( swAlfa,  getInner_idc( ele_txtOrig ).replaceAll("<br>", "")  );
				//console.log("111 swSep1=", swSep1, " speedRed=", speedRed); 
				righeDaLeggere.push( [IX_SetMSG, msg_ix_set2 + " velocità=" + speedRed, swOrigAndTran,null ] ) ;  // set msg under loop type button
			
				righeDaLeggere.push( [IX_ORIG, txtOrigW,speedRed, ele_txtOrig, swShowOrig[z]] ) ; 
				tot_ixorig++;  
			} else {	
				righeDaLeggere.push( [IX_SetMSG, msg_ix_set2 + " velocità=" + perc_speed_reduce,swOrigAndTran,null ] ) ;  // set msg under loop type button
				//console.log("222 speedRed=", perc_speed_reduce); 
				righeDaLeggere.push( [IX_ORIG, getInner_idc( ele_txtOrig ).replaceAll("<br>", ""),perc_speed_reduce, ele_txtOrig, swShowOrig[z]] ) ; 
				tot_ixorig++;  
				
				//console.log("      tot_ixorig=", tot_ixorig, " da leggere =",ele_txtOrig.innerHTML.replaceAll("<br>", "") ); 
			}
			
			if (swTran1) {
					//console.log(" 1  traduz.  swTran1=true z=", z, " swShowTran[z]=", swShowTran[z] )
					ele_txtTran = document.getElementById("idt_" + f);	
					righeDaLeggere.push( [IX_TRAN, ele_txtTran.innerHTML.replaceAll("<br>", ""),speed1, ele_txtTran, swShowTran[z] ] ) ;	 
					tot_ixtran++;  			
			} else {
				//console.log("   2 traduz.  swTran1=FALSE z=", z , " swShowTran[z]=", swShowTran[z])
				if (swShowTran[z]) {
					ele_txtTran = document.getElementById("idt_" + f);	
					//console.log("           traduz.  swTran1=FALSE z=", z , " swShowTran[z]=", swShowTran[z] ," f=", f, " indice righe=", righeDaLeggere.length)
					righeDaLeggere.push( [IX_TRAN, ele_txtTran.innerHTML.replaceAll("<br>", ""),0, ele_txtTran, swShowTran[z] ] ) ;	// mostra la traduzione se richiesto ma non la legge
				}
			}		
		}
			
	} // end for z  
	//------------------------------
	//righeDaLeggere.push( [IX_SetMSG, "",null,null] ) ; // set msg under loop type button
	//tot_ixsetmsg++; 
	//----------------------
	//righeDaLeggere.push( [IX_ORIG, "",1,null] ) ; // pausa 	
	//tot_ixorig++; 
	
	
} // end of accumRowToPlay	
		
//------------------------------------------

async function onclick_play_Orig_and_Tran_group(numId0,swOrigAndTran, swPause,swAlfa) { 
	
	

	let numId = parseInt(numId0);
	
	let eleTyLoop = document.getElementById("tyLoop" + numId+ "_m1");   // gruppo
	let eleTyLoop_button = eleTyLoop.parentElement;
	
	let ele_showWh = eleTyLoop_button.children[3];
	
	var typL = eleTyLoop_button.children[0].innerHTML;
	var tXXX = typeList[ parseInt( typL )  ];
	
	//console.log("\nxxxx GROUP onclick_play_Orig_and_Tran_group(numId=", numId,  " typL =" + typL + "<==   tXXX="  + tXXX + "<==");  

	//let swNoLoop = (eleTyLoop_button.children[0].innerHTML == "0");
	//let swLoop1  = (eleTyLoop_button.children[0].innerHTML == "1");
	//let swLoop2  = (eleTyLoop_button.children[0].innerHTML == "2");

	
	onclick_anotherLoopType( eleTyLoop_button, true, false, "group numId=" + numId + " tXXX=" + tXXX);             // get type loop and copy to thisLineList_nRepeat0, ...  
	
	//console.log( "tran_group g20/g30 (1) ",   thisLineList_nome1, " thisLineList_nRighe1=", thisLineList_nRighe1, " g20/30 (2) ",   thisLineList_nome2," thisLineList_nRighe2=", thisLineList_nRighe2);

	righeDaLeggere = [];
	tot_ixsound=0; tot_ixorig=0; tot_ixtran=0; tot_ixsetmsg=0;
	//console.log("xxxx GRUPPO TIPO = ",  typL)
	
	var begix, endix;	
	
	[begix, endix] = fromIxToIxLimit;
	
	//console.log("begix=", begix, ", endix=", endix)
	var minNumId = 0;
	
	var msgtxt="GRUPPO lettura delle righe dal num. "+begix + " al num." + endix + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ;
	if (typL != "0") msgtxt += " tipo Loop g" + typL;
	
	//var swPause=false;
	//var mms1;
	switch (tXXX) {
		case "Tg00":
			// g00
			accumRowToPlay(0, begix, endix, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType0,  thisLineList_nome0, 
							thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, 
							thisLineList_swTran0,
							thisLineList_swShowOrig0,
							thisLineList_swShowTran0,"BEG",
							begix, endix, 0, 0);
			play_accum(0,"Tg00", swOrigAndTran);		
				
			return;	
		case "Tg10":	
			//mms1 = thisLineList_nRepeat0 + " volte "; 
		    //if (thisLineList_nRepeat0 == 1) mms1 = "1 volta ";  // g10
			accumRowToPlay(1, begix, endix, swOrigAndTran, swPause, swAlfa, thisLineList_loopType0,  thisLineList_nome0, 
							thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, thisLineList_swTran0,
							thisLineList_swShowOrig0,
							thisLineList_swShowTran0,"BEG",
							begix, endix, 0, 0); 
			play_accum(1,"Tg10", swOrigAndTran);				
			return;	
			
		case "Tg20":
			group_g20();
			break;
		case "Tg30":
			group_g30();
			break;	
		default:
			return;	
	} // end of switch
	//---------------
	async function group_g20() {		
		for( var f1=0; f1 < thisLineList_nRepeat0; f1++) {			
			await play_accum(2,"g20", swOrigAndTran);	
			if (f1 > 0) { 	
				righeDaLeggere.push( [IX_SOUND,null, soundFreq[0], f1 ] ); 
				tot_ixsound++; 	
			}
			
			for(var f2 = begix; f2 <= endix; f2++) {
				// g21
				accumRowToPlay(1, f2, f2, swOrigAndTran, false, false,  "Tg21",  thisLineList_nome1, 
					thisLineList_nRighe1, thisLineList_nRepeat1, thisLineList_swSpeedReduce1, thisLineList_swTran1,  
					thisLineList_swShowOrig1, thisLineList_swShowTran1,"BEG",
					begix, endix, f1, thisLineList_nRepeat0 );    							
			} 			
		} 
		await play_accum(3,"g20",  swOrigAndTran);	
	} // end of g20
	//---------------
	async function group_g30() {
		//console.log("XXX  gruppo 30   ", " begix=", begix,  "  endix=", endix); 
		var f1=-1;

		sw_told_group_row_list = [];
		
		let bigLoopR2 = document.getElementById("Tg30_loopR2").value; 
		
		function bmBig(ww) {
			return '<span style="font-weigth:bold; font-size:1.5em;">' + ww + "</span>";
		}
		//-------------------------
		for(var bgR2=0; bgR2 < bigLoopR2; bgR2++) { 
			
			for (var bg_numId = begix; bg_numId<= endix; bg_numId++) {
				//console.log("\nLOOP sulla riga ", bg_numId , " -----------------"); 
				await play_accum(5,"g30", swOrigAndTran,  "loop g3 (loop di loop r2) ripetiz." + bmBig( (1+ bgR2)) + " del set di loop r2 su ogni riga del ");		
				sw_told_group_row_list[bg_numId] = true;
				f1++;
				if (f1 > 0) { 
					//await play_accum(swOrigAndTran);	
					//righeDaLeggere = [];			
					//tot_ixsound=0; tot_ixorig=0; tot_ixtran=0; tot_ixsetmsg=0;				
					righeDaLeggere.push( [IX_SOUND,null, soundFreq[0], f1 ] ); 
					tot_ixsound++; 	
				}
				//console.log("     XXX  gruppo 30  r2   bg_numId=", bg_numId); 			
				
				// qui siamo al tipo R2 che comprende 3 elabor. 
				//minNumId = bg_numId ;	
				
				//console.log("  loop g3 r2  (1) (loop sulla riga richiesta) ", " minNumId=", minNumId, " bg_numId=", bg_numId  , 
				//				" thisLineList_loopType0=",  thisLineList_loopType0, " thisLineList_nRighe0=", thisLineList_nRighe0	); 
				
				accumRowToPlay(1, bg_numId, bg_numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType0,  thisLineList_nome0, 
										thisLineList_nRighe0, thisLineList_nRepeat0, thisLineList_swSpeedReduce0, thisLineList_swWordByWord0, thisLineList_swTran0 , 
										thisLineList_swShowOrig0, thisLineList_swShowTran0,"BEG",
										begix, endix, 0, 0);
				
				//console.log("                    ----- fine loop (1) -------- ");  
				
				//--------------------------
				minNumId = bg_numId - thisLineList_nRighe1;     // minNumId potrebbe essere inferiore a begix ( gestione in accumRowToPlay)
				
				//console.log("                  loop g3 r2  (2) (loop con le precedenti)"," minNumId=", minNumId, " bg_numId=", bg_numId  , 
				//				" thisLineList_loopType1=",  thisLineList_loopType1, " thisLineList_nRighe1=", thisLineList_nRighe1	);  

				accumRowToPlay(2, minNumId, bg_numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType1,  thisLineList_nome1, 
										thisLineList_nRighe1, thisLineList_nRepeat1, thisLineList_swSpeedReduce1, thisLineList_swTran1 ,  
										thisLineList_swShowOrig1, thisLineList_swShowTran1,"BEG",
										begix, endix, 0, 0);
										
			
				
				//console.log("                    ----- fine loop (2) -------- ");  						
				//------------------------------
				minNumId = bg_numId - thisLineList_nRighe2;   // minNumId potrebbe essere inferiore a begix ( gestione in accumRowToPlay)
				
				console.log("                  loop g3 r2  (3) (loop con le precedenti)", " minNumId=", minNumId, " bg_numId=", bg_numId  , 
								" thisLineList_loopType2=",  thisLineList_loopType2, " thisLineList_nRighe2=", thisLineList_nRighe2	);  							
				
				accumRowToPlay(2, minNumId, bg_numId, swOrigAndTran, swPause, swAlfa,  thisLineList_loopType2,  thisLineList_nome2, 
										thisLineList_nRighe2, thisLineList_nRepeat2, thisLineList_swSpeedReduce2, thisLineList_swTran2 ,  
										thisLineList_swShowOrig2, thisLineList_swShowTran2,"BEG",
										begix, endix, 0, 0);	
				
				//console.log("                 zzz fine r2 - riprova con numId diverso"); 	
			} // end bg_numId
			
			await play_accum(6,"g30", swOrigAndTran,  "loop g3 (loop di loop r2) ripetiz." + bmBig( (1+ bgR2)) + " del set di loop r2 su ogni riga del ");	
		
		} // end of bgR2 
		
	} // end of group_g30	
	//-------------------		
	
	
} // end of onclick_play_Orig_and_Tran_group 
	
//-------------------------------------------------------

//------------------------------
function get_words_fromRow(swAlfa, txt3) {
	
	if (swAlfa){  // get all letters of the string ( ie. the letters of a word)
		var newTxt3 = "";
		for(var f=0; f < txt3.length; f++) {
			newTxt3 += txt3.charAt(f) + ".  . " ;
		}
		return newTxt3;
	}	
	var ww1 = getListOfWords_inText(txt3, charList) ;
	/**
	var ww1 =  (txt3+" ").replaceAll("–"," ").replaceAll("-"," ").
			replaceAll(", "," ").replaceAll(" ."," ").replaceAll(". "," ").replaceAll("..."," ").
			replaceAll("? "," ").replaceAll("! "," ").split(" "); 
	**/			
	txt3 = "";
	for(var g=0; g < ww1.length; g++) {	
		var ww2 = ww1[g].trim(); 
		if (ww2 != "") txt3 += ww2 + ". "; 
	} 
	return txt3;
}
		
//--------------------------------------

function onclick_chgVoxRotate() {
	set_var_voice_rotate_to_localStore();
	
	plus_list_localStorageItems();
	
} 

//----------------------
function onclick_loopType_change() {	
	load_loop_parameters_fromHTML_to_vars(4); 
}
//=============================================

function set_var_rLoopT() {
	load_loop_parameters_fromHTML_to_vars(5);
	return; 
	/**
	<table style="border:2px solid black;">
				<tr><td  id="rLoopT2" class="tabHtd" style="text-align:center;">loop_2</td>	</tr>
				<tr>
					<td><input id="Tr20_nrLoop" class="tabHloopInput" type="number" value="1"  readonly>&nbsp;&nbsp;<span>riga &nbsp;</span></td>
					<td><input   id="Tr20_rLoop" class="tabHloopInput" type="number" value="3">&nbsp;&nbsp;<span>volte</span></td>
				</tr>
				<tr>
					<td><input id="Tr21_nrLoop" class="tabHloopInput" type="number" value="3">&nbsp;&nbsp;<span>righe</span></td>
					<td><input   id="Tr21_rLoop" class="tabHloopInput" type="number" value="2">&nbsp;&nbsp;<span>volte</span></td>
				</tr>
				<tr>
					<td><input id="Tr22_nrLoop" class="tabHloopInput" type="number" value="5">&nbsp;&nbsp;<span>righe</span></td>
					<td><input   id="Tr22_rLoop" class="tabHloopInput" type="number" value="1">&nbsp;&nbsp;<span>volta</span></td>
				</tr>						
	</table>	
	**/	
	/**
	 eleTabHloop    = document.getElementById("idTabHloop");
	 ele_rLoopT0    = document.getElementById("rLoopT0"); 
	 ele_rLoopT1    = document.getElementById("rLoopT1"); 
	 ele_rLoopT2    = document.getElementById("rLoopT2"); 
	 
	 ele_rLoopTg0  = document.getElementById("rLoopTg0");
	 ele_rLoopTg1  = document.getElementById("rLoopTg1"); 
	 ele_rLoopTg2  = document.getElementById("rLoopTg2"); 
	 rLoopT_listEle  = [ele_rLoopT0, ele_rLoopT1, ele_rLoopT2, ele_rLoopTg0, ele_rLoopTg1, ele_rLoopTg2]; 
	 
	 rLoopT_listHButt= ["no&nbsp;loop","loop r1" , "loop r2", "no&nbsp;loop","loop g1" , "loop g2"];
	**/	
	 //load_loop_parameters_fromHTML_to_vars();	
	
} // end of set_var_rLoopT

//---------------------
function restore_prevRun_loop_parameters_to_htmlPage() {
	
	console.log("\nxxxxxxxxxxxxx\nrestore_prevRun_loop_parameters_to_htmlPage    ( update html page )\n") 
	
	restore_fromStor_loopType_toHTML("Tr00"); 
	restore_fromStor_loopType_toHTML("Tr10");
	
	restore_fromStor_loopType_toHTML("Tr20");
	restore_fromStor_loopType_toHTML("Tr21");
	restore_fromStor_loopType_toHTML("Tr22");
	
	restore_fromStor_loopType_toHTML("Tg00");
	restore_fromStor_loopType_toHTML("Tg10");
	restore_fromStor_loopType_toHTML("Tg20");
	restore_fromStor_loopType_toHTML("Tg21");
	
	restore_fromStor_loopType_toHTML("Tg30");
	restore_fromStor_loopType_toHTML("Tg31");
	restore_fromStor_loopType_toHTML("Tg32");
		
	//plus_set_localStorage_var ();
	
}

//---------------------------------------

//---------------------------------------
function restore_fromStor_loopType_toHTML(loopTypeId ) {
		//console.log("restore_fromStor_loopType_toHTM INIZIO ");
		//console.log("restore_fromStor_loopType_toHTML(loopTypeId ", loopTypeId,   " id=" +  loopTypeId + "_rLoop" + "<==") ;
		
		var ele_rLoop         = document.getElementById( loopTypeId + "_rLoop");  	

		//console.log("ele_rLoop=", ele_rLoop); 
		
		if (ele_rLoop == null) { console.log("loop type ", loopTypeId, " does not exist"); return;} 
		
		// eg. id_loop = "20"
		
		var sw1 = (loopTypeId == "Tr10"); 
		
		//if (sw1) console.log("restore_fromStor_loopType ", loopTypeId );
		
		var index = loopIndexOfType( loopTypeId );  
		
		//console.log("index=", index); 
		
		var storeLoop = sel_loopTypeSet[index];
		
		//console.log("storeLoop=", storeLoop);
		if (storeLoop == null) {
			console.log("restore_fromStor_loopType(loopTypeId = ", loopTypeId , ") non esiste in storage");
			return; 
		}
		if (storeLoop == "") {			
			//console.log("restore_fromStor_loopType(loopTypeId = ", loopTypeId , ") in storage è vuoto");	
			return;  
		}
		//if (sw1) console.log("storeLoop=", storeLoop); 
		
		var ret_txLoopT_nome    = "";   
		var ret_txLoopT_nRighe  = "";   
		var ret_txLoopT_nRepeat = "";   
		var ret_txLoopT_speedReduce = "";  
		var ret_txLoopT_wordByWord  = ""; 	
		var ret_txLoopT_swTran      = "";	
		var ret_txLoopT_swShowOrig  = "";	
		var ret_txLoopT_swShowTran  = "";	
		
		var fields= storeLoop.split("::");
		
		//console.log("fields=", fields);
		
		fields.forEach(assignLoopVal);
		
		function assignLoopVal(item) {
			var val1 = item.substring(3); 
			switch(item.substr(0,3) ) {
			   case "1n=": ret_txLoopT_nome        = val1; break;   
			   case "2r=": ret_txLoopT_nRighe      = val1; break;   
			   case "3r=": ret_txLoopT_nRepeat     = val1; break;  			     
			   case "4w=": ret_txLoopT_wordByWord  = val1; break; 
			   case "5r=": ret_txLoopT_speedReduce = val1; break;  
			   case "6t=": ret_txLoopT_swTran      = val1; break;   
			   case "7s=": ret_txLoopT_swShowOrig  = val1; break;   
			   case "8s=": ret_txLoopT_swShowTran  = val1; break;   
			   default: break; 
			}	   
		}
		
		//console.log("  ret_txLoopT_nRighe=",  ret_txLoopT_nRighe);
		
		var ele_rLoop         = document.getElementById( loopTypeId + "_rLoop");  	
		
		var ele_nrLoop        = document.getElementById( loopTypeId + "_nrLoop");  
		
		//console.log("1 restore ", loopTypeId, " ele_nrLoop=",  ele_nrLoop ); 
		//if (sw1) console.log("   1xxx ", loopTypeId + "_nrLoop", " ", ele_nrLoop.tagName, " value=", ele_nrLoop.value); 
		
		ele_rLoop.value  = parseInt( ret_txLoopT_nRepeat ); 
	  	ele_nrLoop.value = parseInt( ret_txLoopT_nRighe  ); 		
		
		//if (sw1) console.log("2 restore ", loopTypeId, " ele_nrLoop=",  ele_nrLoop ); 
		//if (sw1) console.log("   2xxx ", loopTypeId + "_nrLoop", " ", ele_nrLoop.tagName, " value=", ele_nrLoop.value); 
		//return
		
		var ele_read_rowspeed = document.getElementById( loopTypeId + "_read_rowspeed");  
		
		//console.log("1 restore ", loopTypeId, " ele_nrLoop=",  ele_nrLoop ); 
		
		if (ele_read_rowspeed == null        ) { 
			//console.log("restore_fromStor_loopType_toHTM chiama 1 onclick_refresh_loopParms");
			onclick_refresh_loopParms( loopTypeId ,"restore1"); 
			return; 
		} 
		
		if (ele_read_rowspeed.innerHTML == "") { 
			//console.log("restore_fromStor_loopType_toHTM chiama 2 onclick_refresh_loopParms");
			onclick_refresh_loopParms( loopTypeId , "restore2"); 
			return; 
		} 
		
		
		var eleTr_swList_SpeedReduce = document.getElementById( loopTypeId + "_spRedSw" );
		var eleTr_swList_WordByWord  = document.getElementById( loopTypeId + "_wbwSw" );
		var eleTr_swList_Tran        = document.getElementById( loopTypeId + "_tranSw"  );	
		var eleTr_swList_ShowOrig    = document.getElementById( loopTypeId + "_showOrigSw" ); 
		var eleTr_swList_ShowTran    = document.getElementById( loopTypeId + "_showTranSw" );
				
		putListSw_onHTML(true,  eleTr_swList_SpeedReduce, ret_txLoopT_speedReduce );
		putListSw_onHTML(true,  eleTr_swList_WordByWord,  ret_txLoopT_wordByWord );
		putListSw_onHTML(false, eleTr_swList_Tran       , ret_txLoopT_swTran      );
		putListSw_onHTML(false, eleTr_swList_ShowOrig   , ret_txLoopT_swShowOrig  );
		putListSw_onHTML(false, eleTr_swList_ShowTran   , ret_txLoopT_swShowTran  );
	
		//--------------
		function putListSw_onHTML(swSpeed, eleTrList, ret_txLoopT_swList) {
			
			let eleTd, eleSw; 
			
			ret_txLoopT_swList = ret_txLoopT_swList.trim(); 
			
			//console.log("putListSw_onHTML=>" + ret_txLoopT_swList+ "<=="); 
			
			if (ret_txLoopT_swList == "") return;
			var numE = 0;
			let swList = [];
			if (ret_txLoopT_swList.indexOf(":") > 0 ) {
				var ret_tx  = ret_txLoopT_swList.split(":"); // eg. 6:80,false,false,false,false,false
				numE    = parseInt( ret_tx[0] ); 
			    swList  = ret_tx[1].split(","); 
			} else {
				swList  = ret_txLoopT_swList.split(","); 
			}
				
			
			for(var f=1; f < eleTrList.children.length; f++) {		
				try{
					eleTd = eleTrList.children[f]; 		
					eleSw = eleTd.children[0];
					if (eleSw.tagName == "INPUT") eleSw.checked = (swList[f] == "true");  
				} catch(e1) {
					console.log("error=", " f=", f, " eleTd=", eleTd, "\nsystem error=", e1); signalError(11); 
				}
			} 
			if (swSpeed) {
				eleTd = eleTrList.children[0]; 	
				if (eleTd.children.length > 0) {	
					eleSw = eleTd.children[1];
					if (eleSw.tagName == "INPUT") eleSw.value = parseInt(swList[0]); 
				}
			}		
			
		} //-------	
		//console.log("restore_fromStor_loopType_toHTM FINE ");
		
} // end of restore_fromStor_loopType 
//---------------------------------------

//-----------------------------------------

function lista_loop_parms_byType(loopTypeId) {
	//console.log("\nXXXXXXXXXXXXXXXXXXXXXX lista_loop_parms_byType XXXXXXXXXXXXXXXXXXXXXX")  
	var u=loopIndexOfType( loopTypeId );
	lista_loop_parms(u); 
	
} // end of lista_loop_parms_byType

//--------------------------

function lista_loop_parms(u) {
	if (txLoopT_limit_nome[u] == undefined) { 
		//console.log("loop parms riga u=",u," 0: ", "XXXXXXX txLoopT_limit_nome MANCANTE XXXXXXXX  r"); 
		return;
	}
	if (txLoopT_limit_nome[u]) {  // ATTENZIONE  esiston anche valori undefined 
		/*	
		console.log("loop parms u=",u,  " \t nome=", txLoopT_limit_nome[u] ,"\t loopType=" + txLoopT_limit_loopType[u], 
			"\t n.righe=", txLoopT_limit_nRighe[u], " \t n.repeat=", txLoopT_limit_nRepeat[u] )
		**	,
		 "\t   sw word separ.=[", txLoopT_limit_swSepar[ u ],"] ", 
		             ", sw speed reduction=[", txLoopT_limit_swSpeedReduce[u] ,"] ",
		             ", sw translate =", txLoopT_limit_swTran[u], "]"        );
		*/			 
	}
} // end of lista_loop_parms

//-------------------------------------------------
function loopIndexOfType( loopTypeId ) {	
	//const listaTipi = ",Tr00,Tr10,Tr20,Tr21,Tr22,Tg00,Tg10,Tg20,Tg21,Tg22,Tg30,Tg31,Tg32," ;  // row and group
	//var listaTipi = ",Tr00,Tr01,Tr02,Tr10,Tr11,Tr12,Tr20,Tr21,Tr22,Tg00,Tg01,Tg02,Tg10,Tg11,Tg12,Tg20,Tg21,Tg22,Tg30,Tg31,Tg32," ;  // row and group
	
	var pos= listaTipi.indexOf( ","+loopTypeId.trim() + ",") ; 
	if (loopTypeId == null) signalError(1);
	if (loopTypeId == undefined) signalError(2);
	if (loopTypeId == "") signalError(3);
	//console.log("XX  loopIndexOfType(" , loopTypeId, ") pos=", pos, " index=",  parseInt( pos/5 ) );
	
	return parseInt( pos/5 );
	
} // end of loopRowIndexOfType
//-------------------------------------------------
function getTypeName( loopTypeId ) {
	//console.log("getTypeName loopTypeId=", loopTypeId, " id=" + loopTypeId.substr(0, loopTypeId.length-1) + "_rLoop" )
	var eleName = document.getElementById( loopTypeId.substr(0, loopTypeId.length-1) + "_rLoop");	
	//console.log(" type name= nchild=", eleName.children.length, " outer=", eleName.outerHTML) 
	var nome="";
	if (eleName.children.length < 2) {
		nome = eleName.innerHTML;
		} else {
			//console.log(" nome [0] =", eleName.children[0].innerHTML )
			//console.log(" nome [1] =", eleName.children[1].innerHTML )
			nome = eleName.children[0].innerHTML; 
	}
	return nome.replaceAll("&nbsp;"," ").trim();  
	
} // end of getTypeName

//--------------------------
//      onclick_refresh_loopParms ("§§","spRedSw" , true,this)  
function onclick_refresh_loopParms( loopTypeId , where, sw0,this1) {
		// eg. id_loop = "20"
		var index = loopIndexOfType( loopTypeId );  
		
		var storeLoop= "==loop_" + loopTypeId  + " ix=" + index ;  
		
		//var sw1=((sw0) && (loopTypeId == "Tr10")); 
			
		
		//if (sw1) {
		//console.log("\nXXXXXXXXXXXXXXXXXXXXXXXXXX\n onclick_refresh_loopParms(" , "loopTypeId=", loopTypeId + " in ",where, " sw0=", sw0, "\n1tthis=", this1, ")"  +    " index=", index)
		//if (this1) 	console.log("\t ", this1.parentElement.parentElement.innerHTML)
		//}		
		
		var nome = getTypeName( loopTypeId );
		
		var ele_rLoop         = document.getElementById( loopTypeId + "_rLoop");  	
		var ele_nrLoop        = document.getElementById( loopTypeId + "_nrLoop");  	
		var ele_read_rowspeed = document.getElementById( loopTypeId + "_read_rowspeed");  

		var numRepit = parseInt(ele_rLoop.value ); 
	  	var numRighe = parseInt(ele_nrLoop.value); 
		/**
				console.log("                    onclick_refresh_loopParms(  ...rloopId=", loopTypeId + "_rLoop" )
				console.log("              ele_rLoop.outerHTML=", ele_rLoop.outerHTML )
				console.log("        ele_rLoop.type=" +  ele_rLoop.type + "<==" ) 	
				console.log("        ele_rLoop.value=" +  ele_rLoop.value + "<==" ) 	
				console.log("        ele_rLoop.innerHTML=" +  ele_rLoop.innerHTML + "<==" ) 	
				console.log("        numRepit=", numRepit); 
				console.log("                    onclick_refresh_loopParms(  ...nrloopId=", loopTypeId + "_nrLoop" )
				console.log("              ele_nrLoop.outerHTML=", ele_nrLoop.outerHTML )
				console.log("        ele_nrLoop.value=" +  ele_nrLoop.value + "<==" ) 	
		**/					
				
		//-------------------------------------------------
		// update localStor with values from HTML Page 
		//---------------------------------------------------------
		txLoopT_limit_loopType[   index] = loopTypeId;  
		txLoopT_limit_nome[   index] = nome;  
		txLoopT_limit_nRighe[ index] = numRighe; 
		txLoopT_limit_nRepeat[index] = numRepit;
		
		storeLoop+= " ::1n=" + nome + " ::2r=" + numRighe + " ::3r=" + numRepit + " "; 
		
		
		txLoopT_limit_swSpeedReduce[index] = [];
		txLoopT_limit_swWordByWord[ index] = [];
		txLoopT_limit_swTran[       index] = []; 	
		txLoopT_limit_swShowOrig[   index] = []; 	
		txLoopT_limit_swShowTran[   index] = []; 
		
		if (ele_read_rowspeed) {
			if (ele_read_rowspeed.innerHTML != "") {
				/**
				if ( loopTypeId == "Tr20") {
					console.log( "1 ele_read_rowspeed=", ele_read_rowspeed)
					console.log("Tr20 rowspeed=" + "\n\t" + ele_read_rowspeed.parentElement.parentElement.innerHTML) ;
				}	
				**/
				//var pref= '_' + ele_read_rowspeed.id.substring(0,4);
				//console.log( "id=" +  "rSepW"    + pref)
						
				var eleTr_swList_SpeedReduce = document.getElementById( loopTypeId + "_spRedSw" );
				var eleTr_swList_WordByWord  = document.getElementById( loopTypeId + "_wbwSw" );
				var eleTr_swList_Tran        = document.getElementById( loopTypeId + "_tranSw"  );
				var eleTr_swList_ShowOrig    = document.getElementById( loopTypeId + "_showOrigSw"  );
				var eleTr_swList_ShowTran    = document.getElementById( loopTypeId + "_showTranSw"  );
				
				if (eleTr_swList_SpeedReduce)	txLoopT_limit_swSpeedReduce[index] = getListSw_fromHTML(true,  eleTr_swList_SpeedReduce);
				if (eleTr_swList_WordByWord)	txLoopT_limit_swWordByWord[index]  = getListSw_fromHTML(true,  eleTr_swList_WordByWord);
				if (eleTr_swList_Tran       )	txLoopT_limit_swTran[       index] = getListSw_fromHTML(false, eleTr_swList_Tran       );
				if (eleTr_swList_ShowOrig   )   txLoopT_limit_swShowOrig[   index] = getListSw_fromHTML(false, eleTr_swList_ShowOrig   );  				
				if (eleTr_swList_ShowTran   )   txLoopT_limit_swShowTran[   index] = getListSw_fromHTML(false, eleTr_swList_ShowTran   );  	
			}
		} 
		storeLoop+= " ::4w=" + txLoopT_limit_swWordByWord[index]  + 	
					" ::5r=" + txLoopT_limit_swSpeedReduce[index] + 			
					" ::6t=" + txLoopT_limit_swTran[index]        +
					" ::7s=" + txLoopT_limit_swShowOrig[index]    + 
					" ::8s=" + txLoopT_limit_swShowTran[index]  		
		;  
	    
		//if (sw1) console.log("index=", index, " storeLoop ==>" + storeLoop); 
		
		sel_loopTypeSet[index] = storeLoop; 
	
		//console.log("  onclick_refresh_loopParms  chiama  plus_set_localStorage_var (1"); 
		
		plus_set_localStorage_var(1,  loopTypeId , sw0,this1);
				
		//-----------------------------------------
		function getListSw_fromHTML(swSpeed, eleTrList ) {
			//console.log("getList  storeLoop=", storeLoop , " swSpeed=", swSpeed, " eleTrList=", eleTrList)
			var swList=[false];	var eleTd, eleSw; 	
			var numCh = eleTrList.children.length;
			for(var f=1; f < numCh; f++) {			
				eleTd = eleTrList.children[f]; 		
				eleSw = eleTd.children[0];
				if (eleSw.tagName == "INPUT") swList[f] = eleSw.checked; 
				else swList[f] = false; 
			} 
			
			if (swSpeed) {
				//console.log("1 spped swList=", swList.toString() ); 
				eleTd = eleTrList.children[0]; 	
				//console.log("ANTO XXXX eleTd=" , eleTd.innerHTML , " num ch=", eleTd.children.length);
				if (eleTd.children.length > 0) {	
					eleSw = eleTd.children[1];
					//console.log("child[1].eleSw.value=", eleSw.value, " inner=", eleSw.innerHTML)
					if (eleSw.tagName == "INPUT") swList[0] = parseInt(eleSw.value); else swList[0] = 0; 
				}
				//console.log("2 spped swList=", swList.toString() ); 
			} else {
				swList[0] = 0; 
			}
			//console.log("numCh : swList=" +  numCh + ": ==> " + swList.toString()); 
			//return numCh + ":" + swList; 
			return swList; 
		} //-------	
		
} // end of onclick_refresh_loopParms 
//---------------------------------------

function fun_getLoopTypeValFromStore( storeLoop ) { 

	var ret_txLoopT_nome    = "";   
	var ret_txLoopT_nRighe  = "";   
	var ret_txLoopT_nRepeat = "";   
	
	var ret_txLoopT_speedReduce = "";  
	var ret_txLoopT_wordByWord  = "";  	
	var ret_txLoopT_swTran  = "";		
	var ret_txLoopT_swShowOrig= "";	
	var ret_txLoopT_swShowTran= "";		
	var fields= storeLoop.split("::");
	fields.forEach(assignLoopVal);
	function assignLoopVal(item) {
		var val1 = item.substr(3); 
		switch(item.substr(0,3) ) {
		   case "1n=": ret_txLoopT_nome        = val1; break;   
		   case "2r=": ret_txLoopT_nRighe      = val1; break;   
		   case "3r=": ret_txLoopT_nRepeat     = val1; break;  
		   case "4w=": ret_txLoopT_wordByWord  = val1; break;   		   
		   case "5r=": ret_txLoopT_speedReduce = val1; break; 		  
		   case "6t=": ret_txLoopT_swTran      = val1; break;   
		   case "7s=": ret_txLoopT_swShowOrig  = val1; break;   
		   case "8s=": ret_txLoopT_swShowTran  = val1; break;   
		   default: break; 
		}	   
	}
	console.log("get Loop: ", "ret_txLoopT_nome    = ",  ret_txLoopT_nome  ) ;
	console.log("get Loop: ", "ret_txLoopT_nRighe  = ",  ret_txLoopT_nRighe) ;
	console.log("get Loop: ", "ret_txLoopT_nRepeat = ",  ret_txLoopT_nRepeat ) ;	
	console.log("get Loop: ", "ret_txLoopT_ret_txLoopT_wordByWord = ",  ret_txLoopT_wordByWord  ) ;
	console.log("get Loop: ", "ret_txLoopT_swSpeedReduce = ",  ret_txLoopT_speedReduce ) ;
	console.log("get Loop: ", "ret_txLoopT_swTran  = ",  ret_txLoopT_swTran  ) ;
	console.log("get Loop: ", "ret_txLoopT_swShowOrig  = ",  ret_txLoopT_swShowOrig ) ;	
	console.log("get Loop: ", "ret_txLoopT_swShowTran  = ",  ret_txLoopT_swShowTran ) ;
	
} // end of fun_getLoopTypeValFromStore

//-------------------------------------------
function build_loopType_HTML() {

	build_loopType_rowspeed_inHTML("Tr00", ""  );
	build_loopType_rowspeed_inHTML("Tr10", ""  );
	build_loopType_rowspeed_inHTML("Tr20", "1)");
	build_loopType_rowspeed_inHTML("Tr21", "2)");
	build_loopType_rowspeed_inHTML("Tr22", "3)");
	
	build_loopType_rowspeed_inHTML("Tg00", ""  );
	build_loopType_rowspeed_inHTML("Tg10", ""  );
	build_loopType_rowspeed_inHTML("Tg20", ""  );
	build_loopType_rowspeed_inHTML("Tg21", ""  );
	
	build_loopType_rowspeed_inHTML("Tg30", "1)");
	build_loopType_rowspeed_inHTML("Tg31", "2)");
	build_loopType_rowspeed_inHTML("Tg32", "3)");
}
//----------------------
function build_loopType_rowspeed_inHTML( loopTypeId, headSpeed ) {
		var ele_rLoop         = document.getElementById( loopTypeId + "_rLoop");  	
		//var ele_nrLoop        = document.getElementById( loopTypeId + "_nrLoop");  	
		var ele_read_rowspeed = document.getElementById( loopTypeId + "_read_rowspeed");  
		
		if (ele_rLoop == null) { console.log("loop type ", loopTypeId, " does not exist"); return;} 	
		if (ele_read_rowspeed) {		
			ele_read_rowspeed.innerHTML = ele_read_rowspeed.innerHTML.replaceAll("§§", loopTypeId);
			if (headSpeed != ""){
				var ele_headSpeed = document.getElementById( loopTypeId + "_headSpe" ) ;  
				if (ele_headSpeed) ele_headSpeed.innerHTML = headSpeed;
			}	
		} else {			
			//console.log("build_loopType_rowspeed_inHTML(loopTypeId=", loopTypeId, "  headSpeed=",  headSpeed  , " elem. " + loopTypeId + "_read_rowspeed ", " non esiste");
			//signalError(20);
		}	
		
} // end of build_loopType_rowspeed_inHTML

//----------------------------------------------------
function load_loop_parameters_fromHTML_to_vars(wh) {
	//console.log("%cload_loop_parameters_fromHTML_to_vars ", "color:blue;");
	onclick_refresh_loopParms("Tr00", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tr10", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tr20", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tr21", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tr22", "load_loop_parameters_fromHTML_to_vars" );
	
	onclick_refresh_loopParms("Tg00", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tg10", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tg20", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tg21", "load_loop_parameters_fromHTML_to_vars" );
	
	onclick_refresh_loopParms("Tg30", "load_loop_parameters_fromHTML_to_vars" );
	onclick_refresh_loopParms("Tg31", "load_loop_parameters_fromHTML_to_vars" );	
	onclick_refresh_loopParms("Tg32", "load_loop_parameters_fromHTML_to_vars" );
	
	lista_loop_parms_byType("Tr00");
	
	//console.log("  lista_loop_parms_byType ()  lista_loop_parms_byType('Tr00')");	
	
	lista_loop_parms_byType("Tr10");	
	lista_loop_parms_byType("Tr20");
	lista_loop_parms_byType("Tr21");
	lista_loop_parms_byType("Tr22");
	
	lista_loop_parms_byType("Tg00");
	lista_loop_parms_byType("Tg10");
	lista_loop_parms_byType("Tg20");
	lista_loop_parms_byType("Tg21");
	lista_loop_parms_byType("Tg22");
	lista_loop_parms_byType("Tg30");
	lista_loop_parms_byType("Tg31");
	lista_loop_parms_byType("Tg32");
	
}	// end of load_loop_parameters_fromHTML_to_vars 	

//---------------------------------------

function getLType12( ix, loopTypeId0) { 

	//console.log(" getLType12( ix=", ix , "   loopTypeId0=", loopTypeId0) ;  
	//console.log(" in getLType12  txLoopT_limit_loopType[ ix ] = ", txLoopT_limit_loopType[ ix ] ); 
	var loopTypeId1 = "";
	var loopTypeId2 = "";
	var ix1 = (ix+1);
	var ix2 = (ix+2);
	
	//console.log(" in getLType12  txLoopT_limit_loopType[ ix1 ] = ", txLoopT_limit_loopType[ ix1 ] ); 
	//console.log(" in getLType12  txLoopT_limit_loopType[ ix2 ] = ", txLoopT_limit_loopType[ ix2 ] ); 
	
	if (txLoopT_limit_loopType.length <= ix1) return [loopTypeId1, loopTypeId2];  
	
	loopTypeId1 =  txLoopT_limit_loopType[ix1];
	
	//console.log(" in getLType12  loopTypeId1=", loopTypeId1); 
	
	if (loopTypeId1 == undefined)  return ["",""];
	
	//console.log(" in getLType12  loopTypeId1.substring(0,3) =", loopTypeId1.substring(0,3) ) 
	
	if (loopTypeId1.substring(0,3) != loopTypeId0.substring(0,3)) {
		//console.log(" in getLType12  NO  ", loopTypeId1  , " è un altro tipo" ) 
		loopTypeId1 = ""; loopTypeId2 = ""; 
		return ["",""]; 
	}
	//---	
	if (txLoopT_limit_loopType.length <= ix2) return [loopTypeId1, loopTypeId2];

	loopTypeId2 = txLoopT_limit_loopType[ix2];	
	if (loopTypeId2 == undefined)  return [loopTypeId1, ""];
	
	if (loopTypeId2 == "") return [loopTypeId1, loopTypeId2];
	
	if (loopTypeId2.substring(0,3) != loopTypeId0.substring(0,3)) {
		//console.log(" in getLType12  NO ", loopTypeId2  , " è un altro tipo" ) 
		loopTypeId2 = ""; 
		return [loopTypeId1, loopTypeId2]; 
	}
	return [loopTypeId1, loopTypeId2];
	
} // end of getLType12
//-------------------------------
function onclick_anotherLoopType(this1, sw_group, sw_incr, wh) {
	
	//if (wh) console.log("onclick_anotherLoopType "  , " chiamato da ", wh) 
	/*
	this function is used to get loop type parameters, the type is changed at each call (unless sw_incr = false)     
	this1    = button element: parent = TD, children[0] = loop type 
	sw_group = false: it's a row to play, true: it's a group of rows 
	sw_incr  = true: each click gets a new type, false: no-type rotation, the function is called by other functions     	
	*/
	
	/**
	if (this1) {
		console.log("\nXXXXXXXXXXXXXXXXXX\n1 onclick_anotherLoopType  this1=", this1.id, " sw_group=", sw_group, " sw_incr=", sw_incr , "( loop_type rotate)" ); 
	} else {
		console.log("1 onclick_anotherLoopType  this1=", " null = ", this1.id); 
		signalError(4);
	}
	**/
	
	let loopTypeId0 =""; 
	let loopTypeId1 =""; 
	let loopTypeId2 =""; 
	//-----
	//for(var h=0; h < txLoopT_limit_nome.length; h++) { console.log("      ZZZ txLoopT_limit_nome[",h,"] = ", txLoopT_limit_nome[ h ] , " ",txLoopT_limit_loopType[ h ] );  	  } 
	//-------
	
	//let td1= this1.parentElement;
	//console.log("2 onclick_anotherLoopType  td=", td1.outerHTML); 
	//console.log("3 onclick_anotherLoopType  td.children len =", td1.children.length); 
	//let ele_showWh = td1.children[2]; 	
	
	let ch= this1.children;
	let ix = parseInt( ch[0].innerHTML); 	
	
	loopTypeId0 = txLoopT_limit_loopType[ix];
	
	//console.log("4 onclick_anotherLoopType   ch=", ch, " num ch =", ch.length , " ix=", ix, "    loopTypeId0=" , loopTypeId0 ) ; 
	
	  
	var ixG00 = loopIndexOfType( "Tg00");  // inizio dei tipi gruppo
	
	var fromI=0,  toI = ixG00-1;  // index of: no loop, loop_r1, loop r2
	if (sw_group) {
		fromI = ixG00;  
		toI = txLoopT_limit_nome.length-1;		
	}	
	var fromI2 = fromI+2; 
	//ix = parseInt( ch[0].innerHTML); 		
	//console.log("anto 1 sw_group=", sw_group,  " sw_incr=", sw_incr, "  ix=", ix,  " fromI=", fromI, " toI=", toI ); 	
	if (sw_incr) {	
		// cerca il prossimo indice che punta ad un tipo che termina con 0  (eg. dopo Tg20 trova Tg30 anche se esiste Tg21)   
		ix++; 		 	
		if (ix >= toI) ix = fromI;	
		if (ix >= fromI2) {
			for(var h=ix; h <= toI; h++) {   			
				ix = h; 
				if (", Tr00, Tr10, Tr20, Tr30, Tg00, Tg10, Tg20, Tg30 ".indexOf( txLoopT_limit_loopType[ix] ) >= 0) break;     
			}	
		}
	} 
	if (ix >= toI) ix = fromI;	
	if (ix < fromI) ix = fromI; 		
	
	ch[0].innerHTML = ix;	
	
	
	 
	//console.log("   XXXXXXXXX   loopT_limit_loopType[ix=", ix,"] = ",  txLoopT_limit_loopType[ix]  ); 
	ch[3].innerHTML = "";
	if (ix == fromI) {
		ch[1].style.display = "none";
	} else {
		ch[1].style.display = "block" ; // show loop symbol
	} 
	//console.log("     ix=", ix, " LOOP ch[1]=",  ch[1].innerHTML )
	//------------------------------
	/**
	if (sw_group) {
		loopTypeId0 = "Tg" + ix + "0"; 			
		if (ix==2) {
			loopTypeId1 = "Tg" + ix + "1";	
			//loopTypeId2 = "Tg" + ix + "2";	
		}	
	} else {
		loopTypeId0 = "Tr" + ix + "0"; 	
		if (ix==2) {
			loopTypeId1 = "Tr" + ix + "1";
			loopTypeId2 = "Tr" + ix + "2";
		}		
	}
	**/
	loopTypeId0 = txLoopT_limit_loopType[ix];
	
	//console.log("anto 2   ix=", ix, "  loopTypeId0=",  loopTypeId0 , " txLoopT_limit_loopType.length=", txLoopT_limit_loopType.length); 
	
	//console.log(" PRIMA  txLoopT_limit_loopType[ ix ] = ", txLoopT_limit_loopType[ ix ] ); 
	//console.log(" txLoopT_limit_loopType[ (ix+1) ] = ", txLoopT_limit_loopType[ (ix+1) ] ,  "   (ix+1)=", (ix+1) ); 
	var z12 =  getLType12( ix, loopTypeId0); 
	loopTypeId1 = z12[0]; 
	loopTypeId2 = z12[1];
	
	//console.log("anto 3   ix=", ix, "  loopTypeId0=",  loopTypeId0 , "  loopTypeId1=",  loopTypeId1 , "  loopTypeId2=",  loopTypeId2); 	
	
	var index0=-1, index1=-1, index2=-1;	
	
	index0 = loopIndexOfType( loopTypeId0 );  
	
	
	thisLineList_loopType1 = ""; 
	thisLineList_loopType2 = ""; 
	thisLineList_nome1 = ""; 
	thisLineList_nome2 = ""; 
	
	thisLineList_loopType0		= txLoopT_limit_loopType[index0] ;  
	thisLineList_nome0    		= txLoopT_limit_nome[    index0] ;  	
	thisLineList_nRighe0  		= txLoopT_limit_nRighe[  index0] ; 
	thisLineList_nRepeat0 		= txLoopT_limit_nRepeat[ index0] ;
	//thisLineList_swSepar0 		= txLoopT_limit_swSepar[ index0].slice();  
	thisLineList_swSpeedReduce0	= txLoopT_limit_swSpeedReduce[index0].slice();  
	thisLineList_swWordByWord0	= txLoopT_limit_swWordByWord[index0].slice();  
	thisLineList_swTran0  	    = txLoopT_limit_swTran[     index0].slice(); 
	thisLineList_swShowOrig0 	= txLoopT_limit_swShowOrig[ index0].slice(); 	
	thisLineList_swShowTran0    = txLoopT_limit_swShowTran[ index0].slice();  
	
	if (index0 == 0) {
		thisLineList_swSpeedReduce0	= txLoopT_limit_swSpeedReduce[1].slice();  
		thisLineList_swWordByWord0	= txLoopT_limit_swWordByWord[1].slice();  		
	}
	
	//var field0 = thisLineList_swSpeedReduce0[0].split(":"); 
	//thisLineList_swSpeedReduce0[0] = field0[1]; 
	
	//console.log("anto4 index0=", index0, " thisLineList_loopType0=",thisLineList_loopType0 , " thisLineList_nRighe0=",thisLineList_nRighe0, " thisLineList_nRepeat0=",thisLineList_nRepeat0 )  
	
	let highlight_loop = 'color:blue;background-color:yellow;font-weight=bold;' ; 
	var nome2 = thisLineList_nome0.split("(")[0]; 
	if (ix == fromI) ch[2].innerHTML = nome2;
	else             ch[2].innerHTML = '<span style=' + highlight_loop + '>'   + nome2 + '</span>';			
	
	if (loopTypeId1 == "") {
		thisLineList_loopType1		= "";  
		thisLineList_nome1    		= "";  
		thisLineList_nRighe1  		= 0; 
		thisLineList_nRepeat1 		= 0;
		//thisLineList_swSepar1 		= [];  
		thisLineList_swSpeedReduce1	= [];  
		thisLineList_swTran1 	    = [];       
		thisLineList_swShowOrig1   	= []; 	
		thisLineList_swShowTran1   	= []; 	
	} else {	
		index1 = loopIndexOfType( loopTypeId1 );  
		//console.log("	loopTypeId1 =", loopTypeId1 , "   index1=", index1 );  
		thisLineList_loopType1		= txLoopT_limit_loopType[index1] ;  
		thisLineList_nome1    		= txLoopT_limit_nome[    index1] ;  
		thisLineList_nRighe1  		= txLoopT_limit_nRighe[  index1] ; 
		thisLineList_nRepeat1 		= txLoopT_limit_nRepeat[ index1] ;
		//thisLineList_swSepar1 		= txLoopT_limit_swSepar[ index1].slice();  
		thisLineList_swSpeedReduce1	= txLoopT_limit_swSpeedReduce[index1].slice();  
		thisLineList_swWordByWord1	= txLoopT_limit_swWordByWord[index1].slice(); 
		thisLineList_swTran1      	= txLoopT_limit_swTran[index1].slice(); 			
		thisLineList_swShowOrig1   	= txLoopT_limit_swShowOrig[index1].slice(); 	
		thisLineList_swShowTran1   	= txLoopT_limit_swShowTran[index1].slice(); 	
	} 
	if (loopTypeId2 == "") {
		thisLineList_loopType2		= "";  
		thisLineList_nome2    		= "";  
		thisLineList_nRighe2  		= 0; 
		thisLineList_nRepeat2 		= 0;
		//thisLineList_swSepar2 		= [];  
		thisLineList_swSpeedReduce2	= [];  
		thisLineList_swTran2 	    = [];       
		thisLineList_swShowOrig2   	= []; 	
		thisLineList_swShowTran2   	= []; 	
	} else {	
		index2 = loopIndexOfType( loopTypeId2 ); 			
		//console.log("	loopTypeId2 =", loopTypeId2 , " index2=", index2 );  
		thisLineList_loopType2		= txLoopT_limit_loopType[index2] ;  
		thisLineList_nome2    		= txLoopT_limit_nome[    index2] ;  
		thisLineList_nRighe2  		= txLoopT_limit_nRighe[  index2] ; 
		thisLineList_nRepeat2 		= txLoopT_limit_nRepeat[ index2] ;
		//thisLineList_swSepar2 		= txLoopT_limit_swSepar[ index2].slice();  
		thisLineList_swSpeedReduce2	= txLoopT_limit_swSpeedReduce[index2].slice();  
		thisLineList_swWordByWord2	= txLoopT_limit_swWordByWord[index2].slice();  
		thisLineList_swTran2     	= txLoopT_limit_swTran[index2].slice(); 
		thisLineList_swShowOrig2   	= txLoopT_limit_swShowOrig[index2].slice(); 	
		thisLineList_swShowTran2   	= txLoopT_limit_swShowTran[index2].slice(); 	
	}	
	
} // end of onclick_anotherLoopType

//-------------------------------


//----------------
function onclick_showtabLoop(thisId) {
	var eleDivLoop = document.getElementById(thisId);
	if (eleDivLoop.style.display == "block") {
		eleDivLoop.style.display = "none";
		document.getElementById("id_h01").style.display = "none";
	} else {	
		eleDivLoop.style.display = "block";
	}	
} // end of onclick_showtabLoop
//-------------------	


//================================

function soundEffect(my_frequency) {

	if (sw_audioCtx_not_active) {
		sw_audioCtx_not_active = false;		
		audioCtx = new AudioContext();  // deve essere inizializzato da un intervento utente ( per esempio premeno un pulsante	
	} 
	//------------------------------------------	
	function playSound( onda , my_frequency, volume1) {
			// create web audio api context

			//const audioCtx = new AudioContext();  // lo metto fuori, perchè altrimenti crea diverse istanze, ma esiste un numero massimo di istanze da non superare  
			if (volume1 == undefined) volume1 = 1;  
			const my_duration = 0.5;
			const oscillator1 = audioCtx.createOscillator();
			const gainNode1   = audioCtx.createGain();
			
			oscillator1.connect(gainNode1);
			gainNode1.connect(audioCtx.destination);
			
			oscillator1.type = onda; // "square";
			oscillator1.frequency.setValueAtTime(my_frequency, audioCtx.currentTime); // value in hertz
			
			gainNode1.gain.value = volume1;
			oscillator1.start();
			oscillator1.stop(audioCtx.currentTime + my_duration);
			
	} // end of playSoundEffect	

	playSound("sine", my_frequency, 0.5);  // forma onda, frequenza, volume  

} // end of soundEffect

//------------------------------------------------------

function onclick_tts_seeWords3(this1, numId) {	
	//console.log("08_nuovo  onclick_tts_seeWords3() numId=", numId );

	var anal_txt = "";  // var anal_tts_txt=""; 
	var idc1 = "idc_"  + numId;   // frase originale 

	var anal_ele_idc   = document.getElementById(idc1 );		  // frase originale 
		
	if (anal_ele_idc) {
		anal_txt = getInner_idc( anal_ele_idc );
	} else {
		return;
	}
	/***
	<tr>    riga 
		...
	   <td class="playBut1">
		   <button class="buttonTD2" id="idG_§1§" onclick="onclick_tts_seeWords(this, §1§)">
				<span style="font-size:2em;height:1.4em;padding:0 0.1em;"><span>${magnifyingGlass_symb}</span></span>
		   </button>
		</td>  		
		<td> 
			<div class="divRowText" >
				<div class="suboLine" style="display:none;" id="idc_§1§">§4txt§</div>               //  frase originale 
				<div class="tranLine" style="display:none;" id="idt_§1§">§5txt§<br></div>		    // traduzione 		
				<div id="idw_§1§"></div> 
				<div style="display:none;" id="idtts§1§">§ttstxt§</div>
			</div>
		</td>		
		...
	</tr>
	
	XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	 
	<td style="background-color: yellow;"> 
		<div class="divRowText">
			<div class="suboLine boldLine" style="display: block; background-color: yellow;" id="idc_4">Das ist Nummer 4.</div>                     // idc_ ...   FRASE originale 
			<div class="tranLine" style="display:none;" id="idt_4">Questo è il numero 4.<br></div>		                                             // idt_ ... traduzione  		
			<div id="idw_4">                                                                                                                       // idw...  contiene tabella parole della frase  
			</div>
		</div>
	</tr>
	**/
	
	var id_analWords = "idw_" + numId;        
	var ele_wordset = document.getElementById(id_analWords);   // output = table of words 
	if (ele_wordset.children.length > 0 ) {
		ele_wordset.innerHTML = "";
		return; 
		/**
		var elett = ele_wordset.children[0];
		if (elett.tagName == "TABLE") {
			if (elett.style.display == "block") elett.style.display = "none";
			else elett.style.display = "block";
			return;	
		}	
		**/		
	}	
	var table_txt = tts_3_spezzaRiga3(anal_txt, numId)	 ;   
 	
	//var divWord = "";	
	//divWord += table_txt;
	
	ele_wordset.innerHTML = table_txt;  // divWord; 
	
			
} //  end of onclick_tts_seeWords()
	
//-------------------------------------


// ===================================================================
function tts_3_spezzaRiga3(orig_riga, numId) {

	/**
    var orig_riga2 = orig_riga.replaceAll(". ", ". §").replaceAll("! ", "! §").replaceAll("? ", "? §").replaceAll("; ", "; §").
							replaceAll(": ", ": §").replaceAll(", ", ", §").replaceAll(" ", " §");

    var listaParole =  orig_riga2.split("§");
	**/
	var listaParole = getListOfWords_inText(orig_riga, charList);
	  
    let clipSub_showTxt = "";
	
	clipSub_showTxt += `		
			<div style="font-size:0.6em;color: black;text-align:center;margin-top:0.5em;">					
				clicca su una parola per ottenere la lista di tutte le frasi che la contengono							
			</div>  `;
						
	clipSub_showTxt += '<table style="display:block; width:100%;margin-top:0.5em;"> \n'; 		
	clipSub_showTxt +=  `		
         <colgroup>
            <col id="col_1_2_arrow" span="2">
            <col id="col_3_showHideOrig" span="1">
            <col id="col_4_showHideTran" span="1" style="visibility: collapse;">
            <col id="col_5_splitwords"   span="1" style="visibility: collapse;">
            <col id="col_6_subText"      span="1" style="width:100%;">
			<col id="col_ttsLoop"        span="1">
            <col id="col_ttsVoice0"      span="1">
            <col id="col_ttsVoice0x"     span="1" style="visibility: collapse;">            
            <col id="col_ttsWord"        span="1">
			<col id="col_tts_pause"      span="1">
			<col id="col_tts_cancel"     span="1">
            <col id="col_numSub"         span="1">
         </colgroup>  \n  ` ; // 	
	clipSub_showTxt = clipSub_showTxt.replaceAll("§x1§",numId); 
	let z3Base = numWordBase + numId * 100;

	//console.log("numWordBase=", numWordBase, "  numId=", numId, "  z3Base=", z3Base); 

	// "§swAlfaHtml§" = "true")  in tts_3_spezzaRiga3  in onclick_tts_seeWords3
	
	for (let z3 = 0; z3 <listaParole.length; z3++) {  
		let unaParola = listaParole[z3]; 
		
		if (unaParola == "") continue; 		
        let rowclip = string_tr_xxWord.replaceAll("§1§", (z3Base + z3) ).
			replaceAll("§4txt§", unaParola).replaceAll("§5txt§", "").replaceAll("§5dftxt§", "").
			replaceAll("§swAlfaHtml§","true").	
			replaceAll("§ttstxt§", "").
			replaceAll('§spelling§','spelling'); 
		//console.log("numId=", numId, " z3=", z3, " rowclip=",  	rowclip ); 
        clipSub_showTxt += rowclip + "\n";		
    } // end of for z3
	
	clipSub_showTxt += "</table> \n"; 		
	clipSub_showTxt += `
		<div class="centerFlex">
			<div>
				<div style="font-size:0.5em;color: black;text-align:left;margin-top:1.5em;">	
					è possibile ottenere la lista delle frasi che contengono una qualunque parola o combinazione di parole, 
					inserendo le parole richieste nelle 2 liste e poi premendo il pulsante di ricerca.
					<br>Per soddisfare il criterio di scelta una parola delle lista1 deve essere presente insieme ad una parola della lista2  (una delle due lista può essere vuota).
					<br>(es. la prima lista potrebbe contenere il prefisso di un verbi composto tedesco, la seconda le voci di paradigma dello stesso verbo)   
					<table>								
						<tr><td>1) lista di parole</td><td><textarea id="idwS1_§x1§" cols="50" rows="1" placeholder="ab" ></textarea></td></tr>
						<tr><td>2) lista di parole</td><td><textarea id="idwS2_§x1§" cols="50" rows="2" placeholder="gebe gebt gab gegeben" ></textarea></td></tr>
					</table>
				</div>	
				<div style="font-size:0.6em;text-align:center;margin-bottom:1.5em;padding-bottom:2em; border-bottom:1px solid black;">
					<button class="but_word" style="font-size:1.0em;" onclick="onclickSelectWord(2,'§x1§')">cerca tutte le frasi che contengono le parole delle liste1 e 2</button>	
					<br><span id="err_§x1§" + style="color:red; font-weight:bold;display:none;"></span>
				</div>
				
			</div>
		</div> `;
	
	return clipSub_showTxt;

} // end of fun_build_all_clip()  


//===================================

  var myVoice;
  let voices;
//-------------------------------------------------
function begin_lbl2() {
	console.log("%cXXXXXXXXXX   begin() XXXXXXXXXXXXXXXXXX", "color:blue;");
	
	//copyLev2Page("mioArgInHTML");
 
	//	console.log("begin 1 copy page2_content") 
	
	document.getElementById("page2_2").innerHTML = page2_content.trim() ; 	
	
	console.log("begin 2 copy div_voices"); 	
		
	ele_div_voices.innerHTML = div_voices.trim(); 
	
	//---------	
	 document.getElementById("divTabHloop"       ).outerHTML =  table_idTabHloop;	
   //document.getElementById("Tr00_read_rowspeed").innerHTML =  table_read_rowspeed; 
	 document.getElementById("Tr10_read_rowspeed").innerHTML =  table_read_rowspeed; 	 
	 document.getElementById("Tr20_read_rowspeed").innerHTML =  table_read_rowspeed;
     document.getElementById("Tr21_read_rowspeed").innerHTML =  table_tran_rowspeed; // translation only 
     document.getElementById("Tr22_read_rowspeed").innerHTML =  table_tran_rowspeed; // translation only 	 
	 
   //document.getElementById("Tg00_read_rowspeed").innerHTML =  table_read_rowspeed;
     document.getElementById("Tg10_read_rowspeed").innerHTML =  table_tran_rowspeed;	
   //document.getElementById("Tg20_read_rowspeed").innerHTML =  table_read_rowspeed;
	 document.getElementById("Tg21_read_rowspeed").innerHTML =  table_tran_rowspeed;
   
     document.getElementById("Tg30_read_rowspeed").innerHTML =  table_tran_rowspeed;
	 document.getElementById("Tg31_read_rowspeed").innerHTML =  table_tran_rowspeed;
	 document.getElementById("Tg32_read_rowspeed").innerHTML =  table_tran_rowspeed;
	 
	 //if (document.getElementById("g21_read_rowspeed").innerHTML == "") console.log(errore)
	//------------------
	//console.log("antonio ", document.getElementById("Tr21_read_rowspeed").children[0].children[0].children[0].children[0].outerHTML )
	
	//---------------------------
	console.log("begin 3.1 ");
 	
	build_loopType_HTML(); 
	
	plus_initial_from_localStorage_values();
	
	restore_prevRun_loop_parameters_to_htmlPage();
	
	
	load_loop_parameters_fromHTML_to_vars(1);
	
	listRadioPF = document.getElementsByName('radioPF');	
	setInitVarVoice();		
	
	//setNew_varLoop_and_PF();
	//console.log("antonio 9 dic ", document.getElementById("Tr10_read_rowspeed").innerHTML ); 
	//var loopTypeId00="Tr21"; var ele_nrLoop00 = document.getElementById(loopTypeId00 + "_nrLoop") ; 
	//console.log("dopo setNew_varLoop_and_PF() ",  loopTypeId00 + "_nrLoop", " ", ele_nrLoop00.tagName, " value=", ele_nrLoop00.value); 
	
	
	
	//console.log("dopo load_loop_parameters_initial() ",  loopTypeId00 + "_nrLoop", " ", ele_nrLoop00.tagName, " value=", ele_nrLoop00.value); 

	
	// NOVEMBRE2024 string_tr_xx = "\n" + prototype_tr_m2_tts + "\n" + prototype_tr_m1_tts + "\n" + prototype_tr_tts; 
	string_tr_xx = "\n" + prototype_tr_tts;  // NOVEMBRE2024
	string_tr_xxWord = "\n" + prototype_tr_ttsWord; 		
	
	
	lev2_build_all_clip();
	
	//plus_initial_from_localStorage_values();
	
	
	
	//console.log("begin 4 ==> fcommon   (funzione asincrona) ")
		
		/**
		XXXXXXXXXXXXXXXX ATTENZIONE fcommon...  è una funzione asincrona  XXXXXXXXXXXXXXXXXXXXXXX 
		eventuali istruzioni che la seguono, saranno eseguite IMMEDIATAMENTE, cioè senza attendere la fine di fcommon_load.... "
		XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");  
		*/
		
	fcommon_load_all_voices();  // at end calls tts_1_toBeRunAfterGotVoices()
		
	//console.log("begin 9 ==> end begin xxxxxxxxxxxxxxxxxxxxx\n ");
	
} // end of begin

//------------------------------------
function get_languageName( en_GB ) {
	
	var la =  (en_GB+"--").replaceAll("_","-").split("-");	
	var id_lang    = la[0];
	var id_country = la[1]; 
	
	if (myLocalLanguage == "xx") {
		myLocalLanguage = "en";
	}
	id_lang    = (""+id_lang).trim().toLowerCase();
	id_country = (""+id_country).trim().toUpperCase();
	
	//console.log("en_GB=", en_GB , " id_lang=", id_lang, " myLocalLanguage=",  myLocalLanguage )
	
	var r_lang = ""; var r_country=""; 
	
	if (myLocalLanguage == "") return id_lang + " - " + id_country;  
		
	const countryExt  = new Intl.DisplayNames([ myLocalLanguage ], { type: 'region'   } );
	const languageExt = new Intl.DisplayNames([ myLocalLanguage ], { type: 'language' } ); 
	
	
	if (id_lang != "")    r_lang    = languageExt.of( id_lang    ); 
	if (id_country != "") r_country = countryExt.of(  id_country );  
	
	r_lang    = r_lang.substr(0,1).toUpperCase()    + r_lang.substr(1); 
	r_country = r_country.substr(0,1).toUpperCase() + r_country.substr(1); 
	
	return r_lang + " - " + r_country;  
	
}

//-------------------------------------
/*
	let selected_voice_ix                    = 0 ;     // eg. 65 	 
	let selected_voiceName                   = "";     // eg. Microsoft David - English (United States)"; 	
	let	selected_voiceLangRegion             = "";     // eg. en-us	
	let	selected_voiceLang2      
*/  

//-------------------------------------------------

function lev2_build_all_clip() {
	
	//console.log("lev2_build_all_clip ()" );
	
    let clipSub_showTxt = "", txt1;
  
	var printBil =""; 
	printStringBilingual =""; 

	var trantxt1, tts1; var eleTr;
	
	for(var z1=0; z1 < 3; z1++) {  	
		//console.log("ele_inp1.tagName=" + ele_inp1.tagName, " len=" , ele_inp1.children.length);		
		if (ele_inp1.children[0].tagName == "TR") { break;}		 
		ele_inp1 = ele_inp1.children[0];
	}
	
	numRowInput = ele_inp1.children.length;
	//numWordBase = 1000 * Math.ceil((numRowInput+10)/1000);
	var zero1 = "0".repeat( 2+(""+numRowInput).length );
	numWordBase = parseInt("1"+ zero1 ); 
	numRowForWordBase  = parseInt("2"+ zero1 ); 
		
	//console.log("lev3_build_all_clip 3" , " numRowInput=", numRowInput, " numWordBase=", numWordBase, "  numRowForWordBase=",numRowForWordBase );
	
	let nota1 = "";
	let traduzSeconda=""; 
	let numCh=0; 
	//---
	for (let z3 = 0; z3 < numRowInput; z3++) {  
		eleTr = ele_inp1.children[z3]; 
		numCh = eleTr.children.length;
		
		txt1 = ""; 
		trantxt1 = "";
		nota1 = "";
		traduzSeconda=""; 
		if (numCh > 0) txt1 = eleTr.children[0].innerHTML;
		tts1 = txt1; 
		
		/**
		<div class="divRowText" style="padding:50%:">
					<div class="suboLine"     style="display: block;" id="idc_1">zu.</div>
					<div class="cl_paradigma" style="display: none;" id="iddf_1">zu. zum=zu dem<br></div>	
					<div class="tranLine"     style="display: none;" id="idt_1">to<br></div>				
					<div class="tranLine2"    style="display:none;" id="idt2_1"><br></div>				
					<div id="idw_1"></div> 
					<div style="display:none;" id="idtts1">zu.</div>
				</div>
		**/
		if (numCh > 1) trantxt1      = eleTr.children[1].innerHTML.trim();
		if (numCh > 2) nota1         = eleTr.children[2].innerHTML.trim(); 
		if (numCh > 3) traduzSeconda = eleTr.children[3].innerHTML.trim();
		//---
        let rowclip = string_tr_xx.replaceAll("§1§", z3).
			replaceAll("§4txt§",    txt1).
			replaceAll("§5txt§",    trantxt1).
			replaceAll("§5dftxt§",  nota1). 
			replaceAll("§52txt§" ,  traduzSeconda). 
			replaceAll("§swAlfaHtml§",     "false").
			replaceAll("§ttstxt§",  tts1).
			replaceAll('§spelling§',''); 
		
		if (nota1 == ""        ) rowclip = annulla_para_tran2_vuote(rowclip,'iddf_');
		if (traduzSeconda == "") rowclip = annulla_para_tran2_vuote(rowclip,'idt2_'); 
		
        clipSub_showTxt += rowclip + "\n";
		printBil +=  '<div class="print_row"><div class="print_orig">' + txt1 + '</div><div class="print_tran">' + trantxt1 + '</div></div>'  ;
		printStringBilingual +=  '<div class="print_origOnly">' + txt1 + '</div>';   
		
    } // end of for z3
	
	
	//console.log("clipSub_showTxt=" + clipSub_showTxt)
	
    document.getElementById("id_tabSub_tbody").innerHTML = clipSub_showTxt;
	
	var eleFromNum=document.getElementById("id_toSave_fromNum");
	if (eleFromNum.value != "0") onclickSaveFromNum(eleFromNum, false);

} // end of lev2_build_all_clip  

//--------------
function annulla_para_tran2_vuote(rowClip, id2) {	
	//<div class="cl_paradigma" style="display:none;" id="iddf_§1§">§5dftxt§<br></div>	
	//<div class="tranLine2"    style="display:none;" id="idt2_§1§">§52txt§<br></div>		
	
	let j1 = rowClip.indexOf(id2);
	if (j1 < 0) return rowClip;
	
	let fJ = rowClip.lastIndexOf("<div",j1); 
	let tJ = rowClip.indexOf("<div>",j1);  
	if ((fJ > tJ) || (tJ <0)) return rowClip;
	
	return rowClip.substring(0,fJ)  + rowClip.substring(tJ);
	
} // end of annulla_para_tran2_vuote 
//--------------

//===================================


//-------------------------------------------------

function onclick_tts_arrowFromIx( this1, z3, wh) {
	//------------------------------------------
	// button from ( --> ) has been clicked 
	//------------------------------------------

	//console.log(" onclick_tts_arrowFromIx( this1, z3=" +z3 + ", wh=" + wh); 
	
	
	tts_5_fun_invisible_prev_fromto(-1);
	
	fromIxToIxLimit = [1*z3 ,-1]; 
	[begix, endix] =  fromIxToIxLimit;
	
	tts_5_fun_copy_openClose_to_tr_m1(z3) ;  //  copy open/Close book style from this line idtr_xx to the upper idtr_xx_m1
	
	fromIxToIxButtonElement=[this1, null];
	this1.style.backgroundColor = "green";	

} // end of  onclick_tts_arrowFromIx()  

//---------------------------------------

function onclick_tts_arrowToIx( this1, z3 ) {
	//------------------------------------------
	// button to( <-- ) has been clicked 
	//------------------------------------------
	//console.log(" onclick_tts_arrowToIx( this1, z3=" +z3 ); 
	
	//reset previous ..._ToIx  button     
		
	if (fromIxToIxButtonElement[1]) {
		fromIxToIxButtonElement[1].style.backgroundColor = null;
		var endix2 = fromIxToIxLimit[1]; 
		if (endix2 > 0)  {
			var id_post_tr_end_space2 = "idtr_" + (endix2+1) + "_m2" ; 
			if (document.getElementById(id_post_tr_end_space2  ) ) { document.getElementById(id_post_tr_end_space2 ).style.display = "none"; }
		}
	}
	//-------------------------------------------
	// new ... _ToIx
	
	fromIxToIxLimit[1]   = 1*z3;  
	fromIxToIxButtonElement[1] = this1;
	
	[begix, endix] = fromIxToIxLimit;	

	document.getElementById("id_end_" + begix).innerHTML = endix;
		
	/*
	this:  from id="b1_§1§" fromIx(§1§,this) -  to id="b2_§1§" 
		<tr id="idtr_§1§_m2"  ...>
		<tr id="idtr_§1§_m1"  ...>
	**/
	
	var id_pre_tr_beg_space  = "idtr_" + begix + "_m2" ; 
	var id_pre_tr_head       = "idtr_" + begix + "_m1" ; 
	var id_post_tr_end_space = "idtr_" + (endix+1) + "_m2" ;
	/**
	if (begix == endix) {
		try{
			document.getElementById(id_pre_tr_beg_space  ).style.display = "none"; 
			document.getElementById(id_pre_tr_head       ).style.display = "none"; 
			document.getElementById(id_post_tr_end_space ).style.display = "none"; 
		} catch(e1) {}
		return; 
	}	
	**/
	
	if (document.getElementById(id_pre_tr_head) == null) {
		insert_TR_m1_m2( begix );
	}	
	if (document.getElementById(id_post_tr_end_space) == null) {
		insert_TR_m1_m2( (endix+1) );
	}	
		
	
	tts_5_fun_copyHeaderSelected() ; 
	
	
	if (document.getElementById(id_pre_tr_beg_space ) ) {  
		document.getElementById(id_pre_tr_beg_space).style.display = "table-row";  
		if (begix < 1) 
			document.getElementById(id_pre_tr_beg_space).style.display = "none";  
	}
	//else {console.log(" manca "+id_pre_tr_beg_space ) }	
	if (document.getElementById(id_pre_tr_head      ) ) {  document.getElementById(id_pre_tr_head     ).style.display = "table-row"; }	
	//else {console.log(" manca "+id_pre_tr_head      ) }	
	if (document.getElementById(id_post_tr_end_space) ) { document.getElementById(id_post_tr_end_space).style.display = "table-row";}
	//else {console.log(" manca "+id_post_tr_end_space ) }	

	this1.style.backgroundColor="red";
	
	//c_onsole.log("onclick_tts_arrowToIx() calls 'fun_reset_clip_all_sel()'" )  ; 
	
	
} // end of onclick_tts_arrowToIx()

//------------------------------------------


//---------------------------------------

function tts_5_fun_invisible_prev_fromto(interX) {
    // eliminate bold of the  previous group of lines, unless this is a line in them  
    [begix, endix] = fromIxToIxLimit; // previously set 
	
	//console.log("tts_5_fun_invisible_prev_fromto() prev  fromIxToIxLimit = ",  fromIxToIxLimit); 
    if ((interX >= begix) && (interX <= endix)) {
        return;
    }
    var id_pre_tr_beg_space = "idtr_" + begix + "_m2";
    var id_pre_tr_head = "idtr_" + begix + "_m1";
    var id_post_tr_end_space = "idtr_" + (endix + 1) + "_m2";


    if (fromIxToIxButtonElement[0]) {
		//console.log("    prev fromIxToIxButtonElement[0].id=",fromIxToIxButtonElement[0].id);  
        fromIxToIxButtonElement[0].style.backgroundColor = null;
        if (document.getElementById(id_pre_tr_beg_space)) {
            document.getElementById(id_pre_tr_beg_space).style.display = "none";
        }
        if (document.getElementById(id_pre_tr_head)) {
            document.getElementById(id_pre_tr_head).style.display = "none";
        }
    }
    if (fromIxToIxButtonElement[1]) {
		//console.log("    prev fromIxToIxButtonElement[1].id=",fromIxToIxButtonElement[1].id);  
        fromIxToIxButtonElement[1].style.backgroundColor = null;
        if (document.getElementById(id_post_tr_end_space)) {
            document.getElementById(id_post_tr_end_space).style.display = "none";
        }
    }

} // end of fun_invisible_prev_fromto()

//------------------------------------------

function insert_TR_m1_m2(z3) { 
	
	var eleTrX = document.getElementById("idtr_" + z3); //  + "m1";  
	var eleTrX_m1 = document.getElementById("idtr_" + z3 + "_m1");
	//var eleTrX_m2 = document.getElementById("idtr_" + z3 + "_m2");
	if (eleTrX_m1) {
		//console.log("document.getElementById("idtr_" + z3 + "_m1");=",var eleTrX_m1 = document.getElementById("idtr_" + z3 + "_m1") ) 
		return;  
	}
	if (eleTrX) {} else {return;}
	
	var rowIx = eleTrX.rowIndex;
	
	var eleTabX= eleTrX.parentElement;
	for(var h=0; h < 10;h++) { 			
		if  (eleTabX.tagName == "TABLE") break;
		eleTabX=eleTabX.parentElement;
	}	
	if  (eleTabX.tagName != "TABLE") {  console.log("ERRORE eleTabX.tagName", eleTabX.tagName); }	
	//console.log("eleTrX=", eleTrX.id, " z3=", z3,  " rowIndex=", rowIx);
	
	//-------------
	let rowclip = prototype_tr_m1_tts.replaceAll("§1§", z3).replaceAll("§swAlfaHtml§","false");	
	let rowX = eleTabX.insertRow( rowIx ); 
	rowX.outerHTML = rowclip; 
	
	var ele_tloop = document.getElementById("tyLoop" + z3 + "_m1");
	
	var ixG00 = loopIndexOfType( "Tg00");
	ele_tloop.innerHTML = ixG00; 	
	
	//console.log("2 ele_tloop_pare=", ele_tloop_pare.outerHTML) ;
	
	//--------------
	
	rowclip = prototype_tr_m2_tts.replaceAll("§1§", z3);
	rowX = eleTabX.insertRow( rowIx ); 
	rowX.outerHTML = rowclip;  	
		
} // end of insert_TR_m1_m2

//--------------------------------

function tts_5_fun_copy_openClose_to_tr_m1(z3) {
	
    var i_eleSubO = document.getElementById("idb_" + z3); // from button id="idb_§1§"    onclick_tts_show_row()
    var i_eleSubT = document.getElementById("idbT_" + z3); // from button id="idbT_§1§"   onclick_tts_show_row() 
	var o_eleSubO = document.getElementById("idb_" + z3 + "_m");
	if (o_eleSubO == null) {		
		//console.log( "o_eleSubO=" , o_eleSubO)
		insert_TR_m1_m2(z3); 	
		o_eleSubO = document.getElementById("idb_" + z3 + "_m"); 
	}
    var o_eleSubT = document.getElementById("idbT_" + z3 + "_m"); // to   button id="idbT_§1§_m" onclick_tts_OneClipRow_showHide_tran()		
    try {
        o_eleSubO.children[0].style.display = i_eleSubO.children[0].style.display; // ${openbook_symb}
        o_eleSubO.children[1].style.display = i_eleSubO.children[1].style.display; // ${closedbook_symb}
        o_eleSubT.children[0].style.display = i_eleSubT.children[0].style.display; // ${show_translation_symb}
        o_eleSubT.children[1].style.display = i_eleSubT.children[1].style.display; // ${hide_translation_symb}
    } catch (e1) {
        console.log("error in 'fun_copy_openClose_to_tr_m1(z3=" + z3 + ")'");
		console.log("i_eleSubO=", i_eleSubO); 
		console.log("o_eleSubO=", o_eleSubO); 
		console.log("document.getElementById(idtr_ + z3 + _m1)=", document.getElementById("idtr_" + z3 + "_m1") ) ;
		console.log("document.getElementById(idb_ + z3 + _m)  = ", document.getElementById("idb_" + z3 + "_m") );		
        console.log(e1);
    }
} // end of fun_copy_openClose_to_tr_m1() 

//-------------------------------------------

//-----------------------------------------------
function tts_5_fun_copyHeaderSelected() {

    let id1;
    let inBeg, inEnd;

    id1 = "idb_" + begix + "_m";
    var thisX = document.getElementById(id1);
    if (thisX == false) {
        return;
    }

    inBeg = begix;
    inEnd = endix;
    if (begix > endix) {
        inBeg = endix;
        inEnd = begix;
    }

    var style0, style1;

    tts_5_fun_oneRowZZ();

    for (var g = inBeg; g <= inEnd; g++) {
        id1 = "idb_" + g;
        thisX = document.getElementById(id1);
        tts_5_fun_oneRow11H();
    }

    //--------------
    function tts_5_fun_oneRowZZ() {
        if (thisX == false) {
            return;
        }

        if (thisX.children[0].style.display == "none") { // no openbook   
            style0 = "none"; //  hide opened book image  
            style1 = "block"; //  show closed book image 
        } else {
            style0 = "block"; // show opened book image  
            style1 = "none"; // hide closed book image 	
        }
    }
    //--------------
    function tts_5_fun_oneRow11H() {
        if (thisX == false) {
            return;
        }
        thisX.children[0].style.display = style0; // show/hide  opened book image  
        thisX.children[1].style.display = style1; // show/hide closed book image 
        let subid = thisX.id.replace("idb", "idc");

        if (subid.substring(subid.length - 2) == "_m") {
            return;
        }
        let ele1 = document.getElementById(subid);
        if (style0 == "block") {
            tts_5_fun_makeTextVisible(ele1);
        } else {
            tts_5_fun_makeTextInvisible(ele1);
        }
    }
} // end of fun_copyHeaderSelected()

//-----------------------------
//----------------------------
function tts_5_fun_makeTextInvisible(element) {
    if (element) element.style.display = "none";
}
//----------------------------
function tts_5_fun_makeTextVisible(element) {
    if (element) element.style.display = "block";
}

//----------------------------------------------

function tts_5_show_hideORIG(z3) {
	
	//console.log("10 script (un altro in 07play) tts_5_show_hideORIG(z3=", z3);
    let ele_orig_toTestShow = document.getElementById("idb_" + z3); // onclick ...  children opened/closed orig.image  (book) 		
    let ele_orig_text = document.getElementById("idc_" + z3); // element of original text to show/hide	  			
	//console.log("10 script (un altro in 07play) tts_5_show_hideORIG(z3=", z3, " orig_text=", ele_orig_text.innerHTML);
    // show subtitle if icon opened book is visible otherwise hide it ( icon closed book is visible) 
    tts_5_fun_oneClipRow_showHide_ORIG_if_book_opened(ele_orig_text, ele_orig_toTestShow);
	
} // end of  show_hideORIG
//-------------------------

function tts_5_show_hideTRAN(z3) {

    let ele_tran_toTestShow = document.getElementById("idbT_" + z3); // onclick ...  children opened/closed tran.image  (T/t) 
    let ele_tran_text = document.getElementById("idt_" + z3); // element of tran     text to show/hide	  
    let ele_tran2_text = document.getElementById("idt2_" + z3); // element of tran     text to show/hide	      
	let ele_def_text = document.getElementById("iddf_" + z3); // element defintion ( optional) 	      
    // show subtitle if icon T is visible otherwise hide it ( icon t? is visible  )	
    tts_5_fun_oneClipRow_showHide_TRAN_if_book_opened(ele_tran_text,ele_tran2_text,  ele_tran_toTestShow, ele_def_text);

} // end of  show_hideTRAN
//-----------------------------------------------------

//-------------------------------------------
function tts_5_fun_oneClipRow_showHide_ORIG_if_book_opened(ele1, ele_to_test) {

    var ele1_tr = ele1.parentElement.parentElement;

    

    if (ele1 == null) {
        return;
    }

    last_BoldRow = ele1;

    if (ele_to_test.children[0].style.display == "block") { // openbook ==> show 		
        ele1.style.display = "block";
        //ele1.classList.add("boldLine");
        //ele1.style.backgroundColor = "yellow";
        //ele1.parentElement.style.border = null;
        //ele1_tr.style.backgroundColor = "yellow"; //feb 		
    } else { // closebook  ==> hide 
        ele1.style.display = "none";
        //ele1.classList.remove("boldLine");
        //ele1.style.backgroundColor = null;
        //ele1.parentElement.style.border = "1px solid red";
    }

    //last_BoldRow = ele1; 

} // end of fun_oneClipRow_showHide_ORIG_if_book_opened() 

//-------------------------------------------

function tts_5_fun_oneClipRow_showHide_TRAN_if_book_opened(ele1, ele2, ele_to_test, ele_def_text) {

    if ((ele1 == null) && (ele2 == null) && (ele_def_text == null)) {
        return;
    }

    if (ele_to_test.children[0].style.display == "block") { // openbook ==> show 
		ele1.style.display = "block";  // traduzione principale 		
		if (ele2) { // traduzione optional 
			if ((ele2 != "") &&  (ele2.innerHTML != "<br>")) {
				ele2.style.display = "block";
			}		
		}	
		if (ele_def_text) { // eventuale paradigma 
			if ((ele_def_text.innerHTML != "") &&  (ele_def_text.innerHTML != "<br>")) {
				ele_def_text.style.display = "block";
			}		
		}	
		
    } else { // closebook  ==> hide 
        ele1.style.display = "none";
		if (ele2) ele2.style.display = "none";
		if (ele_def_text) ele_def_text.style.display = "none";
    }


} // end of fun_oneClipRow_showHide_TRAN_if_book_opened() 
//-----------------------------------------


//-------------------------------------------------

function onclick_tts_show_row(this1, z3) {
	
	 
	if (this1 == false) { 
		console.log("2 onclick_tts_show_row(this1, z3), z3=", z3, ") return"); 
		return; 
	}	
	
	if (this1.children[0].style.display == "none") {  // no openbook   
		this1.children[0].style.display = "block";                         // show opened book image  
		this1.children[1].style.display = "none";						  // hide closed book image 	
	} else {
		this1.children[0].style.display = "none";                          //  hide opened book image  
		this1.children[1].style.display = "block";						  //  show closed book image 	
	}
	//console.log("3 onclick_tts_show_row(this1, z3), z3=", z3, " chiama tts_5_show_hideORIG()");  
	tts_5_show_hideORIG(z3);
	tts_5_show_hideTRAN(z3);
}	
//-------------------------------------------------------------------------

function onclick_tts_OneClipRow_showHide_sub( thisX, sw_allSel) {
	
	if (thisX == false) { 
		//console.log("onclick_tts_OneClipRow_showHide_sub  thisX = null"); 
		return; 
	}
	//console.log("onclick_tts_OneClipRow_showHide_sub  thisX.id = ", thisX.id, " sw_allSel=", sw_allSel);	

	let id1;
	let inBeg, inEnd; 
	begix = 1*begix;    // mi assicuro che sia un numero altrimenti il test di maggiore o minore è falsato
	endix = 1*endix;
	inBeg      = begix;
	inEnd      = endix; 
	
	
	if (begix > endix) {
		inBeg  = endix;
		inEnd  = begix; 		
	} 
	//console.log(" 2 onclick_tts_OneClipRow_showHide_sub ",   " begix=", typeof begix, "=", begix, " endix =",typeof endix,"=",  endix, " XXX   inBeg=", inBeg, " inEnd=", inEnd);
	
	var style0 , style1; 

	
	tts_5_fun_oneRow00S(); 	
	
	tts_5_fun_oneRow11S(1); 
	
	if (sw_allSel) {	
		//console.log("    onclick_tts_OneClipRow_showHide_sub()   sw_allSel");
		for(var g=inBeg; g <= inEnd; g++) {
			id1 = "idb_" + g;   			
			thisX = document.getElementById(id1); 
			tts_5_fun_oneRow11S(1+inEnd-inBeg); 	
		} 
	} 	
	//--------------
	function tts_5_fun_oneRow00S() {
		if (thisX == false) { return; }	
		
		if (thisX.children[0].style.display == "none") {  // no openbook   
			style0 = "block";                         // show opened book image  
			style1 = "none";						  // hide closed book image 	
		} else {
			style0 = "none";                          //  hide opened book image  
			style1 = "block";						  //  show closed book image 	
		}
		//console.log("   style0=", style0, " style1=", style1); 
	}	
	//--------------
	function tts_5_fun_oneRow11S() {	
		if (thisX == false) { return; }
		
		thisX.children[0].style.display = style0;         // show/hide  opened book image  
		thisX.children[1].style.display = style1; 		  // show/hide closed book image 
		let subid = thisX.id.replace("idb","idc"); 
		
		//console.log("subid=" + subid + " last2="  + subid.substring( subid.length-2)  ); 
		
		if (subid.substring( subid.length-2) == "_m") {
			return; 
		} 
		let ele1 = document.getElementById( subid );
		
		//console.log(" fun_fun_fun_oneRow11()  subid=" + subid + " ele1.id=" + ele1.id + " style0=" + style0 +" thisX.outer=" + thisX.outerHTML  )  
		
		if (style0 == "block") {
			//console.log("   onclick_tts_OneClipRow_showHide_sub()  " + subid + "  visibile");
			//ele1.style.color = null; // style.color is set only when equal to background color 
			tts_5_fun_makeTextVisible(ele1);  
		} else {
			//console.log("   onclick_tts_OneClipRow_showHide_sub() " + subid + " INVISIBILE");
			tts_5_fun_makeTextInvisible(ele1); 
		}
	}
	
} // end of onclick_tts_OneClipRow_showHide_sub()

//-----------------------------------------

function onclick_tts_OneClipRow_showHide_tran( thisX, sw_allSel ) {
	if (thisX == false) { return; }
	
	let tran_id = thisX.id.replace("idbT_","idt_"); 

	let id1;
	let inBeg, inEnd; 
	inBeg      = begix;
	inEnd      = endix; 	
	if (begix > endix) {
		inBeg  = endix;
		inEnd  = begix; 		
	} 
	var outDisplay_block ;  
	var style0 , style1; 
	let id00;
	let tran1_id; 
	let tran2_id; 
	let parad_id; 
	
	fun_fun_oneRow00T(); 	
	
	fun_fun_fun_oneRow11T(false); 
	
	if (sw_allSel) {	
		for(var g=inBeg; g <= inEnd; g++) {
			id1 = "idbT_" + g;  			
			thisX = document.getElementById(id1); 
			//console.log("gruppo tran id1=" + id1 ) ;  
			fun_fun_fun_oneRow11T(true); 	
		} 
	} 
	
	//--------------
	function fun_fun_oneRow00T() {	
		if (thisX == false) { return; }		
		
		if (thisX.children[0].style.display == "none") {  //  opened_translation symbol is hided  (T)  
			//console.log(" tran  mostra T grande style0=block" ); 
			style0 = "block";                         // show opened_translation symbol   (T) 
			style1 = "none";						  // hide closed_translation symbol   (image)				
			outDisplay_block =	"block" ;             // show translation line 			 
			sw_active_show_lastSpokenLineTranslation = true;
		} else {
			//console.log(" tran  mostra t piccolo   style0 = none") ;	
			style0 = "none";                          // hide opened_translation symbol  (T) 
			style1 = "block";						  // show closed_translation symbol  (image) 	
			outDisplay_block =	"none" ;              // hide translation line	
			sw_active_show_lastSpokenLineTranslation = false;	
		}
	}
	//--------------
	function fun_fun_fun_oneRow11T() {	
			//console.log( "tran  fun_fun_fun_oneRow11T()  thisX.id=" + thisX.id);  	
			
		if (thisX == null) {  return; }
		if (thisX == false) {   return; }
		
		thisX.children[0].style.display = style0;         // show/hide opened_translation symbol  (T)
		thisX.children[1].style.display = style1; 		  // show/hide closed_translation symbol  (image) 	
		
		//tran_id = thisX.id.replace("idbT_","idt_"); 
		id00 = thisX.id.substring(5);
		tran1_id = "idt_"    + id00; 
		tran2_id = "idt2_"   + id00; 
		parad_id = "iddf_" + id00; 
		
		//console.log("style0=", style0, " ", "id="+id00, "   tran1_id=", tran1_id, "   tran2_id=", tran2_id, " parad_id=", parad_id); 
		if (document.getElementById(tran1_id)) document.getElementById(tran1_id).style.display = style0;  // show/hide  translation line	
		if (document.getElementById(tran2_id)) document.getElementById(tran2_id).style.display = style0;  // show/hide  translation line	
		if (document.getElementById(parad_id)) document.getElementById(parad_id).style.display = style0;  // show/hide  translation line	
		/**
		if (document.getElementById(tran1_id)) console.log("  tran1 ", document.getElementById(tran1_id).innerHTML ) 
		if (document.getElementById(tran2_id)) console.log("  tran2 ", document.getElementById(tran2_id).innerHTML ) 
		if (document.getElementById(parad_id)) console.log("  parad ", document.getElementById(parad_id).innerHTML ) 
		***/
		//<div class="cl_paradigma" style="display:none;" id="iddf_0"><br></div>	
		//<div class="tranLine" style="display: block;" id="idt_0">from<br></div>				
		//<div class="tranLine2" style="display:none;" id="idt2_0"><br></div>		
	}

	
} // end of onclick_tts_OneClipRow_showHide_tran()

//-------------------------------------------
function moduleNormalize( fromNum, begix, module) {
	if (fromNum >= begix) return fromNum; 
	let sub1 = fromNum - begix;
	let zz = ( ( sub1 % module ) + module)%module; 
	return (begix + zz);  
}
//----------------------------------------------------
var printStringBilingual = '';
var printStringOrigTxt  = '';
//----------------------------------------------------
function printOrigText() {
	loadPrintGroupData(); 
	var myWindow = window.open();
	myWindow.document.write( printStringOrigTxt);
}
//----------------------------------------------------
function printBilingual() {
	loadPrintGroupData(); 
	var myWindow = window.open();
	myWindow.document.write( printStringBilingual );
}
//------------------------------------------------

function loadPrintGroupData() {
	var titoloPag = document.getElementsByTagName("TITLE")[0].innerHTML; 
	 
	var begix, endix;	

	[begix, endix] = fromIxToIxLimit;
	var groupLimit = begix + "-" + endix; 
	console.log("begixi=", begix, " endix=", endix);

	printStringBilingual = '<html> \n' + 
		'<head><title>' + titoloPag + '</title>\n' +
		'<style> \n' +
		' .print_row { margin-top:0.5em; font-size:1em; text-align:left;} \n' +
		' .print_orig { font-weight: bold; text-align:left; } \n' +
		' .print_origOnly { margin-top:0.1em; text-align:left; } \n' +
		' .print_tran {	text-align:left; } \n' +  
		'</style> \n' + 
		'</head>\n' + 
		'<body style="margin-left:1em;"> \n' +
		'<h2>' + titoloPag + '&nbsp;&nbsp;<small>(' + groupLimit + ')</small></h2>\n' ;

	printStringOrigTxt = printStringBilingual;
	let txt1 =""; var trantxt1="";

	for (let z3 = begix; z3 <= endix; z3++) {
		if (document.getElementById("idtr_" + z3).classList.contains("hideForNow") ) continue; 
		txt1     = getInner_idc( document.getElementById("idc_" + z3) ).replaceAll("<br>",""); 		
		trantxt1 = document.getElementById("idt_" + z3).innerHTML.replaceAll("<br>","");		

		printStringBilingual += '<div class="print_row"><div class="print_orig">' + txt1 + '</div><div class="print_tran">' + trantxt1 + '</div></div> \n'  ;
		printStringOrigTxt   += '<div class="print_origOnly">' + txt1 + '</div> \n';   

	} // end of for z3
	printStringBilingual += '</body>\n</html>\n' ;   	
	printStringOrigTxt   += '</body>\n</html>\n' ;  
	
} // end of loadPrintGroupData 

//-----------------------------------

function onclick_show_chosenVoices(this1) {
	var eleListChosenVoices = this1.parentElement.children[1]; 
	if (eleListChosenVoices.style.display == "none")  eleListChosenVoices.style.display = "block";
	else  eleListChosenVoices.style.display = "none";
	
} // end of onclick_show_chosenVoices

//-----------------------------------------

function onclick_chkChosenVox(this1, nLang) {
	var check1 = this1.checked; 
	var ixVoice = parseInt(this1.value);
	var voice1 = listVoxL[nLang][ixVoice];  // [vox.lang, vox]
	//console.log("voice1=", voice1); 
	/**
	var chlist=[]
	for(var h=0; h < listVoxL[nLang].length;h++) {
		console.log("1 chList=",  h, "  = ", listVoxL[nLang][h][2]) ; 
	} 
	**/
	//console.log("1 voce [0]=", voice1[0], " [1].name=", voice1[1].name, " [2]=",voice1[2], "  new checked=", check1);  
	
	listVoxL[nLang][ixVoice][2] = check1; 
	var chlist=[];
	for(var h=0; h < listVoxL[nLang].length;h++) {
		chlist[h] = listVoxL[nLang][h][2]; 
		//console.log("2 chList=",  h, "  = ",  listVoxL[nLang][h][2]) ; 
	} 
	sel_voice_exclude[nLang] = chlist; 
	
	plus_set_localStorage_var(5); 
	
	//console.log( "exclude vox ", nLang, "  =>",  sel_voice_exclude[nLang] ); 	
	
	//voice1 = listVoxL[nLang][ixVoice];  // [vox.lang, vox]
	//console.log("2 voice [0]=", voice1[0], " [1].name=", voice1[1].name, " [2]=",voice1[2], "  new checked=", check1);  
	
} // end of onclick_chkChosenVox

//-------------------------------------------------

function signalError(var1) {
	console.log( "questa funzione serve soltanto per provocare un'interruzione con segnalazione del punto incliminato (quello che ha chiamato signalError" );
	10 + error*3 ;	
}
//---------------------------
function unused_functions() {
	// might be used if needed for some debugging
	removeKey();
	remove_localStorageItems();	
	
}
//===============================================================================

function htmlPageCalledFunctions() {
	var uno, due, tre, quattro; 
	  onclick_anotherLoopType (uno,due, tre) ;           // 	9		
	  onclick_chgVoxRotate()             ;           // 16
	  onclick_loopType_change()          ;           //  4
	  onclick_play_Orig_and_Tran_group(uno,due, tre, quattro) ;    // 9
	  onclick_play_Orig_and_Tran_row (uno,due, tre, quattro) ;    // 18
	  onclick_refresh_loopParms(uno)        ;           //  128 
	  onclick_showtabLoop(uno)              ;           //    2
	  onclick_tts_arrowFromIx(uno,due)      ;           //    6
	  onclick_tts_arrowToIx(uno,due)        ;           //    6 
	  onclick_tts_changePitch(uno,due)      ;           //    4
	  onclick_tts_changeRate(uno,due)       ;           //    4
	  onclick_tts_changeVolume(uno,due)     ;           //    4
	  onclick_tts_get_oneLangVoice3(uno, due) ;         //    4    
	  onclick_tts_OneClipRow_showHide_sub( uno,due)  ;  //    3
	  onclick_tts_OneClipRow_showHide_tran( uno, due);  // 	  3 			
	  onclick_tts_seeWords3(uno, due)       ;           //    6
	  onclick_tts_show_row(uno,due)         ;           //   12  
	  onclick_tts_speech_cancel()           ;           //   13
	  onclick_tts_speech_pause2()           ;           //    9 
	  onclick_tts_speech_resume()           ;           //    4
	  onclick_printBilingual()              ;           // 	  2	   
} // end  htmlPageCalledFunctions 
//==================================================================       
