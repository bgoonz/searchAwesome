jQuery(($) => {
  const $bodyEl = $("body");
  const $sidedrawerEl = $("#sidedrawer");

  // ==========================================================================
  // Toggle Sidedrawer
  // ==========================================================================
  function showSidedrawer() {
    // show overlay
    const options = {
      onclose() {
        $sidedrawerEl.removeClass("active").appendTo(document.body);
      },
    };

    const $overlayEl = $(mui.overlay("on", options));

    // show element
    $sidedrawerEl.appendTo($overlayEl);
    setTimeout(() => {
      $sidedrawerEl.addClass("active");
    }, 20);
  }

  function hideSidedrawer() {
    $bodyEl.toggleClass("hide-sidedrawer");
  }

  $(".js-show-sidedrawer").on("click", showSidedrawer);
  $(".js-hide-sidedrawer").on("click", hideSidedrawer);

  $(".to-top-arrow").click(() => {
    // console.log($('html, body'));
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });
});
