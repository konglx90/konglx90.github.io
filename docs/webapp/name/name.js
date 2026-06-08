/**
 * Created by kong90 on 16-5-28.
 */
$(function () {

    var count_words,
        count_words_items,
        famliy_words;

    // 将名字渲染到浏览器上
    var drawName = function (start, end) {
        // 计算时间
        console.time("addString");
        html += '<tr><td>' + data[i] + '</td><td>' + data[i + 1] + '</td><td>' + data[i + 2] + '</td><td>' + data[i + 3] + '</td><td>' + data[i + 4] + '</td></tr>';
        console.timeEnd("addString");
        $('#table tbody').append(html);
    };

    // 柱状图, 画出名字字数不同个数
    function drawCountWords(items, data) {

        var min = d3.min(data),
            max = d3.max(data);

        var linear = d3.scale.linear()  // 线性比例尺
            .domain([min, max])
            .range([1, 900]);

        var axis = d3.svg.axis()      // 坐标轴
            .scale(linear)      //指定比例尺
            .orient("bottom")   //指定刻度的方向
            .ticks(7);          //指定刻度的数量

        function render(data) { // <- B
            var width = 900;  //画布的宽度
            var height = 300;   //画布的高度

            var svg = d3.select("body")     //选择文档中的body元素
                .append("svg")          //添加一个svg元素
                .attr("width", width)       //设定宽度
                .attr("height", height);    //设定高度

            var rectHeight = 25;   //每个矩形所占的像素高度(包括空白)

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", 20)
                .attr("y", function (d, i) {
                    return i * rectHeight;
                })
                .attr("width", function (d) {
                    return linear(d);
                })
                .attr("height", rectHeight - 2)
                .attr("fill", "steelblue");

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(20,130)")
                .call(axis);
        }

        render(data);
    }

    // 圆饼图
    function drawFamilyName(data) {

        var datas = data;
        // 改变文字标识的x坐标
        var txt_transform = [0.9, 1.2, 1.5, 1.8, 2.2, 2.5];
        var line_transform = [0.9, 1.2, 1.5, 1.8, 2.2, 2.5];

        function render(dataset) {

            var width = 600, height = 300;
            // 创建一个分组用来组合要画的图表元素
            var main = d3.select('.container svg').append('g')
                .classed('main', true)
                .attr('transform', "translate(" + width / 2 + ',' + height / 2 + ')');

            // 转换原始数据为能用于绘图的数据
            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                });
            // pie是一个函数
            var pieData = pie(dataset);
            // 创建计算弧形路径的函数
            var radius = 100;
            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);
            var outerArc = d3.svg.arc()
                .innerRadius(1.2 * radius)
                .outerRadius(1.2 * radius);
            var oArc = d3.svg.arc()
                .innerRadius(1.1 * radius)
                .outerRadius(1.1 * radius);
            var slices = main.append('g').attr('class', 'slices');
            var lines = main.append('g').attr('class', 'lines');
            var labels = main.append('g').attr('class', 'labels');
            // 添加弧形元素（g中的path）
            var arcs = slices.selectAll('g')
                .data(pieData)
                .enter()
                .append('path')
                .attr('fill', function (d, i) {
                    return getColor(i);
                })
                .attr('d', function (d) {
                    return arc(d);
                });
            // 添加文字标签
            var texts = labels.selectAll('text')
                .data(pieData)
                .enter()
                .append('text')
                .attr('dy', '0.35em')
                .attr('fill', function (d, i) {
                    return getColor(i);
                })
                .text(function (d, i) {
                    return d.data.name;
                })
                .style('text-anchor', function (d, i) {
                    return midAngel(d) < Math.PI ? 'start' : 'end';
                })
                .attr('transform', function (d, i) {
                    // 找出外弧形的中心点
                    var pos = outerArc.centroid(d);
                    // 改变文字标识的x坐标
                    pos[0] = radius * (midAngel(d) < Math.PI ? txt_transform.pop() : -txt_transform.pop());

                    return 'translate(' + pos + ')';
                })
                .style('opacity', 1);

            var polylines = lines.selectAll('polyline')
                .data(pieData)
                .enter()
                .append('polyline')
                .attr('points', function (d) {
                    return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
                })
                .attr('points', function (d) {
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * (midAngel(d) < Math.PI ? line_transform.pop() : -line_transform.pop());
                    return [oArc.centroid(d), outerArc.centroid(d), pos];
                })
                .style('opacity', 0.5);

            function midAngel(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            function getColor(idx) {
                var palette = [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ];
                return palette[idx % palette.length];
            }

        }

        render(datas);
    }


    count_words = $('#count-words').data('count-words');
    count_words_items = ["一字名", "两字名", "三字名", "四字名"];
    famliy_words = $('#count-family-names').data('family-name');
    drawCountWords(count_words_items, count_words);
    drawFamilyName(famliy_words);


});