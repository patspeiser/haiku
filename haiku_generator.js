//haiku generator
var fs = require('fs');
var dict = readDictionary('./cmudict.txt');
var syllableMap = {};

//reads dictionary file
function readDictionary(file){
	return fs.readFileSync(file).toString();
};

//get syllable count of word
function getSyllables(wordArray){
	var syllables = 0;
	for (var i = 2; i < wordArray.length; i++){
		var hasNum = wordArray[i].substr(-1);
		if (parseInt(hasNum) == 0 || parseInt(hasNum) == 1 || parseInt(hasNum) == 2){
			syllables++;
		}
	} 
	return syllables;
}

// create an object where it breaks down words by syllable count.
function pushToSyllableMap(word, syllables){
	if (!(syllables in syllableMap)){
		syllableMap[syllables] = [word];
	} else {
		syllableMap[syllables].push(word);
	}
};

//get a random number to use when looking up passed in structure array
function RNG(syllableCount){
	var max = syllableMap[syllableCount].length;
	var randomIndex = Math.floor(Math.random() * max);
	return randomIndex;
};

//make sure we get 17 syllables
// TODO update this to check each line as well instead of just total.
function checkStructure(array){
	var total = 0;
	var oneTotal = 0;
	var twoTotal = 0;
	var threeTotal = 0;
	array.forEach( function(lineArr){
		
		lineArr.forEach( function(el){
			total+=el;
		});
	});
	return total == 17 ? true : false;
};
//console.log(checkStructure([[1,1,1,1,1,1],[1,1,2,2,1],[5]]));

function getWord(syllables){
	return syllableMap[syllables][RNG(syllables)];
};
//console.log(getWord(2));

//get each row
function formatData(data){
	var lines = data.toString().split("\n"),
		lineSplit;
	lines.forEach(function(line){
		lineSplit = line.split(" ");
		var lineSyllables = getSyllables(lineSplit);
		if (lineSyllables < 7){
			if (!lineSplit[0].match(/[\d\W]/)){
				pushToSyllableMap(lineSplit[0], lineSyllables);	
			}
		}
	});
};

function createHaiku(structure){
	var haiku = '';
	structure.forEach( function(arr){
		arr.forEach( function(el){
			var word = getWord(el).toLowerCase();
			haiku += word + ' ';
		});
		haiku += '\n';
	});
	return haiku;			
};

formatData(dict);
for (var i = 0; i < 200; i++){
	console.log(createHaiku([[1,2,2],[3,2,2],[5]]))
};