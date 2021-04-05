import { debug, log } from '../foundryvtt-mindmap';
import { MODULE_NAME } from './settings';

// https://github.com/cytoscape/cytoscape.js
import cytoscape from './libs/cytoscape.js/cytoscape.esm.js';
// import cytoscape from 'cytoscape';

// https://github.com/iVis-at-Bilkent/cytoscape.js-cise
import cise from './libs/cytoscape.js-cise/cytoscape-cise.js';
// import cise from 'cytoscape-cise';

// https://github.com/cytoscape/cytoscape.js-cola
import cola from './libs/cytoscape.js-cola/cytoscape-cola.js';
// import cola from 'cytoscape-cola';

// https://github.com/iVis-at-Bilkent/cytoscape.js-context-menus
import contextMenus from './libs/cytoscape.js-context-menus/cytoscape-context-menus.js';
// import contextMenus from 'cytoscape-context-menus';
// import CSS as well
// import 'cytoscape-context-menus/cytoscape-context-menus.css';

// https://github.com/cytoscape/cytoscape.js-compound-drag-and-drop
import compoundDragAndDrop from './libs/cytoscape.js-compound-drag-and-drop/cytoscape-compound-drag-and-drop.js';
// import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';

// https://github.com/cytoscape/cytoscape.js-cose-bilkent
import coseBilkent from './libs/cytoscape.js-cose-bilkent/cytoscape-cose-bilkent.js';
// import coseBilkent from 'cytoscape-cose-bilkent';

// https://github.com/cytoscape/cytoscape.js-cxtmenu
import cxtmenu from './libs/cytoscape.js-cxtmenu/cytoscape-cxtmenu.js';
// import cxtmenu from 'cytoscape-cxtmenu';

// https://github.com/cytoscape/cytoscape.js-dagre
import dagre from './libs/cytoscape.js-dagre/cytoscape-dagre.js';
// import dagre from 'cytoscape-dagre';

// https://github.com/cytoscape/cytoscape.js-edgehandles
import edgehandles from './libs/cytoscape.js-edgehandles/cytoscape-edgehandles.js';
// import edgehandles from 'cytoscape-edgehandles';

// https://github.com/iVis-at-Bilkent/cytoscape.js-fcose
import fcose from './libs/cytoscape.js-fcose/cytoscape-fcose.js';
// import fcose from 'cytoscape-fcose';

// https://github.com/cytoscape/cytoscape.js-klay
import klay from './libs/cytoscape.js-klay/cytoscape-klay.js';
// import klay from 'cytoscape-klay';

// https://github.com/cytoscape/cytoscape.js-spread
import spread from './libs/cytoscape.js-spread/cytoscape-spread.js';
// import spread from 'cytoscape-spread';

// https://github.com/d3/d3
import d3 from './libs/d3/d3.js';
// import d3 from 'd3';

// let cytoscape;

async function initCytoscape() {
	// cytoscape = await import(
	// 	/* webpackPrefetch: true */
	// 	/* webpackChunkName: "cytoscape" */
	// 	'cytoscape');

}

let extensionsImported = false;
async function importExtensions() {
	// const edgehandles = (await import(
  	// /* webpackPrefetch: true */
	// 	/* webpackChunkName: "edgehandles" */
	// 	'cytoscape-edgehandles')).default;

	// const cxtmenu = (await import(
  	// /* webpackPrefetch: true */
	// 	/* webpackChunkName: "cxtmenu" */
	// 	'cytoscape-cxtmenu')).default;

	// const compoundDragAndDrop = (await import(
	// 	/* webpackPrefetch: true */
	// 	/* webpackChunkName: "compound-drag-and-drop" */
	// 	'cytoscape-compound-drag-and-drop')).default;

	// cytoscape.use(compoundDragAndDrop);
	// cytoscape.use(edgehandles);
	// cytoscape.use(cxtmenu);

	cytoscape.use( compoundDragAndDrop );
	cytoscape.use( edgehandles );
	cytoscape.use( contextMenus );

    // TO ADD ???
	cytoscape.use( cise );
	cytoscape.use( cola );
	cytoscape.use( coseBilkent );
	cytoscape.use( cxtmenu );
	cytoscape.use( dagre );
	cytoscape.use( fcose );
	cytoscape.use( klay );
	cytoscape.use( spread );

	extensionsImported = true;
}

