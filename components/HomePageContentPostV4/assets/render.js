/* globals define, SCSRenderAPI */

define([
	'jquery',
	'css!./layout.css'
], function( $ ) {
	'use strict';

	function SectionLayout( params ) {
		this.sectionLayoutData = params.sectionLayoutData || {};
		this.renderMode = params.renderMode || SCSRenderAPI.getRenderMode();
	}

	SectionLayout.prototype = {

		render: function( parentObj ) {
			var html = '';
			var maxItems = 0;
			var emptyClass;
			var components = this.sectionLayoutData.components || [];

			if( this.sectionLayoutData.customSettingsData &&
				( typeof this.sectionLayoutData.customSettingsData.maxItems === 'number' ) &&
				( this.sectionLayoutData.customSettingsData.maxItems > 0 ) ) {
				maxItems = this.sectionLayoutData.customSettingsData.maxItems;
			}

			try {
				// Add the child components to the section layout.  For each of the child 
				// components, add a <div> to the page.  The child components will be 
				// rendered into these <div>s.
				$.each( components, function( index, value ) {
					if( !maxItems || ( index < maxItems ) ) {
						html += '<div id="' + value + '"></div>';
						html += '<hr style="background-color: #ebebeb; margin: 30px 0px; opacity: 0.5;" >';
					}
				});

				// Add a drop zone to the section layout in edit mode, if applicable
				if( ( this.renderMode === SCSRenderAPI.RENDER_MODE_EDIT )  &&
					( ( maxItems === 0 ) || ( components.length < maxItems ) ) ) {
					emptyClass = ( components.length > 0 ) ? '' : 'sl-empty';
					$(parentObj).append( '<div class="sl-list-drop-zone ' + emptyClass + '">Add Item</div>' );
				}

				if( html ) {
					$(parentObj).append( html );
				} 
			} catch( e ) {
				console.error( e );
			}
		}

	};

	return SectionLayout;
});