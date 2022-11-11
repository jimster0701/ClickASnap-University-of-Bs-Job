/* ---------- Membership validation
------------------------------------------------------------------------------------------------ */
var regex_encode = /[\*\(\)!%\/]+/; // escape characters not escaped in encodeURIComponent() AND NOT working in PHP rawurldecode().
var regex_username = /^[a-zA-Z0-9_-]+$/; // username verification
var exitmodal = false;

if (typeof embedRatio !== "undefined") {
  setEmbed(embedRatio, embedKwey);
}

function setEmbed(ratio, key) {
  embed_ratio = ratio;
  embed_key = key;
  set_embed_dialog();
}

// membership field validation
function reg_validation() {
  var error = "";
  var email = $("#reg_email");
  var reg_username = $("#reg_username");
  var reg_password = $("#reg_password");

  if (email.val().length == 0) {
    error += "<p>" + LANG.fill_out_email + "</p>";
  } else if (email.val().length > 255) {
    error += "<p>" + LANG.email_maxlength + "</p>";
  }

  if (reg_username.val().length == 0) {
    error += "<p>" + LANG.fill_out_username + "</p>";
  } else if (reg_username.val().length < 6) {
    error += "<p>" + LANG.username_minlength + "</p>";
  } else if (reg_username.val().length > 16) {
    error += "<p>" + LANG.username_maxlength + "</p>";
  } else if (!regex_username.test($("#reg_username").val())) {
    error += "<p>" + LANG.is_valid_username + "</p>";
  }

  if (reg_password.val().length == 0) {
    error += "<p>" + LANG.fill_out_password + "</p>";
  } else if (reg_password.val().length < 9) {
    error += "<p>" + LANG.password_minlength + "</p>";
  } else if (reg_password.val().length > 64) {
    error += "<p>" + LANG.password_maxlength + "</p>";
  } else if (reg_password.val() != $("#password_confirm").val()) {
    error += "<p>" + LANG.password_match + "</p>";
  }

  if ($("#recaptcha_response_field").val() !== undefined && $("#recaptcha_response_field").val().length == 0) {
    error += "<p>" + LANG.recaptcha_required + "</p>";
  }

  if (!$("#agree_terms").is(":checked")) {
    error += "<p>You must agree to the terms and conditions</p>";
  }

  if (error == "") {
    return true;
  }
  return false;
}

function fb_error() {
  $(".fb_error_message").show();
  return false;
}

function exploreClick() {}

function isiPhone() {
  return navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1;
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    },
  );
}

if (typeof blockps != "undefined" && blockps == true) {
  window.addEventListener("keyup", function (e) {
    if (e.keyCode == 44) {
      $("#printscreen_popup").modal("show");
      copyTextToClipboard(
        "Images on Clickasnap.com are copyrighted. Please request clearance from the author prior to usage.",
      );
      return false;
    }
  });

  $(window).blur(function () {
    $("#innerajax").addClass("blur");
  });

  $(window).focus(function () {
    $("#innerajax").removeClass("blur");
  });

  var mouseblur = false;

  $(document).on("mousedown", function () {
    mouseblur = true;
    setTimeout(function () {
      if (mouseblur) {
        $("#innerajax").addClass("blur");
      }
    }, 200);
  });

  $(document).on("mouseup", function () {
    mouseblur = false;
    $("#innerajax").removeClass("blur");
  });
}

$(".watch-video-container").bind("contextmenu", function (e) {
  return false;
});
$(".img-container").bind("contextmenu", function (e) {
  return false;
});

// getCookie
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

function calculateHMSleft() {
  //calculate
  var now = new Date();
  var hoursleft = 23 - now.getHours();
  var minutesleft = 59 - now.getMinutes();
  var secondsleft = 59 - now.getSeconds();

  //format 0 prefixes
  if (minutesleft < 10) minutesleft = "0" + minutesleft;
  if (secondsleft < 10) secondsleft = "0" + secondsleft;

  //display
  $(".HMSremaining").html(hoursleft + "h " + minutesleft + "m"); //+secondsleft);
}

calculateHMSleft();
setInterval(calculateHMSleft, 1000);

$(".search-tab").click(function () {
  $(".active").removeClass("active");
  $(".justified-gallery").removeClass("loaded");
  $(".spinner").show();
  $(this).addClass("active");
});

$(".shop_tab").click(function () {
  $(".selected").removeClass("selected");
  $(this).addClass("selected");
  $("#shop_tab_wrapper").load($(this).attr("href") + " #shop_tab_content", function (data) {
    replace_thumbs();
  });
  return false;
});

$(".product_free").change(function () {
  if ($(this).val() == "1") {
    $(this).parents(".product-info-row").find(".min_price").val("£0.00");
    $(this).parents(".product-info-row").find(".price").val("£0.00");
    $(this).parents(".product-info-row").find(".price").prop("disabled", true);
  } else {
    $(this).parents(".product-info-row").find(".min_price").val("£0.50");
    $(this).parents(".product-info-row").find(".price").val("£0.50");
    $(this).parents(".product-info-row").find(".price").prop("disabled", false);
  }
});

$(".upgrade_action").click(function () {
  $("#upgrade_popup").modal("show");
});

function addSearchJS() {
  clear_ajax_listeners(".search_btn");
  $("#search_popup").on("shown", function () {
    alert("I want this to appear after the modal has opened!");
  });
  $(".search_btn").click(function () {
    $("#search_popup").modal("show");
    $("#modal_search").focus();
    addSearchDropdown();
    return false;
  });
}

$(".change_cover").click(function () {
  $("#cover_popup").modal("show");
  return false;
});

$(".edit-image").change(function () {
  $(this).parents("form").submit();
});

function addShareJS() {
  clear_ajax_listeners(".share_image");
  clear_ajax_listeners(".share_status");
  clear_ajax_listeners(".share_album");

  $(".share_image").click(function () {
    $("#share_userthumb").html('<img src="' + $(this).data("userthumb") + '" />');
    $("#share_userthumb").css("background-image", "url(" + $(this).data("userthumb") + ")");
    $("#share_username").html($(this).data("username"));
    $("#share_message").html('<img src="' + $(this).data("img") + '" />'); //+$(this).data('message'));
    $("#share_id").val($(this).data("id"));
    $("#share_comment").val("");
    $("#share_type").val("image_repost");
    $("#share_popup h2").html("Share this image with your subscribers");
    $("#share_popup").modal("show");
    $("#share_popup").on("hidden.bs.modal", function () {
      $("#innerajax").removeClass("blur");
    });
    $("#innerajax").addClass("blur");
    return false;
  });

  $(".share_status").click(function () {
    $("#share_userthumb").html('<img src="' + $(this).data("userthumb") + '" />');
    $("#share_userthumb").css("background-image", "url(" + $(this).data("userthumb") + ")");
    $("#share_username").html($(this).data("username"));
    $("#share_message").html($(this).data("message"));
    $("#share_id").val($(this).data("id"));
    $("#share_type").val("status_repost");
    $("#share_popup h2").html("Share this status with your subscribers");
    $("#share_popup").modal("show");
    $("#share_popup").on("hidden.bs.modal", function () {
      $("#innerajax").removeClass("blur");
    });
    $("#innerajax").addClass("blur");
    return false;
  });

  $(".share_album").click(function () {
    $("#share_userthumb").html('<img src="' + $(this).data("userthumb") + '" />');
    $("#share_userthumb").css("background-image", "url(" + $(this).data("userthumb") + ")");
    $("#share_username").html($(this).data("username"));
    $("#share_message").html('<img src="' + $(this).data("img") + '" />'); //+$(this).data('message'));
    $("#share_id").val($(this).data("id"));
    $("#share_type").val("album_repost");
    $("#share_popup h2").html("Share this album with your subscribers");
    $("#share_popup").modal("show");
    $("#share_popup").on("hidden.bs.modal", function () {
      $("#innerajax").removeClass("blur");
    });
    $("#innerajax").addClass("blur");
    return false;
  });
}

$("#share_form").submit(function () {
  $("#share_popup").modal("hide");
  $("#innerajax").removeClass("blur");
  $.ajax({
    // create an AJAX call...
    data: $(this).serialize(), // get the form data
    type: $(this).attr("method"), // GET or POST
    url: $(this).attr("action"), // the file to call
    success: function (response) {
      // on success..
      toastr.success("This image has been shared");
      if (response == "success") {
        //location.reload();
      }
    },
  });
  return false;
});

function addCheckoutProcess() {
  $(".process-checkout").click(function () {
    if (parseFloat($(".total").html()) == 0) {
      window.location = "/checkout_success";
      return false;
    }
  });
}

if (typeof search_term !== "undefined") {
  setsearch(search_term, true);
}

function setsearch(type, first) {
  $(".select_search_type").html(" &#x25BE;");
  $(".search_type").val(type);
  $(".search-dropdown").hide();
  if (!first) {
    $(".search-icon-selected").removeClass("search-icon-selected");
  }
  type_set = true;
  $(".search-icon-" + type).addClass("search-icon-selected");
  $(".search_title").html("Search " + type.charAt(0).toUpperCase() + type.slice(1).toLowerCase());

  $(".search_type_selected").removeClass("search_type_selected");
  $(".cat_" + type).addClass("search_type_selected");

  return false;
}

var img_zoomed = false;

function init_img_zoom() {
  clear_ajax_listeners(".swiper-img");

  $(".swiper-img").click(function () {
    $(".swiper-container-zoomed .img-container").html(
      '<img class="swiper-img img-responsive imageh" src="' + $(this).data("large") + '" />',
    );
    $(".swiper-container-zoomed").show();
    $(".toggle_zoomed_comments_open").hide();
    $(".toggle_zoomed_comments").show();

    var comment_content = $(".image-comments-wrapper").html();
    if (comment_content != "") {
      $(".cs-sidebar-column .sidebar-comments").html($(".image-comments-wrapper").html());
    }
    $(".cs-sidebar-column").addClass("sidebar-zoomed");
    $("#header").addClass("zoomed-header");
    $(".image-comments-wrapper").html("");
    $(".cs-sidebar-column .hide-zoomed").hide();
    $(".cs-sidebar-column .show-zoomed").show();
    $("body").css("overflow", "hidden");
    addCommentJS();
    addLikeJS();
    addFollowJS();
    expandMediaDescription();

    $(".swiper-container-zoomed .img-container img").on("load", function () {
      resize_image();
    });
    $(".swiper-container-zoomed .img-container img").click(function () {
      close_swiper_zoom();
    });

    $(".sidebar-zoomed").hide();
    comments_visible = false;

    $("img").on("dragstart", function (event) {
      event.preventDefault();
    });

    img_zoomed = true;
    return false;
  });
}

$(document).keyup(function (e) {
  if (e.keyCode == 27) {
    // escape key maps to keycode `27`
    close_swiper_zoom();
  }
});
var imgPad = 0;
var comments_visible = false;

function toggle_zoomed_comments() {
  if (!comments_visible) {
    $(".swiper-container-zoomed .img-container img").css("margin-left", imgPad + "px");
    $(".sidebar-zoomed").show();
    $(".toggle_zoomed_comments").hide();
    $(".toggle_zoomed_comments_open").show();
    comments_visible = true;
  } else {
    $(".swiper-container-zoomed .img-container img").css("margin-left", "auto");
    $(".sidebar-zoomed").hide();
    $(".toggle_zoomed_comments").show();
    $(".toggle_zoomed_comments_open").hide();
    comments_visible = false;
  }
}

function resize_image() {
  var windowW = $(".cs-main-column").width();
  var windowH = $(".cs-main-column").height();

  $(".cs-sidebar-scroll").css({
    top: $(window).scrollTop() + "px",
    height: $(window).height() - 40 + "px",
  });

  if (ismobile) {
    $(".main-mobile-cart-adjust").css("margin-top", $(".cs-sidebar-column-mobile").height() - 20);
  }
  var newH = $(".swiper-slide-active img").height();

  if (newH > 50) {
    $(".video_video").css("max-height", newH + "px");
    $(".swiper-container").css("max-height", newH + "px");
    $(".video_video .image_div img").css("max-height", newH + "px");
    $(".video_video .swiper-button-prev").css("max-height", $(".video_video .swiper-slide-active img").height() + "px");
    $(".video_video .swiper-button-next").css("max-height", $(".video_video .swiper-slide-active img").height() + "px");
    $("#thumb_canvas").css("height", newH + "px");
    $(".imageh").css("max-height", newH + "px");
    $(".imageh").css("opacity", "1");

    $(".swiper-container-zoomed .img-container img").css("max-height", newH + 215 + "px");
    $(".sidebar-zoomed").css("height", newH + 215 + "px");
    var imgW = $(".swiper-container-zoomed .img-container img").width();
    imgPad = (windowW - 470 - imgW) / 2;
    var bannerPad = (windowW - 470 - 728) / 2;
    if (bannerPad < 0) {
      bannerPad = 0;
    }
    if (imgPad < 0) {
      imgPad = 0;
    }
    $(".swiper-container-zoomed .img-container img").css("margin-left", "auto");
    $(".swiper-container-zoomed").css("min-height", windowH + "px");

    $(".swiper-container-zoomed .img-container img").css("max-height", $(window).height() + "px");
    $(".zoom-banner").css("margin-left", bannerPad + "px");

    if (windowW < 991) {
      $(".sidebar-zoomed").css("top", $(".swiper-container-zoomed .img-container img").height() + "px");
      $(".sidebar-zoomed").css("position", "absolute");
      $(".sidebar-zoomed").css("height", "auto");
    } else {
      $(".sidebar-zoomed").css("top", "0px");
      $(".sidebar-zoomed").css("min-height", windowH + "px");
      $(".sidebar-zoomed").css("position", "fixed");
    }
  }
}

var zoomed = false;
$(".imgzooom").click(function () {
  $(".playlist-button").hide();
  $(".playlist-button-zoomed").fadeIn("slow");
});

function get_comment_reply($id, $iid, $sid) {
  if ($iid != "") {
    $html =
      '<form method="post" action="/i/' +
      $iid +
      '" class="ajax_form comment-reply add-comment-form mb15"><div class="form-error"></div><input type="hidden" name="parent" value="' +
      $id +
      '"><textarea name="comment" rows="4" placeholder="Leave a comment..." required="required"></textarea><button id="" class="ajax_btn btn cs-button-primary" type="submit">Submit</button><div class="clearfix"></div></form>';
  } else if ($sid != "") {
    $html =
      '<form method="post" action="/feed/' +
      $sid +
      '" class="ajax_form comment-reply add-comment-form mb15"><div class="form-error"></div><input type="hidden" name="parent" value="' +
      $id +
      '"><input type="hidden" name="status_id" value="' +
      $sid +
      '"><textarea name="comment" rows="4" placeholder="Leave a comment..." required="required"></textarea><button id="" class="ajax_btn btn cs-button-primary" type="submit">Submit</button><div class="clearfix"></div></form>';
  } else {
    $html =
      '<form method="post" class="ajax_form comment-reply add-comment-form mb15"><div class="form-error"></div><input type="hidden" name="parent" value="' +
      $id +
      '"><textarea name="comment" rows="4" placeholder="Leave a comment..." required="required"></textarea><button id="" class="ajax_btn btn cs-button-primary" type="submit">Submit</button><div class="clearfix"></div></form>';
  }
  return $html;
}

function submitCrop(product_image_id, crop_data = false) {
  if (crop_data) {
    $.ajax({
      type: "POST",
      url: "/ajax/add_cart",
      data: {
        image_id: product_image_id,
        x_perc: crop_data["x_perc"],
        y_perc: crop_data["y_perc"],
        w_perc: crop_data["w_perc"],
        h_perc: crop_data["h_perc"],
        zoom: crop_data["zoom"],
      },
      success: function (response) {
        if (link) {
          var reload_page = link;
        } else {
          var reload_page = window.location;
        }
        $(".cart-outer").load(reload_page + " .cart-inner", function (data) {
          basketJS();
        });
        return false;
      },
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/ajax/add_cart",
      data: { image_id: product_image_id },
      success: function (response) {
        if (link) {
          var reload_page = link;
        } else {
          var reload_page = window.location;
        }
        $(".cart-outer").load(reload_page + " .cart-inner", function (data) {
          basketJS();
        });
        return false;
      },
    });
  }
  return false;
}
var pid;

function close_product_select() {
  $("#product_select_popup").find(".modal-body").html("");
  $("#innerajax").removeClass("blur");
  $("body").removeClass("modal--open");
  $("body").removeClass("modal-open");
  $(".modal-backdrop").hide();
  $("#product_select_popup").modal("hide");
}

$("#product_select_popup").on("hidden.bs.modal", function () {
  $("#product_select_popup").modal("hide");
  $("#innerajax").removeClass("blur");
  $("body").removeClass("modal--open");
  $("body").removeClass("modal-open");
});

