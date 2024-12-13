
"use strict";
/*  
LineByLine: A tool to practice language comprehension
Antonio Cigna 2024
license MIT: you can share and modify the software, but you must include the license file 
*/
/* jshint strict: true */
/* jshint esversion: 6 */
/* jshint undef: true, unused: true */
//----------------------------------------------
var currScript = document.currentScript.src; var bar1 = currScript.lastIndexOf("\\");var bar2 = currScript.lastIndexOf("/"); 
//console.log("LOADED file SCRIPT " + currScript.substring( 1+Math.max(bar1,bar2) )) ;	
//----------------------------------------------------------------------------------------

const ele_outTitle = document.getElementById("id_outTitle") ;

let level2Title=""; 
let ele_textAreaOrig = document.getElementById("txt_pagOrig");
let ele_textAreaTran = document.getElementById("txt_pagTrad");
let ele_tabTextBody = document.getElementById("id_tabTextBody");
let ele_page1 = document.getElementById("page1");
let ele_newPage1 = document.getElementById("newPage1");

const IX_T_ORIG = 0; // col.index in table with id="id_tabText" 
const IX_T_TRAN = 6; // col.index in table with id="id_tabText" 

//-------------------------------------------------
var this_ras_base = get_this_file_path(window.location.href);
//console.log(" this_ras_base=" +  this_ras_base); 
//var this_file_root0 = get_this_file_path(window.location.href); // eliminate file name 
//var this_file_root1 = get_this_file_path(this_file_root0); // eliminate this folder (ras_builder)
//var this_ras_base = this_file_root1;



 //---------------------------------------
 function onclick_get2TextArea() {
     const titleMiss = "manca il titolo, scrivilo qui per andare avanti";
     level2Title = ele_outTitle.value;
     if ((level2Title == "") || (level2Title == titleMiss)) {
         ele_outTitle.value = titleMiss;
         ele_outTitle.style.color = "red";
         return;
     }
	 document.getElementById("id_outTitle2").innerHTML = level2Title;
	 
     ele_outTitle.style.color = "black";

     const arrTxtOrig = fun_txt2row(ele_textAreaOrig.value);
     const arrTxtTran = fun_txt2row(ele_textAreaTran.value);
     const lenO = arrTxtOrig.length;
     const lenT = arrTxtTran.length;

     var z1;
     for (z1 = lenO + 1; z1 <= lenT; z1++) {
         arrTxtOrig.push("");
     }
     for (z1 = lenT + 1; z1 <= lenO; z1++) {
         arrTxtTran.push("");
     }

     let str1 = "";  //  "<tbody> \n";
     for (z1 = 0; z1 < arrTxtOrig.length; z1++) {
         str1 += fun_newTrRowString(z1, arrTxtOrig[z1], arrTxtTran[z1]);
     }
     //str1 += "</tbody> \n";
     //ele_tabText.innerHTML = str1;
	 ele_tabTextBody.innerHTML = str1;
	 
     ele_page1.style.display = "none";
     ele_newPage1.style.display = "block";

 } // end of onclick_get2TextArea

 //------------------------------------------------------------------------

