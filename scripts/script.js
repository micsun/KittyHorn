var keyBinds = {
	"1":['C', 1], "!":['C#', 1],
	"2":['D', 1], "@":['D#', 1],
	"3":['E', 1], "#":['E', 1],
	"4":['F', 1], "$":['F#', 1],
	"5":['G', 1], "%":['G#', 1],
	"6":['A', 1], "^":['A#', 1],
	"7":['B', 1], "&":['B', 1],
	"8":['C', 2], "*":['C#', 2],
	"9":['D', 2], "(":['D#', 2],
	"0":['E', 2], ")":['E', 2],
	"q":['F', 2], "Q":['F#', 2],
	"w":['G', 2], "W":['G#', 2],
	"e":['A', 2], "E":['A#', 2],
	"r":['B', 2], "R":['B', 2],
	"t":['C', 3], "T":['C#', 3],
	"y":['D', 3], "Y":['D#', 3],
	"u":['E', 3], "U":['E', 3],
	"i":['F', 3], "I":['F#', 3],
	"o":['G', 3], "O":['G#', 3],
	"p":['A', 3], "P":['A#', 3],
	"a":['B', 3], "A":['B', 3],
	"s":['C', 4], "S":['C#', 4],
	"d":['D', 4], "D":['D#', 4],
	"f":['E', 4], "F":['E', 4],
	"g":['F', 4], "G":['F#', 4],
	"h":['G', 4], "H":['G#', 4],
	"j":['A', 4], "J":['A#', 4],
	"k":['B', 4], "K":['B', 4],
	"l":['C', 5], "L":['C#', 5],
	"z":['D', 5], "Z":['D#', 5],
	"x":['E', 5], "X":['E', 5],
	"c":['F', 5], "C":['F#', 5],
	"v":['G', 5], "V":['G#', 5],
	"b":['A', 5], "B":['A#', 5],
	"n":['B', 5], "N":['B', 5],
	"m":['C', 6], "M":['C#', 6]};
var instrument = 'piano';
var duration = 2;

init();

function init()
{
	document.addEventListener("keypress", keyDownHandler);
	setInstrument('piano');
	setVolume(1);
	setDuration(2);
}

function keyDownHandler(e)
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
			if (!keyBinds.hasOwnProperty(key))
			{
				console.log('The keyBinds did not contain property: "' + key + '"');
				return;
			}

			var keyBind = keyBinds[key];
			Synth.play(instrument, keyBind[0], keyBind[1], duration);
			break;
	}
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
			setInstrument('edm');
			break;
		case 'edm':
			setInstrument('piano');
			break;
	}
}

function setInstrument(value)
{
	instrument = value;
	document.getElementById('Instrument').innerHTML = "Instrument: " + value + " (press spacebar to choose)";
}

function setVolume(value)
{
	Synth.setVolume(value);
	document.getElementById('Volume').innerHTML = "Volume: " + Math.round(Synth.getVolume() * 100) + "% (press - and + to adjust)";
}

function setDuration(value)
{
	duration = value < 0 ? 0 : value;
	document.getElementById('Duration').innerHTML = "Duration: " + duration + " (press [ and ] to adjust)";
}