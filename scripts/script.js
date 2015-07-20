
var KeyData = function(primary_button, secondary_button, music_note, octave_offset, x_offset, y_offset)
{
	this.primary = primary_button;
	this.secondary = secondary_button;
	this.note = music_note;
	this.octave = octave_offset;
	this.x = x_offset;
	this.y = y_offset;
};

var keys = [
	new KeyData("1", "!", 'C', 1, 58, 17),
	new KeyData("2", "@", "D", 1, 96, 17),
	new KeyData("3", "#", "E", 1, 134, 17),
	new KeyData("4", "$", "F", 1, 172, 17),
	new KeyData("5", "%", "G", 1, 209, 17),
	new KeyData("6", "^", "A", 1, 244, 17),
	new KeyData("7", "&", "B", 1, 283, 17),
	new KeyData("8", "*", "C", 2, 322, 17),
	new KeyData("9", "(", "D", 2, 361, 17),
	new KeyData("0", ")", "E", 2, 400, 17),
	new KeyData("q", "Q", "F", 2, 74, 58),
	new KeyData("w", "W", "G", 2, 111, 58),
	new KeyData("e", "E", "A", 2, 150, 58),
	new KeyData("r", "R", "B", 2, 188, 58),
	new KeyData("t", "T", "C", 3, 225, 58),
	new KeyData("y", "Y", "D", 3, 263, 58),
	new KeyData("u", "U", "E", 3, 300, 58),
	new KeyData("i", "I", "F", 3, 340, 58),
	new KeyData("o", "O", "G", 3, 376, 58),
	new KeyData("p", "P", "A", 3, 416, 58),
	new KeyData("a", "A", "B", 3, 83, 97),
	new KeyData("s", "S", "C", 4, 121, 97),
	new KeyData("d", "D", "D", 4, 159, 97),
	new KeyData("f", "F", "E", 4, 197, 97),
	new KeyData("g", "G", "F", 4, 236, 97),
	new KeyData("h", "H", "G", 4, 274, 97),
	new KeyData("j", "J", "A", 4, 313, 97),
	new KeyData("k", "K", "B", 4, 350, 97),
	new KeyData("l", "L", "C", 5, 389, 97),
	new KeyData("z", "Z", "D", 5, 111, 136),
	new KeyData("x", "X", "E", 5, 149, 136),
	new KeyData("c", "C", "F", 5, 188, 136),
	new KeyData("v", "V", "G", 5, 225, 136),
	new KeyData("b", "B", "A", 5, 264, 136),
	new KeyData("n", "N", "B", 5, 303, 136),
	new KeyData("m", "M", "C", 6, 340, 136)];

var instrument = 'piano';
var duration = 2;
var canvas = document.getElementById("mainCanvas");
var stage, preload, background;
var inst_Circle, inst_Keyboard, inst_Title, inst_Volume, inst_Duration, inst_Instrument;
var letters = [], shots = [];
var queue = "";

init();

function init()
{
	initCanvas();
	initBackground();
	initKeyboard();
	refreshTitle();
	refreshVolume();
	refreshDuration()
	initInstruments();
	addEventListeners();
	startGame();
}

function startGame()
{
	TweenMax.delayedCall(1, spawnObject);
}

function getKey(value)
{
	for (var item in keys)
	{
		var key = keys[item];

		if (key.primary == value || key.secondary == value)
		{
			return key;
		}
	}

	console.info('getKey ==> value not found, "' + value + '"');
	return null;
}

function spawnObject()
{
	if (letters.length < 10)
	{
		var targetKey = getNextKey();

		if (targetKey === null)
		{
			TweenMax.delayedCall(Math.random() * 2 + 0.2, spawnObject);
			return;
		}

		var o = new createjs.Text(targetKey[Math.random() < 0.5 ? "primary" : "secondary"], "20px Arial Black", "#fff");
		o.x = targetKey.x + inst_Keyboard.x - o.getMetrics().width * 0.5;
		o.y = 110;
		TweenMax.from(o, 0.25, {alpha:0});
		var t = TweenMax.to(o, 5, {y:targetKey.y + inst_Keyboard.y - o.getMetrics().height * 0.5, ease:Power2.easeInOut, onComplete:handleFailure});
		stage.addChild(o);
		letters.push(t);
	}

	TweenMax.delayedCall(Math.random() * 2 + 0.2, spawnObject);
}