function add_cart(
  product_image_id = false,
  price = 0,
  link = false,
  product = false,
  imagekey = false,
  download = "false",
  cropdata = false,
) {
  close_product_select();
  pid = product_image_id;
  if (cropdata != false) {
  }
  if (download != "false" && price == 0) {
    toastr.success("Added to basket");
    submitCrop(pid);
  } else if (imagekey) {
    $("#crop_popup .inner").html("");
    $("#crop_popup").modal("show");
    $("#crop_popup .inner").load("/product/crop/" + product + "/" + imagekey + " #popup_content", function (data) {
      if (download != "false") {
        $("#crop_popup").addClass("download_crop");
        download_crop_btns(product_image_id);
      } else {
        $("#crop_popup").removeClass("download_crop");
        $(".crop_item").each(function (index) {
          initCrop(this);
        });
      }
    });
  } else if (cropdata) {
    toastr.success("Added to basket");
    submitCrop(pid, cropdata);
  } else if (product_image_id) {
    toastr.success("Added to basket");
    submitCrop(pid);
  }
  return false;
}

function download_crop_btns(product_image_id) {
  var pid = product_image_id;
  $(".confirm-crop").click(function () {
    $("#crop_popup").modal("hide");
    add_cart(pid, false, false, false, false);
    return false;
  });
}

function remove_cart(image_id, product_id, group_id) {
  $.ajax({
    type: "POST",
    url: VS.config.base_url + "ajax/remove_cart",
    data: { image_id: image_id, product_id: product_id, group_id: group_id },
    success: function (response) {
      var reload_page = window.location;
      $(".cart-outer").load(reload_page + " .cart-inner", function (data) {
        basketJS();
      });
    },
  });
  return false;
}

function basketJS() {
  clear_ajax_listeners(".remove-cart");
  $(".remove-cart").click(function () {
    toastr.success("Item removed");
    remove_cart($(this).data("cart-id"));
    $(this).parents(".cart-item").remove();
  });
}

$("#search_filter").change(function () {
  var $urlvars = getJsonFromUrl();
  var $string = "/search";
  var first = true;
  var $val = $(this).val();
  var sort_set = false;
  var cat = searchcat;
  $string = "?cat=" + searchcat;
  if ($val == "paid") {
    $string += "&=paid";
  } else if ($val == "free") {
    $string += "&t=free";
  } else if ($val == "sale") {
    $string += "&t=sale";
  } else {
    $.each($urlvars, function (index, value) {
      if (
        index != "" &&
        index != undefined &&
        index != "undefined" &&
        value != "" &&
        value != undefined &&
        value != "undefined"
      ) {
        $string += "&";
        if (index == "sort") {
          value = $val;
          sort_set = true;
        }
        $string += index + "=" + value;
      }
    });
    if (!sort_set) {
      if (first) {
        $string += "&";
      } else {
        $string += "&";
      }
      $string += "sort=" + $val;
    }
  }
  window.location = $string;
});

addSearchDropdown();
function addSearchDropdown() {
  clear_ajax_listeners(".search-group .search");
  search_dropdown = false;
  $(".search-group .search").click(function () {
    $(this).parents(".search_form").find(".search-dropdown").show();
    $(this).parents(".search_form").find(".search-dropdown-menu").show();
  });
  $(".search_submit").click(function () {
    $(".search_form").trigger("submit");
  });
  $(document).click(function (event) {
    if (!$(event.target).closest(".search-dropdown").length && !$(event.target).closest(".search").length) {
      if ($(".search-dropdown").is(":visible")) {
        $(".search-dropdown").hide();
      }
    }
  });
}

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

$(".product-category-row").click(function () {
  var checked = $(this).find(".checkbox").is(":checked");
  if (checked) {
    $(this).find(".checkbox").prop("checked", false);
    $(".category_" + $(this).data("id")).hide();
    $(".added").show();
    $(this).find(".checked").hide();
    $(this).find(".unchecked").show();
  } else {
    $(".select-categories .checkbox").prop("checked", false);
    $(".select-categories .checked").hide();
    $(".select-categories .unchecked").show();
    $(".product-info-row").hide();
    $(this).find(".checkbox").prop("checked", true);
    $(".category_" + $(this).data("id")).show();
    $(this).find(".checked").show();
    $(this).find(".unchecked").hide();
  }
});

$(".product-info-row h3, .product-info-row .select").click(function () {
  if ($(this).parents(".product-info-row").find(".checkbox").is(":checked")) {
    if ($(this).parents(".product-info-row").hasClass("added")) {
      $("#p_" + $(this).parents(".product-info-row").attr("id")).remove();
      $(this).parents(".product-info-row").find(".confirm-btn").removeClass("confirmed");
      $(this).parents(".product-info-row").find(".confirm-btn").val("Confirm");
    }
    $(this).parents(".product-info-row").find(".product-info").hide();
    $(".select-products .checkbox").prop("checked", false);
    $(".select-products .checked").hide();
    $(".select-products .unchecked").show();
    $(".added").find(".checkbox").prop("checked", true);
    $(".added").find(".checked").show();
    $(".added").find(".unchecked").hide();
    $(this).parents(".product-info-row").find(".checkbox").prop("checked", false);
    $(this).parents(".product-info-row").find(".checked").hide();
    $(this).parents(".product-info-row").find(".unchecked").show();
    $(this).parents(".product-info-row").removeClass("added");
  } else {
    $(".product-info").hide();
    $(".added").find(".product-info").show();
    $(this).parents(".product-info-row").find(".product-info").show();
    $(".select-products .checkbox").prop("checked", false);
    $(".added").find(".checkbox").prop("checked", true);
    $(".select-products .checked").hide();
    $(".select-products .unchecked").show();
    $(".added").find(".checked").show();
    $(".added").find(".unchecked").hide();
    $(this).parents(".product-info-row").find(".checkbox").prop("checked", true);
    $(this).parents(".product-info-row").find(".checked").show();
    $(this).parents(".product-info-row").find(".unchecked").hide();
  }
});

function setProductCreationJS() {
  $(".cs-instant-product .product-confirm-btn").click(function () {
    var selected_images = [];

    if (typeof curr_img_key !== "undefined" && curr_img_key != "") {
      selected_images.push(curr_img_key);
    }

    $(".my-upload-selected").each(function () {
      selected_images.push($(this).attr("id"));
    });

    var id = $(this).data("id");
    var min_price = $(".min_price_" + id)
      .val()
      .replace("Â", "");
    var price = $(".price_" + id)
      .val()
      .replace("£", "");
    price = price.replace(/[^0-9\.]/g, "");
    min_price = min_price.replace(/[^0-9\.]/g, "");

    if (price == "" || parseFloat(price) < parseFloat(min_price)) {
      alert("You must enter a price higher than £" + min_price);
    } else {
      $(".price_" + id).val("£" + parseFloat(price));
      $("#" + $(this).data("id")).addClass("added");

      var img = $("#" + $(this).data("id"))
        .find("img")
        .attr("src");
      var id = $(this).data("id");
      var name = $(this).data("name");

      $.ajax({
        // create an AJAX call...
        data: { images: selected_images, product_id: id, product_price: price }, // get the form data
        type: "POST", // GET or POST
        url: "/ajax/create_product", // the file to call
        success: function (response) {
          // on success..

          $("#create_products_popup").modal("show");
          $("#create_products_popup .inner").load(
            "/myaccount/products/" + response + " #popup_content",
            function (data) {
              var num_added = $(data).find("#numadded").html();
              if (parseInt(num_added) > 0) {
                toastr.success("Created " + name);
              }
            },
          );

          $(".related-videos").load("/myaccount/products/" + response + " #paginated", function (data) {
            //replace images
            $("#paginated").addClass("row");
            $("#loading_content").hide();
          });
        },
      });
      $(".select-product-info").hide();
      $(".select-subcategory").hide();
      $("#product_categories").val("-1");
    }
  });
}

productFormJS();
function productFormJS() {
  $(".add_product_form").submit(function () {
    if ($(this).parents(".product-info-row").hasClass("added")) {
      $("#p_" + $(this).parents(".product-info-row").attr("id")).remove();
      $(this).parents(".product-info-row").find(".confirm-btn").removeClass("confirmed");
      $(this).parents(".product-info-row").find(".confirm-btn").val("Confirm");
      $(this).parents(".product-info-row").removeClass("added");
    } else {
      var id = $(this).data("id");
      var min_price = $(".min_price_" + id)
        .val()
        .replace("Â", "");
      var price = $(".price_" + id)
        .val()
        .replace("£", "");
      price = price.replace(/[^0-9\.]/g, "");
      min_price = min_price.replace(/[^0-9\.]/g, "");

      if (parseFloat(price) < parseFloat(min_price)) {
        alert("You must enter a price higher than £" + min_price);
      } else {
        $(".price_" + id).val("£" + parseFloat(price));
        $("#" + $(this).data("id")).addClass("added");
        var img = $("#" + $(this).data("id") + "_img").attr("src");
        var name = $("#" + $(this).data("id") + "_title").html();
        var id = $(this).data("id");
        add_product(id, img, name, min_price, price);
        $(this).find(".confirm-btn").addClass("confirmed");
        var products_count = $("#products_count").html();
        products_count++;
        $("#products_count").html(products_count);
      }
    }
    $(".upload-side .select-product-info").hide();
    $(".select-subcategory").hide();
    $("#product_categories").val("-1");
    return false;
  });
}

function getPosition(el) {
  var scrollTop = 520; //$(window).scrollTop();
  var elementOffset = el.offset().top + el.height();
  var distance = elementOffset - scrollTop;
  return distance;
}

var product_open = false;
var currpid;
var curr_img_id;
var infinite_scroll = true;

initProducts();

var products_set = false;

function initProducts() {
  $(".image-front").unbind("click");
  $(".image_product").unbind("click");
  $(".change-price").unbind("click");
  $(".price-update").unbind("click");

  $(".image-front").click(function () {
    currpid = $(this).data("image");
    curr_img_id = $(this).data("image-id");

    var currItm = $(this);
    $(".my-product").css("margin-bottom", "10px");
    $(".product-description-intro").show();
    $(".delbtnClicked").removeClass("delbtnClicked");

    if (ismobile) {
      $(".product-back-open").hide();
    } else {
      $(".product-back-open").slideUp(300);
    }

    if ($(this).hasClass("image-front-selected")) {
      $(".product-back-open").removeClass("product-back-open");
      $(".image-front-selected").removeClass("image-front-selected");
      $(".image-row-open").removeClass("image-row-open");
      product_open = false;
    } else {
      $(".image-front-selected").removeClass("image-front-selected");
      $(".image-row-open").removeClass("image-row-open");
      $(this).addClass("image-front-selected");
      $(this).parents(".image-row").addClass("image-row-open");

      if (product_open) {
        if (ismobile) {
          $(".product-back-open").hide();
          $(".product-back-open").removeClass("product-back-open");
          $(".product-back-" + currpid).hide();
          $(".product-back-" + currpid).addClass("product-back-open");
        } else {
          $(".product-back-open").slideUp(300, function () {
            $(".product-back-open").removeClass("product-back-open");
            $(".product-back-" + currpid).slideDown(300);
            $(".product-back-" + currpid).addClass("product-back-open");
          });
        }
      } else {
        if (ismobile) {
          $(".product-back-" + currpid).show();
        } else {
          $(".product-back-" + currpid).slideDown(300);
        }
        $(".product-back-" + currpid).addClass("product-back-open");
      }

      if (ismobile) {
        $(".image-front").css("margin-bottom", "11px");
        currItm.css("margin-bottom", "140px");
        var offset = getPosition($(this)) - $(".search-filters").height();
        if ($("#shop-results").length) {
          $(".product-back-" + currpid).css("top", offset + 65 + "px");
          currItm.css("margin-bottom", "140px");
        } else {
          $("#product_select_popup .product-back-" + currpid).css("top", offset - 320 + "px");
          currItm.css("margin-bottom", "280px");
        }
      }

      $("html, body").animate(
        {
          scrollTop: $(this).offset().top - 120, //#DIV_ID is an example. Use the id of your destination on the page
        },
        "slow",
      );
    }
  });

  $(".image_product").click(function () {
    $(".delbtnClicked").removeClass("delbtnClicked");
    $(".product-description-intro").show();
    $(".product-description-right").hide();
    $(".product-front-selected").removeClass("product-front-selected");
    $(".product-front-delete-clicked").removeClass("product-front-delete-clicked");
    $(".product-front-delete").removeClass("product-front-delete");
    $(this).addClass("product-front-selected");
    $(this).parents(".product-category-section").find(".product-description-intro").hide();
    $("#product_description_" + $(this).data("product-image")).show();
    $(".my-products-ti4tle").each(function () {
      $(this).html($(this).data("orig-title"));
    });
    $("#product_title_" + $(this).data("product-group")).html($(this).data("product-title"));
  });

  $(".change-price").click(function () {
    $(this).siblings(".product-your-price-val").hide();
    $(this).siblings(".product-price-input").val($(this).siblings(".product-your-price-val").html());
    $(this).siblings(".product-price-input").show();
    $(this).siblings(".price-update").show();
    $(this).hide();
    return false;
  });

  $(".price-update").click(function () {
    if (
      $(this).siblings(".product-cost-price").find(".val").html().replace("£", "") >
      $(this).siblings(".product-price-input").val().replace("£", "")
    ) {
      alert("Price must be higher than " + $(this).siblings(".product-cost-price").find(".val").html());
      $(this)
        .siblings(".product-your-price-val")
        .html("£" + $(this).siblings(".product-cost-price").find(".val").html().replace("£", ""));
      $(this).siblings(".product-your-price-val").show();
      $(this).siblings(".product-price-input").hide();
      $(this).hide();
      $(this).siblings(".change-price").show();
      s;
    } else {
      $(this)
        .siblings(".product-your-price-val")
        .html("£" + $(this).siblings(".product-price-input").val().replace("£", ""));
      $(this).siblings(".product-your-price-val").show();
      $(this).siblings(".product-price-input").hide();
      $(this).hide();
      $(this).siblings(".change-price").show();

      var product = $(this).data("product");
      var image = $(this).data("image");
      var price = $(this).siblings(".product-price-input").val().replace("£", "");

      var saveurl = "?product=" + product + "&image=" + image + "&productprice=" + price;

      $.ajax({
        url: saveurl,
        success: function (data) {},
      });
    }

    return false;
  });

  $(".my-products-title").click(function () {
    $(".product-description-right").hide();
    $(".product-description-intro").show();
    $(".my-products-title").each(function () {
      $(this).html($(this).data("orig-title"));
    });

    if ($("#group-" + $(this).data("category-id")).hasClass("product-group-open")) {
      $("#group-" + $(this).data("category-id")).removeClass("product-group-open");
      $("#section-" + $(this).data("category-id")).removeClass("product-section-open");
      $("#group-" + $(this).data("category-id")).hide();
    } else {
      $("#group-" + $(this).data("category-id")).addClass("product-group-open");
      $("#section-" + $(this).data("category-id")).addClass("product-section-open");
      $("#group-" + $(this).data("category-id")).show();
    }
    if ($(window).width() < 768) {
      $(".image-front-selected")
        .parents(".my-product")
        .css({
          marginBottom: $(this).parents(".product-back").height() + "px",
        });
    }
    return false;
  });

  $("#usershop_update").click(function () {
    updateUserShop();
  });

  var shopstate = "";

  function updateUserShop() {
    if (shopstate == "products") {
      var breadcrumbs = $("#product-results .product-breadcrumbs").html();
      $("#product-results").html('<ul class="product-breadcrumbs">' + breadcrumbs + "</div>");
      var search_url = "/search?t=product&image=" + currpid;
    } else {
      var search_url = window.location.pathname + "?q=";
    }

    $(".usershop-filter").each(function () {
      if ($(this).is(":checked")) {
        search_url += "&filters%5B%5D=" + $(this).attr("id");
      }
    });

    low_price = $("#low_price").val();
    high_price = $("#high_price").val();

    search_url += "&low_price=" + low_price + "&high_price=" + high_price;

    window.scrollTo(0, 0);

    if (shopstate == "products") {
      $(".usershop-loading").show();
      $("#product-results").html("");
      $("#product-results").load(search_url + " #paginated", function (data) {
        $(".close-products").click(function () {
          close_products($(this).attr("href"));
          return false;
        });
        $(".usershop-loading").hide();
      });
    } else {
      $("#paginated-wrapper").html("");
      $("#paginated-wrapper").load(search_url + " #paginated", function (data) {
        $(".usershop-loading").hide();
        initUserProducts();
        initProducts();
      });
    }

    return false;
  }

  $(".usershop-filter").click(function () {
    //updateUserShop();
  });

  function close_products(url) {
    $("#product-results").hide();
    $(".usershop-loading").hide();
    $(".products-back").hide();
    $("#shop-results").show();
    $(".usershop-filter").prop("checked", true);
    shopstate = "";
    if ($("#shop-results").length) {
      return false;
    } else {
      window.location = url;
    }
    return false;
  }

  initUserProducts();

  function initUserProducts() {
    $(".user-products-title").click(function () {
      $("#product-results").html("");
      $("#product-results").show();
      $("#shop-results").hide();

      var cat = $(this).data("cat");
      $(".usershop-filter").prop("checked", false);
      $("#" + cat).prop("checked", true);
      shopstate = "products";
      window.scrollTo(0, 0);

      $(".products-back").show();

      $("#product-results").load($(this).attr("href") + " #paginated", function (data) {
        window.scrollTo(0, 0);
        $(".close-products").click(function () {
          close_products($(this).attr("href"));
          return false;
        });
        $(".usershop-loading").hide();
      });

      return false;
    });
    $(".close-product-back").click(function () {
      $(".product-back-open").slideUp(300);
      $(".product-back-open").removeClass("product-back-open");
      $(".product-front-selected").removeClass("product-front-selected");
      $(".product-carousel-open").removeClass("product-carousel-open");
      product_open = false;
    });

    $(".product-thumb-overlay").hover(function () {
      $(".owl-item").css("z-index", 0);
      $(this).parents(".owl-item").css("z-index", 999999999999);
    });
  }

  $(".price-btn").click(function () {
    var p = $(this).siblings(".product-cost-price").find(".val").html();
    var a = $(this).data("amount");
    p = p.replace("£", "");
    p = parseFloat(p);
    p = (p * (1 + a / 100)).toFixed(2);
    $(this)
      .siblings(".product-your-price-val")
      .html("£" + p);
    $(".price-btn-selected").removeClass("price-btn-selected");
    $(this).addClass("price-btn-selected");

    var product = $(this).data("product");
    var image = $(this).data("image");
    var price = p;
    var saveurl = "?product=" + product + "&image=" + image + "&productprice=" + price;

    $.ajax({
      url: saveurl,
      success: function (data) {},
    });
  });

  $(".product_delete_btn").click(function () {
    var delurl = "/myaccount/products?delete=" + $(this).data("product-image-id");
    $.ajax({
      url: delurl,
      success: function (data) {},
    });

    var l = $(this).parents(".owl-stage-outer").find(".image_product").length;
    if (l == 1) {
      $(this)
        .parents(".product-category-section")
        .fadeOut("fast", function () {
          $(this).remove();
        });
      var m = $(this).parents(".product-back").find(".product-category-section").length;
      if (m == 1) {
        $(".image-front-selected").removeClass("image-front-selected");
      }
    }
    $(this)
      .parents(".image_product")
      .fadeOut("fast", function () {
        $(this).remove();
      });
    return false;

    $(".product-description-right").hide();
    $(".my-products-title").each(function () {
      $(this).html($(this).data("orig-title"));
    });
    return false;
  });

  $(".delbtn").click(function () {
    $(".delbtnClicked").removeClass("delbtnClicked");
    $(this).addClass("delbtnClicked");
    $(this).parents(".product-front-selected").addClass("product-front-delete-clicked");
    return false;
  });

  $(".delbtn").hover(function () {
    $(this).parents(".product-front-selected").addClass("product-front-delete");
  });

  $(".delbtn").mouseleave(function () {
    $(this).parents(".product-front-delete").removeClass("product-front-delete");
  });

  $("#product_search").submit(function () {
    $("#paginated-wrapper").html("");
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        var $result = $(response).find("#paginated");
        $("#paginated-wrapper").html($result);
        initProducts();
      },
    });
    return false;
  });

  $(".main-product-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        nav: false,
        loop: false,
      },
      600: {
        items: 3,
        nav: false,
        loop: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });

  imageProductsJS();

  $(".product-images-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        nav: false,
        loop: false,
      },
      600: {
        items: 3,
        nav: false,
        loop: false,
      },
      1000: {
        items: 4,
        nav: false,
        loop: false,
      },
    },
  });
}

