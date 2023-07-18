export default class Debug {
	static log(message, addDivider) {
		if (!addDivider) {
			console.log(message);
		} else {
			console.log(`${divider}\n${message}\n${divider}`);
		}
	}
}

const divider = "--------------------------------------------------";