/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: Moerill
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */

// Import JavaScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { log } from './module/util/log.js';
import { Graph } from './module/graph.js';
import { GraphJournalSheet } from './module/graph-journal-sheet';


/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	
	log('Initializing graphs');
	
	// Assign custom classes and constants here
	
	// Register custom module settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	CONFIG.JournalEntry.sheetClass = GraphJournalSheet;
	
	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
// Hooks.once('setup', function() {
// 	// Do anything after initialization but before
// 	// ready
// });

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function() {
	// Do anything once the module is ready
	// fromUuid('JournalEntry.uRAS8eO7VOolui9w').then(journal => journal.show("graph", true))

	// Only show welcome screen to gms
	if (!game.user.isGM)
		return;
	// Edit next line to match module.
	const module = game.modules.get("mindmap");
	const moduleId = module.id;
	const title = module.data.title;
	const moduleVersion = module.data.version;
	game.settings.register(title, 'version', {
		name: `${title} Version`,
		default: "0.0.0",
		type: String,
		scope: 'world',
	});
	const oldVersion = game.settings.get(title, "version");

	if (!isNewerVersion(moduleVersion, oldVersion))
		return;

	class WelcomeScreen extends Application {
		static get defaultOptions() {
			const options = super.defaultOptions;
			options.template = `modules/${moduleId}/templates/welcome-screen.html`;
			options.resizable = true;
			options.width = 450;
			options.height = 600;
			options.classes = ["welcome-screen"];
			options.title = `${title} - Welcome Screen`;
			return options;
		}

		activateListeners(html) {
			super.activateListeners(html);

			html.find('.show-again').on('change', ev => {
				let val = "0.0.0";
				if (ev.currentTarget.checked)
					val = moduleVersion;

				game.settings.set(title, "version", val);
			})
		}
	}

	(new WelcomeScreen()).render(true);
});