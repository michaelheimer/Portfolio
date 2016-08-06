$(function () {
	var $overlay = $('#overlay');
	var storage = localStorage.getItem('overlay') || false;
	var clickedTimes = parseInt(localStorage.getItem('overlayTimes') || 0, 10);
	var overlayHide = localStorage.getItem('overlayHide') || false;
	var timer;
	var formTimeout;
	var href = document.location.href;
	var downloading = false;
	// window.showOverlay = (Math.round(Math.exp(Math.random()*Math.log(100-1+1)))+1) % 4 === 0;
	window.showOverlay = true;

	if (window.showOverlay) {
		_gaq.push(['_trackEvent', 'Overlay', 'enabled']);
	} else {
		_gaq.push(['_trackEvent', 'Overlay', 'disabled']);
	}

	$('.download').on('click', function (ev) {
		href = $(this).attr("href");
		var time = 8;
		var viewedTimes = parseInt(storage);
		donwloading = true;
		_gaq.push(['_trackEvent', 'button', 'download', href]);

		clickedTimes = clickedTimes + 1;
		localStorage.setItem('overlayTimes', clickedTimes);

		if (window.showOverlay && !storage || (clickedTimes % 6 === 0 && !overlayHide)) {
			ev.preventDefault();
			ev.stopPropagation();
			viewedTimes = viewedTimes ? viewedTimes + 1 : 1;
			localStorage.setItem('overlay', viewedTimes);

			$overlay.addClass('show').removeClass('subscribe-form');
			window.showOverlay = false;
			$('.manual-download').attr('href', href);
			_gaq.push(['_trackEvent', 'Overlay', 'viewed', 'viewed times', viewedTimes || 1]);

			timer = setTimeout(function downloadTimer () {
				$('.wait').text(time);
				time = (time >= 0 ? time - 1 : 0);

				if (time === 0) {
					clearTimeout(timer);
					document.location.href = href;
					downloading = false;
					$overlay.addClass('subscribe-form');
				} else {
					timer = setTimeout(downloadTimer, 1000);
				}
			});
		} else {
			_gaq.push(['_trackEvent', 'Overlay', 'blocked']);
		}
	});

	$(document).on('keydown click', function (ev) {
		if (ev.which === 27 || ev.which === 1) {
			clearTimeout(timer);
			$overlay.removeClass('show');
		}
	});

	$('#overlay .close-overlay').on('click', function () {
		if (downloading) document.location.href = href;
		$('#overlay').removeClass('show');
	});

	$('#overlay .box').click(function(ev){
	    ev.stopPropagation();
	});

	$('.manual-download').on('click', function () {
		clearTimeout(timer);
		if (downloading) document.location.href = href;
		$overlay.addClass('subscribe-form');
		_gaq.push(['_trackEvent', 'Overlay', 'button', 'Manual download']);
	});

	$('.overlay-hide').on('click', function () {
		overlayHide = true;
		localStorage.setItem('overlayHide', true);
		clearTimeout(timer);
		$('#overlay').removeClass('show');
		if (downloading) document.location.href = href;
		_gaq.push(['_trackEvent', 'Overlay', 'button', 'Never show again']);
	});

	$('#overlay .subscribe').on('submit', function (ev) {
		ev.preventDefault();
		clearTimeout(formTimeout);
		var $input = $('input', this);
		var $button = $('button', this);
		var exp = /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/;

		if ($input.val() == "" || !exp.test($input.val())) {
			$input.addClass('invalid').focus();

			formTimeout = setTimeout(function () {
				$input.removeClass('invalid');
			}, 1000);
		} else {
			$input.attr('disabled', true);
			$button.attr('disabled', true);
			$.ajax({
				url: 'https://madebysource.com/api/mailing/subscribe/jpvq5lk4prz6hmim3v5gek2oruyf7hoxchm2rnoz/',
				jsonp: 'callback',
				dataType: 'jsonp',
				data: {
					email: $input.val(),
					format: 'json'
				},
				success: function(response) {
					console.log();
					$('#overlay .subscribe > h2').text(response.message);
					_gaq.push(['_trackEvent', 'Overlay', 'Subscribed']);

					$input.addClass('sent').val('').attr('disabled', false);
					$button.attr('disabled', false);


					setTimeout(function () {
						$input.removeClass('sent');
					}, 1000);
				}
			});
		}
	});

	var $adpack = $('#adpack');

	if ($adpack.height() == 0 || $adpack.css('visibility') == 'hidden') {
		_gaq.push(['_trackEvent', 'Adblock', 'Enabled']);
	} else {
		_gaq.push(['_trackEvent', 'Adblock', 'Disabled']);
	}
});
