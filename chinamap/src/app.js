define(["json!web/data.json"],function(a){var t=function(){};return t.draw=function(){$(function(){$("#container").highcharts("Map",{title:{text:"2015年942万人报名高考 各省高考人数汇总排行"},subtitle:{text:'<a href="#">map china</a>'},mapNavigation:{enabled:!0,buttonOptions:{verticalAlign:"bottom"}},colorAxis:{min:2e4,max:8e5},series:[{data:a,mapData:Highcharts["countries/cn/custom/cn-all-china"],joinBy:"hc-key",name:"Random data",states:{hover:{color:"#BADA55"}},dataLabels:{enabled:!0,format:"{point.properties.cn-name}"}}]})})},t});