define([
	'knockout',
	'text!./select-sources-popup.html',
	'appConfig',
	'components/Component',
	'utils/AutoBind',
	'utils/CommonUtils',
	'utils/DatatableUtils',
	'utils/Renderers',
	'less!./select-sources-popup.less'
], function (
	ko,
	view,
	config,
	Component,
	AutoBind,
	commonUtils,
	datatableUtils,
	renderers
) {
	class SelectSourcesPopup extends AutoBind(Component) {
		constructor(params) {
			super();

			this.showModal = params.showModal;
			this.selectedSources = params.selectedSources;
			this.sourceOptions = ko.computed(() => params.sources().map(s => ({ source: s, selected: ko.computed(() => this.selectedSources().includes(s)) })));
			this.submit = params.submit;

			this.tableDom = "Bfrt";

			this.columns = [
				{
					class: this.classes({ element: 'col', modifiers: 'selector', extra: 'text-center' }),
					render: () => renderers.renderCheckbox('selected', false),
					searchable: false,
					orderable: false,
				},
				{
					class: this.classes({ element: 'col', modifiers: 'name' }),
					title: 'Name',
					data: 'source.sourceName',
					render: (d, t, r) => `<span>${d}` + (r.source.disabledReason ? `<span class="${this.classes('disabled-reason')}">(${r.source.disabledReason})</span>` : '') + '</span>',
				}
			];

			this.buttons = [
				{
					text: 'Select All', action: () => this.toggleAll(true), className: this.classes({ element: 'select-all', extra: 'btn btn-sm btn-success' }),
					init: this.removeClass('dt-button')
				},
				{
					text: 'Deselect All', action: () => this.toggleAll(false), className: this.classes({ element: 'deselect-all', extra: 'btn btn-sm btn-primary' }),
					init: this.removeClass('dt-button')
				}
			];

			this.onRowCreated = function( row, data, dataIndex ) {
				data.source.disabled && row.classList.add('disabled');
			};
		}

		toggle(sourceOption) {
			if (!sourceOption.source.disabled) {
				const ss = this.selectedSources();
				ss.includes(sourceOption.source) ? ss.splice( ss.indexOf(sourceOption.source), 1 ) : ss.push(sourceOption.source);
				this.selectedSources(ss);
			}
		}

		toggleAll(selected) {
			if (selected) {
				this.selectedSources(this.sourceOptions().filter(o => !o.source.disabled).map((o) => o.source));
			} else {
				this.selectedSources([]);
			}
		}

		removeClass(className) {
			return (dt, node, cfg) => node.removeClass(className);
		}

		generate() {
			this.selectedSources().length > 0 && this.submit(this.selectedSources());
		}
	}

	return commonUtils.build('select-sources-popup', SelectSourcesPopup, view);
});
