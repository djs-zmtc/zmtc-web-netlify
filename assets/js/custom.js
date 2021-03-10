// Check to see if the window is top if not then display button
$(window).scroll(function() {
    if ($(this).scrollTop()) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
  
  // Click event to scroll to top
  $('#back-to-top').click(function() {
    $('html, body').animate({scrollTop: 0}, 1000);
    return false;
  });

  $.fn.exists = function(callback) {
    var args = [].slice.call(arguments, 1);
    if (this.length) {
      callback.call(this, args);
    }
    return this;
  }

  window.onload = function() {
    var group, i, tocexp, toccol;
    group = document.querySelectorAll('#TableOfContents ul ul');
    tocexp = document.querySelector('#toc-expand');
    toccol = document.querySelector('#toc-collapse');
    for (i = 0; i < group.length; ++i) {
      tocexp.style.display = 'inline';
    }
  }
    // $('#TableOfContents ul ul').exists(function() {
    //   tocexp = document.querySelector('#toc-expand');
    //   toccol = document.querySelector('#toc-collapse');
    //   tocexp.style.display = 'inline';
    //   toccol.style.display = 'none';
    // });
  
  $('#toc-expand').click(function() {
    // var newstyle = document.createElement('style');
    var group, i, tocexp, toccol;
    group = document.querySelectorAll('#TableOfContents ul ul');
    tocexp = document.querySelector('#toc-expand');
    toccol = document.querySelector('#toc-collapse');
    for (i = 0; i < group.length; ++i) {
      group[i].style.display = 'block';
    }
    tocexp.style.display = 'none';
    toccol.style.display = 'inline';
  });  

  $('#toc-collapse').click(function() {
    // var newstyle = document.createElement('style');
    var group, i, tocexp, toccol;
    group = document.querySelectorAll('#TableOfContents ul ul');
    tocexp = document.querySelector('#toc-expand');
    toccol = document.querySelector('#toc-collapse');
    for (i = 0; i < group.length; ++i) {
      group[i].style.display = 'none';
    }
    tocexp.style.display = 'inline';
    toccol.style.display = 'none';
  });  