var all_products = [];

function add_product(id, img, name, min_price, price) {
  price = price.replace(/[^\.\d]/g, "");
  min_price = min_price.replace(/[^\.\d]/g, "");
  var profit = parseFloat(price) - parseFloat(min_price);
  $(".my-products").prepend(
    '<div class="selected-product" id="p_' +
      id +
      '"><input type="hidden" name="' +
      id +
      '" value="' +
      price +
      '"><img src="' +
      img +
      '" /><div class="info"><h4>' +
      name +
      '</h4><span class="price">£' +
      price +
      ' RRP</span><span class="profit">£' +
      profit.toFixed(2) +
      ' profit</span><a href="#" class="action remove"><img class="icon icons8-Cancel" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAEFElEQVRoQ92a0VHcMBBAtZb/Qwc5KggG+ZujA6gg0AGpIJcKQgeBCqADjm8LDBXk6OD4t63MeiTG9tmWVqcLTjRzPzfatZ52tVqtBGwH7enp6biqqhkAzPrUK6VWURStDg8PH0J/HkIozPN8VlXVV6XUnDGGP0pbAsAyiqKbJElWFMG+vlsBSSkR4hIADrYdCMorpZ4B4EoIceOrzwsIQRhjC8ZYr0v5DqYhh5Za+ICRgNC1yrL85eFWvoxLzvkFxRWdgR4fH8+VUj8ZY3u+o/OUWwPAt6Ojo2sXeScgKSVa5dxF4Q77XAshLmz6rUATgTEcVqhRoInBOEENAk0UxgrVC6QDAK6byTYAuOgLFBtAOjTnHxDNqJO35pwn3ZC+ASSlvP+L+wwVott/KYQ4af7ZAvoXXK1L1HW9FpCU8rdHOvOmlDqN43hVluUdY+wLcdpfOOenRVFgdo7yn4jyKyHEvpF5B/K0zhvnfJ4kyTMqzPN8ryzLJQEKYVB+reUPtDwJqmmld6Asy3Ji1tyCMTNEgGrBNOTJUJilp2maoI4aSEc2dDfnppQ6SdMUrbHRHKB6YYyiLMvmAIDByblxzvcx4tVAWZYtAOC7szRjzCgYkhmBGoXxnWCdwF4ZIDw1HlOA0MxxHJ8Y/3e0lAvMXlEU90T3x8PhQ5qm8xpISqkoMKYvEQqt+h4AhibAB8boEkIA+PhrczCuUChjs+Y2MKgf1zV4huvWBLtAjXkArrdtYbT+M7QQOSD0Dc4XKiAMWuhHMCBtcmugaE5GSBj9/bBAFKjQMDsDYoxZQ7Pea6hpkjUQB3c5VxgzMoeMwgrRibhBXc7JMt0RhoSqLRQibFMts0OoOmyTE8HOgKyWQSu4bKzEo8eGO9Yb6zapj4tlTDTD73jkfqQ1VKc+KJFlGTk5pcCYRNNl8/VdU63k1CdbcDk+9KUzjlB4KUA6n7WOD7s44I3lZjYon3XdOuDpdYR1AUqBA+tieB6q6wnNvcUl0RyCyvMcj+B4WqXccrwIIepLt22LJC0oajrThfKEYb1FEm0lvDn7TAotjK2VUmdYxiqK4tbjpIkJ7ZkuY90SLYNDfRVCvN8k/t+Fxi1CONGoYbqbUN3UNlSsx4VOKvaFGSJJC9YFD6zFelQZKL8jjY7a2fk6xSiWUuIlLV7fT7HdCCF673xtV5JThBqEae1DQ2aYmKVGYZyA9P40BUtZYZyBGoHi6gOi3xsAXAZ9eNHI02ZFUVxT6+C+UQX3mTiOz3fyNKY5KB3W8fESNU1yZXsFgIWrVUY3VtcvNtzwkpilj33iBZ+X+YAYpdanMS6AeJ4qigL3BaxPUK9lHqIousMfxbWGxhUEqKscD2hRFOErx973dPg8s6qq1dANoMskDvX5A+NX+EPCKe3BAAAAAElFTkSuQmCC" width="15" height="15"> Remove</a></div></div>',
  );
  add_remove_product();
  all_products[id] = [id, img, name, min_price, price];
}

function add_remove_product() {
  $(".selected-product .remove").click(function () {
    $(this).parent().parent().remove();
    var id = $(this).parents(".selected-product").attr("id").replace("p_", "");
    $("#" + id).removeClass("added");
    $("#" + id)
      .find(".confirm-btn")
      .removeClass("confirmed");
    $("#" + id)
      .find(".confirm-btn")
      .val("Confirm");

    var products_count = $("#products_count").html();
    products_count--;
    if (products_count < 0) {
      products_count = 0;
    }
    $("#products_count").html(products_count);

    return false;
  });
}

$("#product_images_proceed").click(function () {
  $("#selected_images").val("");
  var first = true;
  var i_string = "";
  $(".selected-image").each(function (index) {
    if (!first) {
      i_string += ",";
    }
    i_string += $(this).attr("id");
    first = false;
  });
  $("#selected_images").val(i_string);
  $("#product_images_proceed_form").submit();
  return false;
});

function product_images_js() {
  $(".my-images .justified-grid-item").unbind("click");
  $(".my-images .justified-grid-item").click(function () {
    var img = $(this).find(".main-img").attr("src");
    var id = $(this).data("id");
    var title = $(this).data("title");
    if (!$(this).hasClass("selected-photo")) {
      $(".selected-images").prepend(
        '<tr class="selected-image" id="' +
          id +
          '"><td class="table-thumb"><a class="ajax_link"><div class="thumb-container" style="background-image: url(' +
          img +
          ')"><img src="' +
          img +
          '" class="load_img"></div></a></td><td class="title">' +
          title +
          "</td></tr>",
      );
      $(this).addClass("selected-photo");
    } else {
      $(this).removeClass("selected-photo");
      $(".selected-images")
        .find("#" + id)
        .remove();
    }
    return false;
  });
}

$("#order_by").change(function () {
  window.location = "/myaccount/media?orderby=" + $(this).val();
  return false;
});

$("#order_form").submit(function () {
  var success = true;
  $(this)
    .find("input, select")
    .each(function () {
      if ($(this).data("required") == "1") {
        if ($(this).val() == "") {
          $("#" + $(this).attr("id") + "_error").html($(this).data("error"));
          $(this).addClass("form-field-error");
          $("#" + $(this).attr("id") + "_error").show();
          success = false;
        } else {
          $(this).removeClass("form-field-error");
          $("#" + $(this).attr("id") + "_error").hide();
        }
      }
    });
  if (success) {
    $(".confirm-btn").addClass("confirmed");
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        $("#outerpayment").show();
        var $result = $(response).find("#innerpayment");
        $("#outerpayment").html($result); // update the DIV
        $("#shipping_form").show();
        addCheckoutProcess();
        apply_postage();
      },
    });
  }
  return false;
});

function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}
function remove_non_ascii(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/[^\x20-\x7E]/g, "");
}

function apply_postage() {
  $(".postage-option input").click(function () {
    $.ajax({
      url: "/ajax/update_order",
      type: "POST",
      data: { shipping: $(this).val() },
      success: function (response) {
        var r = remove_non_ascii(response);
        var totals = jQuery.parseJSON(r);
        $(".basket-total").html(totals.order);
        $(".shipping-total").html(totals.shipping);
        var total = totals.total;
        if (totals.country == "GB") {
          var vat = parseFloat(total) / 0.833333 - parseFloat(total);
          total = parseFloat(total) + parseFloat(vat);
          $(".vat-total").html(vat.toFixed(2));
          $(".vat-row").removeClass("hidden");
        }
        $(".paypal_ammount").val(parseFloat(totals.total).toFixed(2));
        $(".total").html(parseFloat(total).toFixed(2));
        $(".order-summary").show();
        $(".cart-next").show();
        $(".shipping-row").removeClass("hidden");
      },
    });
  });
  $(".postage_option").removeAttr("disabled");
}

var selectedCount = 0;

$("#page").on("click", ".my-media-checkbox", function (e) {
  e.preventDefault();
  if ($(this).parents(".ajax-select").hasClass("my-upload-selected")) {
    $(this).parents(".ajax-select").removeClass("my-upload-selected");
    selectedCount--;
  } else {
    $(this).parents(".ajax-select").addClass("my-upload-selected");
    selectedCount++;
  }
  updateUploadsRight();
  return false;
});

$("#page").on("click", ".my-media-image-click", function (e) {
  e.preventDefault();
  $(".my-upload-selected").removeClass("my-upload-selected");
  if ($(this).hasClass("my-upload-selected")) {
    $(this).removeClass("my-upload-selected");
  } else {
    selectedCount = 1;
    $(this).addClass("my-upload-selected");
  }
  var album = false;
  if ($(this).hasClass("album-select")) {
    album = true;
  }
  updateUploadsRight(album);
  return false;
});

$(".media_tab").click(function () {
  $(".album-none-selected").hide();
  $(".none-selected").show();
  $(".album-details").hide();
});

$(".album_tab").click(function () {
  $(".album-none-selected").show();
  $(".none-selected").hide();
  $(".image-details").hide();
  $(".bulk-actions").hide();
});

function addProductCatJS() {
  $("#product_categories").change(function () {
    $(".select-subcategory").hide();
    $(".select-product-info").hide();
    $("#" + $(this).val() + "_label").show();
    $("." + $(this).val() + "_first").show();
  });
  $(".select-subcategory select").change(function () {
    $(".select-product-info").hide();
    $("#" + $(this).val() + "_info").show();
  });
}

function updateUploadsRight(album) {
  $(".cs-sidebar-scroll").css({
    top: $(window).scrollTop() + "px",
    height: $(window).height() - 200 + "px",
  });

  $(".image-details-container").html("");
  resetDelete();
  if (album) {
    $(".album-none-selected").hide();
    $(".bulk-actions").hide();
    $(".none-selected").hide();
    $(".image-details").hide();
    var title = $(".my-upload-selected").find("h3").html();
    var desc = $(".my-upload-selected").find(".hidden-desc").html();
    var preset = $(".my-upload-selected").data("trueform-preset");
    var image = $(".my-upload-selected").find(".thumb-container").html();
    $(".image-details-container").html("<h2>" + title + "</h2>");
    if (selectedCount == 1) {
      $(".album-details").show();
      $(".album-none-selected").hide();
    } else {
      $(".album-details").hide();
      $(".album-none-selected").show();
    }
  } else {
    var in_albums = [];
    $(".my-upload-selected").each(function () {
      var promoted = $(this).data("promoted-info");
      $(".promoted").html(
        '<img src="/assets/themes/clickasnap/images/icons/promote-blue.png" alt="" class="megaphone v-icon v-icon-30"> ' +
          promoted +
          ' Promoted Views <a class="promote_link" href="">Promote Now</a>',
      );
      var albumstring = $(this).data("albums");
      if (albumstring != "") {
        if (Number.isInteger(albumstring)) {
          in_albums.push(albumstring);
        } else {
          var albums = albumstring.split(",");
          if (albums.length > 0) {
            albums.forEach(function (entry) {
              in_albums.push(entry);
            });
          }
        }
      }
    });

    if (selectedCount == 1) {
      var title = $(".my-upload-selected").find("h3").html();
      var uploaded = $(".my-upload-selected").find("h4").html();
      var desc = $(".my-upload-selected").find(".hidden-desc").html();
      var category = $(".my-upload-selected").find(".hidden-category").html();
      var tags = $(".my-upload-selected").find(".hidden-tags").html();
      var preset = $(".my-upload-selected").data("trueform-preset");
      var image =
        '<img style="width:100%;" class="" id="' +
        $(".my-upload-selected").data("key") +
        '" data-unsharpAmount="' +
        $(".my-upload-selected").data("unsharpamount") +
        '" data-unsharpRadius="' +
        $(".my-upload-selected").data("unsharpradius") +
        '" data-unsharpThreshold="' +
        $(".my-upload-selected").data("unsharpthreshold") +
        '" src="' +
        $(".my-upload-selected").data("image") +
        '" />';
      $(".image-details-container").html(
        "<h2>" +
          title +
          "</h2><p>" +
          uploaded +
          "</p>" +
          image +
          '<p class="video-description image-desc">' +
          desc +
          "</p>",
      );

      if (category == "None") {
        category = "";
      }
      if (category != "" || tags != "") {
        $(".image-details-container-bottom").html("<p>" + category + "</p><p>" + tags + "</p>");
      }

      expandMediaDescription();
      $(".preset").hide();
      $("#preset_" + preset).show();
      $(".promote_link").attr("href", "/myaccount/promote/" + $(".my-upload-selected").data("key"));
      $(".album-details").hide();
      $(".album-none-selected").hide();
      $(".image-details").show();
      $(".bulk-actions").hide();
      $(".none-selected").hide();
    } else if (selectedCount > 1) {
      $(".bulk-actions").show();
      $(".none-selected").hide();
      $(".image-details").hide();
    } else if (selectedCount == 0) {
      $(".bulk-actions").hide();
      $(".none-selected").show();
      $(".image-details").hide();
    }
    $(".pro-products").hide();
    if (selectedCount > 0) {
      $(".pro-products").show();
      populateProductsDropdown($(".my-upload-selected").data("key"));
    }
    $(".ticked").removeClass("ticked");
    if (in_albums.length > 0) {
      in_albums.forEach(function (entry) {
        $(".tick_" + entry).addClass("ticked");
      });
    }
    $(".img_count").html(selectedCount);
  }
}