function onclick_build_runPage() {
   
	//console.log("esegue downLoad_File()"); 
    var html_fn_download = "de_" + level2Title + ".html";	
	html_fn_download   = correctFileName(  html_fn_download   );     
	
	var html_lev2_title = "Line By Line - " + level2Title.trim(); 
	document.getElementsByTagName("TITLE")[0].innerHTML = html_lev2_title;  
	
	
	var strLV2inp = '<!DOCTYPE html>\n<html lang="en">' + document.getElementsByTagName("HEAD")[0].outerHTML.
		replaceAll(  ' href="./' , ' href="' + this_ras_base ) + '\n';
		
	strLV2inp += '<body id="id_body"> \n\n';
	strLV2inp += '<table id="inp1" style="display:none;">\n';
	var eleTD;
	for(var z1=0; z1 < ele_tabTextBody.children.length; z1++) {
		eleTD = ele_tabTextBody.children[z1];
		strLV2inp += "   <tr><td>" + eleTD.children[IX_T_ORIG].innerHTML + "</td><td>" + eleTD.children[IX_T_TRAN].innerHTML + "</td></tr>\n" 
	} 
	strLV2inp += "</table> \n"; 	
	strLV2inp += '\n'; 
	strLV2inp += '<b>' + html_lev2_title + '</b> \n' ;  
	strLV2inp += lev2html_endpage.replaceAll( "§prefixScriptFile§",this_ras_base).trim();
	strLV2inp += '\n\n'; 
	strLV2inp += "</body> \n</html> \n"; 	
	
    download(html_fn_download, strLV2inp);   
	

} // end of onclick_build_runPage

 //----------------------------------------

 function onclick_moveHalfRowUp(this1, ix_half_row ) {
     //
     //  // move orig. or transl. row column UP   ( all rows from index z1 to end ) 
     //
     const eleTD = this1.parentElement;
     const eleTR = eleTD.parentElement;
	 var z1 = eleTR.rowIndex;
	 
	 //console.log("moveHalf Up   eleTR.rowIndex=", eleTR.rowIndex,  "  z1=", z1);
	 

     const ele_TBODY = eleTR.parentElement;
     let numTR = ele_TBODY.children.length;
     
	 //console.log("  esistono ", numTR, " righe");
     
	 let from_z, to_z;
     let ele_from, ele_to;
     const first_to_z = z1 - 1;
     let swOne = false;

     if (z1 == 0) {
         ele_to = ele_TBODY.children[0].children[ix_half_row];
         if (ele_to.innerHTML != "") {
             insert_TR_row(ele_TBODY, 0, "", "");
             z1++;
         }
     }
     numTR = ele_TBODY.children.length;

     for (from_z = z1; from_z < numTR; from_z++) { // move one by one from the row number.z1 to the last    
         to_z = from_z - 1;
         if (to_z >= numTR) {
             break;
         }
		 //console.log("Up z1=", z1, " from_z=", from_z ,  "  to_z=", to_z);
         ele_from = ele_TBODY.children[from_z].children[ix_half_row];
         ele_to = ele_TBODY.children[to_z].children[ix_half_row];
         if (to_z == first_to_z) {
             if (ele_to.innerHTML == "") {
                 ele_to.innerHTML = ele_from.innerHTML.trim();
             } else {
                 ele_to.innerHTML = (ele_to.innerHTML + "<br>" + ele_from.innerHTML).trim();
             }
         } else {
             ele_to.innerHTML = ele_from.innerHTML.trim();
         }
         swOne = true;
     }
     if (swOne) ele_from.innerHTML = "";

 } // end of onclick_halfRowUp

 //----------------------------------

 function onclick_moveHalfRowDown(this1, ix_half_row) {
     //
     // move orig. or transl. row column DOWN  ( all rows from index z1 to end ) 
     //
     const eleTD = this1.parentElement;
     const eleTR = eleTD.parentElement;
	 const z1 = eleTR.rowIndex;
     //const eleTD_orig = eleTR.children[ix_half_row];

     const ele_TBODY = eleTR.parentElement;

     let numTR = ele_TBODY.children.length;

     let from_z, to_z;
     let ele_from, ele_to;
     const first_from_z = numTR - 2;
     let swOne = false;
     to_z = numTR - 1;
     ele_to = ele_TBODY.children[to_z].children[ix_half_row];
     if (ele_to.innerHTML != "") {
         insert_TR_row(ele_TBODY, numTR, "", "");
         numTR = ele_TBODY.children.length;
     }

     for (from_z = numTR - 2; from_z >= z1; from_z--) { // move one by one row from the lower one to the number z1 
         to_z = from_z + 1;
         ele_from = ele_TBODY.children[from_z].children[ix_half_row];
         ele_to   = ele_TBODY.children[to_z].children[ix_half_row];
         ele_to.innerHTML = ele_from.innerHTML;
     }

     ele_from = ele_TBODY.children[z1].children[ix_half_row];
     ele_from.innerHTML = "";

 } // end of onclick_moveHalfRowDown

 //----------------------------------------

 function onclick_removeRow(this1, ix_leftHalf_row, ix_rightHalf_row) {
     //
     // remove empty row 
     //
     const eleTD = this1.parentElement;
     const eleTR = eleTD.parentElement;
	 const z1 = eleTR.rowIndex;
     //const eleTD_orig = eleTR.children[ix_half_row];

     const ele_TBODY = eleTR.parentElement;
	 const eleTab =ele_TBODY.parentElement;

     let numTR = ele_TBODY.children.length;

     let from_z, to_z;
     let ele_from, ele_to, ele_to1, ele_to2;
     const first_from_z = numTR - 2;
     let swOne = false;
    
     ele_to1 = ele_TBODY.children[z1].children[ix_leftHalf_row];
	 ele_to2 = ele_TBODY.children[z1].children[ix_rightHalf_row];
	
	 if ((ele_to1.innerHTML != "") || (ele_to2.innerHTML != ""))  {
		return;   // only if both halves are empty
	 }
	 
	 eleTab.deleteRow( z1 );         // questa istruzione falsa gli indici  delle righe tabella in html  che contengono onclick ... indice z1 	 
 } // end of onclick_removeRow

 //----------------------------------------

 function fun_txt2row(str1) {
     //
     // split string for new line (/n), full stop (.), question and exclamation marks, and ;     
     //	
     const str3 = str1.replaceAll(". ", ".\n").
     replaceAll("! ", "!\n").replaceAll("? ", "?\n").
     replaceAll("; ", ";\n");
	 
     return str3.split("\n");
	 
 } // end of fun_txt2row 
 
 //---------------------------------------

 function fun_newTrRowString(z1, txtOrig, txtTran) {
     //
     //	build new tr line 
     //	 
	 
     var str1 = "";
     str1 += '<tr>';
     str1 += '<td contenteditable>' + txtOrig.trim() + '</td>';
     str1 += '<td><button onclick="onclick_moveHalfRowUp(   this,' + IX_T_ORIG + ')" class="butTabText">&#8679;</button></td>'; 
     str1 += '<td><button onclick="onclick_moveHalfRowDown( this,' + IX_T_ORIG + ')" class="butTabText" >&#8681;</button></td>';
	 
	 str1 += '<td><button onclick="onclick_removeRow(       this,' +  IX_T_ORIG + ',' + IX_T_TRAN + ')" class="butTabText">&#x1F5D1;</button></td>';
	 
     str1 += '<td><button onclick="onclick_moveHalfRowUp(   this,' + IX_T_TRAN + ')" class="butTabText">&#8679;</button></td>';
     str1 += '<td><button onclick="onclick_moveHalfRowDown( this,' + IX_T_TRAN + ')" class="butTabText">&#8681;</button></td>';
     str1 += '<td contenteditable>' + txtTran.trim() + '</td>';
     str1 += '</tr> \n';
	 
     return str1;

 } // end of fun_newTrRowString 
 
 //------------------------------------------

 function insert_TR_row(ele_TBODY, z1, txtOrig, txtTran) {

     var row = ele_TBODY.insertRow(z1);
     row.innerHTML = fun_newTrRowString(z1, txtOrig, txtTran);

 } // end of insert_TR_row

 
 //---------------------------------------
 
