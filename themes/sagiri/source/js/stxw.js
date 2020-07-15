/* 加载页面后，自动跳转到主要内容部分（主页除外） */
const stxw = {
	load_to_main: function () {
		var pathname = window.location.pathname;
		var pre_pathname = sessionStorage.getItem("pre_pathname");
		var cur_st = $(document).scrollTop();
		if (pathname != "/" && cur_st < 10 && pathname != pre_pathname) {
			$('html, body').animate({
				scrollTop: $("#main").offset().top - 50
			}, 500);
		}
		sessionStorage.setItem("pre_pathname", pathname);
	},

	/* https://www.antmoe.com/posts/ff6aef7b/#post-comment */
	code_event: function () {
		/**
		 * 代码
		 * 只適用於Hexo默認的代码渲染
		 */
		const $figureHighlight = $('figure.highlight')

		if ($figureHighlight.length) {
			// const isHighlightCopy = window.CONFIG.highlightCopy
			// const isHighlightLang = window.CONFIG.highlightLang
			// const isHighlightShrink = window.CONFIG_SITE.isHighlightShrink
			const isHighlightCopy = true;
			const isHighlightLang = true;
			const isHighlightShrink = true;

			if (isHighlightCopy || isHighlightLang || isHighlightShrink !== undefined) {
				$figureHighlight.prepend('<div class="highlight-tools"></div>')
			}

			/**
		   * 代码收缩
		   */
			const $highlightTools = $('.highlight-tools')
			if (isHighlightShrink === true) {
				$highlightTools.append('<i class="fa fa-angle-down code-expand code-closed"></i>')
			} else if (isHighlightShrink === false) {
				$highlightTools.append('<i class="fa fa-angle-down code-expand"></i>')
			}

			$(document).on('click', '.highlight-tools >.code-expand', function () {
				const $hideItem = $(this).parent().nextAll()
				if ($(this).hasClass('code-closed')) {
					$hideItem.css('display', 'block')
					$(this).removeClass('code-closed')
				} else {
					$hideItem.css('display', 'none')
					$(this).addClass('code-closed')
				}
			})

			/**
			* 代码语言
			*/
			if (isHighlightLang) {
				let langNameIndex, langName
				$figureHighlight.each(function () {
					langNameIndex = langName = $(this).attr('class').split(' ')[1]
					if (langNameIndex === 'plain' || langNameIndex === undefined) langName = 'Code'
					$(this).find('.highlight-tools').append('<div class="code-lang">' + langName + '</div>')
				})
			}

			/**
			* 代码copy
			* copy function
			*/
			if (isHighlightCopy) {
				$highlightTools.append('<div class="copy-notice"></div><i class="fa fa-paste copy-button"></i>')

				// click events
				$(document).on('click', '.highlight-tools>.copy-button', function () {
					const $buttonParent = $(this).parents('figure.highlight')
					$buttonParent.addClass('copy-true')
					const selection = window.getSelection()
					const range = document.createRange()
					range.selectNodeContents($buttonParent.find('table .code pre')[0])
					selection.removeAllRanges()
					selection.addRange(range)
					const text = selection.toString()
					// copy(text, this)
					selection.removeAllRanges()
					$buttonParent.removeClass('copy-true')
				})
			}
		}
	}
}

$(function () {
	if (window.CONFIG.load_to_main) {
		stxw.load_to_main();
	}
	stxw.code_event();
})