/**
 * Lazy load module by name
 * @param {*} name
 */
async function loadLayout(name) {
	const layout = (await {
			dagre: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "dagre" */
				'cytoscape-dagre'
			),
			klay: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "klay" */
				'cytoscape-klay'
			),
			cola: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "cola" */
				'cytoscape-cola'
			),
			fcose: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "fcose" */
				'cytoscape-fcose'
			),
			cise: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "cise" */
				'cytoscape-cise'
			),
			spread: async () => import(
				/* webpackPrefetch: true */
		/* webpackChunkName: "spread" */
				'cytoscape-spread'
			),
		}[name]()).default;

	cytoscape.use(layout);
}

const dblClickTime = 300;

export class Graph {
	constructor(container, journal, options = {}) {
		this['_style'] = [...this.defaultStyle, ...(options['style'] || [])];
		this['_layout'] = {...this.defaultLayout, ...(options['layout'] || {})};
		this['_journal'] = journal;
		this['_container'] = container;

		this['_selectedNode'] = null;
		this['_dragTime'] = null;
	}

	async init() {
		if (!cytoscape){
			await initCytoscape();
    }
		if (!extensionsImported){
			await importExtensions();
    }
		const journal = this['_journal'];
		const container = this['_container'];
		let json = journal.getFlag(MODULE_NAME, 'data') || {elements: {}};

		if (!json.elements.nodes) {
			json.elements =
				[
					{
						data: {
							name: "Drag Entities onto the Canvas or right click me.",
							type: "text"
						},
						classes: [
							'text-node'
						]
					}
				];
		}

		if (json.layout) {
			let layout = Graph.layouts.find(e => e.name === json.layout.name);
			this['_layout'] = {...this.defaultLayout, ...layout};
		} else
			this['_layout'] = this.defaultLayout;

		log('Initializing.. ', json, this)
		this['_cy'] = cytoscape['default']({
			container: container,
			elements: json.elements,
			layout: {name: "preset"},
			style: this['_style'],
			boxSelectionEnabled: true,
			autoungrabify: journal.permission < CONST.ENTITY_PERMISSIONS.OWNER ? true : false,
			autounselectify: journal.permission < CONST.ENTITY_PERMISSIONS.OWNER ? true : false
		});
		window['cy'] = this['_cy'];

		const cdnd = this['_cy'].compoundDragAndDrop();
		cdnd.enable();

		await this.update();
		this['_cy'].nodes().unselect();

		// Open Entity with double clicked
		this['_cy'].on('click', 'node', ev => this._onDblClick(ev));

		if (journal.permission < CONST.ENTITY_PERMISSIONS.OWNER){
			return;
    }

		this['_eh'] = this['_cy'].edgehandles( {
			snap: true,
			stop: (sourceNode, targetNode, addedEles) => {
				this['_eh'].disable();
			},
			complete: (sourceNode, targetNode, addedEles) => {
				log(sourceNode, targetNode, addedEles, this['_cy'].json().elements)

				this.saveDataToJournal()
			}
		} );
		this['_eh'].hide();
		this['_eh'].disable();
		const cxtMenues = this.cxtMenuCommands;
		for (let menu of cxtMenues) {
			this['_cy'].cxtmenu(menu);
		}


		// Save after finishing dragging a node, but only if layout is preset
		this['_cy'].on('free', 'node', ev => { this.saveDataToJournal();	});

		container.addEventListener('dragover', ev => this._onDragOver(ev));
		container.addEventListener('dragenter', ev => this._onDragEnter(ev));
		container.addEventListener('drop', ev => this._onDropEntity(ev));
	}