function getNextKey()
{
	if (queue != "")
	{
		var c = getKey(queue.charAt(0));
		queue = queue.slice(1);
		return c;
	}
	else
	{
		return keys[Math.floor(Math.random() * keys.length)];
	}
}

function handleFailure()
{
	this.target.color = "#f00";
	this.target.alpha = 0.5;
}

function initCanvas()
{
	stage = new createjs.Stage("mainCanvas");
}

function addEventListeners()
{
	document.addEventListener("keypress", handleKeyDown);
	createjs.Ticker.addEventListener("tick", handleTick);
	document.getElementById("btnQueue").addEventListener("click", queueInput);
	document.getElementById("btnClear").addEventListener("click", clearInput);
}

function queueInput()
{
	queue = document.getElementById("textInput").value;

	for (var l in letters)
	{
		stage.removeChild(letters[l].target);
	}
	letters = [];
}

function clearInput()
{
	document.getElementById("textInput").value = "";
}

function initKeyboard()
{
	inst_Keyboard = new createjs.Container();
	var keyboardBitmap = new createjs.Bitmap("assets/images/Keyboard.jpg");
	keyboardBitmap.image.onload = function()
	{
		inst_Keyboard.addChild(keyboardBitmap);
		inst_Keyboard.x = stage.canvas.width * 0.5 - keyboardBitmap.image.width * 0.5;
		inst_Keyboard.y = stage.canvas.height - keyboardBitmap.image.height;
		stage.addChild(inst_Keyboard);

		for (var i in keys)
		{
			var key = keys[i];
			var incorrect = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRoundRect(-19, -19, 38, 38, 5));
			incorrect.alpha = 0.5;
			incorrect.x = key.x;
			incorrect.y = key.y;
			inst_Keyboard.addChild(incorrect);
			incorrect.key = key;
			key.incorrect = incorrect;
			incorrect.alpha = 0;
			var correct = new createjs.Shape(new createjs.Graphics().beginFill("#00ff00").drawRoundRect(-19, -19, 38, 38, 5));
			correct.alpha = 0.5;
			correct.x = key.x;
			correct.y = key.y;
			inst_Keyboard.addChild(correct);
			correct.key = key;
			correct.addEventListener("click", handleShapeClick);
			key.correct = correct;
			correct.alpha = 0.01;
		}
	}
}

function initBackground()
{
	background = new createjs.Shape();
	background.graphics.beginFill("#000").drawRect(0, 80, stage.canvas.width, stage.canvas.height);
	stage.addChild(background);
}

function initInstruments()
{
	setInstrument('piano');
	setVolume(0.5);
	setDuration(2);
}

function handleTick(e)
{
	stage.update();
}

function handleKeyDown(e)
{
	var key = String.fromCharCode(e.charCode);

	switch (key)
	{
		case " ":
			nextInstrument();
			break;
		case "-":
		case "_":
			setVolume(Synth.getVolume() - 0.1);
			break;
		case "=":
		case "+":
			setVolume(Synth.getVolume() + 0.1);
			break;
		case "{":
		case "[":
			setDuration(duration - 1);
			break;
		case "}":
		case "]":
			setDuration(duration + 1);
			break;
		default:
			if (!getKey(key))
			{
				console.log('The keys array did not contain the key, "' + key + '"');
				return;
			}

			var keyData = getKey(key);
			mow(keyData, key == keyData.primary);
			break;
	}
}

function handleShapeClick(e)
{
	mow(e.target.key);
}

