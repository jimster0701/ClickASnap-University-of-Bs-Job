
$('.update_price').click(function(){
  var min_price = $('.min_price').html().replace('£', '');
  var price = $('.product_price').val().replace('£', '');
  price = price.replace(/[^0-9\.]/g, '');
  min_price = min_price.replace(/[^0-9\.]/g, '');

  if(parseFloat(price) < parseFloat(min_price)) {
    alert('You must enter a price higher than £'+min_price);
  }else{
    $.ajax({
      type:"POST",
      data:{ 'product_price' : $('.product_price').val()},
      success:function(resp){
        toastr.success('Product price updated.');
      }
    });
  }

  return false;
});

function crop_btns(mc){
  var el = mc.parents('.crop_item');
  el.find('.confirm-crop').on('click', function (ev) {
    mc.croppie('result', {
      type: 'rawcanvas',
      enableZoomboolean: false,
      format: 'png'
    }).then(function (canvas) {
      showImage(canvas.toDataURL(), el);
    });
    return false;
  });

  var el = mc.parents('.crop_item');
  el.find('.confirm-crop-user').on('click', function (ev) {
    mc.croppie('result', {
      type: 'rawcanvas',
      enableZoomboolean: false,
      format: 'png'
    }).then(function (canvas) {
      showImage(canvas.toDataURL(), el);
    });
    return false;
  });

  el.find('.edit-crop').on('click', function (ev) {
    mc.parents('.crop_item').find('.cropped-image-wrapper').hide();
    mc.parents('.crop_item').find('.crop-container').show();
    mc.parents('.crop_item').find('.instructions').show();
    mc.parents('.crop_item').find('.crop-container').removeClass('hidden-crop');
    mc.parents('.crop_item').find('.image_display').hide();
    mc.parents('.crop_item').find('.confirm-crop').show();
    mc.parents('.crop_item').find('.edit-crop').hide();
    mc.parents('.crop_item').find('.uncroped_status').show();
    mc.parents('.crop_item').find('.croped_status').hide();
    mc.parents('.crop_item').find('.crop_wrapper').removeClass('not-valid');
    addWarning();
    return false;
  });

}

function initCrop(itm, rotate = false, init=false) {

  var div_html = $(itm).html();
  $(itm).html(div_html);

  var mc = $(itm).find('.demo-cropper');

  var w = mc.data('product-width');
  var h = mc.data('product-height');

  if(init){
    var idw = $(itm).find('.image_display').width();
    var idh = $(itm).find('.image_display').height();
    $(itm).find('.image_display').width(idh);
    $(itm).find('.image_display').height(idw);
    var pw = $(itm).find('.p_w').val();
    var ph = $(itm).find('.p_h').val();
  }

  if(mc.parents('.crop_item').find('.rotated').val() == "1") {
    if(rotate){
      mc.parents('.crop_item').find('.rotated').val('0');
      mc.parents('.crop_item').find('.rotate_crop').data('rotated', '0');
      var w2 = w;
      w = h;
      h = w2;
    }
  }else{
    if(rotate){
      mc.parents('.crop_item').find('.rotated').val('1');
      mc.parents('.crop_item').find('.rotate_crop').data('rotated', '1');
      var w2 = w;
      w = h;
      h = w2;
    }
  }

  if(w > 500){
    var diff = 500/w;
    w *= diff;
    h *= diff;
  }
  if(rotate){
    $(itm).find('.p_w').val(ph);
    $(itm).find('.p_h').val(pw);
    $(itm).find('.image_display').width(idh);
    $(itm).find('.image_display').height(idw);
  }

  mc.croppie({
    viewport: {
      width: w,
      height: h
    },
    boundary: {
      width: w,
      height: h
    },
  });

  crop_btns(mc);

  mc.parents('.crop_item').find('.rotate_crop').click(function(){
    var orig_item = $(this).parents('.crop_item').find('.crop-init').html();
    orig_item = orig_item.replace("new-img", "demo-cropper");
    $(this).parents('.crop_item').find('.croppie-container').remove();
    $(this).parents('.crop_item').find('.crop-container').prepend(orig_item);
    var new_img =  $(this).parents('.crop_item').find('.crop-container').find('.demo-cropper');
    var rotated = $(this).data('rotated');
    if(rotated == "0") {
      initCrop($(this).parents('.crop_item'), true, true);
    }else{
      initCrop($(this).parents('.crop_item'), false, true);
    }
    return false;
  });

}

function addCrop() {
  $('#crop_count').html(parseInt($('#crop_count').html())+1);
  removeWarning();
}
function removeCrop() {
  $('#crop_count').html(parseInt($('#crop_count').html())-1);
  setProceed();
}
function removeWarning(){
  $('#crop_warnings').html(parseInt($('#crop_warnings').html())-1);
  setProceed();
}
function addWarning() {
  $('#crop_warnings').html(parseInt($('#crop_warnings').html())+1);
  $('#crop_count').html(parseInt($('#crop_count').html())-1);
  setProceed();
  //
}
function setProceed(){
  if(parseInt($('#crop_warnings').html()) == 0){
    $('.proceed-btn-hidden').show();
    $('.proceed-btn-fake').hide();
  }else{
    $('.proceed-btn-hidden').hide();
    $('.proceed-btn-fake').show();
  }
}

