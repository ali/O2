function rgbToHex(rgbString) {
    var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    for (var i = 1; i <= 3; i++) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    delete (parts[0]);
    return parts.join('');
}

$(document).ready(function() {
    var darkTheme = $(document.body).is('.dark');
    var bgColor = rgbToHex($('body').css('background-color'));
  
    // Use nice ampersands.
    // http://patrickhaney.com/thinktank/2008/08/19/automatic-awesompersands
    var tags = ['h1','h2','h3','h4','h5','h6','p','blockquote','li'];
    var amp_tags = jQuery.map(tags, function(t) { return t + ":contains('&')"; }).join(',');
    $('.post-body').find(amp_tags).contents().each(function() {
        if (this.nodeType == 3) {  // text
            $(this).replaceWith(this.nodeValue.replace(/&/g, '<span class="amp">&amp;</span>'));
        }
    });

    $('.post object').each(function() {
      // Matthew Buchanan's "improved YouTube player"
      // http://matthewbuchanan.name/post/451892574/widescreen-youtube-embeds
      if (!darkTheme) {
        
        if ($(this).find("embed[src^='http://www.youtube.com']").length > 0) {
          // Identify and hide embed(s)
          var parent = $(this).parent();
          parent.css("visibility","hidden");
          var youtubeCode = parent.html();
          var params = "";
          if (youtubeCode.toLowerCase().indexOf("<param") == -1) {
            // IE doesn't return params with html(), soÉ
            $("param", this).each(function () {
              params += $(this).get(0).outerHTML;
            });
          }
          // Set colours in control bar to match page background
          var oldOpts = /rel=0/g;
          var newOpts = "rel=0&amp;color1=0xFFFFFF&amp;color2=0xFFFFFF";
          youtubeCode = youtubeCode.replace(oldOpts, newOpts);
          if (params != "") {
            params = params.replace(oldOpts, newOpts);
            youtubeCode = youtubeCode.replace(/<embed/i, params + "<embed");
          }
          // Extract YouTube ID and calculate ideal height
          var youtubeIDParam = $(this).find("embed").attr("src");
          var youtubeIDPattern = /\/v\/([0-9A-Za-z-_]*)/;
          var youtubeID = youtubeIDParam.match(youtubeIDPattern);
          var youtubeHeight = Math.floor(parent.find("object").width() * 0.75 + 25);
          var youtubeHeightWide = Math.floor(parent.find("object").width() * 0.5625 + 25);
          // Test for widescreen aspect ratio
          $.getJSON("http://gdata.youtube.com/feeds/api/videos/" + youtubeID[1] + "?v=2&alt=json-in-script&callback=?", function (data) {
            oldOpts = /height="?([0-9]*)"?/g;
            if (data.entry.media$group.yt$aspectRatio != null) {
              newOpts = 'height="' + youtubeHeightWide + '"';
            } else {
              newOpts = 'height="' + youtubeHeight + '"';
            }
            youtubeCode = youtubeCode.replace(oldOpts, newOpts);
            if (params != "") {
              params = params.replace(oldOpts, newOpts);
              youtubeCode = youtubeCode.replace(/<embed/i, params + "<embed");
            }
            // Replace YouTube embed with new code
            parent.html(youtubeCode).css("visibility","visible");
          });
        }
      }      
    });
});

