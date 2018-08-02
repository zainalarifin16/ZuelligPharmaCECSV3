/* globals define */

define([
	'jquery',
	'mustache',
	'text!./layout.html',
	'css!./design.css'
], function($, Mustache, templateHtml, css) {
	'use strict';

	function ContentLayout(params) {
		this.contentItemData = params.contentItemData || {};
		this.scsData = params.scsData;
		this.contentClient = params.contentClient;
	}

	function dateToMDY(date) {
		var dateObj = new Date(date);

		var options = { year: 'numeric', month: 'long', day: 'numeric' };
		var formattedDate = dateObj.toLocaleDateString('en-US', options);

		return formattedDate;
	}

	function isDigitalAsset(id) {
		return /^DigitalAsset_/i.test(id) || (id.length === 36 && (/^CONT/.test(id) || /^CORE/.test(id)));
	}

	ContentLayout.prototype = {

		render: function(parentObj) {
            try {
				
                var template,
                    content = $.extend({}, this.contentItemData),
                    contentClient = this.contentClient,
                    contentType,
                    secureContent,
                    params;

                if (this.scsData) {
                    content = $.extend(content, { 'scsData': this.scsData });
                    contentType = content.scsData.showPublishedContent === true ? 'published' : 'draft';
                    secureContent = content.scsData.secureContent;
                }

                console.log("blog detail", content.data);

				// Check blog-post_content availability
				if (!content.data.hasOwnProperty('blogpostv4-2_content')) {
					console.warn("blog_post_content field is not available in a ContentList component.");
					content.data.blog_post_content = "<b>Warning: This blog's content is not available when it is shown in a list.</b>"
				}

				try{

					content.post_detail = {
						date: dateToMDY(content.data["blogpostv4-2_date"]),
						title: content.data["blogpostv4-2_title"],
						subtitle: content.data["blogpostv4-2_sub_title"],
						image: contentClient.getRenditionURL({
							'itemGUID': (content.data["blogpostv4-2_media_post"] instanceof Object) ? content.data["blogpostv4-2_media_post"].id : content.data["blogpostv4-2_media_post"],
							'contentType': contentType,
							'secureContent': secureContent
						}),
						category: content.data["blogpostv4-2_category_post"],
						summary: content.data["blogpostv4-2_summary"],
						content: content.data["blogpostv4-2_content"],
						version: "4.1"
					}

					var msg_system = '<br/>\
									<br/>\
									<br/>\
									<span style="font-family: GothamRoundedMedium;font-size: 14px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.57;letter-spacing: 0.3px;color: #005d62;    padding: 30px 240px 30px 0px;border-top: 1px solid #ebebeb;border-bottom: 1px solid #ebebeb;" >\
									<b style="color:#000000;" >Related</b>: Donec dapibus erat ac odio egestas molestie\
									</span>\
									<br/>\
									<br/>\
									<br/>';

					$(".zp-detail-post-title").html(content.post_detail.title);
					$("title").html(content.post_detail.title);
					$(".zp-detail-image-big").prop("src", content.post_detail.image);

					var post_info = "Written by $author | Posted $time | 42 comments | 12 shares";
					post_info = post_info.replace("$author", "Admin").replace("$time", "12 Hours ago");
					$(".zp-detail-post-info").html(post_info);

	
					/* console.log(this.scsData);
					console.log(content);
					console.log(content.data);
					console.log(content.post_detail); */

				} catch (e) {
					console.error(e.stack);
				}

				try {
					// Mustache
					template = Mustache.render(templateHtml, content);
	
					if (template) {
						$(parentObj).append(template);
					}
				} catch (e) {
					console.error(e.stack);
				}

            } catch (e) {
                console.error("Content Layout Component error: ", e);
            }
        }

	};

	return ContentLayout;
});
