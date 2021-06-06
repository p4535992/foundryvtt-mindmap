import { FOUNDRYVTT_MINDMAP_MODULE_NAME } from "./settings.js";
export const preloadTemplates = async function () {
    const templatePaths = [
        // Add paths to "module/XXX/templates"
        //`/modules/${FOUNDRYVTT_MINDMAP_MODULE_NAME}/templates/XXX.html`,
        `/modules/${FOUNDRYVTT_MINDMAP_MODULE_NAME}/templates/graph-journal-sheet.html`
    ];
    return loadTemplates(templatePaths);
};
