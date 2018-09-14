---
title: Search
layout: page
---

<div class="pure-form">
  <input type="text" id="local-search-input" name="q" results="0" autocomplete="off" placeholder="搜索" class="pure-input pure-input-1"></div>
<div id="local-search-result"></div>


<script src="//cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
<script>
  var searchFunc = function(t, e, r) {
    "use strict";
    $.ajax({
      url: t,
      dataType: "xml",
      success: function(t) {
        console.log(t)
        var a = $("entry", t).map(function() {
          return {
            title: $("title", this).text(),
            content: $("content", this).text(),
            url: $("url", this).text()
          }
        }).get(),
        n = document.getElementById(e);
        if (n) {
          var s = document.getElementById(r);
          n.addEventListener("input",
          function() {
            var t = '<ul class="search-result-list">',
            e = this.value.trim().toLowerCase().split(/[\s\-]+/);
            s.innerHTML = "",
            this.value.trim().length <= 0 || (a.forEach(function(r) {
              var a = !0;
              r.title && "" !== r.title.trim() || (r.title = "Untitled");
              var n = r.title.trim().toLowerCase(),
              s = r.content.trim().replace(/<[^>]+>/g, "").toLowerCase(),
              c = r.url,
              l = -1,
              i = -1,
              h = -1;
              if ("" !== s ? e.forEach(function(t, e) {
                l = n.indexOf(t),
                i = s.indexOf(t),
                l < 0 && i < 0 ? a = !1 : (i < 0 && (i = 0), 0 == e && (h = i))
              }) : a = !1, a) {
                t += "<li><a href='" + c + "' class='search-result-title'>" + n + "</a>";
                var u = r.content.trim().replace(/<[^>]+>/g, "");
                if (h >= 0) {
                  var o = h - 20,
                  p = h + 80;
                  o < 0 && (o = 0),
                  0 == o && (p = 100),
                  p > u.length && (p = u.length);
                  var f = u.substr(o, p);
                  e.forEach(function(t) {
                    var e = new RegExp(t, "gi");
                    f = f.replace(e, '<em class="search-keyword">' + t + "</em>")
                  }),
                  t += '<p class="search-result">' + f + "...</p>"
                }
                t += "</li>"
              }
            }), t += "</ul>", s.innerHTML = t)
          })
        }
      }
    })
  },
  search_path = "search.xml";
  0 == search_path.length && (search_path = "search.xml");
  var path = "/" + search_path;
  searchFunc(path, "local-search-input", "local-search-result")
</script>