function populateProductsDropdown(key) {
  $.getJSON("/ajax/available_products/" + key, function (result) {
    $(".image-products-container").html("");
    $(".image-products-container").append(
      '<label for="product_categories" id="product_categories_label"><select name="product_categories" id="product_categories"><option value="-1">Select a Product</option></select></label></div>',
    );
    var $dropdown = $("#product_categories");
    $.each(result, function () {
      $dropdown.append($("<option />").val(this.parent.id).text(this.parent.name));
      $(".image-products-container").append(
        '<label for="' +
          this.parent.id +
          '" id="' +
          this.parent.id +
          '_label" class="select-subcategory"><select name="' +
          this.parent.id +
          '" id="' +
          this.parent.id +
          '"></select></label></div>',
      );
      var $dropdown2 = $("#" + this.parent.id);
      var set_display = false;
      if (this.products) {
        $.each(this.products, function () {
          $dropdown2.append($("<option />").val(this.id).text(this.description));
          extra_class = " ";
          if (!set_display) {
            extra_class = this.parent + "_first";
            set_display = true;
          }
          $(".image-products-container").append(
            '<div class="select-product-info ' +
              extra_class +
              '" id="' +
              this.id +
              '_info"><form method="post" data-id="' +
              this.id +
              '" class="add_product_form"><div class="product-info-row" style="display: block;"><div class="product-info" style="display: block;"><p class="add_hide center"><div class="hidden" id="' +
              this.id +
              '_title">' +
              this.description +
              '</div><img id="' +
              this.id +
              '_img" src="/assets/themes/clickasnap/images/products/350/' +
              this.thumbnail +
              '"></p><div class="product-info-data"><div class="col-md-6"><h4>Mini Price</h4></div><div class="col-md-6"><h4>Your Price</h4></div><div class="col-md-6 form-group"><input type="text" name="price" class="price-input min_price min_price_' +
              this.id +
              '" value="£' +
              this.min_price +
              '" disabled=""></div><div class="col-md-6 form-group"><input type="text" name="price" class="price-input price price_' +
              this.id +
              '" value=""></div><div class="col-md-12"><div class="product-submit"><input type="submit" class="confirm-btn product-confirm-btn" data-id="' +
              this.id +
              '" data-name="' +
              this.description.replace('"', "") +
              '" value="Add Product"></div></div></div></div></div></form></div>',
          );
        });
      }
    });
    setProductCreationJS();
    addProductCatJS();
    productFormJS();
  });
}

function deleteAlbum() {
  var album_id;
  $(".my-upload-selected").each(function () {
    album_id = $(this).attr("id");
    $(this).remove();
  });
  $.ajax({
    type: "GET",
    url: window.location.href,
    data: "da=" + album_id,
    success: function () {
      toastr.success("Your album were successfully removed.");
    },
  });
  selectedCount = 0;
  updateUploadsRight(true);
}

function deleteAllImages() {
  var imagesToDelete = [];
  $(".my-upload-selected").each(function () {
    var id = $(this).attr("id");
    imagesToDelete.push(id);
    $(this).remove();
    selectedCount--;
  });
  $.ajax({
    type: "POST",
    url: window.location.href,
    data: "delete_images=" + imagesToDelete,
    success: function () {
      toastr.success("Your images were successfully removed.");
    },
  });
  updateUploadsRight();
}

$(".album_tab_link").click(function () {
  window.location = "/myaccount/media/albums";
});

$(".images_tab_link").click(function () {
  window.location = "/myaccount/media ";
});

var setAlbumJs = false;
function add_album_js() {
  $(".new-album").click(function (e) {
    e.preventDefault();
    $name = $("#playlist_name").val();
    $desc = $("#playlist_description").val();
    $.ajax({
      type: "POST",
      url: VS.config.base_url + "ajax/new_album",
      data: { playlist_name: $name, playlist_description: $desc },
      success: function (response) {
        if ($.isNumeric(response)) {
          var album_id = response;
          $(".album_select").append(
            $("<option>", {
              value: album_id,
              text: $name,
            }),
          );
          // update all select boxes on images
          $(".album_select").append(
            $("<option>", {
              value: album_id,
              text: $name,
            }),
          );
          $(".album_select").val(album_id);
          $("#add_album_dropdown").append(
            '<li role="presentation"><a role="menuitem" tabindex="-1" data-album="' +
              album_id +
              '" class="normal_link upload_album">' +
              $name +
              "</a></li>",
          );
          add_album_js();
          // set to album id
        } else {
          alert("There was an error creating the album. Please try again");
        }
      },
    });
    $("#new_playlist").modal("hide");
    $("#playlist_name").val("");
    return false;
  });

  clear_ajax_listeners(".add_album");
  $(".add_album").click(function () {
    var album_id = $(this).data("album");
    if ($(this).hasClass("ticked")) {
      $(this).removeClass("ticked");
      removeAllFromAlbum($(this).data("album"), $(this).data("album-name"));
      $(".my-upload-selected").each(function () {
        var al = $(this).data("albums");
        al2 = al.replace(album_id, "");
        $(this).data("albums", al2);
      });
    } else {
      $(".my-upload-selected").each(function () {
        var al = $(this).data("albums");
        al2 = al + "," + album_id;
        $(this).data("albums", al2);
      });
      $(this).addClass("ticked");
      addAllToAlbum($(this).data("album"), $(this).data("album-name"));
    }
    return false;
  });
  setAlbumJs = true;
}

function removeAllFromAlbum(id, name = "") {
  var imagesToRemove = [];
  $(".my-upload-selected").each(function () {
    var id = $(this).attr("id");
    imagesToRemove.push(id);
  });
  $.ajax({
    type: "POST",
    url: window.location.href,
    data: "remove_album=" + id + "&album_images=" + imagesToRemove,
    success: function () {
      toastr.success("Your images were successfully removed to the album " + name + ".");
    },
  });
  return false;
}

function addAllToAlbum(id, name = "") {
  var imagesToAdd = [];
  $(".my-upload-selected").each(function () {
    var id = $(this).attr("id");
    imagesToAdd.push(id);
  });
  $.ajax({
    type: "POST",
    url: window.location.href,
    data: "add_album=" + id + "&album_images=" + imagesToAdd,
    success: function () {
      toastr.success("Your images were successfully added to the album " + name + ".");
    },
  });
  return false;
}

$(".delete-all").click(function () {
  if ($(this).hasClass("can-delete")) {
    deleteAllImages();
    resetDelete();
  } else {
    $(this).addClass("can-delete");
    if (selectedCount == 1) {
      $(this).html("Are you sure you want to delete this image?");
    } else {
      $(this).html("Are you sure you want to delete " + selectedCount + " images?");
    }
  }
});

$(".delete-album").click(function () {
  if ($(this).hasClass("can-delete")) {
    deleteAlbum();
    resetDelete();
  } else {
    $(this).addClass("can-delete");
    $(this).html("Are you sure you want to delete this album?");
  }
});

function resetDelete() {
  $(".can-delete").html("Delete");
  $(".can-delete").removeClass("can-delete");
}

function trueformAllImages() {
  var imagesToEdit = [];
  $(".my-upload-selected").each(function () {
    var id = $(this).attr("id");
    imagesToEdit.push(id);
  });
  window.location = "/myaccount/update_image?thumb=" + imagesToEdit;
  return false;
}

function editAllImages() {
  var imagesToEdit = [];
  $(".my-upload-selected").each(function () {
    var id = $(this).attr("id");
    imagesToEdit.push(id);
  });
  window.location = "/myaccount/update_image?i=" + imagesToEdit;
  return false;
}

$(".view-image-link").click(function () {
  $(".my-upload-selected").each(function () {
    var key = $(this).data("key");
    window.open("/i/" + key, "_blank");
  });
  return false;
});

$(".view-album").click(function () {
  $(".my-upload-selected").each(function () {
    var key = $(this).data("id");
    window.open("/album/" + key, "_blank");
  });
  return false;
});

$(".edit-album").click(function () {
  $(".my-upload-selected").each(function () {
    var key = $(this).data("id");
    window.location = "/myaccount/media/album/" + key;
  });
  return false;
});

$(".edit-all").click(function () {
  editAllImages();
  return false;
});

$(".trueform-all").click(function () {
  trueformAllImages();
  return false;
});

$(".delete.album")
  .find("a")
  .click(function (e) {
    e.preventDefault();
    var thislink = $(this);
    $("#delete_popup").modal("show");
    $("#confirm-delete-album").unbind("click");
    $("#confirm-delete-album").click(function () {
      window.location = $(thislink).attr("href");
    });
  });

var loading_content = false;
var setscroll = false;

if (page == undefined) {
  var page = 0;
}

var video_view_point = 0;
var next_in_playlist = "";
var video_key = "";
var video_image = "";
var video_playlist = "";
var video_mp4 = 0;
var video_ogv = 0;
var video_webm = 0;
var video_mp4_optimised = 0;
var video_title = "";

function initVideo(view_point, key, image, next_video, playlist, mp4, ogv, webm, mp4_optimised, title) {
  video_key = key;
  video_view_point = view_point;
  video_image = image;
  next_in_playlist = next_video;
  video_playlist = playlist;
  video_mp4 = mp4;
  video_ogv = ogv;
  video_webm = webm;
  video_mp4_optimised = mp4_optimised;
  video_title = title;
}

var viewed = false;
var recently_viewed = false;
var player;
var players = [];
var curr_vid_id = "";
var set_video;

$nvids = 0;

function calculatePromoted() {
  var credits = $("#credits").html();
  var credit_value = 0.05;
  var cpv = 0.05;
  var cpf = 0.2;

  $("#promote_views").keyup(function () {
    var credit_price = credits * credit_value;
    var credits_used = ($(this).val() * cpv) / credit_value;
    if (credits < credits_used) {
      credits_used = credits;
      var credits_new = 0;
      var cost = $(this).val() * cpv - credits_used * credit_value;
    } else {
      var credits_new = credits - credits_used;
      cost = 0;
    }
    $("#credits_used").val(credits_used);
    $("#credits").html(credits_new);
    $("#promote_price").val(cost.toFixed(2));
  });

  $("#promote_follows").keyup(function () {
    var credit_price = credits * credit_value;
    var credits_used = ($(this).val() * cpf) / credit_value;

    if (credits < credits_used) {
      credits_used = credits;
      var credits_new = 0;
      var cost = $(this).val() * cpf - credits_used * credit_value;
    } else {
      var credits_new = credits - credits_used;
      cost = 0;
    }
    $("#credits_used").val(credits_used);
    $("#credits").html(credits_new);
    $("#promote_follows_price").val(cost.toFixed(2));
  });
}

if (typeof ikey != "undefined") {
  updateView(ikey);
}

var isFocussed = true;

function browserVisibility() {
  $(window).blur(function () {
    isFocussed = false;
  });
  $(window).focus(function () {
    isFocussed = true;
  });
}

function authentic_view(key) {
  $.ajax({
    url: "/ajax/authentic_view?v=" + key,
    success: function (response) {},
  });
}

var viewTimer = null;

function updateView(key) {
  let totalTime = 0;
  let viewTriggered = false;

  if (viewTimer) {
    clearInterval(viewTimer);
  }

  viewTimer = setInterval(() => {
    if (isFocussed) {
      totalTime += 100;
    }
    if (totalTime >= 5000) {
      if (!viewTriggered) {
        viewTriggered = true;
        authentic_view(key);
      }
    }
  }, 100);

  setTimeout(function () {
    $.ajax({
      url: "/ajax/add_recently_viewed?v=" + key,
      success: function (response) {},
    });
  }, 500);
}

var videos = [];
var video_id = 0;
var current_video;

var app_loaded = false;
var page_loaded = false;
var embed_ratio = 0.66;
var embed_key = "";

var pages = [];

function loadPage(goto, dir) {
  $("#loadbar").animate(
    {
      width: "70%",
    },
    300,
    "swing",
  );
  return true;
}

function resize() {
  var heights = window.innerHeight;
  var widths = (window.innerWidth - $(".shop-hero").width()) / 2;
  $(".product-images-form").css("max-height", heights - 200 + "px");
  $(".my-selected-images").css("max-height", heights - 300 + "px");
  $(".featured-cover").css("width", widths - 5 + "px");
}
resize();
window.onresize = function () {
  resize();
};

var side_fixed = false;
var feedy;
function infiniteScroll() {
  if ($(".feed-right").length > 0) {
    if (!side_fixed) {
      feedy = $(".feed-right").height() - $(".feed-right").offset().top;
      if ($(window).scrollTop() + $(window).height() - feedy > 200) {
        side_fixed = true;
        $(".feed-right").css("top", $(window).height() - $(".feed-right").height() + "px");
        $(".feed-right").css("position", "fixed");
      }
    } else {
      if ($(window).scrollTop() + $(window).height() - feedy < 200) {
        side_fixed = false;
        $(".feed-right").css("top", "50px");
        $(".feed-right").css("position", "absolute");
      }
    }
  }

  //$(".cs-sidebar-media").css("top", window.scrollY);

  if ($("#paginated-wrapper").length > 0 && infinite_scroll) {
    if (
      $(window).scrollTop() + $(window).height() >=
      $("#paginated-wrapper").offset().top + $("#paginated-wrapper").height() - 1000
    ) {
      show_more_content();
    }
  }

  if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    setTimeout(function () {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        showFooter();
      }
    }, 1000);
  } else {
    hideFooter();
  }
}

function showFooter() {
  if (!footer_opened) {
    $(".footer-popup").animate({ "line-height": "70px" }, 175);
    $(".footer-popup").fadeIn(175);
    footer_opened = true;
  }
}
function hideFooter() {
  if (footer_opened) {
    $(".footer-popup").fadeOut(175);
    $(".footer-popup").animate({ "line-height": "0" }, 175);
    footer_opened = false;
  }
}

function getAllUrlParams(url) {
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, "");
        if (!obj[key]) obj[key] = [];
        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function show_more_content() {
  $("#loading_content").show();
  if (!loading_content) {
    if (window.location.pathname == "search") {
      var linkstart = link.split("?")[0];
    } else {
      var linkstart = window.location.pathname;
    }
    var params = getAllUrlParams(link);
    page++;
    linkstart = linkstart + "?p=" + page;
    $.each(params, function (key, value) {
      if (key != "p") {
        linkstart += "&" + key + "=" + value;
      }
    });
    $("#more_content").hide();
    replace_thumbs();
    loading_content = true;
    if ($("#no_content").is(":visible")) {
      append_content();
    } else {
      var go_to = linkstart;
      var go_to = go_to.split("&_")[0];
      jQuery.get(go_to, append_content);
    }
  }
}

jQuery(window).on("navigate", function (event, data) {
  var direction = data.state.direction;
  if (direction == "back") {
  }
  if (direction == "forward") {
  }
  return false;
});

var load_next_image_data = function (response, status, xhr) {
  curr_img_key = jQuery(response).find(".current_page").data("key");

  newtitle = $(response).filter("title").text();
  newtitle = newtitle.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
  document.title = newtitle;

  if (jQuery(response).find(".next_page").data("key") == null) {
  } else {
    var slide =
      '<div class="swiper-slide" data-img-url="' +
      jQuery(response).find(".next_page").attr("href") +
      '" data-img-key=' +
      jQuery(response).find(".next_page").data("key") +
      '" ><img id="' +
      jQuery(response).find(".next_page").data("key") +
      '" class="swiper-img img-responsive imageh" src="' +
      jQuery(response).find(".next_page").data("file") +
      '" data-large="' +
      jQuery(response).find(".next_page").data("file") +
      '" /></div>';
    swiper.appendSlide(slide);
  }

  jQuery("#" + jQuery(response).find(".next_page").data("key")).css("opacity", 1);

  jQuery(".cs-sidebar-swap-top").html(jQuery(response).find(".cs-sidebar-swap-top").html());

  jQuery(".related-videos-wrapper").html(jQuery(response).find(".related-videos-wrapper").html());
  jQuery(".image-comments-wrapper").html(jQuery(response).find(".image-comments-wrapper").html());
  jQuery(".album-share-wrapper").html(jQuery(response).find(".album-share-wrapper").html());
  addPlaylistJS();

  jQuery(".cs-sidebar-swap-top").fadeIn();
  jQuery(".cs-sidebar-swap-bottom").fadeIn();
  jQuery(".mobile-mid-banner").fadeIn();

  var image_h = $(".swiper-slide-active img").height();
  $(".video_video").height(image_h + "px");

  jQuery(".image-comments-wrapper").fadeIn();
  jQuery(".sidebar-bottom-ad").fadeIn();
  if (img_zoomed) {
    $(".cs-sidebar-column .sidebar-comments").html($(".image-comments-wrapper").html());
    $(".cs-sidebar-column .hide-zoomed").hide();
    $(".cs-sidebar-column .show-zoomed").show();
  }
  $(".share_image").data("img", $(".swiper-slide-active img").attr("src"));
  $(".share_image").data("id", $(".swiper-slide-active").data("img-id"));
  addCommentJS();
  addLikeJS();
  addShareJS();
  addFollowJS();
  expandMediaDescription();
  exif_js();
  init_img_zoom();

  $(".main-product-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        nav: false,
        loop: false,
      },
      600: {
        items: 3,
        nav: false,
        loop: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });

  imageProductsJS();
  initAddThis();
};

