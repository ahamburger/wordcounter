var word_count = [0];
var max_words = 10;
var max_width = 400;

var count = [0];
var most_used = {};
var most_used_amts = ["","","","",""];
var most_used_arr = ["","","","",""];
var minMaxWord = "";
var words = {};
var text = "";
var numMU = 5;

var blue_color = "#6699FF";
var bg_blue_color = "#D6E4FF";
var	red_color = "#990000";
var	green_color = "#00CC99";
var purple_color = "#8C3991";

var x = d3.scale.linear()
    .domain([0, max_words])
    .range([0, max_width]);

function init(){
	var bar = d3.select(".graph")
	  	.selectAll("div")
			.data(word_count)
		.enter().append("div")		
	    	.style("width", "1px")
			.style("background-color", blue_color);

	max_words = document.getElementById("maxText").value;		
	update();

	init1WC();
	initMostUsed();
}


function updateSize() {	
	var graph = d3.select(".graph")
  		.selectAll("div")
  		.data(word_count)
		.transition().style("width", function(d) {
			var width = 0 
			if (word_count[0] >= max_words){
				width = max_width
			}
			else if (word_count[0] !== 0){
				width = x(d);
			}

			return width + "px"; 
		});
}

function updateText() {
		var graph = d3.select(".count")
  		.data(word_count)
		.text(word_count[0]);
}

function countWords() {
	var old_count = word_count[0];
	var text = document.getElementById("textBox").value.trim()
	word_count[0] = text === "" ? 0 : text.split(" ").length;
	
	var border_color = green_color;
	var color = blue_color;
	if (word_count[0] > max_words){
		color = red_color;
		border_color = red_color;
	}
	else if (word_count[0] == max_words){
		color = green_color;
	}
	d3.select(".graph")
		.style("border-right-color", border_color)
  		.select("div")
		.style("background-color", color);
	
	return word_count[0] != old_count;
}

function updateMaxWords(){
	//TODO assert that is a number
  var oldMax = max_words;
  max_words = document.getElementById("maxText").value;	
  x = d3.scale.linear()
    .domain([0, max_words])
    .range([0, max_width]);

  return oldMax != max_words
}

function update(){
	setInterval(function() {
	text = document.getElementById("textBox").value.trim();
	  var changedMax = updateMaxWords();
	  var changedWC = countWords();
	  
	  if (changedMax || changedWC){
	  	updateSize();
	  }
	  updateText();

	 //Most used
	words = {};		
	countWordsMostUsed();
	updateMostUsed();
	updateMostUsedChart();
		


	//1WC
  	word = document.getElementById("wordSearch").value.trim();
	countWords1WC();
	update1WC();

	}, 100);
}


function init1WC(){
	var bar = d3.select(".total")
	  	.selectAll("div")
			.data(count)
		.enter().append("div")			
			.text(count)

	
	word = document.getElementById("wordSearch").value.trim();
	text = document.getElementById("textBox").value.trim();

	if (word === "" || text === ""){
		count[0] = 0;
		var graph = d3.select(".total")
			.style("color", blue_color);
	}
}
function update1WC(){
	var color = "white";

	if (word === "" || text === ""){
		count[0] = 0;
		color = blue_color;
	}
	var graph = d3.select(".total")
  		.data(count)
		.text(count[0])
		.style("color", color);
}

function countWords1WC(){
	var searchOpt = document.getElementsByName('opt');
    var contains = searchOpt[0].checked;
    var text = document.getElementById("textBox").value.trim();

    if (contains){
		matches = text.split(word);
		 if (matches !== null)
		 	count[0] = matches.length-1;
	}
	else{
		count[0] = words[word];
	}


 }

 function initMostUsed(){
	var mU = d3.select(".mostUsed")
	  	.selectAll("div")
			.data(most_used_amts)
		.enter().append("div")
			.attr("class", "topNums")	
			.data(most_used_arr)

		mU.append("div")
				.attr("class","topWord")
				.style("display", "inline");

}
function updateMostUsedChart(){
	//numMU = document.getElementById("dropdown").value;

	var mU = d3.selectAll(".topNums")
			.data(most_used_amts)
			.text(function(d){return d; })
			.data(most_used_arr);
	mU.append("div")
				.attr("class","topWord")
				.style("display", "inline")
				.text(function(d){return d;})
// 				.attr("width", function(d){return 100*d + " px"});		//change this!!!	
}

function updateMostUsed(){
	var wordA = sortObject(words);
	most_used_amts =[];
	most_used_arr =[];
	for (var i = 0; i<numMU; i++){
		if (i >= wordA.length){
			most_used_amts.push("");
			most_used_arr.push("");
		}
		else{
			most_used_amts.push(wordA[i].value);
			most_used_arr.push(wordA[i].key);
		}
 	}

}

function countWordsMostUsed(){
	var textWords = text === "" ? 0 : text.split(" ");
	
	for (var i = 0; i < textWords.length; i++){
		var w = textWords[i];
		if (words[w]){
			words[w] += 1;
		}
		else {
			words[w] = 1;
		}
	}

 }


function sortObject(obj) {		//from http://jsfiddle.net/lalatino/mcuzr/
    var arr = [];
    var prop;
    for (prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] !== undefined) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) {
        return b.value - a.value;
    });
    return arr; // returns array
}

init();