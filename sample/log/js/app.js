document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    J.hideMask();
}
$(function(){
    Jingle.launch({
        showWelcome : false
    });
    var app = new App();
    app.init();
});

var App = function(){
    var context = 'local', $footer,$article,$progress,log,_this = this,local_analy;
    this.init = function(){
        $footer = $('#analy_section footer a');
        $article = $('#analy_section article');
        $progress = $('#file_upload_progress');

        local_analy = App.prototype.anlaysis;
        try{
            _init_migrator();
        }catch(e){
            console.log(e);
        }
        $('#btn_log_upload').on('change',_handler);
        $('#btn_analy').on('tap',function(){
            if($(this).parent().attr('id') == 'analy_btn_container_center'){
                $(this).animate({
                    opacity:0.8,
                    translate3d:'-100%,-100px,0',
                    scale :0.9
                },100,'linear',function(){
                    $(this).attr('style','padding:16px 20px').appendTo('#analy_btn_container');
                    $('#analy_btn_container_center').remove();
                    _render();
                });
            }else{
                _render();
            }
        });
        $footer.on('tap',_showArticle);
        $('#change_context_menu ul li').tap(function(){
            var type = $(this).data('type');
            if(type == 'local'){
                $('#txt_btn_context').text('本地');
                J.showToast('当前计算环境：本地','success');
            }else{
                $('#txt_btn_context').text('云端');
                J.showToast('当前计算环境：云端','success');
            }
            context = type;
            J.Menu.hide();
        });
        $('#btn_search').tap(function(){
            var value = $('#search_value').val();
            if($.trim(value) == '')return;
            $('#result_list').html('');
            J.showMask('正在检索...');
            setTimeout(function(){
                var data = _getSearchResult(value);
                _renderSearch(data);
                J.Scroll('#search_result',{onBeforeScrollStart:function(){}});
                J.hideMask();
            },300);
        });
    }
    var _showArticle = function(){
        var href = $(this).attr('href');
        if(href != '#select_file_article' && !log){
            J.showToast('请先选择一个日志文件');
            return;
        }
        $footer.removeClass('active');
        $(this).addClass('active');
        $article.removeClass('active');
        $(href).addClass('active');
        if(href == '#search_article'){
            $('#search_value').focus();
        }
    }
    var _init_migrator = function(){
        var cfg = {
            funcPath : "App.prototype.anlaysis",
            thisAttrs : []
        }
       return Migrator.migrateToServer(cfg);
    }
    var _render = function(){
        $('#log_trend_chart,#log_distributed_chart').empty();
        $('#waiting').show();
        $('#run_time').parent().show();
        setTimeout(function(){
            var beginDate = new Date(),resultStr;
            if(context == 'local'){//本地计算
                resultStr = local_analy(log);
            }else{//云端计算
                resultStr = _this.anlaysis(log);
            }
            var result = JSON.parse(resultStr);
            $('#run_time').text((new Date()-beginDate)/1000);
            $('#waiting').hide();
            _showDistributedChart(result);
            _showTrendChart(result);
            J.Scroll('#analy_article',{onBeforeScrollStart:function(){}});
        },300);
    }
    var _handler = function(e){
        var reader = new FileReader();
        reader.onprogress = _onProgress;
        reader.onloadstart = _onStart;
        reader.onload = _onLoad;
        reader.readAsText(e.target.files[0]);
        $('#select_file_name').text(e.target.files[0].name);
        $('#select_file_tip').show();

    }
    var _onStart = function(){
        $progress.show().find('.bar').width('0%').text('0%');
    }

    var _onProgress = function(e){
        if(e.lengthComputable){
            var percentLoaded = Math.round((e.loaded / e.total) * 100)+'%';
            $progress.find('.bar').width(percentLoaded).text(percentLoaded);
        }
    }
    var _onLoad = function(e){
        $progress.find('.bar').width('100%').text('100%');
        log = e.target.result;
        setTimeout(function(){
            $progress.hide();
        },5000);
        setTimeout(function(){
            $footer.removeClass('active');
            $($footer.get(1)).addClass('active');
            $article.removeClass('active');
            $($article.get(1)).addClass('active');
        },1000);
    }

    var _showDistributedChart = function(result){
        var data = [
            {name : '信息',value : result.total[0],color:'#27AE60'},
            {name : '告警',value : result.total[1],color:'#F1C40F'},
            {name : '错误',value : result.total[2],color:'#C0392B'}
        ];

        new iChart.Pie2D({
            animation : true,
            render : 'log_distributed_chart',
            data: data,
            title : result.month+'月日志指标分布',
            showpercent:true,
            decimalsnum:2,
            border : false,
            width : $('#analy_result').width(),
//            height : 400,
            offset_angle:-90,
            sub_option : {
                mini_label:true,
                mini_label_threshold_angle:30,
                mini_label:{color:'#ffffff'}
            }
        }).draw();
    }
    var _showTrendChart = function(result){
        var data = [{
            name : '信息',
            value:result.info,
            color:'#27AE60',
            line_width:2
        },{
            name : '告警',
            value:result.warn,
            color:'#F1C40F',
            line_width:2
        },{
            name : '异常',
            value:result.error,
            color:'#C0392B',
            line_width:2
        }
        ];
        var labels = [];
        for(var i = 0;i<result.info.length;i++){
            labels.push(i+1);
        }
        //labels = [1,5,10,15,20,25,30];
        var line = new iChart.LineBasic2D({
            render : 'log_trend_chart',
            data: data,
            align:'center',
            title : result.month+'月日志指标趋势',
            width : $('#analy_result').width(),
            height : 400,
            padding:0,
            border : false,
            tip:{
                enable:true,
                shadow:true,
                border:{
                    enable:true,
                    radius : 5,
                    width:2,
                    color:'#3f8695'
                },
                listeners:{
                    parseText:function(tip,name,value,text,i){
                        return name+":"+value;
                    }
                }
            },
            tipMocker:function(tips,i){
                return "<div style='font-weight:600'>"+
                    result.month + "-"+(i+1)+
                    "</div>"+tips.join("<br/>");
            },
            legend : {
                enable : true,
                row:1,//设置在一行上显示，与column配合使用
                column : 'max',
                valign:'top',
                sign:'bar',
                background_color:null,//设置透明背景
                offsetx:-80,//设置x轴偏移，满足位置需要
                border : true
            },
            crosshair:{
                enable:true,
                line_color:'#62bce9'
            },
            sub_option : {
                label:false,
                point_hollow : false
            },
            label:{
                fontsize:6,
                font:'arial'
            },
            labels : labels
        });

        //开始画图
        line.draw();
    }

    var _getSearchResult = function(key){
        return JSON.parse(local_analy(log,key));
    }
    var _renderSearch = function(data){
        var str = '';
        if(data.total[0]>0){
            str += '<li class="divider">info</li>'
            for(var i=0;i<data.info.length;i++){
                if(data.info[i]>0){
                    str += '<li class="grid"><div class="one-part">'+data.month+'-'+(i+1)+'</div><div class="one-part">出现了'+data.info[i]+'次</div></li>'
                }
            }
        }
        if(data.total[1]>0){
            str += '<li class="divider">warn</li>'
            for(var i=0;i<data.warn.length;i++){
                if(data.warn[i]>0){
                    str += '<li class="grid"><div class="one-part">'+data.month+'-'+(i+1)+'</div><div class="one-part">出现了'+data.warn[i]+'次</div></li>'
                }
            }
        }
        if(data.total[2]>0){
            str += '<li class="divider">error</li>'
            for(var i=0;i<data.error.length;i++){
                if(data.error[i]>0){
                    str += '<li class="grid"><div class="one-part">'+data.month+'-'+(i+1)+'</div><div class="one-part">出现了'+data.error[i]+'次</div></li>'
                }
            }
        }
        if(str == ''){
            J.showToast('没有查询到相关数据');
        }else{
            $('#result_list').append(str);
        }
    }

}
/**
 * 统计分析(可迁移至云端)
 * @param str
 * @return {*}
 */