	get cxtMenuCommands() {
		let ret = [];

		const modifyLabel = { // modify label
						fillColor: 'rgba(50, 50, 50, 0.75)',
						content: '<i class="fas fa-tag"></i><br>Modify label',
						contentStyle: {},
						select: (ele) => this._modifyData(ele, 'name', 'text'),
						enabled: true
					};

		let node = [
			{ // delete
				fillColor: 'rgba(200, 50, 50, 0.75)',
				content: '<i class="fa fa-trash" aria-hidden="true"></i><br>Remove<br>Node',
				select: (ele) => this.removeElement(ele),
				enabled: true
			},
			{ // mark visited
				fillColor: 'rgba(50, 50, 50, 0.75)',
				content: 'Toggle visited',
				select: (ele) => {
					ele.toggleClass('visited');
					this.saveDataToJournal();
				},
				enabled: true
			},
			{ // add edge
				fillColor: 'rgba(50, 50, 50, 0.75)',
				content: 'Add<br>Edge',
				select: (ele) => {
					this['_eh'].enable();
					this['_eh'].start(ele);
				},
				enabled: true
			},
			{ // Add text node
				fillColor: 'rgba(50, 50, 50, 0.75)',
				content: 'Add<br>Textnode',
				select: async (ele) => {
					const node = await this.addNode(null, ele.renderedPosition());
					this.addEdge(ele.data().id, node.data().id, true);
				},
				enabled: true
			},
			modifyLabel,
		];
		let entity = [
				...node
				, ...[
					{ // show entity
						fillColor: 'rgba(50, 50, 50, 0.75)',
						content: '<i class="fas fa-eye"></i><br>Open Sheet',
						select: (ele) => this._showEntity(ele.data().uuid),
						enabled: true
					},
				]
			];

		ret.push({
			selector: '.scene',
			commands: [
				...node,
				...[
					{ // Activate Scene
						fillColor: 'rgba(50, 50, 50, 0.75)',
						content: '<i class="fas fa-bullseye fa-fw"></i><br>Activate',
						select: async (ele) => {
							const entity = await fromUuid(ele.data().uuid);
							entity.activate();
						},
						enabled: true
					},

				]
			]
		});
		ret.push({
			selector: '.journal-entry',
			commands: [
				...entity
			]
		});
		ret.push({
			selector: '.actor',
			commands: [
				...entity
			]
		});
		ret.push({
			selector: '.rollable-tables',
			commands: [
				...entity
			]
		});
		ret.push({
			selector: '.item',
			commands: [
				...entity
			]
		});
		ret.push({
			selector: '.macro',
			commands: [
				...entity
			]
		});
		ret.push({
			selector: '.text-node',
			commands: [
				...node,
			]
		});
		ret.push({
			selector: 'node:compound',
			commands: [
				...node,
			]
		})

		// Edge
		ret.push({
			selector: 'edge',
			commands: [
				{ // delete
					fillColor: 'rgba(200, 50, 50, 0.75)',
					content: '<i class="fa fa-trash" aria-hidden="true"></i><br>Remove<br>Edge',
					select: (ele) => this.removeElement(ele),
					enabled: true
				},
				{ // Toggle direction
					fillColor: 'rgba(50, 50, 50, 0.75)',
					content: '<i class="fas fa-map-signs"></i><br>Toggle direction',
					contentStyle: {},
					select: (ele) => this._toggleEdgeDirection(ele),
					enabled: true
				},
				modifyLabel,
				{ // modify color
					fillColor: 'rgba(50, 50, 50, 0.75)',
					content: '<i class="fas fa-palette"></i><br>Change Color',
					contentStyle: {},
					select: (ele) => this._modifyData(ele, 'color', 'color'),
					enabled: true
				}
			]
		})
		return ret;
	}

