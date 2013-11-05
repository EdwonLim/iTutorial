(function($) {

    var markdown = {}, hljs;

    $Import('markdown');
    $Import('highlight');

    // Default Options
    var defaultOptions = {
        content : '',
        pages : {}
    };

    // Browser Type
    var browserType = (function() {
        return (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|IEMobile/i) || ['desktop'])[0].toLowerCase();
    })();

    // Animate?
    var canAnimate = function() {
        return (browserType == 'desktop' || browserType == 'ipad') && $(window).width() >= 1000;
    };

    // Page Mini Width
    var dWidth = browserType == 'desktop' ? 8 : 3;

    // Get Random Color.
    var getRandomColor = function() {
        while (true) {
            var r = parseInt(Math.random() * 255),
                g = parseInt(Math.random() * 255),
                b = parseInt(Math.random() * 255),
                z = r * 0.299 + g * 0.587 + b * 0.114;
            if (z > 192) {
                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
            }
        }
    };

    var pages = [], total = 0, contentData = [], options = defaultOptions;

    // Create Page
    var makePage = function(index) {
        var content = $('<div class="page page' + index + '">' + contentData[index] + '</div>'),
            isCover = options.pages[index] && options.pages[index].cover,
            page = content.css('z-index', (index + 1) * 10).appendTo($(document.body));
        if (content.css('background-color') == 'rgba(0, 0, 0, 0)' || content.css('background-color') == 'transparent') {
            content.css('background-color', getRandomColor());
        }
        if (isCover) {
            page.addClass('cover');
        }
        pages.push(page);
    };

    // Animate Page

    var curPage = 0;

    var gotoPage = function(ani) {
        if (curPage < 0) {
            curPage = 0;
        } else if (curPage >= total) {
            curPage = total - 1;
        }
        if (canAnimate()) {
            for (var i = 0; i < total; i ++) {
                if (i <= curPage) {
                    pages[i][ani ? 'animate' : 'css']({
                        left : i * dWidth
                    }, 500);
                } else {
                    pages[i][ani ? 'animate' : 'css']({
                        left : $(window).width() - (total - i) * dWidth
                    }, 500);
                }
            }
        } else {
            if (ani) {
                $(document.body).animate({
                    scrollTop : pages[curPage].offset().top
                }, 500);
            } else {
                $(document.body).scrollTop(pages[curPage].offset().top);
            }
        }
    };

    var bindClick = function() {
        var canClick = true;
        for (var i = 0; i < total; i ++) {
            (function(index) {
                pages[index].click(function(e){
                    if (canClick) {
                        canClick = false;
                        if (curPage == index) {
                            if (e.clientX - pages[curPage].offset().left > pages[curPage].width() / 6) {
                                curPage ++;
                            } else {
                                curPage --;
                            }
                        } else {
                            curPage = index;
                        }
                        gotoPage(true);
                        setTimeout(function(){
                            canClick = true;
                        }, 500);
                    }
                });
            })(i);
        }
    };

    var bindTouch = function() {
        var start = 0, next = true;
        $(document.body).bind('touchstart', function(e){
            var x = e.originalEvent.pageX;
            start = x, next = false;
            e.preventDefault();
        });
        $(document.body).bind('touchmove', function(e){
            var x = e.originalEvent.pageX;
            if (!next && Math.abs(x - start) > 100) {
                next = true;
                if (x - start > 0) {
                    curPage --;
                } else {
                    curPage ++ ;
                }
                gotoPage(true);
            }
        });
    };

    var aniPage = function() {
        $(document.body).addClass('ani');
        $('.page').height($(window).height() - 100);
        $('.page').width($(window).width() - 100 - (total - 1) * dWidth);
        if (browserType == 'ipad') {
            bindTouch();
        } else {
            bindClick();
        }
    };

    var removeAni = function() {
        $(document.body).removeClass('ani');
        for (var i = 1; i < total; i ++) {
            pages[i].unbind('click');
        }
    };

    // Fix code to highlight.
    var fixCode = function() {
        $('code').addClass('block');
        $('pre code').removeClass('block');
        var codes = $('.page pre code');
        for (var i = 0, l = codes.length; i < l; i ++) {
            var code = codes.eq(i), obj, code_type = code.parents('.page').attr('data-code-type');
            if (code_type) {
                obj = hljs.highlight(code_type, code[0].innerHTML);
            } else {
                obj = hljs.highlightAuto(code[0].innerHTML);
            }
            codes.eq(i).addClass(obj.language);
            codes.eq(i)[0].innerHTML = obj.value;
        }
    };

    // Fix Page.
    var fixPage = function() {
        $('.page').css('min-height', $(window).height() - 100);
        $('.page').width($(window).width() - 100);
        if (canAnimate()) {
            aniPage();
        }
        pages[0] && pages[0].addClass('cover');
        pages[total - 1] && pages[total - 1].addClass('cover');
    };

    // Fix Content.
    var fixContent = function() {
        if (/^<pre><code>(?:.|[\r\n])*?<\/code><\/pre>$/.test(contentData[total - 1])){
            total --;
            var str = contentData.pop().replace(/[\r\n\s]/ig, '');
            str = str.substring(11, str.length - 13);
            if ($('content_style').length) {
                $('content_style').html(str);
            } else {
                $('<style id="content_style" type="text/css">' + str + '</style>').appendTo('head');
            }
        }
    };

    // Initialize.
    var initialize = function() {
        $('body').removeClass('start');
        $('body .gs').remove();
        fixContent();
        pages.length = 0;
        $('body .page').remove();
        for(var i = 0; i < total; i ++) {
            makePage(i);
        }
        fixCode();
        fixPage();
        gotoPage(false);
    };

    // Execute Data.
    var execData = function(data) {
        var arr = markdown.toHTML(data).split('<hr>');
        for (var i = 0, l = arr.length; i < l; i ++) {
            arr[i] = arr[i].replace(/<\/hr>/g, '').replace(/\n+$/g, '').replace(/^\n+/g, '');
        }
        return arr;
    };

    // Get Start.
    var gotoUrl = function() {
        var url = $('.upload .url').val() || 'http://edwon.me/xproject/itutorial/content.md';
        location.href = location.origin + location.pathname + '?md=' + url;
    };

    var getStart = function() {
        if (browserType == 'desktop') {
            $('.upload .btn').click(function() {
                gotoUrl();
            });
            if (FileReader) {
                $(".upload .uploadFile").change(function(evt){
                    var file = evt.target.files[0];
                    var fr = new FileReader();
                    fr.onload = function(e) {
                        var data = e.target.result;
                        contentData = execData(data);
                        total = contentData.length;
                        initialize();
                    };
                    fr.readAsText(file);
                });
                $('.upload')[0].addEventListener('drop', function(e){
                    var fileList = e.dataTransfer.files;
                    if (fileList.length == 1) {
                        var file = fileList[0];
                        var fr = new FileReader();
                        fr.onload = function(e) {
                            var data = e.target.result;
                            contentData = execData(data);
                            total = contentData.length;
                            initialize();
                        };
                        fr.readAsText(file);;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                }, false);
                $(document).on({
                    dragleave : function(e){
                        e.preventDefault();
                    },
                    drop : function(e){
                        e.preventDefault();
                    },
                    dragenter : function(e){
                        e.preventDefault();
                    },
                    dragover : function(e){
                        e.preventDefault();
                    }
                });
            } else {
                $('.upload .uploadBtn').hide();
                $('.upload').css('border', 'none');
            }
        } else if ( browserType == 'ipad') {
            $('.upload .btn').bind('touchstart', function() {
                gotoUrl();
            });
            $('.upload .uploadBtn').hide();
            $('.upload').css('border', 'none');
        } else {
            location.href = 'http://edwon.me/xproject/itutorial/getstart.html';
        }
    };

    // Main Function.
    var iTutorial = function(opt) {
        options = $.extend(defaultOptions, opt);
    };

    iTutorial.setPages = function(pageSetting) {
        options = $.extend(defaultOptions, {pages : pageSetting});
        initialize();
    };

    iTutorial.setData = function(data) {
        curPage = 0;
        contentData = execData(data);
        total = contentData.length;
        initialize();
    };

    $.iTutorial = iTutorial;

    // Start.
    $(document).ready(function() {
        options.content = options.content || $(document.body).attr('content');
        if (options.content && window.location.href.indexOf('http://') !== -1) {
            $.ajax({
                url : options.content,
                success : function(data) {
                    contentData = execData(data);
                    total = contentData.length;
                    initialize();
                },
                error : function() {
                    getStart();
                }
            });
        } else if (options.content && $('code[id=' + options.content.split('.')[0] + ']').length) {
            contentData = execData($('code[id=' + options.content.split('.')[0] + ']')[0].innerHTML);
            total = contentData.length;
            initialize();
        } else if (/[?&]md=/.test(window.location.search)) {
            var md = window.location.search.match(new RegExp("[?&]md=([^&]*)(&|$)"))[1];
            $.getJSON('http://itutorial.sinaapp.com/get.php?url=' + md + '&callback=?', function(data) {
                contentData = execData(data);
                total = contentData.length;
                initialize();
            });
        } else {
            getStart();
        }
    });

    // Execute Resize Event.
    var timer = null;
    $(window).resize(function(){
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
            if (!canAnimate()) {
                removeAni();
            }
            fixPage();
            for (var i = 0; i < total; i ++) {
                pages[i].css('left', 0);
                pages[i].css('height', 'auto');
            }
            gotoPage(false);
            timer = null;
        }, 100);
    });

    // Execute Key Event.
    $(document).keyup(function(e){
        if (e.keyCode == 37 || e.keyCode == 38) {
            curPage --;
            gotoPage(true);
        } else if (e.keyCode == 39 || e.keyCode == 40) {
            curPage ++;
            gotoPage(true);
        }
    });


})(jQuery);