function imageProductsJS() {
  //clear_ajax_listeners('.cloud-download');
  clear_ajax_listeners(".ajax-products");

  $(".image-product-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: {
        items: 2,
        nav: false,
        loop: false,
      },
      600: {
        items: 3,
        nav: false,
        loop: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });

  $(".ajax-products").click(function () {
    $(".product-selected").removeClass("product-selected");
    $(".ajax-all-products").hide();
    $(".related-videos").html("");
    $("#loading_content").show();
    $(this).parents(".product").addClass("product-selected");
    var products_link = $(this).attr("href");
    $(".related-videos").load(products_link + " #paginated-inner", function (data) {
      //replace images
      $("#loading_content").hide();
    });
    return false;
  });
}

var append_content = function (response, status, xhr) {
  $("#more_content").hide();
  if (jQuery(response).find(".largegrid").html() != undefined) {
    var content = jQuery(response).find(".largegrid");
    var grid = content.find(".largegrid");
    $largegrid.append(content.html());
    initJustice();
    $("#no_content").hide();
  } else if (jQuery(response).find("#paginated").html() != undefined) {
    jQuery("#paginated-wrapper").append(jQuery(response).find("#paginated").html());
    loading_content = false;
    $("#loading_content").hide();
    $("#no_content").hide();
  } else {
    loading_content = true;
    $("#more_content").remove();
    $("#loading_content").remove();
    $("#no_content").show();
  }

  addCommentJS();
  addLikeJS();
  addFollowJS();
  addShareJS();
  addPlaylistJS();
  initProducts();
  product_images_js();
  add_album_js();
  addDownloadJS();
};

function addDownloadJS() {
  clear_ajax_listeners(".cloud-download");
  clear_ajax_listeners(".image-feedback");
  $(".cloud-download").click(function () {
    window.open($(this).attr("href"), "_blank");
  });

  $(".image-feedback").click(function () {
    window.open($(this).attr("href"), "_blank");
  });
}

var ads_loaded = false;
var play_started = false;

$("#loadbar").animate(
  {
    width: "100%",
  },
  300,
  "swing",
  function () {
    $("#loadbar").animate(
      {
        opacity: "0",
      },
      300,
      "swing",
      function () {
        $("#loadbar").css("width", "0");
        $("#loadbar").css("opacity", "1");
      },
    );
  },
);

exif_js();
function exif_js() {
  $(".show_exif").click(function () {
    if ($(this).html() == "Show Details") {
      $(".exif-hidden").show();
      $(this).html("Hide Details");
    } else {
      $(".exif-hidden").hide();
      $(this).html("Show Details");
    }
    return false;
  });
}

function close_swiper_zoom() {
  $(".image-comments-wrapper").html($(".cs-sidebar-column .sidebar-comments").html());
  $(".cs-sidebar-column .sidebar-comments").html("");
  $(".swiper-container-zoomed").hide();
  $(".sidebar-zoomed").show();
  comments_visible = true;
  $("#header").removeClass("zoomed-header");
  $(".cs-sidebar-column").removeClass("sidebar-zoomed");
  $(".cs-sidebar-column .comment-details").remove();
  $(".cs-sidebar-column .hide-zoomed").show();
  $(".cs-sidebar-column .show-zoomed").hide();
  $(".swiper-container-zoomed .img-container img").css("margin-left", "auto");
  $(".sidebar-zoomed").show();
  $(".swiper-slide-active img").css("margin-left", "auto");
  $(".swiper-container-zoomed .img-container").html("");
  $(".cs-sidebar-column").css("top", "0");
  $(".cs-sidebar-column").css("height", "auto");
  $(".cs-sidebar-column").css("position", "relative");
  $("body").css("overflow", "scroll");
  addCommentJS();
  expandMediaDescription();
  img_zoomed = false;

  return false;
}

$(".header-carousel").owlCarousel({
  loop: true,
  margin: 10,
  responsiveClass: true,
  responsive: {
    0: {
      items: 2,
      nav: false,
      loop: false,
    },
    600: {
      items: 3,
      nav: false,
      loop: false,
    },
    1000: {
      items: 4,
      nav: true,
      loop: false,
    },
  },
});

var loadingtab = false;

function initRegFlow() {
  $(".checkbox-switch").bootstrapSwitch();
  $(".checkbox-switch").on("switchChange.bootstrapSwitch", function (event, state) {
    if (state == true) {
      $(".subscriptions-yearly").fadeIn(200);
      $(".subscriptions-monthly").fadeOut(200);
      $(".hide-annual").fadeOut(200);
    } else {
      $(".subscriptions-yearly").fadeOut(200);
      $(".subscriptions-monthly").fadeIn(200);
      $(".hide-annual").fadeIn(200);
    }
  });

  $(".register-next").click(function () {
    $("#register_form").submit();
    return false;
  });

  $("#register_form").submit(function () {
    if (reg_validation()) {
      //if(ismobile){
      $(".register-hide").hide();
      $(".load-spinner").show();
      return true;
      //}
      $(".register-hide").hide();
      $(".load-spinner").show();
      $.ajax({
        // create an AJAX call...
        data: $(this).serialize(), // get the form data
        type: $(this).attr("method"), // GET or POST
        url: "/membership/register/add_member", //$(this).attr('action'), // the file to call
        success: function (response) {
          // on success..
          $(".response").html(jQuery(response).find(".reg-modal-content").html());
          /*$("#register_container").css({
          "maxWidth": "1280px"
        });*/
          $("#membership_popup").addClass("subs_popup");
          initRegFlow();
        },
      });
    }
    return false;
  });
}

function initConfirmUpdate() {
  $(".ajax-confirm").click(function () {
    setExitBind(false);
    $(this).val("Saving...");
    $(this).html("Saving...");
    $(this).addClass("disabled");
    $(this).attr("disabled", true);
  });
}

function subscribe_checkout() {
  clear_ajax_listeners(".payment_type_label_click");
  $(".payment_type_label_click").click(function () {
    $(this).parents(".radio-container").find(".payment_type").click();
  });
}

//removes and chars that aren't letters or numbers from input
function onlyLetters() {
  $(".only-letters").keyup(function (event) {
    $(".only-letters").val($(".only-letters").val().replace(/\W/g, ""));
  });
}