	get defaultStyle() {
		return [
			{
				selector: 'node',
				style: {
					'background-fit': 'cover',
					'background-color': '#666',
					'text-valign': 'bottom',
					'border-width': 1,
					'border-style': 'solid',
					'border-color': '#666',
					'border-opacity': 0.8,
					'font-family': 'Signika, sans-serif',
					'font-size': 9,
					'text-wrap': 'wrap',
					'text-max-width': '100px',
					'color': '#333',
					'width': 30,
					'height': 30
				}
			},
			{
				selector: 'node[name]',
				style: {
					'label': 'data(name)',
				}
			},
			{
				selector: 'node:compound',
				style: {
					'background-color': '#999',
					'background-opacity': '0.5',
				}
			},
			{
				selector: '.visited',
				style: {
					'opacity': 0.55,
					'border-color': '#A00',
					'border-width': 2,
					'background-blacken': 0.3
				}
			},
			{
				selector: 'edge',
				style: {
					'curve-style': 'bezier',
					'width': "2px",
					'line-color': "#999",
					'target-arrow-color': '#999',
					'target-arrow-shape': 'triangle-backcurve',
					'arrow-scale': 1.5,
					'source-endpoint': 'outside-to-node-or-label',
					'target-endpoint': 'outside-to-node-or-label',
				}
			},
			{
				selector: '.undirected',
				style: {
					'target-arrow-shape': 'none'
				}
			},
			{
				selector: 'edge[name]',
				style: {
					'font-family': 'Signika, sans-serif',
					'label': 'data(name)',
					'text-rotation': 'autorotate',
					'color': '#333',
					'font-size': 9,
					'text-wrap': 'wrap',
					'text-max-width': '40px',
					'text-outline-color': '#ccc',
					'text-outline-width': 1,
					'text-outline-opacity': 0.5
				}
			},
			{
				selector: 'edge[color]',
				style: {
					'line-color': 'data(color)',
					'target-arrow-color': 'data(color)',
				}
			},
			{
				selector: '.journal-entry',
				style: {
					'background-image':  `/modules/${MODULE_NAME}/assets/open-book.png` //'modules/mindmap/assets/open-book.png'
				},
			},
			{
				selector: '.actor',
				style: {
					'background-image': `/modules/${MODULE_NAME}/assets/assets/person.png` //'modules/mindmap/assets/person.png'
				},
			},
			{
				selector: '.item',
				style: {
					'background-image': `/modules/${MODULE_NAME}/assets/assets/suitcase.png` //'modules/mindmap/assets/suitcase.png'
				},
			},
			{
				selector: '.roll-table',
				style: {
					'background-image': `/modules/${MODULE_NAME}/assets/assets/rolling-dices.png` //'modules/mindmap/assets/rolling-dices.png'
				}
			},
			{
				selector: '.macro',
				style: {
					'background-image': 'icons/svg/dice-target.svg'
				}
			},
			{
				selector: '.img',
				style: {
					'background-image': 'data(img)'
				}
			},
			{
				selector: 'node:selected',
				style: {
					'border-style': 'dashed',
					'border-width': '2px',
					'border-color': '#0169d9',
					'border-opacity': 1,
					'background-blacken': -0.3
				}
			},
			{
				selector: '.text-node',
				style: {
					'shape': 'star',
					'width': 15,
					'height': 15,
					'font-size': 9,
				}
			}
		];
	}

	get defaultLayout() {
		return {
			name: 'dagre',
			animate: true,
			fit: true,
			nodeDimensionsIncludeLabels: true,
			animationEasing: 'ease-out-sine',
			animationDuration: 300
		}
	}

	static get layouts() {
		return [
			{ name: 'preset', label: 'Manual', fit: false },
			{ name: 'grid', label: 'Grid' },
			{ name: 'circle', label: 'Circle' },
			{ name: 'concentric', label: 'Concentric Circles' },
			{ name: 'breadthfirst', label: 'Breadthfirst (Tree like)', directed: true },
			{ name: 'dagre', label: 'Dagre' },
			{ name: 'klay', label: 'Klay' },
			{ name: 'fcose', label: 'fast Compound Spring Embedder', quality: "proof", randomize: false },
			// { name: 'cose-bilkent', label: '' },
			{ name: 'spread', label: 'Spread' },
			{ name: 'cise', label: 'Circular Spring Embedder', animate: false },
			{ name: 'cola', label: 'Cola' },
			{ name: 'random', label: 'Random' },
		]
	}

	set layout(name) {
		const layout = Graph.layouts.find(e => e.name === name);
		if (!layout)
			throw new Error('Graphs | Layout not found!');

		this['_layout'] = {...this.defaultLayout, ...layout};
		this.saveDataToJournal();
	}

	_getClassByEntityName(name) {
		return {
			JournalEntry: 'journal-entry',
			Actor: 'actor',
			Item: 'item',
			Scene: 'scene',
			RollTable: 'roll-table',
			Macro: 'macro'
		}[name];
	}

