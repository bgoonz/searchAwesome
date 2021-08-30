$(document).ready(() => {
  let repoFinder;
  let awesomeFinder;
  let isAwesome = false; // is it sindre/awesome repo ?
  const urlMap =
    "https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json";
  let urlMapObj = {};
  const options = {
    keys: ["name"],
  };
  const $awesome = $(".readme-container");
  let $searchResult = $(".search-result");
  const $searchBlock = $(".search-input-section");
  const $innerDropDownMenu = $(".mui-dropdown__menu");
  const $dropDownMenu = $(".mui-dropdown");

  function processReadMe(content, repoURL, originRepoHTML) {
    $awesome.html("").append(content);
    $("#readme").prepend(originRepoHTML);
    const $anchor = $("h6 a, h5 a, h4 a, h3 a, h2 a, h1 a");
    const anchorLink = $('#readme a[href^="#"]').not(".anchor");
    const maintainer = repoURL.split("/")[3];
    const repo = repoURL.split("/")[4];
    const githubRawURL = `https://raw.githubusercontent.com/${maintainer}/${repo}/master/`;
    const githubURL = `https://github.com/${maintainer}/${repo}/blob/master`;
    let tagLevel;

    /**
     * Dealing with some repos use relative image path.
     **/
    const $imgArr = $("img");
    let linksArr = [];

    for (var i = 0, len = $imgArr.length; i < len; ++i) {
      var relativeSrc = $($imgArr[i]).attr("src");
      if (!isURL(relativeSrc)) {
        relativeSrc = relativeSrc.startsWith("/")
          ? relativeSrc
          : `/${relativeSrc}`;
        $($imgArr[i]).attr("src", githubRawURL + relativeSrc);
      }
    }

    /**
      insert data-anchor and class cate-anchor so that when the link is clicked,
      the page will be scroll the position of anchor.
    **/
    for (var i = 0, len = anchorLink.length; i < len; ++i) {
      const $anchorEle = $(anchorLink[i]);
      $anchorEle
        .attr({
          class: "cate-anchor",
          "data-anchor": $(anchorLink[i]).attr("href"),
        })
        .removeAttr("href");
    }

    /**
     * Build Category List.
     **/
    for (var i = 0, len = $anchor.length; i < len; ++i) {
      $anchor[i].id = $anchor[i].id.replace("user-content-", "");
      if ($anchor[i].id) {
        let anchorClass = "";
        let anchorPrefix = "━ ";
        tagLevel = $($anchor[i]).parent()[0].nodeName;

        if (tagLevel === "H1") {
          anchorClass = "cate-anchor-h1";
          anchorPrefix = "";
        } else if (tagLevel === "H2") {
          anchorClass = "cate-anchor-h2";
        } else if (tagLevel === "H3") {
          anchorClass = "cate-anchor-h3";
          anchorPrefix = "╰ ";
        } else if (tagLevel === "H4") {
          anchorClass = "cate-anchor-h4";
          anchorPrefix = "╰ ";
        } else if (tagLevel === "H5") {
          anchorClass = "cate-anchor-h5";
          anchorPrefix = "┈ ";
        } else if (tagLevel === "H6") {
          anchorClass = "cate-anchor-h6";
          anchorPrefix = "┈ ";
        }

        $innerDropDownMenu.append(
          `<li class="${anchorClass}"><a class="cate-anchor" data-anchor="#${
            $anchor[i].id
          }">${anchorPrefix}${$($anchor[i])
            .parent("h6, h5, h4, h3, h2, h1")
            .text()}</a></li>`
        );
      }
    }

    $(".cate-anchor").click(scrollToAnchor);
    $dropDownMenu.removeClass("content-hidden");

    // Filter all links in readme but not anchor.
    linksArr = $("#readme a").not(".cate-anchor");

    // the relatvie src to absolute src.
    for (var i = 0, len = linksArr.length; i < len; ++i) {
      var relativeSrc = $(linksArr[i]).attr("href");

      if (relativeSrc !== undefined && !isURL(relativeSrc)) {
        relativeSrc = relativeSrc.startsWith("/")
          ? relativeSrc
          : `/${relativeSrc}`;
        $(linksArr[i]).attr({ href: githubURL + relativeSrc });
      }

      $(linksArr[i]).attr({ target: "_blank" });
    }
  }

  /**
   * Generate the array of awesome repos for search and display
   * the Category on the left sidedrawer using urlMapObj
   **/
  function processAwesomeJSON() {
    let awesomeData = [];
    const $awesomeCate = $(".awesome-cate");
    $awesomeCate.html("");

    Object.keys(urlMapObj).forEach((e) => {
      const _cateID = e.replace(/\W/g, "").toLowerCase();
      awesomeData = awesomeData.concat(urlMapObj[e]);

      $awesomeCate.append(
        `<strong><i class="fa fa-terminal" style="color: gray;"></i> ${e}</strong><li><ul class="${_cateID}-ul"></ul></li>`
      );

      urlMapObj[e].forEach((e) => {
        const $cateUl = $(`.${_cateID}-ul`);
        let link = "";
        if (e.url.split("/").indexOf("github.com") > -1) {
          link = `<li><a href="#repos/${e.repo}"><span><i class="fa fa-bookmark"></i> ${e.name}</span></a></li>`;
        } else {
          link = `<li><a href="${e.url}" target="_blank"><span><i class="fa fa-bookmark"></i> ${e.name}</span></a></li>`;
        }

        $cateUl.append(link);
      });
    });

    const $sidedrawerEl = $("#sidedrawer");
    const $titleEls = $("strong", $sidedrawerEl);
    $titleEls.next().hide();
    $titleEls.off("click");
    $titleEls.on("click", function () {
      $titleEls.not(this).next().hide();
      $(this).next().slideToggle(300);
    });

    $(".repo-count-number").html(awesomeData.length);
    awesomeFinder = new Fuse(awesomeData, options);
  }

  /**
   * Retrieve the readme file of an awesome repo from github and store the json for searching.
   * @param e It's an object containing repo name and url.
   * @param cate The repo name we want to get.
   * @return null
   **/
  const getCateList = (maintainer, repo) => {
    const repoURL = `https://github.com/${maintainer}/${repo}`;
    isAwesome = repo === "awesome" ? 1 : 0;
    jsonURL = `https://raw.githubusercontent.com/lockys/awesome.json/master/repo-json/${maintainer}-${repo}.json`;
    $dropDownMenu.removeClass("content-hidden");
    $searchResult.addClass("content-hidden");

    $searchResult.html("");
    $innerDropDownMenu.html("");
    $(".alert").html("");
    $(".awesome-input").val("");

    /**
     * Get readme of awesome repo
     **/
    if (!isAwesome) {
      const originRepoHTML = `<a href="${repoURL}" class="origin-repo-btn" target="_blank">View on <i class="fa fa-github"></i></a><br/><br/>`;

      $awesome.html('<div class="sk-spinner sk-spinner-pulse"></div>');

      getReadme(maintainer, repo, repoURL, originRepoHTML, processReadMe);
      updatePageTitle(repo);

      $.getJSON(jsonURL, (data) => {
        const list = data;
        let d = [];
        /**
         * Category has not been parsed yet.
         **/
        $searchBlock.removeClass("content-hidden");

        if (Object.keys(list).length === 0) {
          $(".alert").html(
            '<span style="color: red;">This repo has not been parsed yet, we will support it soon.</span><br/>'
          );
          $searchBlock.addClass("content-hidden");
          return;
        }

        /**
         * Fill in to data for searching
         **/
        list.forEach((e) => {
          if (!isURL(e.url)) {
            const maintainer = repoURL.split("/")[3];
            const repo = repoURL.split("/")[4];
            const repoUrlPrefix = `https://github.com/${maintainer}/${repo}/blob/master`;
            e.url = repoUrlPrefix + e.url;
          }

          d = d.concat(e);
        });

        repoFinder = new Fuse(d, options);
      });
    } else {
      processAwesomeJSON();
      $dropDownMenu.addClass("content-hidden");
    }
  };

  /**
   * Show search result when users search.
   **/
  $("input").on("input", function (e) {
    const isCateInput = $(e.target).hasClass("cate-input");
    const query = $(this).val();
    const LENGTH_LIMIT = 15;
    $searchResult = isCateInput
      ? $(".cate-search-result")
      : $(".search-result");

    $searchResult.removeClass("content-hidden");
    $searchResult.html("");

    if (!query) {
      $searchResult.addClass("content-hidden");
    }

    const result = isCateInput
      ? awesomeFinder.search(query)
      : repoFinder.search(query);
    const link = "";
    let description = "";
    if (!result.length) {
      $searchResult.html("No result :(");
    }

    /**
    List the searching result.
    **/
    for (let i = 0, len = LENGTH_LIMIT; i < len; ++i) {
      if (result[i]) {
        const id = result[i].name.replace(/\W/g, "").toLowerCase();
        let href = ` href="${result[i].url}" `;

        if (isAwesome) {
          href = "";
        }

        // console.log(d);
        description = result[i].description
          ? ` - ${result[i].description}</br>`
          : "<br/>";

        if (!isCateInput) {
          // if parsed(and it is not the top awesome repo), show the searching result about the current repo.
          $searchResult.append(
            `<a href="${result[i].url}" class="search-repo-link"${href}target="_blank">${result[i].name}</a>${description}`
          );
        } else {
          // if not parsed or it is the top awesome repo, show the searching result about the top awesome repo.
          if (result[i].url.split("/").indexOf("github.com") > -1) {
            $searchResult.append(
              `<a href="#/repos/${result[i].repo}">${result[i].name}</a>${description}`
            );
          } else {
            $searchResult.append(
              `<a href="${result[i].url}" target="_blank">${result[i].name}</a>${description}`
            );
          }
        }
      }
    } // end of for loop
  });

  /**
   * @param repoURL
   * @param cb to dealing with html of readme.
   **/
  function getReadme(maintainer, repo, repoURL, originRepoHTML, cb) {
    const apiURL = `https://api.github.com/repos/${maintainer}/${repo}/readme`;

    $.ajax({
      url: apiURL,
      headers: {
        accept: "application/vnd.github.v3.html",
      },
      success(content) {
        cb(content, repoURL, originRepoHTML);
      },
    });
  }

  function updatePageTitle(repo) {
    let formattedRepoName = repo.replace(/-/g, " ");

    formattedRepoName = formattedRepoName
      .split(" ")
      .map((word) => {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" ");

    document.title = `Awesome Search - ${formattedRepoName}`;
  }

  // The Backbone router configuration.
  const AwesomeRouter = Backbone.Router.extend({
    routes: {
      "repos/:maintainer/:repo": "getRepos",
      "": "getAwesome",
    },
  });

  const awesomeRouter = new AwesomeRouter();

  // Execute when route matches the awesomelist.top/#repos/<maintainer>/<repo-name>
  awesomeRouter.on("route:getRepos", (maintainer, repo) => {
    $(".search-holder").html(`Search ${repo}`);
    getCateList(maintainer, repo);
  });

  // Root Route, get the sindresorhus/awesome repo.
  awesomeRouter.on("route:getAwesome", () => {
    getCateList("sindresorhus", "awesome");
  });

  /**
   * Judge what users click, if user clicks home button, return to home page.
   * if users click the body not input area, hide the input.
   **/
  $("body").click((event) => {
    // Close the search result when click outside of the input div
    if (
      !$(event.target).hasClass("awesome-input") &&
      !$(event.target).hasClass("search-result") &&
      !$(event.target).hasClass("search-icon")
    ) {
      $(".awesome-input").val("");
      $(".search-result").addClass("content-hidden");
      $(".search-input").removeClass("hovered");
    }

    if (
      !$(event.target).hasClass("cate-input") &&
      !$(event.target).hasClass("cate-search-result")
    ) {
      $(".cate-input").val("");
      $(".cate-search-result").addClass("content-hidden");
    }
  });

  $(".home-button").click((event) => {
    event.preventDefault();
    window.location.hash = "/";
    location.reload();
  });

  /**
   * Generate urlMapObj for building sidedrawer.
   **/
  $.getJSON(urlMap, (d) => {
    urlMapObj = d;
    getCateList("sindresorhus", "awesome");
  });

  Backbone.history.start();

  // ============= Some Helper functions ==================

  /**
   * To check if a string is a url
   * @return true or false
   **/
  function isURL(str) {
    const pattern =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return pattern.test(str);
  }

  /**
    Back to top button.
  **/
  function scrollToAnchor(e) {
    const anchor = $(e.target).data("anchor");
    const offset = $(anchor).offset().top - $("#header").height();
    $("html, body").animate(
      {
        scrollTop: offset,
      },
      300
    );
  }
});
