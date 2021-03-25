## v0.5.1
* Fixed manual layout not remembering its position after reload.

## v0.5.0
* New Layout: Manual
	- Choose your own layout by dragging the nodes to your desired position.
	- **TIP:** Choose an automatic layout you like, switch afterwards to Manual and adjust to your liking. (This also helps to remove the randomness of the physics based layouts)
* Added Compound nodes
	- Drag a node near another node to create a compound node.
	- Be careful, when deleting a compound node by clicking you also delete its children!
* Reduced the source file sizes drastically (from 7.5MB down to ~1.3MB)
	- Minified code
	- Moved source maps out of the .js source files
	- split  code into chunks, lazy loading libraries only when needed (Experimental. Hopefully does not result in to many bugs..)
* Added Context Menu for Macro nodes
* The "renderJournalSheet" Hook is now called when rendered to allow for compatibility with other journal enhancing mods, like GM Notes by @Felix
* Fixed an issue where the sheet sometimes breaks and is not able to be reopened again.
* Changed "delete irregular nodes" to "delete selected nodes" and child nodes.
* Added a default node for an empty mindmap giving some hint on how to start working with this.

![mindmap_layout_chooser](/data/mindmap_v050.mp4)

## v0.4.0
* New: Settings button in the bottom left corner!
	- Choose your automatic layout for a mindmap.
	- Lost your mindmap due to unresponsible zooming or dragging? Use the "Fit to Viewport" function to find your mindmap again!
	- Did some irregular nodes appear due to some bug? Use the "remove irregular nodes" button to delete them. (Irregular here means you can't access them using the context menu.)
* Now automatically opens a mindmap if the mindmap is the only set content for a Journal entry. (Meaning: neither text nor image is defined)
