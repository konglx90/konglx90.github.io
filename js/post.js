$(document).ready(function() {

    var isMobile = {
        Android: function() { return navigator.userAgent.match(/Android/i); },
        BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
        iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
        Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
        Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
        any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
    };

    // 为文章外链添加 target="_blank" 和 external 样式
    $('.entry a').each(function(index, element) {
        var href = $(this).attr('href');
        if (!href) return;

        if (href.indexOf('#') === 0) return;
        if (href.indexOf('/') === 0 || href.toLowerCase().indexOf('beiyuu.com') > -1) return;
        if ($(element).has('img').length) return;

        $(this).attr('target', '_blank');
        $(this).addClass('external');
    });

    // 自动生成文章目录（仅桌面端，h2 数量 > 2 时）
    (function() {
        if (isMobile.any()) return;

        function initHeading() {
            var h2 = [];
            var h3 = [];
            var h2index = 0;

            $.each($('.entry h2, .entry h3'), function(index, item) {
                var id = 'menuIndex' + index;
                item.id = id;

                if (item.tagName.toLowerCase() === 'h2') {
                    h2.push({ name: $(item).text(), id: id });
                    h2index++;
                } else {
                    if (!h3[h2index - 1]) h3[h2index - 1] = [];
                    h3[h2index - 1].push({ name: $(item).text(), id: id });
                }
            });

            return { h2: h2, h3: h3 };
        }

        function genTmpl() {
            var h1txt = $('h1').text();
            var tmpl = '<ul><li class="h1"><a href="#">' + h1txt + '</a></li>';
            var heading = initHeading();

            for (var i = 0; i < heading.h2.length; i++) {
                tmpl += '<li><a href="#" data-id="' + heading.h2[i].id + '">' + heading.h2[i].name + '</a></li>';
                if (heading.h3[i]) {
                    for (var j = 0; j < heading.h3[i].length; j++) {
                        tmpl += '<li class="h3"><a href="#" data-id="' + heading.h3[i][j].id + '">' + heading.h3[i][j].name + '</a></li>';
                    }
                }
            }
            tmpl += '</ul>';
            return tmpl;
        }

        if ($('.entry h2').length < 3) return;

        var tmpl = genTmpl();
        $('#content').append('<div id="menuIndex" class="sidenav"></div>');
        $('#menuIndex')
            .append($(tmpl))
            .on('click', 'a', function(e) {
                e.preventDefault();
                var selector = $(this).attr('data-id') ? '#' + $(this).attr('data-id') : 'h1';
                var scrollNum = $(selector).offset().top;
                $('body, html').animate({ scrollTop: scrollNum - 30 }, 400, 'swing');
            });

        // 计算目录位置并高亮当前章节
        $(window).on('load', function() {
            var scrollTop = [];
            $('#menuIndex li a').each(function() {
                var selector = $(this).attr('data-id') ? '#' + $(this).attr('data-id') : 'h1';
                scrollTop.push($(selector).offset().top);
            });

            var menuIndexTop = $('#menuIndex').offset().top;
            var menuIndexLeft = $('#menuIndex').offset().left;

            $(window).on('scroll', function() {
                var nowTop = $(window).scrollTop();
                var length = scrollTop.length;
                var index;

                if (nowTop + 20 > menuIndexTop) {
                    $('#menuIndex').css({ position: 'fixed', top: '20px', left: menuIndexLeft });
                } else {
                    $('#menuIndex').css({ position: 'static', top: 0, left: 0 });
                }

                if (nowTop + 60 > scrollTop[length - 1]) {
                    index = length;
                } else {
                    for (var i = 0; i < length; i++) {
                        if (nowTop + 60 <= scrollTop[i]) {
                            index = i;
                            break;
                        }
                    }
                }

                $('#menuIndex li').removeClass('on');
                $('#menuIndex li').eq(index - 1).addClass('on');
            });

            $(window).on('resize', function() {
                $('#menuIndex').css({ position: 'static', top: 0, left: 0 });
                menuIndexTop = $('#menuIndex').offset().top;
                menuIndexLeft = $('#menuIndex').offset().left;
                $(window).trigger('scroll');
                $('#menuIndex').css('max-height', $(window).height() - 80);
            });
        });

        $('#menuIndex').css('max-height', $(window).height() - 80);
    })();
});