function initApp() {
  subscribe_checkout();
  addDownloadJS();
  product_images_js();
  browserVisibility();

  basketJS();
  if ($(".masonry").length) {
    initMasonry();
  }
  if ($(".largegrid").length) {
    initJustice();
  }
  if ($(".smallgrid").length) {
    initSmallJustice();
  }

  onlyLetters();

  $(".earnings_link").click(function () {
    $(".earnings-container").html('<div class="earningsloader"></div>');
    $(".earnings-container").load("/myaccount/settings/request_payment " + " #request-payment", function (data) {
      //replace images
      //replace_thumbs();
    });
    return false;
  });

  $(".ams_album_share").click(function () {
    if ($(this).hasClass("notPRo")) {
      toastr.error(
        '<a href="/myaccount/subscription">Only Pro users can schedule posts from albums. Click here to upgrade.</a>',
      );
      return false;
    } else {
      var album_name = $(this).data("album-name");
      var save_data = $(this).attr("id");
      var save_data_array = save_data.split("_");
      var type = save_data_array[0];
      var album = save_data_array[1];

      $.ajax({
        type: "GET",
        url: "/myaccount/settings/pro",
        data: "sa=" + save_data,
        success: function (response) {
          toastr.success(type + " " + response + " for " + album_name);
        },
      });
    }
  });

  if (typeof toastr_message !== "undefined" && toastr_message != "") {
    toastr.success(toastr_message);
  }

  if (typeof toastr_error !== "undefined" && toastr_error != "") {
    toastr.error(toastr_error);
  }

  clear_ajax_listeners(".settings-hero");

  initRegFlow();

  initConfirmUpdate();

  $(".inline-form-group textarea").each(function () {
    this.style.height = this.scrollHeight + "px";
  });
  $(".inline-form-group textarea").on("keydown", function () {
    this.style.height = this.scrollHeight + "px";
  });

  $(".tab_link").click(function () {
    if (!loadingtab) {
      loadingtab = true;
      $(".tabloader").show();
      $("li.active").removeClass("active");
      $(this).parents("li").addClass("active");
      $("#tabcontainer").html("");
      $("#tabcontainer").load($(this).attr("href") + " #tabinner", function (data) {
        $(".tabloader").hide();
        if (loadingtab) {
          $largegrid = undefined;
          loadingtab = false;
          initJustice();
          initApp();
        } else {
        }
      });
    }
    return false;
  });

  $(".fake_tab_link").click(function () {
    if (!loadingtab) {
      loadingtab = true;
      $("li.active").removeClass("active");
      $(this).parents("li").addClass("active");
      $("#tabcontainer").html("");
      $(".tabloader").show();
      window.location = $(this).attr("href");
    }
    return false;
  });

  $("#fb_page_select").on("change", function () {
    $(".pageform").hide();
    $("#" + $(this).val()).show();
  });

  var editing = false;
  var edited = false;
  $(".inline-save").click(function () {
    $(this).parents(".form-group").find(".inline-save-btn").show();
    $(this).parents(".form-group").find(".inline-save-btn").removeClass("hidden");
    $(this).parents(".inline-form-group").addClass("editing");
  });
  $(".inline-save").on("keydown", function () {
    $(this).parents(".form-group").find(".inline-save-btn").show();
    $(this).parents(".form-group").find(".inline-save-btn").removeClass("hidden");
    $(this).parents(".inline-form-group").addClass("editing");
    $(this).parents(".inline-form-group").addClass("edited");
  });
  $(".inline-form-group").mouseleave(function () {
    if (!$(this).hasClass("edited")) {
      $(this).find(".inline-save-btn").hide();
      $(this).find(".inline-save-btn").addClass("hidden");
      $(this).removeClass("editing");
      $(this).removeClass("edited");
    }
  });

  $("#exit_feedback").on("change keyup paste", function () {
    $("#survey-save").removeAttr("disabled");
  });

  $(".inline-save-form").submit(function () {
    $(this).find(".inline-save-btn").hide();
    $(this).find(".inline-save-btn").addClass("hidden");
    $(this).find(".inline-form-group").removeClass("edited");
    $(this).find(".inline-form-group").removeClass("editing");

    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        var feedback = jQuery.parseJSON(response);
        if (feedback["success"] == "true") {
          toastr.success(feedback["msg"]);
        } else {
          toastr.error(feedback["msg"]);
        }
      },
    });
    $(this).find(".inline-save-btn").hide();
    return false;
  });

  $(".perm-inline-save-form").submit(function () {
    $(this).find(".inline-save-btn").hide();

    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        var feedback = jQuery.parseJSON(response);
        if (feedback["success"] == "true") {
          toastr.success(feedback["msg"]);
        } else {
          toastr.error(feedback["msg"]);
        }
        $(".existing_email").html($("#new_email").val());
        $(".existing_email").show();
        $("#new_email").hide();
        $(".resend-btn").show();
      },
    });
    return false;
  });

  $(".inline-image-form").submit(function () {
    toastr.success("Uploading...");
  });

  $(".social-form").submit(function () {
    $(".social-form .btn").hide();
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        toastr.success("Social Profiles Saved");
      },
    });
    return false;
  });

  $(".adverts-radio").change(function () {
    $(this).parents(".adverts-form").submit();
  });

  $(".autotagging-radio").change(function () {
    $(this).parents(".autotagging-form").submit();
  });

  $(".autotagging-form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        toastr.success("Autotagging settings Saved");
      },
    });
    return false;
  });

  $(".adverts-form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        toastr.success("Advert settings Saved");
      },
    });
    return false;
  });

  $(".notifications-radio").change(function () {
    $(this).parents(".notifications-form").submit();
  });

  $(".notifications-form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        toastr.success("Notifications Saved");
      },
    });
    return false;
  });

  $(".app_form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        if (page_name != undefined && page_name != "") {
        } else {
        }
        if (response == "success") {
        }
      },
    });
    return false;
  });

  $("#all_notifications").change(function () {
    if ($(this).is(":checked")) {
      an = 1;
    } else {
      an = 0;
    }
    $.ajax({
      // create an AJAX call...
      data: { all_notifications: an }, // get the form data
      type: "POST",
      url: "/myaccount/notifications", // the file to call
      success: function (response) {
        // on success..
      },
    });
  });

  $(".auto_post").change(function () {
    if ($(this).is(":checked")) {
      $(this).parents(".switch").addClass("on");
    } else {
      $(this).parents(".switch").removeClass("on");
    }
    $.ajax({
      // create an AJAX call...
      data: $(this).parents(".app_form").serialize(), // get the form data
      type: $(this).parents(".app_form").attr("method"), // GET or POST
      url: $(this).parents(".app_form").attr("action"), // the file to call
      success: function (response) {
        // on success..
      },
    });
  });

  $(".events-wrapper li a").click(function () {
    if ($(this).parents(".timeline").hasClass("notPRo")) {
      toastr.error('<a href="/myaccount/subscription">Only Pro users can schedule posts. Click here to upgrade.</a>');
      return false;
    } else {
      $(this).parents(".app_form").find(".post_frequency").val($(this).data("option"));
      $(this).parents(".app_form").submit();
    }
  });

  $(".notProToggle").click(function () {
    toastr.error('<a href="/myaccount/subscription">' + $(this).data("notpromsg") + "</a>");
    return false;
  });

  $("#cloud_storage").change(function () {
    if ($(this).is(":checked")) {
      window.location = "/myaccount/settings/cloudstorage";
    } else {
      window.location = "/myaccount/settings/cancel_cloud_storage";
    }
  });

  $("#twitter_connect_wrapper img").click(function () {
    $("#twitter_connect").click();
  });

  $("#facebook_connect_wrapper img").click(function () {
    $("#fb_connect").click();
  });

  $("#pinterest_connect_wrapper img").click(function () {
    $("#pinterest_connect").click();
  });

  $("#twitter_connect").change(function () {
    if ($(this).is(":checked")) {
      window.location = "/myaccount/connectapp/twitter";
    } else {
      toastr.success("Disconnecting Twitter");
      $.get("/myaccount/settings/apps/?disconnect=twitter", function (data) {
        toastr.success("Twitter Disconnected Successfully");
      });
      $(".twitter-on-desc").show();
      $(".twitter-off-desc").hide();
      $(".twitter-label").html("Connect to Twitter");
    }
  });

  $("#fb_connect").change(function () {
    if ($(this).is(":checked")) {
      window.location = "/myaccount/connectapp/facebook";
    } else {
      toastr.success("Disconnecting Facebook");
      $.get("/myaccount/settings/apps/?disconnect=facebook", function (data) {
        toastr.success("Facebook Disconnected Successfully");
      });
      $(".facebook-connected").hide();
      $(".fb-on-desc").show();
      $(".fb-off-desc").hide();
      $(".fb-label").html("Connect to Facebook");
    }
  });

  /* Pinterest disabled
  $('#pinterest_connect').change(function(){
    if($(this).is(':checked')){
      window.location = '/myaccount/connectapp/pinterest';
    }else{
      toastr.success('Disconnecting pinterest');
      $.get( "/myaccount/settings/apps/?disconnect=pinterest", function( data ) {
        toastr.success('pinterest Disconnected Successfully');
      });
      toastr.success('Disconnecting pinterest');
      $('.pinterest-connected').hide();
      $('.pinterest-on-desc').show();
      $('.pinterest-off-desc').hide();
      $('.pinterest-label').html('Connect to Pinterest');
    }
  });*/

  $(".change_password").click(function () {
    $(this).hide();
    $("#curr_pwd_form").show();
    return false;
  });

  $(".delete_account").click(function () {
    $(this).hide();
    $("#delete_form").show();
    return false;
  });

  $(".header_image").change(function () {
    $(this).parents(".inline-image-form").submit();
  });
  $(".channel_image").change(function () {
    $(this).parents(".inline-image-form").submit();
  });

  $("#curr_pwd_form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        if (response == "true") {
          $("#current_password").val($("#current_password_1").val());
          $("#curr_pwd_form").hide();
          $("#pwd_form").show();
        } else {
          toastr.error("Password Incorrect");
        }
      },
    });
    return false;
  });

  $("#pwd_form").submit(function () {
    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: $(this).attr("action"), // the file to call
      success: function (response) {
        // on success..
        var result = jQuery.parseJSON(response);
        if (result["success"] == "false") {
          toastr.error(result["msg"]);
        } else {
          toastr.success("Password Updated");
          $("#pwd_form").hide();
          $(".change_password").show();
          $("#current_password").val("");
          $("#current_password_1").val("");
        }
      },
    });
    return false;
  });

  $(".apptitle").click(function () {
    if ($(this).parents(".app-setting").find(".pageform").hasClass("pageformopen")) {
      $(this).parents(".app-setting").find(".pageform").slideUp().removeClass("pageformopen");
      $(".open").removeClass("open");
    } else {
      $(".open").removeClass("open");
      $(this).addClass("open");
      $(".pageformopen").hide().removeClass("pageformopen");
      $(this).parents(".app-setting").find(".pageform").slideDown().addClass("pageformopen");
    }

    return false;
  });

  $("img").on("dragstart", function (event) {
    event.preventDefault();
  });

  $(".rss-content a").attr("target", "_blank");

  $.fn.bootstrapSwitch.defaults.onText = "";
  $.fn.bootstrapSwitch.defaults.offText = "";
  $.fn.bootstrapSwitch.defaults.offColor = "primary";
  $.fn.bootstrapSwitch.defaults.handleWidth = "30";
  $.fn.bootstrapSwitch.defaults.labelWidth = "30";

  if (show_upgrade == true) {
    //  $('#upgrade_popup').modal('show');
  }

  if (!app_loaded) {
    app_loaded = true;
    viewed = false;
    recently_viewed = false;
    ended = false;

    scroll_content();
    expandMobileMenu();
    expandFooter();
    expandMediaDescription();

    var $button;
    $(".nav-dropdown-menu-icon").click(function () {
      $button = $(this);
      $this = $(this).find(".nav-dropdown-menu");
      if ($this.css("display") == "block") {
        $(".nav-dropdown-menu").css("display", "none");
        $("#page").removeClass("blur");
        $("#overlay").hide();
        $button.removeClass("open");
      } else {
        $(".nav-dropdown-menu").css("display", "none");
        $(".nav-dropdown-menu-icon").removeClass("open");
        $button.addClass("open");
        $this.css("display", "block");
        $("#page").addClass("blur");
        $("#overlay").show();
        $("#overlay").click(function () {
          $(".blur").removeClass("blur");
          $("#overlay").hide();
          $(".nav-dropdown-menu").hide();
          $(".nav-dropdown-menu-icon").removeClass("open");
        });
      }
    });

    var explore_open = false;

    $(".explore-dropdown-btn").click(function () {
      if (!explore_open) {
        explore_open = true;
        $("#page").animate({ "margin-top": "+=120" }, 50, "swing");
        $(".explore-dropdown").slideDown();
      } else {
        explore_open = false;
        $("#page").animate({ "margin-top": "-=120" }, 50, "swing", function () {});
        $(".explore-dropdown").slideUp();
      }
      resizeCatImages();
    });

    $(document).click(function (event) {
      if (explore_open) {
        explore_open = false;
        $("#page").animate({ "margin-top": "-=150" }, 50, "swing", function () {});
        $(".explore-dropdown").slideUp();
      }
    });

    $(".classic-menu-dropdown").click(function () {
      if ($(this).hasClass("open")) {
        $(".nav-dropdown-menu-icon").removeClass("open");
        $(".nav-dropdown-menu").css("display", "none");
        $("#page").removeClass("blur");
      } else {
        $(".nav-dropdown-menu-icon").removeClass("open");
        $(".nav-dropdown-menu").css("display", "none");
        $("#page").addClass("blur");
      }
    });

    mrMenu("#menu-categories-parent", "#menu-categories-menu", "hover", 15, "slide");
    mrMenu("#mobile-settings-menu-button", ".account-settings .nav-tabs", "click", 15, "slide");

    // -----------------------------------------------
    // Notifications
    // -----------------------------------------------
    var wh = $(window).height();
    $("#notifications-menu .notifications").css("max-height", wh - 150 + "px");

    // Polling for new notifications - dropdown
    //----------------------------------------------------
    function getNotifications() {
      $.ajax({
        type: "GET",
        url: VS.config.base_url + "ajax/notifications_get",
        data: { limit: 15 },
        success: function (response) {
          $("#notifications-menu").find(".wrap").html(response.data.html);
          if (response.data.unread > 0) {
            $("#user-notification-icon > span").html(response.data.unread).show();
          }
        },
      });
    }
    if ($("#user-notification-icon").length) {
    }
    // Polling for new notifications - Notifications page
    //----------------------------------------------------
    function getNotificationsFeed() {
      $.ajax({
        type: "GET",
        url: VS.config.base_url + "ajax/notifications_get",
        data: { limit: 0 },
        success: function (response) {
          $(".notifications.feed-page").find(".feed-content").html(response.data.html);
        },
      });
    }
    if ($("#user-notification-icon").length && $(".notifications.feed-page").length) {
      //setInterval(function(){ getNotificationsFeed() }, 30000);
    }

    // Open notifications menu
    //---------------------------------------------
    $("#user-notification-icon").click(function () {
      var notification_ids = [];
      $("#notifications-menu ul li").each(function () {
        var id = $(this).data("id");
        notification_ids.push(id);
      });

      if (!$(this).data("open")) {
        $(this).data("open", true);
        $.ajax({
          type: "POST",
          url: VS.config.base_url + "ajax/notifications_read",
          data: { data: notification_ids },
          success: function (response) {
            if (response.notifications_read == true) {
              $("#user-notification-icon > span").hide();
            }
          },
        });
      } else {
        $(this).data("open", false);
      }
    });

    var onCat = false;

    $(".menu-parent").hover(function () {
      onCat = true;
      var timer = setTimeout(function () {
        if (onCat) {
          $(".menu-parent").addClass("menu-parent-open");
          $("#sub-categories").slideDown("fast");
        }
      }, 325);
    });

    $(".menu-parent").mouseleave(function () {
      onCat = false;
      $("#sub-categories").slideUp("fast", function () {
        $(".menu-parent").removeClass("menu-parent-open");
        $("#sub-categories").hide();
      });
    });

    if (!setscroll) {
      setscroll = true;
      $(window).scroll(function () {
        infiniteScroll();
      });
    }

    scroll_outer = $(".masthead .panel .scroll-outer");
    scroll_outer.css("height", scroll_outer.width() - 85);

    $("#nav-tabs a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });

    $(".lower-third .close-btn").click(function () {
      $(".lower-third").hide();
      setTimeout(function () {
        $(".lower-third").show();
      }, 180000);
    });

    scroll_content();
    /*if(isfeed != undefined && isfeed != 'undefined' && isfeed == false){
  }*/
    if ($("body").hasClass("feed")) {
      show_more_content();
    }

    $("#more_content").click(function () {
      show_more_content();
      return false;
    });
    initSwiper(true);

    init_img_zoom();

    $(".search_form").submit(function () {
      var search_data = $(this).serialize();
      if (search_data.indexOf("t=product") >= 0) {
        loadPage("/search?" + search_data, "f");
      } else {
        loadPage("/shop?" + search_data, "f");
      }
    });

    $(".subscribe_form").submit(function () {
      $.ajax({
        // create an AJAX call...
        data: $(this).serialize(), // get the form data
        type: $(this).attr("method"), // GET or POST
        url: $(this).attr("action"), // the file to call
        success: function (response) {
          // on success..
          var $result = $(response).find("#innerajax");
          $("#outerajax").html($result); // update the DIV
          app_loaded = false;
          initApp();
        },
      });
      return false;
    });

    // http://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
    // edited to accomodate a bug in the above solution on Stackoverflow thanks to mayhemx (see his comment in the product discussion to know the fix details)
    if (window.location.hash == "#_=_") {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split("#")[0])
        : (window.location.hash = "");
      event.preventDefault();
    }

    $.ajaxSetup({
      cache: false,
    });

    /* ---------- messages: error, success
  ------------------------------------------------------------------------------------------------ */
    var message_cleanup = function () {
      $("div#error").removeClass("alert alert-danger");
      $("div#error").html("");
      $("div#pwd_error").removeClass("alert alert-danger");
      $("div#pwd_error").html("");
      $("div#success").removeClass("alert alert-success");
      $("div#success").html("");
    };

    var error_box = function (error) {
      var $error = $("div#error");
      $error.addClass("alert alert-danger");
      $error.hide();
      $error.append("<h4>Please verify the following:</h4>" + error);
      $error.fadeIn(200);
      $(".loading").hide();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $(".btn-loading").removeAttr("disabled");
    };

    var pwd_error_box = function (error) {
      var $error = $("div#pwd_error");
      $error.addClass("alert alert-danger");
      $error.hide();
      $error.append("<h4>Password error:</h4>" + error);
      $error.fadeIn(200);
      $(".loading").hide();
      $(".btn-loading").removeAttr("disabled");
    };

    complete_profile_js();

    /* ---------- login field validation
  ------------------------------------------------------------------------------------------------ */
    $("#login_submit").click(function (evt) {
      $(".loading").show();
      message_cleanup();
      $(".btn-loading").attr("disabled", "disabled");

      var error = "";
      if ($("#login_email").val().length == 0) {
        error += "<p>You must enter your email.</p>";
      }
      if ($("#login_password").val().length == 0) {
        error += "<p>You must enter your password.</p>";
      }

      if (error != "") {
        setTimeout(function () {
          error_box(error);
        }, 1200);
        evt.preventDefault();
      } else {
        $(".btn-loading").removeAttr("disabled");
      }
    });

    // when leaving the email field, check for validity and uniqueness
    $("#reg_email, #email").blur(function () {
      var email = $(this).val();

      if (email.length > 0) {
        var email_valid = $("#email_valid");
        var email_taken = $("#email_taken");

        if (!regex_encode.test(email)) {
          email_valid.addClass("checking");
          email_taken.addClass("checking");
          email_valid.text(LANG.checking_validity);
          email_taken.text(LANG.checking_availability);

          $.getJSON(
            CI.base_url + "membership/ajax_membership/ajax_is_valid_email/" + $.trim(encodeURIComponent(email)),
            function (data) {
              if (data != null) {
                email_valid.text(LANG.email_is_valid);
                $("#email_valid").addClass("check_is_ok");
                $.getJSON(
                  CI.base_url +
                    "membership/ajax_membership/ajax_is_existing_unique_field/" +
                    $.trim(encodeURIComponent(email)) +
                    "/user/email",
                  function (data) {
                    if (data == null) {
                      email_taken.text(LANG.email_is_taken);
                      email_taken.addClass("check_is_nok");
                    } else {
                      email_taken.text(LANG.email_is_available);
                      email_taken.addClass("check_is_ok");
                    }
                  },
                );
              } else {
                email_valid.text(LANG.is_valid_email);
                email_valid.addClass("check_is_nok");
                email_taken.removeClass("checking");
                email_taken.text("");
              }
            },
          );
        } else {
          email_valid.text(LANG.is_valid_email);
          email_valid.addClass("check_is_nok");
          email_taken.text("");
        }
      }
    });

    // when leaving the reg_username field, check for uniqueness
    $("#reg_username").blur(function () {
      var username = $(this).val();
      var username = username.replace(" ", "");

      $("#reg_username").val(username);

      if (username.length > 0) {
        var username_taken = $("#username_taken");
        var username_valid = $("#username_valid");
        var username_length = $("#username_length");

        if (!regex_encode.test(username)) {
          username_taken.text(LANG.checking_availability);

          if (regex_username.test(username)) {
            username_valid.text(LANG.username_is_valid);
            username_valid.addClass("check_is_ok");

            $.getJSON(
              CI.base_url +
                "membership/ajax_membership/ajax_is_existing_unique_field/" +
                $.trim(encodeURIComponent(username)) +
                "/user/username",
              function (data) {
                if (data == null) {
                  username_taken.text(LANG.username_exists);
                  username_taken.addClass("check_is_nok");
                } else {
                  username_taken.text(LANG.username_available);
                  username_taken.addClass("check_is_ok");
                  if (username.length < 6) {
                    username_length.text(LANG.username_minlength);
                    username_length.addClass("check_is_nok");
                  } else if (username.length > 16) {
                    username_length.text(LANG.username_maxlength);
                    username_length.addClass("check_is_nok");
                  }
                }
              },
            );
          } else {
            username_valid.text(LANG.is_valid_username);
            username_valid.addClass("check_is_nok");
            username_taken.text("");
          }
        } else {
          username_valid.text(LANG.is_valid_username);
          username_valid.addClass("check_is_nok");
          username_taken.text("");
        }
      }
    });

    $("#reg_password").blur(function () {
      var password = $(this).val();

      var password_length = $("#password_length");

      if (password.length < 9) {
        password_length.text(LANG.password_minlength);
        password_length.attr("class", "check_is_nok");
      } else if (password.length > 64) {
        password_length.text(LANG.password_maxlength);
        password_length.attr("class", "check_is_nok");
      } else {
        password_length.text("Password is ok");
        password_length.attr("class", "check_is_ok");
      }
    });

    // clear field messages when focusing
    $("#reg_email, #profile_email").focus(function () {
      $("#email_taken").text("");
      $("#email_valid").text("");
      $("#email_taken, #email_valid").removeClass("check_is_ok check_is_nok checking");
    });
    $("#reg_username").focus(function () {
      $("#username_taken").text("");
      $("#username_valid").text("");
      $("#username_length").text("");
      $("#username_taken, #username_valid, #username_length").removeClass("check_is_ok check_is_nok checking");
    });

    // other membership related validation
    $(".check_email_empty").click(function (evt) {
      $(".loading").show();
      $(".btn-loading").attr("disabled", "disabled");
      message_cleanup();

      var error = "";
      if ($("#email").val().length == 0) {
        error += "<p>" + LANG.email_empty + "</p>";
      }
      if ($("#recaptcha_response_field").val().length == 0) {
        error += "<p>" + LANG.recaptcha_required + "</p>";
      }
      if (error != "") {
        error_box(error);
        evt.preventDefault();
      } else {
        $(".btn-loading").removeAttr("disabled");
      }
    });

    /* ---------- OAuth Profile validation
  ------------------------------------------------------------------------------------------------ */

    // profile validation: update account part
    $("#oauth_profile_submit").click(function (evt) {
      $(".loading").show();
      message_cleanup();
      $(".btn-loading").attr("disabled", "disabled");

      var error = "";
      if ($("#first_name").val().length == 0) {
        error += "<p>" + LANG.fill_out_first_name + "</p>";
      }
      if ($("#last_name").val().length == 0) {
        error += "<p>" + LANG.fill_out_last_name + "</p>";
      }
      if ($("#email").val().length == 0) {
        error += "<p>" + LANG.fill_out_email + "</p>";
      }
      if (error != "") {
        setTimeout(function () {
          error_box(error);
        }, 1200);
        evt.preventDefault();
      } else {
        $(".btn-loading").removeAttr("disabled");
      }
    });

    /* ---------- Adminpanel validation
  ------------------------------------------------------------------------------------------------ */

    // list members: search membership validation
    $("#member_search_submit").click(function (evt) {
      $(".loading").show();
      message_cleanup();
      $(".btn-loading").attr("disabled", "disabled");

      var error = "";
      if (
        $("#username").val().length == 0 &&
        $("#first_name").val().length == 0 &&
        $("#last_name").val().length == 0 &&
        $("#email").val().length == 0
      ) {
        error += "<p>" + LANG.search_data + "</p>";
      }
      if (error != "") {
        setTimeout(function () {
          error_box(error);
        }, 1200);
        evt.preventDefault();
      } else {
        $(".btn-loading").removeAttr("disabled");
      }
    });

    /* ---------- Adminpanel bootbox (alerts when clicking buttons on list members page)
------------------------------------------------------------------------------------------------ */

    var myBootbox = function ($target) {
      $($target).click(function () {
        $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
        $(this).attr("clicked", "true");
      });
    };

    myBootbox("form#mass_action_form input[type=submit]");

    $("form#mass_action_form").on("click", ".bootbox", function (evt) {
      var $target = $("form#mass_action_form input[type=submit][clicked=true]").attr("id");

      evt.preventDefault();
      bootbox.confirm("Warning: <br>" + $(this).attr("title"), function (confirmed) {
        if (confirmed) {
          $("input#mass_action").val($target);
          $("#mass_action_form").submit();
        }
      });
    });

    /* ---------- other
------------------------------------------------------------------------------------------------ */

    // confirm delete
    $(".confirm_delete_video").click(function () {
      return confirm("Are you sure you want to delete this video?") ? true : false;
    });
    $(".confirm_delete_status").click(function () {
      return confirm("Are you sure you want to delete this status?") ? true : false;
    });
    $(".confirm_delete_comment").click(function () {
      return confirm("Are you sure you want to delete this comment?") ? true : false;
    });

    // easy access method for message_cleanup: add to submit buttons to remove messages if any are present
    $(".message_cleanup").click(function () {
      message_cleanup();
    });

    // select all functionality for manipulating multiple items at one go
    $(".select_checkboxes").change(function () {
      var c = this.checked;
      $(":checkbox").prop("checked", c);
    });

    $(".paypal_submit").click(function () {
      $(this).hide();
      var this_form = "#paypal_form" + $(this).attr("id").replace("paypal_submit", "");
      var custom = jQuery.parseJSON($(this).siblings('input[name="custom"]').val());
      $.get("/myaccount/prepare_upgrade?s=" + custom.subscription_id, function (data) {
        $(this_form).submit();
      });
      return false;
    });

    $(".subscribe_close").click(function () {
      $("#subscribe_popup").hide();
      $("#innerajax").removeClass("blur");
      $("body").removeClass("modal--open");
      $("body").removeClass("modal-open");
      $(".modal-backdrop").hide();
      return false;
    });

    $(".product_close").click(function () {
      $("#create_products_popup").modal("hide");
      $("#innerajax").removeClass("blur");
      $("body").removeClass("modal--open");
      $("body").removeClass("modal-open");
      $(".modal-backdrop").hide();
      return false;
    });

    $(".product_select_close").click(function () {
      close_product_select();
      return false;
    });

    $(".add_product_group").click(function () {
      $("#product_group_popup").show();
      return false;
    });

    $(".add_product").click(function () {
      $("#product_popup").show();
      return false;
    });

    $(".register_btn").click(function () {
      if (isiPhone()) {
        window.location = "/membership/register?mobile=1";
        return false;
      }
      $("#membership_popup").show();
      $("#innerajax").addClass("blur");
      $("body").addClass("modal--open");
      onlyLetters();

      $("#innerajax").addClass("blur");
      $("#register_tab").click();
      return false;
    });

    $(".membership_close").click(function () {
      $("#innerajax").removeClass("blur");
      $("body").removeClass("modal--open");
      $("#membership_popup").hide();
      //$('#outerajax').show();
      return false;
    });

    $(".product_close").click(function () {
      $("#product_popup").modal("hide");
      //$('#outerajax').show();
      return false;
    });

    $("#crop_popup").on("hidden.bs.modal", function () {
      $("#crop_popup").modal("hide");
      $("#innerajax").removeClass("blur");
      $("body").removeClass("modal--open");
      $("body").removeClass("modal-open");
      // do something…
    });

    $(".crop_popup_close").click(function () {
      $("#crop_popup").modal("hide");
      $("#innerajax").removeClass("blur");
      $("body").removeClass("modal--open");
      $("body").removeClass("modal-open");
      //$('#outerajax').show();
      return false;
    });

    $(".product_group_close").click(function () {
      $("#product_group_popup").hide();
      //$('#outerajax').show();
      return false;
    });

    addPlaylistJS();
    addCommentJS();
    addShareJS();
    addSearchJS();
    addLikeJS();
    addFollowJS();
    add_album_js();
    initAddThis();
    calculatePromoted();
  }
}

