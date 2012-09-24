function setCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function deleteCookie(name) {
  setCookie(name,"",-1);
}


// Module pattern + Closure
var YV = (function($, window, document, undefined) {
  // Private constants.
  var HTML = $(document.documentElement);
  var KEY_ESC = 27;
  var TOP_OFFSET = 82;

  // Internet Explorer detection.
  var BROWSER = $.browser;
  var VERSION = parseInt(BROWSER.version, 10);
  var IE = BROWSER.msie;
  var IE7 = !!(IE && VERSION === 7);
  var IE8 = !!(IE && VERSION === 8);
  var IE9 = !!(IE && VERSION === 9);

  // Expose YV methods.
  return {
    // Run everything in YV.init
    go: function() {
      var i, j = YV.init;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    load: function() {
      var i, j = YV.init_load;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    // YV.misc
    misc: {
      // YV.misc.kill_widget_spacers
      kill_widget_spacers: function() {
        // Kill spacers, if they exist already
        // because this function is called when
        // exiting "full screen" mode, so make
        // them up anew, to clean the slate.
        $('.widget_spacer').remove();
      }
    },

    init_load: {

    },
    // YV.init
    init: {


      // YV.init.fixed_widget_header
      fixed_widget_header: function() {
        var header = $('.widget header');

        if (!header.length) {
          return;
        }

        // Used later.
        var timer;

        // Last sidebar widget is special, leave it alone.
        var last_widget = $('#sidebar').find('.widget:last');

        // Insert spacers.
        header.each(function() {
          var el = $(this);
          var this_widget = el.closest('.widget');

          if (this_widget[0] === last_widget[0]) {
            return;
          }

          $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);
        });

        function position_widgets() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          header.each(function() {
            var el = $(this);
            var this_widget = el.closest('.widget');

            if (this_widget[0] === last_widget[0]) {
              // Don't do anything, we'll treat this differently
              // if it's within the very last sidebar widget.
              return;
            }

            var next_widget = this_widget.next('.widget');
            var window_top = $(window).scrollTop() + TOP_OFFSET;
            var spacer = el.siblings('.widget_spacer:first');
            var spacer_top = spacer.offset().top;

            if (window_top >= spacer_top) {
              el.addClass('widget_header_fixed');

              spacer.css({
                height: 34
              });
            }
            else {
              el.removeClass('widget_header_fixed');

              spacer.css({
                height: 0
              });
            }

            if (next_widget.length) {
              if (window_top >= next_widget.offset().top) {
                el.hide();
              }
              else {
                el.show();
              }
            }
          });
        }

        // Initial call.
        position_widgets();

        // Kill off event listeners, re-create them.
        $(window).off('.widget_header').on('scroll.widget_header resize.widget_header load.widget_header', function() {
          // Irrelevant, if in "full screen" mode.
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(position_widgets, 1);
        });
      },
      // YV.init.fixed_widget_last
      fixed_widget_last: function() {
        var el = $('#sidebar > .widget:last-child');

        if (!el.length) {
          return;
        }

        var timer;
        var spacer = $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);

        function pin_widget() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          var spacer = el.prev('.widget_spacer');
          var spacer_top = spacer.offset().top;
          var window_top = $(window).scrollTop() + TOP_OFFSET;

          if (window_top >= spacer_top) {
            el.addClass('widget_last_fixed');
          }
          else {
            el.removeClass('widget_last_fixed');
          }
        }

        // Initial call.
        pin_widget();

        $(window).off('.widget_last').on('scroll.widget_last resize.widget_last load.widget_last', function() {
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(pin_widget, 1);
        });
      }
    }
  };
})(jQuery, this, this.document);

// Fire it off!
jQuery(document).ready(function() {
  YV.go();
  var page = new Page();
});

jQuery(window).load(function() {
  YV.load();
});