function get_this_file_path(this_path0) {

    var ll = this_path0.length;
    var this_path = this_path0;
    var lastChar = this_path0.substring(ll - 1, ll);
    if ((lastChar == "/") || (lastChar == "\\")) {
        this_path = this_path0.substring(0, ll - 1);
    }
    var this_file = "",
        this_root = "";
    var p1 = Math.max(0, this_path.lastIndexOf("/"));
    var p2 = Math.max(0, this_path.lastIndexOf("\\"));
    var p3 = Math.max(p1, p2);
    if (p3 < 0) {
        this_file = this_path;
    } else {
        this_file = this_path.substr(p3 + 1);
        this_root = this_path.substring(0, p3 + 1);
    }
    //console.log("path=" + this_path0 + "\nroot=" + this_root);
    return this_root;

} // end of get_this_file_path()


//------------------------------------------
function download(filename, text) {
	//console.log("esegue downLoad()"); 
    var element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(text));    

    //console.log("element.setAttribute('download'," + filename + ")");

    element.setAttribute('download', filename);

    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//---------------------------------------------

function correctFileName( str1 ) {

	var toAvoid = "#%&{}\<>*?/$!";  
		toAvoid += " "; 
		toAvoid += "\'\"\`"; 
		toAvoid += ":@+"; 
		toAvoid += "|="; 
	var str2 = str1;	
	
	for(var g=0; g<toAvoid.length; g++) {
		str2 = str2.replaceAll( toAvoid.charAt(g),"_"); 
	}  		
   return str2; 

} // end of correctFileName() 

//------------------------------------------