var swiper;

function initSwiper(canswipe) {
  if (canswipe) {
    swiper = new Swiper(".swiper-container", {
      centeredSlides: true,
      touchReleaseOnEdges: false,
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  } else {
    swiper.detachEvents();
    swiper.update();
  }

  swiper.on("slideChange", function () {
    jQuery(".cs-sidebar-swap-top").fadeOut();
    jQuery(".cs-sidebar-swap-bottom").fadeOut();
    jQuery(".mobile-mid-banner").fadeOut();
    jQuery(".sidebar-bottom-ad").fadeOut();
    jQuery(".image-comments-wrapper").fadeOut();
  });

  swiper.on("slideChangeTransitionEnd", function () {
    var cur_url = $(".swiper-slide-active").data("img-url");
    var url = window.location.href;
    var album = getURLParameter(url, "album");
    if (album != "" && album != null) {
      if (cur_url.indexOf("album") >= 0) {
      } else {
        cur_url += "?album=" + album;
      }
    }
    if (cur_url != undefined && cur_url != "undefined") {
      jQuery.get(cur_url, load_next_image_data);
      history.pushState("", "Clickasnap", cur_url);
      updateView($(".swiper-slide-active").data("img-key"));
      resize_image();
    }
  });

  resize_image();
}

function initAddThis() {
  if (!remove_addthis) {
    if (window.addthis) {
      window.addthis = null;
      window._adr = null;
      window._atc = null;
      window._atd = null;
      window._ate = null;
      window._atr = null;
      window._atw = null;
    }

    var addthisScript = document.createElement("script");

    addthisScript.setAttribute("src", "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-56d844031292d156");
    document.body.appendChild(addthisScript);

    var addthis_share = addthis_share || {};
    addthis_share = {
      passthrough: {
        twitter: {
          via: "clickasnap_",
        },
      },
      url_transforms: {
        shorten: {
          twitter: "bitly",
        },
      },
      shorteners: {
        bitly: {},
      },
    };
  }
}

jQuery(window).resize(function () {
  scroll_outer = jQuery(".masthead .panel .scroll-outer");
  scroll_outer.css("height", scroll_outer.width() - 74);
  resizeCatImages();
});

$(".explore").click(function () {
  resizeCatImages();
});

function resizeCatImages() {
  $(".nav .featured-category-img").height($(".nav .featured-category-img").width() * 0.56);
  var nrows = Math.round($("#mp-menu").height() / 40) - 8;
  $(".category-li").hide();
  for (i = 1; i < nrows; i++) {
    $(".category-li-" + i).show();
  }
}

jQuery(window).load(function ($) {
  obliterateIt(".adsbygoogle #abgc");
  obliterateIt(".adsbygoogle #cbc");
});

jQuery(window).resize(function ($) {
  obliterateIt("#abgc");
  obliterateIt("#cbc");
});

function set_embed_dialog() {
  var orig_width = 720;
  var orig_height = orig_width * embed_ratio + 80;
  $("#embed_w").val(orig_width);
  $("#embed_w").keyup(function () {
    set_embed_code($("#embed_w"));
  });
  $("#embed_h").keyup(function () {
    set_embed_code($("#embed_h"));
  });
  set_embed_code($("#embed_w"));
}

function set_embed_code(i) {
  var embed_code =
    '<iframe src="' +
    window.location.protocol +
    "//" +
    window.location.hostname +
    '/embed/<embed_key>" width="<embed_w>" height="<embed_h>" scrolling="no" frameborder="0" style="overflow: hidden; line-height: 0; display: block;" allowfullscreen></iframe>';

  if (i.attr("id") == "embed_w") {
    embed_w = i.val();
    embed_h = Math.ceil(embed_w * embed_ratio) + 80;
  } else {
    embed_h = i.val();
    embed_w = Math.ceil(embed_h / embed_ratio) + 80;
  }

  var ec = embed_code.replace("<embed_w>", embed_w);
  var ec = ec.replace("<embed_h>", embed_h);
  var ec = ec.replace("<embed_key>", embed_key);

  $("#embed_w").val(embed_w);
  $("#embed_h").val(embed_h);
  $("#embed_code").val(ec);

  $("#embed_w").click(function () {
    this.focus();
    this.select();
  });
  $("#embed_h").click(function () {
    this.focus();
    this.select();
  });
  $("#embed_code").click(function () {
    this.focus();
    this.select();
  });
}

function addLikeJS() {
  clear_ajax_listeners(".like_btn");
  clear_ajax_listeners(".like_form");

  $(".like_btn").click(function () {
    if ($(this).find("span").html() == "Liked") {
      $(this).find("span").html("Like");
      $(".global_like").find("span").html("Like");
    } else {
      $(this).find("span").html("Liked");
      $(".global_like").find("span").html("Liked");
    }
    var data2 = $(this).parents(".like_form").serialize();

    $.ajax({
      // create an AJAX call...
      data: $(this).parents(".like_form").serialize(), // get the form data
      type: $(this).parents(".like_form").attr("method"), // GET or POST
      url: $(this).parents(".like_form").attr("action"), // the file to call
      success: function (response) {
        // on success..
      },
    });
    return false;
  });
}

function addFollowJS() {
  clear_ajax_listeners(".follow_btn");
  clear_ajax_listeners(".follow_form");

  var session_follows = 0;

  $(".follow_btn").click(function () {
    var subscribers = parseInt($("#subscriber_count").html());

    if ($(this).hasClass("follow_remove")) {
      $(this).parents("li").remove();
    } else {
      if ($(this).find(".subscribe_text").html() == "Following") {
        $(this).find(".subscribe_text").html("Follow");
        subscribers -= 1;
      } else {
        $(this).find(".subscribe_text").html("Following");
        subscribers += 1;
      }
    }

    var follows = parseInt($("#follows").html()) + 1;

    $("#follows").html(follows);
    $("#to_follow").html(6 - follows);

    $.ajax({
      // create an AJAX call...
      data: $(this).parents(".follow_form").serialize(), // get the form data
      type: $(this).parents(".follow_form").attr("method"), // GET or POST
      url: $(this).parents(".follow_form").attr("action"), // the file to call
      success: function (response) {
        // on success..
        var $result = $(response).find(".subscriber_count");
        $(".subscriber_count").html(subscribers); // update the DIV
      },
    });

    if (follows > 5) {
      $("#to_follow_msg").hide();
      $("#continue").removeClass("hidden");
    }

    return false;
  });
}

function complete_profile_js() {
  $("#profile_submit").click(function () {
    let valid = true;
    let profile_name = $("#channel_title").val();
    let profile_url = $("#profile_url").val();

    if (profile_name == "") {
      $(".profile-name-error").show();
      valid = false;
    }

    if (profile_url == "" || !valid_username) {
      $(".profile-url-error").show();
      valid = false;
    }

    if (!valid) {
      $(window).scrollTop(0);
      return false;
    }

    $(this).val("Saving...");
    $(this).html("Saving...");
  });

  $("#channel_title").blur(function () {
    $(".profile-name-error").hide();
  });

  // disable continue when username is changed
  $("#profile_url").on('input', function() {
    $("#profile_submit").prop("disabled", true);
  });
  
  // when leaving the reg_username field, check for uniqueness
  $("#profile_url").focusout(function () {
    validate_username();
  });

  $(".username-check-message").click(function () {
    validate_username();
  });

  $("#profile_url").keyup(function() {
    $('.username-check-message').html('Check');
    $('.username-check-message').addClass('cs-button-primary');
    $('.username-check-message').removeClass('cs-button-grey');
    $('.username-check-message').removeClass('cs-button-success');
    $('.username-check-message').removeClass('cs-button-error');
  });
}

let valid_username = true;

function validate_username(){
  
  var username = $("#profile_url").val();
  var username = username.replace(" ", "");
  $(".profile-url-error").hide();

  $("#profile_url").val(username);
  var username_taken = $("#username_taken");
  var username_valid = $("#username_valid");
  var username_length = $("#username_length");

  if (username.length > 0) {

    // if username hasn't changed, enable the button
    if($('#profile_url').data('current-username') === username){
      $('.username-check-message').html('Valid');
      $('.username-check-message').removeClass('cs-button-primary');
      $('.username-check-message').removeClass('cs-button-grey');
      $('.username-check-message').removeClass('cs-button-error');
      $('.username-check-message').addClass('cs-button-success');
      $(".profile-url-error").hide();
      $("#profile_submit").prop("disabled", false);
      $('#profile_submit').val($('#profile_submit').data('original-label'));
      $('#profile_submit').html($('#profile_submit').data('original-label'));
      valid_username = true;
      return false;
    }

    if (!regex_encode.test(username)) {
      username_taken.text(LANG.checking_availability);
      $('#profile_submit').html("Verifying");
      $('#profile_submit').val("Verifying");
      $('.username-check-message').html('Checking');
      $('.username-check-message').removeClass('cs-button-primary');
      $('.username-check-message').removeClass('cs-button-success');
      $('.username-check-message').removeClass('cs-button-error');
      $('.username-check-message').addClass('cs-button-grey');

      if (regex_username.test(username)) {
        username_valid.html("<span class='valid'>✔︎</span> " + LANG.username_is_valid);
        $('.username-check-message').html('Checking');
        $('.username-check-message').addClass('cs-button-grey');
        $('.username-check-message').removeClass('cs-button-primary');
        $('.username-check-message').removeClass('cs-button-error');
        $('.username-check-message').removeClass('cs-button-success');

        $.getJSON(
          CI.base_url +
            "membership/ajax_membership/ajax_is_existing_unique_field/" +
            $.trim(encodeURIComponent(username)) +
            "/user/username",
          function (data) {
            if (data == null) {
              username_taken.html("<span class='invalid'>✘</span> " + LANG.username_exists);
              valid_username = false;
              $('#profile_submit').val($('#profile_submit').data('original-label'));
              $('#profile_submit').html($('#profile_submit').data('original-label'));
              $("#profile_submit").prop("disabled", false);
              $(".profile-url-error").show();
              $('.username-check-message').html('Taken');
              $('.username-check-message').removeClass('cs-button-primary');
              $('.username-check-message').removeClass('cs-button-grey');
              $('.username-check-message').removeClass('cs-button-success');
              $('.username-check-message').addClass('cs-button-error');
            } else {
              $("#profile_submit").prop("disabled", false);
              valid_username = true;
              $('.username-check-message').html('Valid');
              $(".profile-url-error").hide();
              $('.username-check-message').removeClass('cs-button-primary');
              $('.username-check-message').removeClass('cs-button-grey');
              $('.username-check-message').removeClass('cs-button-error');
              $('.username-check-message').addClass('cs-button-success');
              username_taken.html("<span class='valid'>✔︎</span> " + LANG.username_available);
              $('#profile_submit').val($('#profile_submit').data('original-label'));
              $('#profile_submit').html($('#profile_submit').data('original-label'));
            }
          },
        );
      } else {
        username_valid.html(LANG.is_valid_username);
        username_taken.html("");
        valid_username = false;
        $('.username-check-message').html('Checking');
        $('.username-check-message').removeClass('cs-button-primary');
        $('.username-check-message').addClass('cs-button-grey');
      }
    } else {
      username_valid.html(LANG.is_valid_username);
      username_taken.html("");
      valid_username = false;
      $('.username-check-message').html('Checking');
      $('.username-check-message').removeClass('cs-button-primary');
      $('.username-check-message').addClass('cs-button-grey');
    }
  }else{
    // if username is blank, hide warnings enable button so error is displayed when it's clicked
    username_taken.html("");
    username_length.html("");
    username_valid.html("");
    valid_username = true;
    $('#profile_submit').val($('#profile_submit').data('original-label'));
    $('#profile_submit').html($('#profile_submit').data('original-label'));
    $("#profile_submit").prop("disabled", false);
  }
}

function report(type, id) {
  $("#report_popup #report_id").val(id);
  $("#report_popup #report_type").val(type);

  if (type == "video") {
    $("#report_popup h2").html("Report image");
  } else if (type == "status") {
    $("#report_popup h2").html("Report status");
  } else {
    $("#report_popup h2").html("Report comment");
  }
}

function addPlaylistJS() {
  clear_ajax_listeners(".add_playlist_link");
  clear_ajax_listeners(".add_playlist");
  clear_ajax_listeners(".new_playlist_btn");
  clear_ajax_listeners(".new_playlist_form");

  var pl = $("#playlist_name").val();
  var pd = $("#playlist_description").val();
  var pi = $("#playlist_image").val();

  $("#playlist_name").val(pl);
  $("#playlist_description").val(pd);
  $("#playlist_image").val(pi);

  $(".new_playlist_btn").click(function () {
    if ($(this).data("image") != "") {
      $(".new_playlist_image").val($(this).data("image"));
    }
    $(".playlist_name").val("");
    $("#new_playlist").modal("show");
    $("#new_playlist").on("hidden.bs.modal", function () {
      $("#innerajax").removeClass("blur");
    });
    $("#innerajax").addClass("blur");
    return false;
  });

  $(".new_playlist_form").submit(function () {
    pl = $("#playlist_name").val();
    pd = $("#playlist_description").val();
    pi = $("#playlist_image").val();

    var image_ids = pi;
    var i = 0;
    $(".my-upload-selected").each(function () {
      if (i > 0) {
        image_ids += ",";
      }
      image_ids += $(this).attr("id");
      i++;
    });
    $("#image_ids").val(image_ids);

    var action = $(this).attr("action");

    $.ajax({
      // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr("method"), // GET or POST
      url: action, // the file to call
      success: function (response) {
        // on success..
        toastr.success("Added image to album '" + pl + "'.");
        $("#new_playlist").modal("hide");
        if ($.isNumeric(response)) {
          var album_id = response;
          $(".album_select").append(
            $("<option>", {
              value: album_id,
              text: pl,
            }),
          );
          $(".album_select").val(album_id);
          $(".album-dropdown-menu").append(
            '<li role="presentation"><a role="menuitem" tabindex="-1" class="tick_' +
              album_id +
              ' normal_link add_album ticked" data-album="' +
              album_id +
              '" data-album-name="' +
              pl +
              '"><img src="/assets/themes/clickasnap/images/icons/tick-blue.png" alt="tick" class="tick album-tick v-icon v-icon-16 v-tick">' +
              pl +
              "</a></li>",
          );
          $(".my-upload-selected").data("albums", $(".my-upload-selected").data("albums") + "," + album_id);
        } else {
          alert("There was an error creating the album. Please try again");
        }
      },
      error: function (response) {},
    });

    return false;
  });

  $(".add_playlist_link").click(function () {
    var text = $(this).text();
    var multi = false;
    var image_id = "";

    if ($(this).data("image_id") != "" && $(this).data("image_id") != null) {
      image_id = $(this).data("image_id");
    }

    $.ajax({
      // create an AJAX call...
      type: "GET", // GET or POST
      url: $(this).attr("href"), // the file to call
      success: function (response) {
        // on success..
        if (image_id != "") {
          var div = "#add_playlist_" + image_id;
          $(div).html($(response).find(".add_playlist").html()); // update the DIV
        } else {
          $(".add_playlist").html($(response).find(".add_playlist").html()); // update the DIV
        }
        if ($(response).find(".playlist_success").length > 0) {
          toastr.success("Added image to album '" + text + "'.");
        } else {
          toastr.success("Removed image from album '" + text + "'.");
        }
        addPlaylistJS();
      },
    });
    return false;
  });
}

function getURLParameter(url, name) {
  return (RegExp(name + "=" + "(.+?)(&|$)").exec(url) || [, null])[1];
}

function clear_ajax_listeners(div) {
  $(div).each(function (index) {
    $(div).unbind();
    var contents = $(this).html();
    var v_contents = $(this).val();
    $(this).html(contents);
    $(this).val(v_contents);
  });
}

/*
$('.status_form').submit(function(){
  $('#add_status').prop("disabled", true);
  $.ajax({ // create an AJAX call...
    data: $(this).serialize(), // get the form data
    type: $(this).attr('method'), // GET or POST
    url: $(this).attr('action'), // the file to call
    success: function(response) { // on success..
      var $result = $(response).find('#paginated').html();
      $('#paginated-wrapper').html($result); // update the DIV
      $('#status').val('');
      $('#add_status').prop("disabled", false);
    },
    error: function(response) {
    }
  });
  return false;
});*/

function addCommentJS() {
  clear_ajax_listeners(".ajax_form_result");
  clear_ajax_listeners(".feed_comments");
  clear_ajax_listeners(".show_comments");

  $(".show_comments").click(function () {
    $(".show_comments").show();
    $(this).hide();
    $(".feed_comments").hide();
    $(this).parents(".activity-item").find(".feed_comments").show();
    return false;
  });

  $(".reply-link").click(function () {
    var $id = $(this).data("cid");
    var $iid = $(this).data("iid");
    var $sid = $(this).data("sid");
    $(".comment-reply").remove();
    $(".reply-link").show();
    $(this).hide();
    $html = get_comment_reply($id, $iid, $sid);
    $($html).insertAfter($(this).parents(".comment").find(".comment-right"));
    addCommentJS();
    return false;
  });

  $(".ajax_btn").click(function () {
    $(this).prop("disabled", true);
    var id = $(this).parents(".ajax_form_result").attr("id");
    $.ajax({
      // create an AJAX call...
      data: $(this).parents(".ajax_form").serialize(), // get the form data
      type: $(this).parents(".ajax_form").attr("method"), // GET or POST
      url: $(this).parents(".ajax_form").attr("action"), // the file to call
      success: function (response) {
        // on success..
        if ($(".ajax_form_result").length > 1) {
          var $result = $(response)
            .find("#" + id)
            .html();
          if ($result == undefined || $result == "") {
            $result = $(response).find(".ajax_form_result").html();
          }
          $("#" + id).html($result); // update the DIV
        } else {
          var $result = $(response).find(".ajax_form_result").html();
          $(".ajax_form_result").html($result); // update the DIV
        }
        $(".ajax_btn").prop("disabled", false);
        $(".ajax_form textarea").val("");
        if ($("#recaptcha").length) {
          $("#recaptcha").empty();
          grecaptcha.render("recaptcha", {
            sitekey: "6LeiChoTAAAAANWqw7jSbfbMfYw2awxdrq66qtOU",
          });
        }
        addCommentJS();
      },
      error: function (response) {
        var response = response.responseJSON;
        if (response.message) {
          $(".ajax_form").find(".form-error").text(response.message);
          $(".ajax_btn").prop("disabled", false);
        }
      },
    });
    return false;
  });

  $(".delete_comment_btn").click(function () {
    var url = $(this).attr("href");
    var del = getURLParameter(url, "delete");
    $.ajax({
      // create an AJAX call...
      type: "GET", // GET or POST
      data: { delete: del },
      url: $("this").attr("href"), // the file to call
      success: function (response) {
        // on success..
        var $result = $(response).find(".comments");
        $(".comments").html($result); // update the DIV
        addCommentJS();
      },
    });
    return false;
  });
}

function scroll_content() {
  $(".panel .scroll").click(function () {
    var target = $(this).parent().find(".scroll-outer .scroll-inner");
    var height = target.height();
    var outer_height = target.parent().height();
    var amount = outer_height * 0.5;

    var top = target.css("top");
    top = top.replace("px", "");
    top = parseInt(top);

    if ($(this).hasClass("scroll-down")) {
      var new_top = top - amount;
    } else {
      var new_top = top + amount;
    }

    if (new_top > 0) {
      new_top = 0;
    } else if (new_top < -(height - outer_height)) {
      new_top = -(height - outer_height);
    }
    new_top += "px";

    target.animate({ top: new_top }, 125);
  });
}

function expandMobileMenu() {
  var opened = false;

  $("#mobile-main-menu-button").click(function () {
    if (opened) {
      opened = false;
      $("#page").animate({ "margin-left": "-=190" }, 400, "swing", function () {
        $(".mobile-main-menu-item").hide("slide", { direction: "left", easing: "swing" }, 400, function () {});
      });
      $("body").removeClass("no-scroll");
    } else {
      opened = true;
      $("#page").animate({ "margin-left": "+=190" }, 400, "swing", function () {});
      $(".mobile-main-menu-item").show("slide", { direction: "left", easing: "swing" }, 400, function () {});
      $("#header").addClass("open");
      $("body").addClass("no-scroll");
    }
  });
}

function mrMenu(button, target, action, speed, animation) {
  var button = $(button);
  var target = $(target);
  var action = action || "click";
  var s = speed || 125;
  var animation = animation || "slide";

  var animExp = "slideDown";
  var animCon = "slideUp";

  if (animation == "fade" || animation == "") {
    animExp = "fadeIn";
    animCon = "fadeOut";
  }

  var children = target.find("*");
  children.css("opacity", "0");

  var opened = false;

  button[action](function () {
    if (opened) {
      $("#page").removeClass("blur");
      children.animate(
        {
          opacity: 0,
        },
        s,
        function () {
          setTimeout(s);
          target[animCon](s);
        },
      );

      opened = false;
    } else {
      $("#page").addClass("blur");
      target[animExp](s, function () {
        setTimeout(s);
        children.animate(
          {
            opacity: 1,
          },
          s,
        );
      });

      opened = true;
    }
  });
}

var footer_opened = false;

function expandFooter() {
  var target = $(".footer-popup");

  $(".footer-icon").click(function () {
    if (footer_opened) {
      hideFooter();
    } else {
      showFooter();
    }
  });
}

function expandMediaDescription() {
  var container = $(".video-description");
  var arrow = $(".expand-arrow");

  var opened = false;
  arrow.click(function () {
    if (opened) {
      container.animate({ "max-height": "193px" }, 375);
      arrow.parent().find(".arrow-up").hide();
      arrow.parent().find(".arrow-down").show();
      opened = false;
    } else {
      container.animate({ "max-height": "999px" }, 375);
      arrow.parent().find(".arrow-up").show();
      arrow.parent().find(".arrow-down").hide();
      opened = true;
    }
  });
}

function obliterateIt() {
  var target = $(target);

  target.hide();
  target.css({
    display: "none !important",
    opacity: "0 !important",
    visibility: "hidden !important",
    height: "0 !important",
    width: "0 !important",
    zoom: "0 !important",
  });
}

var $smallgrid;

function initSmallJustice() {
  var reload = false;
  $("#loading_content").hide();
  if ($smallgrid != undefined) {
    reload = true;
    $smallgrid.justifiedGallery("norewind");
  } else {
    $smallgrid = $(".grid");
    var lastRow = "nojustify";
    $smallgrid.justifiedGallery({
      selector: ".justified-grid-item",
      margins: 10,
      rowHeight: 60,
      maxHeight: "300%",
      fixedHeight: false,
      captions: false,
      cssAnimation: true,
      imagesAnimationDuration: 1000,
      lastRow: lastRow,
    });
    $smallgrid.imagesLoaded().progress(function (instance, image) {
      var $item = $(image.img);
      $item.css({
        opacity: "1",
      });
    });
    $smallgrid.justifiedGallery().on("jg.complete", function () {
      $smallgrid.addClass("loaded");
      replace_thumbs();

      loading_content = false;
      $("#no_content").hide();
      $("#loading_content").hide();
      $("#more_content").show();
    });
  }
}

var $largegrid;

function initJustice() {
  var reload = false;
  $("#loading_content").hide();

  // reset items array
  var items = [];
  // each grid item
  $(".justified-grid-item").each(function () {
    if (items[$(this).data("id")]) {
      // remove dupe
      $(this).remove();
    } else {
      //add to array as doesn
      items[$(this).data("id")] = true;
    }
  });

  if ($largegrid != undefined) {
    reload = true;
    $largegrid.justifiedGallery("norewind");
  } else {
    $largegrid = $(".largegrid");
    var lastRow = "nojustify";
    $largegrid.justifiedGallery({
      selector: ".justified-grid-item",
      margins: 10,
      rowHeight: 200,
      maxHeight: "100%",
      fixedHeight: false,
      captions: false,
      cssAnimation: true,
      imagesAnimationDuration: 1000,
    });
    $largegrid.imagesLoaded().progress(function (instance, image) {
      var $item = $(image.img);
      $item.css({
        opacity: "1",
      });
    });
    $largegrid.justifiedGallery().on("jg.complete", function () {
      $largegrid.addClass("loaded");
      replace_thumbs();

      loading_content = false;
      $("#no_content").hide();
      $("#loading_content").hide();
      $("#more_content").show();

      adjustHPGrid();

      if ($("body").hasClass("category")) {
        var grid_total = $(".justified-grid-item").length;
        var i = 0;
        $(".justified-grid-item").each(function () {
          var gridTop = $(".largegrid").offset().top;
          var thisTop = $(this).offset().top;
          if (i > grid_total - 2 || (!ismobile && thisTop > gridTop + 300)) {
            $(this).hide();
          }
          i++;
        });
      }
    });
  }
}

function adjustHPGrid() {
  /*if($('body').hasClass('homepage')){
    var grid_total = $('.justified-grid-item').length;
    var i = 0;
    $('.justified-grid-item').each(function() {
      var gridTop = $('.largegrid').offset().top;
      var thisTop = $(this).offset().top;
      if(i>grid_total-2 || (!ismobile && thisTop > gridTop+800)) {
        $(this).hide();
      }
      i++;
    });
  }*/
}

var $masonrygrid;

function initMasonry() {
  if ($masonrygrid != undefined) {
    $masonrygrid.masonry("reloadItems");
  } else {
    $masonrygrid = $(".masonrygrid").masonry({
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer",
    });
    $masonrygrid.imagesLoaded().always(function () {
      $masonrygrid.masonry("layout");
    });
    $masonrygrid.masonry("on", "layoutComplete", function () {
      $masonrygrid.addClass("loaded");
    });
  }
}

var btn = $(".product-wrap");

var btnFront = $(".product-front"),
  btnYes = $(".product-back");

var w = $(".sizer").width(),
  h = $(".sizer").height();

btn.each(function (index, el) {
  $wrap = $(this);
  $(this)
    .find(".product-front")
    .click(function (event) {
      var mx = event.clientX - $(this).offset().left,
        my = event.clientY - $(this).offset().top;
      var directions = [
        { id: "top", x: w / 2, y: 0 },
        { id: "right", x: w, y: h / 2 },
        { id: "bottom", x: w / 2, y: h },
        { id: "left", x: 0, y: h / 2 },
      ];

      directions.sort(function (a, b) {
        return distance(mx, my, a.x, a.y) - distance(mx, my, b.x, b.y);
      });

      el.setAttribute("data-direction", "left");
      el.classList.add("is-open");
    });
});

btnYes.each(function (index, el) {
  $(this).click(function (event) {
    $(this).parent(".product-wrap").removeClass("is-open");
  });
});

function distance(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

if (quality == null) {
  var quality = 3; // 0 - 3
}
if (unsharpAmount == null) {
  var unsharpAmount = 100; // 50 - 100
}
if (unsharpRadius == null) {
  var unsharpRadius = 0.5; //  0.5 - 2.0
}
if (unsharpThreshold == null) {
  var unsharpThreshold = 125; // 0 - 255
}
if (alpha == null) {
  var alpha = true;
}

var qualityInfo = ["Box (win 0.5px)", "Hamming (win 1px)", "Lanczos (win 2px)", "Lanczos (win 3px)"];
var resizer;
var resizer_mode = {
  js: true,
  wasm: true,
  cib: true,
  ww: true,
};

function create_resizer() {
  var opts = [];
  Object.keys(resizer_mode).forEach(function (k) {
    if (resizer_mode[k]) opts.push(k);
  });
  resizer = window.pica({ features: opts });
}

function updateOrig(id, img) {
  var src, ctx;
  src = $(id)[0];

  if (src != null) {
    src.width = img.width;
    src.height = img.height;
    ctx = src.getContext("2d");
    ctx.drawImage(img, 0, 0);
  } else {
  }
  return true;
}

var updateResized = function (id, orig, img, width, settings) {
  var dst, ctx, width, start, time;
  dst = $(".dst-pica" + id)[0];

  if (dst != null) {
    dst.width = width;
    dst.height = (img.height * width) / img.width;
    var offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = dst.width;
    offScreenCanvas.height = dst.height;
    start = performance.now();

    thisquailty = settings["quality"];
    thisalpha = settings["alpha"];
    thisunsharpAmount = settings["unsharpAmount"];
    thisunsharpRadius = settings["unsharpRadius"];
    thisunsharpThreshold = settings["unsharpThreshold"];

    resizer
      .resize($(orig)[0], offScreenCanvas, {
        quality: thisquailty,
        alpha: thisalpha,
        unsharpAmount: thisunsharpAmount,
        unsharpRadius: thisunsharpRadius,
        unsharpThreshold: thisunsharpThreshold,
        transferable: true,
      })
      .then(function () {
        time = (performance.now() - start).toFixed(2);
        dst.getContext("2d", { alpha: Boolean(alpha) }).drawImage(offScreenCanvas, 0, 0);
        $(orig)[0].remove();
      });
    $("#" + id + "_thumb").css("background", "");
  }
};

resizer_mode.ww = false;
resizer_mode.cib = false;
resizer_mode.wasm = false;

function replace_recent() {
  clear_ajax_listeners(".replace_recent_img");
  create_resizer();
  setTimeout(function () {
    $(".replace_recent_img").each(function () {
      //  replace_thumb(this);
    });
  }, 4000);
}

function replace_thumbs() {
  clear_ajax_listeners(".replace_img");

  $(".replace_main_img").each(function () {
    if (ismobile) {
      this.src = $(this).data("mobile-img");
    }
  });

  $(".replace_img").each(function () {
    if (ismobile) {
      this.src = $(this).data("mobile-img");
    }
  });
}

var $grid;

function replace_thumb(itm) {
  return false;
}

var ismobile = false;

//FAQ
var currentSelected,
  mainHelp = $(".faqdetail"),
  helpTitle = $(".faqdetail .title h3"),
  helpInfo = $(".faqdetail .info p"),
  helpQuestion = $(".faqdetail .question p"),
  helpAnswer = $(".faqdetail .answer p");

$(".faqitems .item").click(function () {
  var el = $(this);

  if ($(window).width() > 991) {
    if (currentSelected) {
      currentSelected.removeClass("active");
    }

    $(".not-selected").removeAttr("style");

    // assign new selected element
    currentSelected = el;
    el.addClass("active");

    // assign question title
    helpTitle.text(currentSelected.find(".title").text());

    // assign question info
    helpInfo.html(currentSelected.find(".answer").html());
  } else {
    $("#faqmodal").find(".modal-title").html(el.find(".title").text());
    $("#faqmodal").find(".modal-body").html(el.find(".answer").html());
    $("#faqmodal").modal("show");
  }

  $("html, body").animate({ scrollTop: 0 }, "fast");

  return false;
});

var notSaved = function () {
  return "You have some unsaved changes";
};

var canexit = true;
function setExitBind(v) {
  if (v) {
    if (canexit) {
      $(window).bind("beforeunload", notSaved);
      canexit = false;
    }
  } else {
    $(window).unbind("beforeunload", notSaved);
  }
}

i = 0;
setInterval(function () {
  i = ++i % 4;
  $(".loading_txt").html(Array(i + 1).join("."));
}, 500);

if ($(window).width() < 768) {
  ismobile = true;
}

if (!ismobile) {
  initApp();
}

$(window).resize(function () {
  resize_image();
});

$(document).ready(function () {
  if ($("body").hasClass("homepage") || $("body").hasClass("category") || ismobile) {
    initApp();
  }
  /* tooltips */
  $('[data-toggle="tooltip"]').tooltip();
});
