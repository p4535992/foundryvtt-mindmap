export function log(...args) {
	toConsole(args, console.log);
}

export function warn(...args) {
	toConsole(args, console.warn);
}

function toConsole(args, fun) {
	let str = 'Graphs | ';
	if (typeof args[0] === 'string') 
		str += args.shift();

	fun(str, ...args);
}

