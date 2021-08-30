$(document).ready(() => {
  let c;
  let i;
  let h = !1;
  let r = {};
  const o = {
    keys: ["name"],
  };
  const v = $(".readme-container");
  let l = $(".search-result");
  const s = $(".search-input-section");
  const b = $(".mui-dropdown__menu");
  const w = $(".mui-dropdown");

  function d(e, t, a) {
    v.html("").append(e), $("#readme").prepend(a);
    for (
      var n,
        r,
        o = $("h6 a, h5 a, h4 a, h3 a, h2 a, h1 a"),
        s = $('#readme a[href^="#"]').not(".anchor"),
        c = t.split("/")[3],
        i = t.split("/")[4],
        h = `https://raw.githubusercontent.com/${c}/${i}/master/`,
        l = `https://github.com/${c}/${i}/blob/master`,
        d = $("img"),
        u = 0,
        p = d.length;
      u < p;
      ++u
    ) {
      k((g = $(d[u]).attr("src"))) ||
        ((g = g.startsWith("/") ? g : `/${g}`), $(d[u]).attr("src", h + g));
    }
    for (u = 0, p = s.length; u < p; ++u) {
      $(s[u])
        .attr({
          class: "cate-anchor",
          "data-anchor": $(s[u]).attr("href"),
        })
        .removeAttr("href");
    }
    for (u = 0, p = o.length; u < p; ++u)
      if (((o[u].id = o[u].id.replace("user-content-", "")), o[u].id)) {
        let m = "",
          f = "━ ";
        "H1" === (n = $(o[u]).parent()[0].nodeName)
          ? ((m = "cate-anchor-h1"), (f = ""))
          : "H2" === n
          ? (m = "cate-anchor-h2")
          : "H3" === n
          ? ((m = "cate-anchor-h3"), (f = "╰ "))
          : "H4" === n
          ? ((m = "cate-anchor-h4"), (f = "╰ "))
          : "H5" === n
          ? ((m = "cate-anchor-h5"), (f = "┈ "))
          : "H6" === n && ((m = "cate-anchor-h6"), (f = "┈ ")),
          b.append(
            `<li class="${m}"><a class="cate-anchor" data-anchor="#${
              o[u].id
            }">${f}${$(o[u]).parent("h6, h5, h4, h3, h2, h1").text()}</a></li>`
          );
      }
    $(".cate-anchor").click(C), w.removeClass("content-hidden");
    for (
      u = 0, p = (r = $("#readme a").not(".cate-anchor")).length;
      u < p;
      ++u
    ) {
      var g;
      void 0 === (g = $(r[u]).attr("href")) ||
        k(g) ||
        ((g = g.startsWith("/") ? g : `/${g}`),
        $(r[u]).attr({
          href: l + g,
        })),
        $(r[u]).attr({
          target: "_blank",
        });
    }
  }

  function a(e, t) {
    const n = `https://github.com/${e}/${t}`;
    if (
      ((h = "awesome" === t ? 1 : 0),
      (jsonURL = `https://raw.githubusercontent.com/bgoonz/searchAwesome/master/awesome.json${e}-${t}.json`),
      w.removeClass("content-hidden"),
      l.addClass("content-hidden"),
      l.html(""),
      b.html(""),
      $(".alert").html(""),
      $(".awesome-input").val(""),
      h)
    ) {
      !(() => {
        let t = [];
        const a = $(".awesome-cate");
        a.html(""),
          Object.keys(r).forEach((e) => {
            const n = e.replace(/\W/g, "").toLowerCase();
            (t = t.concat(r[e])),
              a.append(
                `<strong><i class="fa fa-terminal" style="color: gray;"></i> ${e}</strong><li><ul class="${n}-ul"></ul></li>`
              ),
              r[e].forEach((e) => {
                const t = $(`.${n}-ul`);
                let a = "";
                (a =
                  -1 < e.url.split("/").indexOf("github.com")
                    ? `<li><a href="#repos/${e.repo}"><span><i class="fa fa-bookmark"></i> ${e.name}</span></a></li>`
                    : `<li><a href="${e.url}" target="_blank"><span><i class="fa fa-bookmark"></i> ${e.name}</span></a></li>`),
                  t.append(a);
              });
          });
        const e = $("#sidedrawer"),
          n = $("strong", e);
        n.next().hide(),
          n.off("click"),
          n.on("click", function () {
            n.not(this).next().hide(), $(this).next().slideToggle(300);
          }),
          $(".repo-count-number").html(t.length),
          (i = new Fuse(t, o));
      })(),
        w.addClass("content-hidden");
    } else {
      const a = `<a href="${n}" class="origin-repo-btn" target="_blank">View on <i class="fa fa-github"></i></a><br/><br/>`;
      v.html('<div class="sk-spinner sk-spinner-pulse"></div>'),
        ((e, t, a, n, r) => {
          const o = `https://api.github.com/repos/${e}/${t}/readme`;
          $.ajax({
            url: o,
            headers: {
              accept: "application/vnd.github.v3.html",
            },
            success(e) {
              r(e, a, n);
            },
          });
        })(e, t, n, a, d),
        ((e) => {
          let t = e.replace(/-/g, " ");
          (t = t
            .split(" ")
            .map((e) => {
              return e.replace(e[0], e[0].toUpperCase());
            })
            .join(" ")),
            (document.title = `Awesome Search - ${t}`);
        })(t),
        $.getJSON(jsonURL, (e) => {
          const t = e;
          let a = [];
          if ((s.removeClass("content-hidden"), 0 === Object.keys(t).length))
            return (
              $(".alert").html(
                '<span style="color: red;">This repo has not been parsed yet, we will support it soon.</span><br/>'
              ),
              void s.addClass("content-hidden")
            );
          t.forEach((e) => {
            if (!k(e.url)) {
              const t = `https://github.com/${n.split("/")[3]}/${
                n.split("/")[4]
              }/blob/master`;
              e.url = t + e.url;
            }
            a = a.concat(e);
          }),
            (c = new Fuse(a, o));
        });
    }
  }
  $("input").on("input", function (e) {
    const t = $(e.target).hasClass("cate-input"),
      a = $(this).val();
    (l = t ? $(".cate-search-result") : $(".search-result")).removeClass(
      "content-hidden"
    ),
      l.html(""),
      a || l.addClass("content-hidden");
    const n = t ? i.search(a) : c.search(a);
    let r = "";
    n.length || l.html("No result :(");
    for (let o = 0; o < 15; ++o)
      if (n[o]) {
        n[o].name.replace(/\W/g, "").toLowerCase();
        let s = ` href="${n[o].url}" `;
        h && (s = ""),
          (r = n[o].description ? ` - ${n[o].description}</br>` : "<br/>"),
          t
            ? -1 < n[o].url.split("/").indexOf("github.com")
              ? l.append(`<a href="#/repos/${n[o].repo}">${n[o].name}</a>${r}`)
              : l.append(
                  `<a href="${n[o].url}" target="_blank">${n[o].name}</a>${r}`
                )
            : l.append(
                `<a href="${n[o].url}" class="search-repo-link"${s}target="_blank">${n[o].name}</a>${r}`
              );
      }
  });

  const e = new (Backbone.Router.extend({
    routes: {
      "repos/:maintainer/:repo": "getRepos",
      "": "getAwesome",
    },
  }))();
  // ==========================================================================

  function k(e) {
    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
      e
    );
  }
  // ==========================================================================

  function C(e) {
    const t = $(e.target).data("anchor"),
      a = $(t).offset().top - $("#header").height();
    $("html, body").animate(
      {
        scrollTop: a,
      },
      300
    );
  }
  e.on("route:getRepos", (e, t) => {
    $(".search-holder").html(`Search ${t}`), a(e, t);
  }),
    e.on("route:getAwesome", () => {
      a("sindresorhus", "awesome");
    }),
    $("body").click((e) => {
      $(e.target).hasClass("awesome-input") ||
        $(e.target).hasClass("search-result") ||
        $(e.target).hasClass("search-icon") ||
        ($(".awesome-input").val(""),
        $(".search-result").addClass("content-hidden"),
        $(".search-input").removeClass("hovered")),
        $(e.target).hasClass("cate-input") ||
          $(e.target).hasClass("cate-search-result") ||
          ($(".cate-input").val(""),
          $(".cate-search-result").addClass("content-hidden"));
    }),
    $(".home-button").click((e) => {
      e.preventDefault(), (window.location.hash = "/"), location.reload();
    }),
    $.getJSON(
      "https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json",
      (e) => {
        (r = e), a("sindresorhus", "awesome");
      }
    ),
    Backbone.history.start();
}),
  // ==========================================================================

  jQuery((a) => {
    const e = a("body"),
      n = a("#sidedrawer");
    a(".js-show-sidedrawer").on("click", () => {
      const e = {
          onclose() {
            n.removeClass("active").appendTo(document.body);
          },
        },
        t = a(mui.overlay("on", e));
      n.appendTo(t),
        setTimeout(() => {
          n.addClass("active");
        }, 20);
    }),
      a(".js-hide-sidedrawer").on("click", () => {
        e.toggleClass("hide-sidedrawer");
      }),
      a(".to-top-arrow").click(() => {
        return (
          a("html, body").animate(
            {
              scrollTop: 0,
            },
            600
          ),
          !1
        );
      });
  });