function removeElement(el){
  if(el.find('.crop_wrapper').hasClass('not-valid')){
    removeCrop();
  }else{
    removeWarning();
  }
  el.remove();
}

function initProductRemove(){
  $('.remove-crop').on('click', function (ev) {
    removeElement($(this).parents('.crop_item'));
    setProceed();
    return false;
  });
  $('.remove-crop-product-btn').on('click', function (ev) {
    $(this).parents('.review_product').find('.crop_item').each(function(index) {
      removeElement($(this));
    });
    $(this).parents('.review_product').remove();
    setProceed();
    return false;
  });
}

function showImage(img, el){

  var image = el.find('.cr-image');
  var transform = image.css("transform");
  var transform_o = image.css("transform-origin");
  var transform_data = transform.replace("matrix(", "").replace(")", "").split(',');
  var zoomx = transform_data[0];
  var zoomy = transform_data[3];

  el.find('.crop_wrapper').addClass('not-valid');

  addCrop();

  el.find('.uncropped_status').hide();
  el.find('.cropped_status').show();
  el.find('.instructions').hide();

  var overlay = el.find('.cr-overlay');
  var product = el.find('.cr-viewport');
  var x = parseFloat(overlay.css('left').replace("px", ""));
  var y = parseFloat(overlay.css('top').replace("px", ""));
  var image_w = parseFloat(overlay.css('width').replace("px", ""));
  var image_h = parseFloat(overlay.css('height').replace("px", ""));
  var product_w = parseFloat(product.css('width').replace("px", ""));
  var product_h = parseFloat(product.css('height').replace("px", ""));

  var iw = $(el).find('.image_display').width();
  var ih = $(el).find('.image_display').height();

  if(iw > 500){
    var diff = 500/iw;
    iw *= diff;
    ih *= diff;
    $(el).find('.image_display').width(iw);
    $(el).find('.image_display').height(ih);
  }

  var xval = -x;
  var yval = -y;

  var x_perc = (xval/image_w);
  var y_perc = (yval/image_h);
  var w_perc = (product_w/image_w);
  var h_perc = (product_h/image_h);

  el.find('.crop_x').val(x_perc);
  el.find('.crop_y').val(y_perc);
  el.find('.crop_w').val(w_perc);
  el.find('.crop_h').val(h_perc);
  el.find('.relative_w').val(w_perc*el.find('.img_w').val());
  el.find('.relative_h').val(h_perc*el.find('.img_h').val());
  el.find('.relative_dpi').val(el.find('.relative_w').val()/el.find('.p_w').val());
  el.find('.zoom').val(zoomx);

  /*el.find('.image_display_2 img').css('zoom', zoomx);
  el.find('.image_display_2 img').css('top', yval+'px');
  el.find('.image_display_2 img').css('left', xval+'px');*/
  el.find('.image_display').html('<img src="'+img+'" />');
  el.find('.image_display').show();
  el.find('.crop-container').hide();
  el.find('.confirm-crop').hide();
  //el.find('.edit-crop').show();



  var cropdata = [];
  cropdata['x_perc'] = x_perc;
  cropdata['y_perc'] = y_perc;
  cropdata['w_perc'] = w_perc;
  cropdata['h_perc'] = h_perc;
  cropdata['zoom'] = zoomx;
  var relative_w = w_perc*el.find('.img_w').val();
  cropdata['relative_w'] = relative_w;
  cropdata['relative_h'] = h_perc*el.find('.img_h').val();
  cropdata['relative_dpi'] = relative_w/el.find('.p_w').val();

  $('#crop_popup').modal('hide');

  //add_cart(pid);
  add_cart(pid,false,false,false,false,cropdata)


}

$('.cr-slider').change(function(){
  $(this).attr({"max" : $(this).parents('.crop_item').find('.max_zoom').val()});
  var image_w = parseFloat($(this).parents('.crop_item').find('.cr-overlay').css('width').replace("px", ""));
  var product_w = parseFloat($(this).parents('.crop_item').find('.cr-viewport').css('width').replace("px", ""));
  var w_perc = parseFloat(product_w/image_w);
  var relative_w = w_perc*parseFloat($(this).parents('.crop_item').find('.img_w').val());
  var p_w = parseFloat($(this).parents('.crop_item').find('.p_w').val());
  $(this).parents('.crop_item').find('.relative_dpi').val(parseFloat(relative_w/p_w));

});

$( document ).ready(function() {
  $( ".crop_item" ).each(function( index ) {
    initCrop(this);
  });
  initProductRemove();
});