	async addNode(entity, position, run = false) {
		let  nodeData;
		if (entity) {
			nodeData = {
				data: {
					// id: entity.id || entity._id,
					name: entity.name,
					type: entity.entity,
					uuid: entity.uuid
				},
				classes: [
					this._getClassByEntityName(entity.entity),
					'entity'
				]
			};
			if (entity.data.thumb) {
				nodeData.data.img = entity.data.thumb;
				nodeData.classes.push('img');
			} else if (entity.img || entity.data.img)  {
				nodeData.data.img = entity.img || entity.data.img;
				nodeData.classes.push('img');
			}

		} else { // Textnode
			nodeData = {
				data: {
					name: "New Textnode",
					type: "text"
				},
				classes: [
					'text-node'
				]
			}
		}
		if (position) {
			nodeData.renderedPosition = position
		}


		const node = this['_cy'].add( nodeData );

		if (run)
			this.saveDataToJournal();

		return node;
	}

	async addEdge(sourceId, targetId, run = false) {
		let edgeData = {
			data: {
				source: sourceId,
				target: targetId,
			}
		};
		const edge = this['_cy'].add( edgeData );
		if (run) {

			this.saveDataToJournal();
		}
	}

	async removeElement(element) {
		element.remove();
		this.saveDataToJournal();
	}

	async _onDropEntity(ev) {
    ev.preventDefault();

    // Try to extract the data
    let data;
    try {
      data = JSON.parse(ev.dataTransfer.getData('text/plain'));
    }
    catch (err) {
      return false;
		}
		if (!this._getClassByEntityName(data.type)) return false;
		let entity;
		try {
			if (data.pack)
				entity = await fromUuid(['Compendium', data.pack, data.id].join("."));
			else if (data.actorId) {
				const uuid = ['Actor', data.actorId, 'OwnedItem', data.data._id].join(".");
				entity = await fromUuid(uuid);
				entity.uuid = uuid
				entity.id = entity._id;
				entity.entity = 'Item';
			} else
				entity = await fromUuid([data.type, data.id].join("."));
		} catch (error) {
			console.error(error);
			ui.notifications.error('Unsupported entity type');
			return;
		}

		const mousePos = {x: ev.offsetX, y: ev.offsetY}
		const closest = this['_selectedNode'];

		let node;
		try {
			node = await this.addNode(entity, mousePos, closest ? false : true);
		} catch (err) {
			console.error(err);
			ui.notifications.error('Only one node of that UUID is allowed.');
			return false;
		}

		if (closest){
			this.addEdge(closest.data().id, node.data().id, true);
    }
		if (this['_selectedNode']) {
			this['_selectedNode'].unselect();
			this['_selectedNode'] = null;
		}

		return;
	}

	async _onDragOver(ev) {
		if ((ev.timeStamp - this['_dragTime']) < 50){
      return;
    }
		this['_dragTime'] = ev.timeStamp;
		const nodes = this['_cy'].nodes();
		if (nodes.length === 0) return;
		let radius = nodes[0].renderedWidth();
		const pos = {x: ev.offsetX, y: ev.offsetY};
		if (this['_selectedNode']){
			this['_selectedNode'].unselect();
    }
		this['_selectedNode'] = null;
		nodes.forEach(el => {
			let nodePos = el.renderedPosition();
			let dist = Math.abs(nodePos.x - pos.x) + Math.abs(nodePos.y - pos.y);
			if (dist < radius) {
				dist = radius;
				this['_selectedNode'] = el;
			};
		})
		if (this['_selectedNode']){
			this['_selectedNode'].select();
    }
	}

	async _onDragEnter(ev) {
		this['_cy'].nodes().unselect();
	}

	async saveDataToJournal() {
		debug('Saving Data...')
		// this._cy.one('layoutstop', ev => this._cy.animation({
		// 		complete: this._journal.setFlag(MODULE_NAME, 'data', this._cy.json()),
		// 		fit: this._cy,
		// 		duration: 300
		// 	}).play()
		// );
		// this._cy.one('layoutstop', ev => this._journal.setFlag(MODULE_NAME, 'data', this._cy.json()));

		this['_cy'].nodes('.eh-ghost').remove();
		// Make sure "edges"  gets deleted!
		let elements = this['_cy'].json().elements;
		if (!elements.edges || elements.edges.length === 0){
			elements["-=edges"] = null;
    }

		if (!elements.nodes || elements.nodes.length === 0){
			elements["-=nodes"] = null;
    }

		let udata = {
			elements,
			layout: this['_layout']
		}

		// Save data after layout has stopped, to reduce differencees after reopening the journal
		this['_cy'].one('layoutstop', ev => {
			let elements = this['_cy'].json().elements;
			if (!elements.edges || elements.edges.length === 0){
				elements["-=edges"] = null;
      }

			if (!elements.nodes || elements.nodes.length === 0){
				elements["-=nodes"] = null;
      }

			let udata = {
				elements,
				layout: this['_layout']
			}
			this['_journal'].setFlag(MODULE_NAME, 'data', udata)
		});
		this.update(udata);
	}

