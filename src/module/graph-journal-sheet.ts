import { debug } from '../foundryvtt-mindmap';
import { Graph } from './graph';
import { MODULE_NAME } from './settings';

export class GraphJournalSheet extends JournalSheet {
	get template() {
		if (this['_sheetMode'] === "graph") return `/modules/${MODULE_NAME}/templates/graph-journal-sheet.html`;//"/modules/mindmap/templates/graph-journal-sheet.html";

		return super.template;
	}

	// static get name() {
	// 	return 'JournalSheet';
	// }

	/**
	 * @override
	 */
	_getHeaderButtons() {

    const isOwner = this.object.owner,
				atLeastLimited = this.object.hasPerm(game.user, "LIMITED"),
				hasMindMap = !!this.object.getFlag(MODULE_NAME, 'data'),
				hasMultipleModes = this.object.data['img'] && this.object.data['content'];

		// Set the empty element to some placeholder so the super functions adds the extra buttons
		const placeholder = "!!||!!";
		if (hasMindMap && !hasMultipleModes){
			if (!this.object.data['img']){
				this.object.data['img'] = placeholder;
      }else{
				this.object.data['content'] = placeholder;
      }
    }
		let buttons = super._getHeaderButtons();

		if (isOwner || (atLeastLimited && hasMindMap) ) {
			buttons.splice(1, 0, {
				label: "MindMap",
				class: "entry-graph",
				icon: "fas fa-project-diagram",
				onclick: ev => this['_onSwapMode'](ev, "graph")
			});
		}


		// Remove the placeholder
		// And remove the button that is wrongly added
		if (hasMindMap && !hasMultipleModes)
			if (this.object.data['img'] === placeholder) {
				this.object.data['img'] = "";
				const idx = buttons.findIndex(e => e.label === "Image");
				buttons.splice(idx, 1);
			} else {
				this.object.data['content'] = "";
				const idx = buttons.findIndex(e => e.label === "Text");
				buttons.splice(idx, 1);
			}

		return buttons;
	}

	_inferDefaultMode() {
		const hasImage = !!this.object.data['img'];
		const hasMindmapElements = !!this.object.getFlag(MODULE_NAME, 'data.elements');

		const otherwise = this.object.limited ? null : this.object.data['content'] ? "text" : hasMindmapElements ? "graph" : "text";
    return hasImage ? "image" : otherwise;
  }


	activateListeners(html) {
		super.activateListeners(html);
		if (this['_sheetMode'] !== "graph"){
			return;
    }
		const graphContainer = html[0].querySelector('.graph');
		if (this['_graph']){
			this['_graph'].destroy();
    }
		this['_graph'] = new Graph(graphContainer, this.object);

		const settings = html[0].querySelector('.graph-settings-menu');
		settings.addEventListener('click', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			ev.currentTarget.closest('.graph-settings').classList.remove('open');
			ev.currentTarget.closest('.graph-settings').querySelector('.graph-layout-chooser').classList.remove('open');
			return false;
		})
		settings.addEventListener('mousedown', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		});
		settings.addEventListener('mouseup', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		});

		html[0].querySelector('.graph-settings-btn').addEventListener('click', ev => {
			ev.preventDefault();
			ev.stopPropagation();

			ev.currentTarget.closest('.graph-settings').classList.toggle('open')

			return false;
		})

		settings.querySelector('.graph-fit-btn').addEventListener('click', ev => this['_graph'].fit());
		settings.querySelector('.graph-clear-btn').addEventListener('click', ev => this['_graph'].removeSelected());

		settings.querySelector('.graph-layout-btn').addEventListener('click', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			ev.currentTarget.parentNode.querySelector('.graph-layout-chooser').classList.toggle('show');
			return false;
		})
		settings.querySelector('.graph-layout-chooser').addEventListener('click', ev => {
			ev.preventDefault(); ev.stopPropagation();
			this['_graph'].layout = (ev.target.name);
		})

		html[0].addEventListener('click', ev => ev.currentTarget.querySelector('.graph-settings').classList.remove('open') );
	}

	getData() {
		const data = super.getData();

		data['layouts'] = Graph.layouts;

		return data;
	}

	// async _render(force, options={}) {
	// 	console.log(force, options={});
	// 	return super._render(force, options);
	// }

	/**
	 * Only rerender if graph is not active, else just update graph.
	 * For smoother graph transitions.
	 * @param {*} force
	 * @param {*} options
	 */
	render(force = false, options= {}) {
		debug('rendering sheet', options);
		if (this.rendered && (!options['sheetMode'] || options['sheetMode'] === "graph") && this['_sheetMode'] === "graph")	{
			const udata = getProperty(options, "data.flags."+MODULE_NAME+".data");
			if (udata){
				this['_graph'].update(udata);
      }
			return this;
		}
		if (this['_graph']  && this['_graph']._cy){
			this['_graph']._cy.destroy();
    }
		return super.render(force, options);
	}
	// async _render(...args) {
	// 	await super._render(...args);

	// }

	_injectHTML(html, options) {
    $('body').append(html);
    this._element = html;
    html.hide().fadeIn(200, ev => {
			if (this['_graph']){
				this['_graph'].init()
      }
		});
	}

	setPosition(...args) {
    const [left, top, width, height, scale] = args;
		const ret = super.setPosition({left, top, width, height, scale});
		if (this['_graph']){
			this['_graph'].update();
    }
		return ret;
	}
}
