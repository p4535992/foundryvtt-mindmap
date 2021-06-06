/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules
import { Graph } from './module/graph.js';
// Import TypeScript modules
import { registerSettings } from './module/settings';
import { preloadTemplates } from './module/preloadTemplates';
import { FOUNDRYVTT_MINDMAP_MODULE_NAME } from './module/settings';
import { initHooks, readyHooks } from './module/Hooks';

import { GraphJournalSheet } from './module/graph-journal-sheet';


export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export let debug = (...args) => {if (debugEnabled > 1) console.log(`DEBUG:${FOUNDRYVTT_MINDMAP_MODULE_NAME} | `, ...args)};
export let log = (...args) => console.log(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | `, ...args);
export let warn = (...args) => {if (debugEnabled > 0) console.warn(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | `, ...args)};
export let error = (...args) => console.error(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | `, ...args);
export let timelog = (...args) => warn(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | `, Date.now(), ...args);

export let i18n = key => {
  return game.i18n.localize(key);
};
export let i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data);
}

export let setDebugLevel = (debugText) => {
  debugEnabled = {"none": 0, "warn": 1, "debug": 2, "all": 3}[debugText] || 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  if (debugEnabled >= 3) CONFIG.debug.hooks = true;
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
	console.log(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | Initializing ${FOUNDRYVTT_MINDMAP_MODULE_NAME}`);

	initHooks();
	// Assign custom classes and constants here

	// Register custom module settings
	registerSettings();
	//fetchParams();

	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)

  //@ts-ignore
  CONFIG.JournalEntry.sheetClass = GraphJournalSheet;
  
  // Creating the structure in CONFIG for Journals to have different sheets
  console.log("CustomJournals | Creating the structure to allow multiple Journal Sheets.")
  //@ts-ignore
  //CONFIG.JournalEntry.sheetClass = {};
  //@ts-ignore
  //CONFIG.JournalEntry.sheetClass[CONST.BASE_ENTITY_TYPE] = {};

  console.log(`${FOUNDRYVTT_MINDMAP_MODULE_NAME} | Registering the module's sheets.`)

  /*CUSTOMIZE
  * Here, register your sheet so it shows up properly in the dropdown, just change
  * for your sheet name and you're good to go
  */
  // The default Foundry journal
  //@ts-ignore
  EntitySheetConfig.registerSheet(JournalEntry, "journals", GraphJournalSheet, {
    label: "GraphJournalSheet",
    types: [CONST.BASE_ENTITY_TYPE],
    makeDefault: false
  });

});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
	// Do anything after initialization but before ready
	// setupModules();

	registerSettings();

  // fromUuid('JournalEntry.uRAS8eO7VOolui9w').then(journal => journal.show("graph", true))

	// Only show welcome screen to gms
	// if (!game.user.isGM){
  //   return;
  // }

  // Edit next line to match module.
  // const module = game.modules.get(FOUNDRYVTT_MINDMAP_MODULE_NAME);
  // const moduleId = module.id;
  // const title = module.data.title;
  // const moduleVersion = module.data.version;
  // game.settings.register(title, 'version', {
  //   name: `${title} Version`,
  //   default: "0.0.0",
  //   type: String,
  //   scope: 'world',
  // });
  // const oldVersion = game.settings.get(title, "version");

  // if (!isNewerVersion(moduleVersion, oldVersion))
  //   return;

  // class WelcomeScreen extends Application {
  //   static get defaultOptions() {
  //     const options = super.defaultOptions;
  //     options.template = `modules/${moduleId}/templates/welcome-screen.html`;
  //     options.resizable = true;
  //     options.width = 450;
  //     options.height = 600;
  //     options.classes = ["welcome-screen"];
  //     options.title = `${title} - Welcome Screen`;
  //     return options;
  //   }

  //   activateListeners(html) {
  //     super.activateListeners(html);

  //     html.find('.show-again').on('change', ev => {
  //       let val = "0.0.0";
  //       if (ev.currentTarget.checked)
  //         val = moduleVersion;

  //       game.settings.set(title, "version", val);
  //     })
  //   }
  // }

  // (new WelcomeScreen()).render(true);
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
	// // Do anything once the module is ready
	// if (!game.modules.get("lib-wrapper")?.active && game.user.isGM){
  //  	ui.notifications.error("The " + FOUNDRYVTT_MINDMAP_MODULE_NAME + " module requires to install and activate the 'libWrapper' module.");
	// 	return;
	// }

	readyHooks();
});

// Add any additional hooks if necessary