	/**
	 * Checks if double left click, if yes, show the entities sheet.
	 * @param {Event} ev
	 */
	_onDblClick(ev)  {
		this['_rightClicked'] = null;
		if (this['_clicked']
			&& Math.abs(this['_clicked'].time - ev.timeStamp) < dblClickTime
			&& (this['_clicked'].target === ev.target.data().id)) {
				ev.preventDefault();
				ev.stopPropagation();

				if (ev.target.data('uuid')){
					this._showEntity(ev.target.data().uuid);
        }
				this['_clicked'] = null;
		} else{
			this['_clicked'] = {
				time: ev.timeStamp,
				target: ev.target.data().id
			}
    }
	}

	/**
	 * Show entity sheet to a given uuid.
	 * @param {string} uuid
	 */
	async _showEntity(uuid) {
		let entity = await fromUuid(uuid);

		if (!entity.entity) // owned item
			entity = new CONFIG.Item.entityClass(entity,null);

		if (entity.permission > CONST.ENTITY_PERMISSIONS.NONE)
			entity.sheet.render(true);
	}

	/**
	 * Toggles direction of an edge.
	 * directed -> undirected -> turned around -> undirecter -> directed
	 * @param {Edge} edge
	 */
	async _toggleEdgeDirection(edge) {
		if (edge.hasClass('undirected')) {
			// edge.removeClass('undirected');
			const data = duplicate(edge.data());
			const source = data.source;
			const target = data.target;
			data.source = target;
			data.target = source;
			edge.remove();
			delete(data.id);
			this['_cy'].add({data});

		} else {
			edge.addClass('undirected');
		}
		this.saveDataToJournal();
	}

	/**
	 * Updates the graph with given json data.
	 * @param {Object} udata
	 */
	async update(udata:any = {}) {
		if (!this['_cy']){
      return;
    }
		if (udata.elements) {
			const elements = udata.elements;
			this['_cy'].json({elements});
		}
		if (udata.layout)
			this['_layout'] = {...this.defaultLayout, ...udata.layout};

		// Load layout if not already done
		if (!this['_cy'].extension('layout', this['_layout'].name))
			await loadLayout(this['_layout'].name);

		this['_cy'].layout(this['_layout']).run();

		this['_cy'].resize();
		this['_cy'].fit();
	}

	async _modifyData(ele, dataName, type) {
		let input:any = document.createElement('input');
		const data = ele.data(dataName) || "";
		input.value = data;
		input.type = type;
		input.style.position = 'absolute';
		input.style.left = '-500px';
		input.style.top = '-100px';
		input.style.width = '300px';

		// due to the color picker getting opened the color input gets a focusout event on clicking the input.. so only trigger it on the second time!
		let focusoutCounter = type === 'color' ? 2 : 1;
		// input.style.zIndex = -1;
		input.addEventListener('focusout', ev => {
			const newData = input.value;
			if (newData !== data)  {
				ele.data(dataName, newData);
				this.saveDataToJournal();
			}
			focusoutCounter--;
			if (input && !focusoutCounter)
				input.remove();
		});
		input.addEventListener('input', ev => {
			const newData = input.value;
			ele.data(dataName, newData);
		});
		input.addEventListener('keyup', ev => {
			if (ev.key !== 'Escape' && ev.key !== 'Enter') return;
			ev.preventDefault();
			ev.stopPropagation();

			if (ev.key === 'Escape'){
         input.value = name;
      }
			ev.currentTarget.blur();
		});
		// input.style.display = 'none';
		await this['_container'].appendChild(input);
		input.focus();
		input.click();
		window['input'] = input;
	}

	fit() {
		this['_cy'].fit();
		this['_cy'].resize();
	}

	removeSelected() {
		this['_cy'].nodes(':selected').remove();
		this.saveDataToJournal();
	}

	destroy() {
		if (this['_cy'])
			this['_cy'].destroy();
	}
}