App.prototype.anlaysis = function(str,key){
    var arr = str.split('\n'),iter = 5,year,month,dateStr,days,result;
    dateStr  = arr[0].split('|')[3].split(' ')[0].split('-');
    year = dateStr[0];
    month = dateStr[1];
    if(month.indexOf('0') == 0){
        month = month.substr(1);
    }
    //当前月份的天数
    days = new Date(year,month,0).getDate();
    for(var k = 0;k<iter;k++){
        result = {
            month : '',
            total : [0,0,0],
            info : [],
            warn : [],
            error : []
        }
        //当前月份
        result.month = year+'-'+month;
        for(var d = 0;d < days; d++){
            //init data
            result.info.push(0);
            result.warn.push(0);
            result.error.push(0);
            //组装数据
            for(var i = 0;i<arr.length;i++){
                var obj = arr[i].split('|');
                var type = obj[0];
                var day = obj[3].split(' ')[0].split('-')[2];
                if(day.indexOf('0') == 0){
                    day = parseInt(day.substr(1));
                }
                if(day-1 === d ){
                    if(key && obj[2].indexOf(key) == -1){
                        continue;
                    }
                    if(type == 'INFO'){
                        result.info[d]++;
                        result.total[0]++;
                    }else if(type == 'WARN'){
                        result.warn[d]++;
                        result.total[1]++;
                    }else{
                        result.error[d]++;
                        result.total[2]++;
                    }
                }
            }
        }
    }
    return JSON.stringify(result);
}