function mow(key_data, is_primary)
{
	is_primary = typeof is_primary !== 'undefined' ? is_primary : true;

	for (var i = 0; i < letters.length; ++i)
	{
		if (letters[i].target.text == key_data.primary || letters[i].target.text == key_data.secondary)
		{
			var t = letters[i].target;
			letters[i].kill();
			t.color = "#00ccff";
			TweenMax.to(t, 1, {scaleX:4, scaleY:4, x:t.x - t.getMetrics().width * 2, alpha:0, y:t.y - 300, ease:Back.easeIn, onComplete:function(target) { stage.removeChild(target); }, onCompleteParams:[t]});
			Synth.play(instrument, key_data.note, key_data.octave, duration);
			letters.splice(i, 1);
			var tl = new TimelineMax();
			tl.to(key_data.correct, 0.25, {alpha:0.5, ease:Power2.easeOut})
				.to(key_data.correct, 0.75, {alpha:0.01, ease:Power2.easeIn});
			return;
		}
	}

	var s = new createjs.Shape();
	s.graphics.beginFill(getRandomColor());
	s.graphics.drawEllipse(-5, -8, 10, 16);
	s.x = key_data.x + inst_Keyboard.x;
	s.y = key_data.y + inst_Keyboard.y;
	stage.addChild(s);
	shots.push(s);
	Synth.play("edm", key_data.note, key_data.octave, duration * 0.5);
	TweenMax.to(s, 1, {y:-10, alpha:0, ease:Power2.easeIn, onComplete:handleMowComplete});
	var tl = new TimelineMax();
	tl.to(key_data.incorrect, 0.25, {alpha:0.5, ease:Power2.easeOut})
		.to(key_data.incorrect, 0.75, {alpha:0, ease:Power2.easeIn});
}

function handleMowComplete()
{
	stage.removeChild(this.target);
	shots.slice(this.target);
}

function getRandomColor()
{
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function nextInstrument()
{
	switch (instrument)
	{
		case 'piano':
			setInstrument('organ');
			break;
		case 'organ':
			setInstrument('acoustic');
			break;
		case 'acoustic':
			setInstrument('piano');
			break;
		// case 'edm':
		// 	setInstrument('piano');
		// 	break;
	}
}

function setInstrument(value)
{
	instrument = value;
	refreshInstrument();
}

function setVolume(value)
{
	Synth.setVolume(value);
	refreshVolume();
}

function setDuration(value)
{
	duration = value < 0 ? 0 : value;
	refreshDuration();
}

function refreshTitle()
{
	if (inst_Title === undefined)
	{
		inst_Title = new createjs.Text("KittyHorn 0.0.2", "20px Arial", "#000");
		stage.addChild(inst_Title);
	}

	inst_Title.x = stage.canvas.width * 0.5 - inst_Title.getMetrics().width * 0.5;
	inst_Title.y = 5;
}

function refreshVolume()
{
	if (inst_Volume === undefined)
	{
		inst_Volume = new createjs.Text();
		inst_Volume.y = inst_Title.y + inst_Title.getMetrics().height + 5;
		stage.addChild(inst_Volume);
	}

	inst_Volume.text = "Volume: " + Math.round(Synth.getVolume() * 100) + "% (press - and + to adjust)";
	inst_Volume.x = stage.canvas.width * 0.5 - inst_Volume.getMetrics().width * 0.5;
}

function refreshDuration()
{
	if (inst_Duration === undefined)
	{
		inst_Duration = new createjs.Text();
		inst_Duration.y = inst_Volume.y + inst_Volume.getMetrics().height + 5;
		stage.addChild(inst_Duration);
	}

	inst_Duration.text = "Duration: " + duration + " (press [ and ] to adjust)";
	inst_Duration.x = stage.canvas.width * 0.5 - inst_Duration.getMetrics().width * 0.5;
}

function refreshInstrument()
{
	if (inst_Instrument === undefined)
	{
		inst_Instrument = new createjs.Text();
		inst_Instrument.y = inst_Duration.y + inst_Duration.getMetrics().height + 5;
		stage.addChild(inst_Instrument);
	}

	inst_Instrument.text = "Instrument: " + instrument + " (press spacebar to choose)";
	inst_Instrument.x = stage.canvas.width * 0.5 - inst_Instrument.getMetrics().width * 0.5;
}