/**
 * 页面设定
 * User: shixy
 * Date: 13-4-2
 * Time: 上午9:45
 */
App.page('login',function(){
    var exports = {};
    exports.init = function(){
        $('#btn-login').bind('tap',_login);
    }
    exports.load = function(){
       // RsAPI.auth.logout();
        var auth = localStorage.getItem('auth');
        if(auth){
            auth = JSON.parse(auth);
            $('#username').val(auth.username);
            $('#password').val(auth.password);
        }
    }
    var _login = function(){
        var username = $('#username').val();
        var pwd = $('#password').val();
        var offline = $('#btn_offline').val();
        if(!App.offline){//只有在在线的情况下，此选项可用
            App.offline = offline == '1';
        }
        $.ui.loadContent("#index_section",false,false,"slide");
    }
    exports.autoLogin = function(){
        var isAutoLogin = localStorage.getItem("auto-login");
        if(isAutoLogin == 1){
            _login();
        }
    }
    return exports;
});
App.page('setting',function(){
    var exports={};
    exports.init = function(){
        $('#setting_section input[type="range"]').on('change',function(){
            localStorage.setItem($(this).attr("name"),$(this).val());
        })
    }
    var _renderCheckbox = function(ids){
        $.each(ids,function(i,id){
            var value = localStorage.getItem(id);
            if(value == 1){
                $('#'+id).val(value).addClass('active');
            }else{
                $('#'+id).val(value).removeClass('active');
            }
        })

    }
    exports.load = function(){
        _renderCheckbox(['network-2g','auto-save','auto-login','auto-update']);
    }
    return exports;
})

App.page('index',function(){
    var exports = {};
    var data_health = [70,60,20,40];
    exports.init = function(){
       // _lockAside();
        var boxList = $('#index_section .box li');
        var current = 0;
        var len = boxList.length;
        boxList.each(function(i){
            $(this).on('tap',function(){
                var animate = 'slideRightIn';
                if(i > current){
                    animate = 'slideLeftIn';
                }
                $(this).addClass('active').siblings().removeClass('active');
                var currBox = $('#index_container .active').removeClass('active').addClass('hiding');
                var target = $('#index_container').children().get(i);
                currBox.animate('fadeOut','400','linear',function(){currBox.removeClass('hiding')});
                $(target).addClass('active').animate(animate);
                current = i;
            });
        });
        $('#index_container').on('swipeLeft',function(){
            if(J.isMenuOpen){
                J.Menu.hide();
            }else if(current < len-1){
                $(boxList.get(current+1)).trigger('tap');
            }
        }).on('swipeRight',function(){
                if(current === 0 && !J.isMenuOpen){
                    J.Menu.show();
                }else if(current>0){
                    $(boxList.get(current-1)).trigger('tap');
                }
        })
        $('#btn_index_grid').on('tap',function(){
            if(!$(this).hasClass('active')){
                $('#btn_index_grid,#index_grid_article').addClass('active').siblings().removeClass('active');
                $('#index_grid_article').animate('bounceInDown');
            }
            _renderHealth();
        });
        $('#btn_index_chart').on('tap',function(){
            if(!$(this).hasClass('active')){
                $('#btn_index_chart,#index_chart_article').addClass('active').siblings().removeClass('active');
                $('#index_grid_index_chart_articlearticle').animate('bounceInDown');
                _renderChart();
            }
        });
        $('#bizSysContainer li .content').on('tap',function(e){
            J.Router.turnTo('#biz_sys_section');
        });
        $('#bizSysContainer li .title').on('tap',function(e){
            var tip = $(this).find('.health-tip');
            tip.show().animate('bounceIn');
            setTimeout(function(){
                tip.animate('bounceOut');
                setTimeout(function(){tip.hide();},300);
            },4000);
        });
        _renderHealth();
        _renderUsageChart();
    }
    var _renderHealth = function(){
        $('#bizSysContainer li').each(function(i,el){
            var data = data_health[i];
            $(el).find('.progress').css('height',data+'%');
            $(el).find('.health-tip span').text(data);
        })

    }
    var _renderChart = function(){
        var data = [
            {
                name : 'CPU',
                value:[2,5,4,8],
                //value:[0.2,0.4,0.3,0.1],
                color:'#4572a7'
            },
            {
                name : '内存',
                value:[60,80,40,70],
                //value:[0.3,0.2,0.1,0.4],
                color:'#aa4643'
            },
            {
                name : '存储',
                value:[40,50,70,90],
                //value:[0.2,0.3,0.3,0.2],
                color:'#89a54e'
            },
            {
                name : '虚拟机数',
                value:[2,5,4,8],
               // value:[0.3,0.1,0.2,0.4],
                color:'#80699b'
            }
        ];
        var config = AHelper.getBarCfg(data,'chartModeDiv',["QA","营销","订单","协同"]);
        config.title = "全局概览";
        config.subtitle = "各业务系统资源使用百分百";
        config.showpercent = false;
        new iChart.ColumnMulti2D(config).draw();
    }
    var _lockAside = function(){
    }

    var _renderUsageChart = function(){
        _renderCPUChart();
        _renderMMChart();
        _renderSRChart();
        _renderVMChart();
    }
    var _renderCPUChart = function(){
        var data = [
            {name:'OA',value:'20',color:'#4572a7'},
            {name:'订单',value:'10',color:'#aa4643'},
            {name:'营销',value:'30',color:'#89a54e'},
            {name:'协同',value:'20',color:'#80699b'}
        ];
        var chartCfg = AHelper.getDountCfg(data,'cpu_usage_canvas','CPU');
        new iChart.Donut2D(chartCfg).draw();
    }
    var _renderMMChart = function(){
        var data = [
            {name:'OA',value:'20',color:'#4572a7'},
            {name:'订单',value:'10',color:'#aa4643'},
            {name:'营销',value:'30',color:'#89a54e'},
            {name:'协同',value:'20',color:'#80699b'}
        ];
        var chartCfg = AHelper.getDountCfg(data,'mm_usage_canvas','内存');
        new iChart.Donut2D(chartCfg).draw();
    }
    var _renderSRChart = function(){
        var data = [
            {name:'OA',value:'20',color:'#4572a7'},
            {name:'订单',value:'10',color:'#aa4643'},
            {name:'营销',value:'30',color:'#89a54e'},
            {name:'协同',value:'20',color:'#80699b'}
        ];
        var chartCfg = AHelper.getDountCfg(data,'sr_usage_canvas','存储');
        new iChart.Donut2D(chartCfg).draw();
    }
    var _renderVMChart = function(){
        var data = [
            {name:'OA',value:'20',color:'#4572a7'},
            {name:'订单',value:'10',color:'#aa4643'},
            {name:'营销',value:'30',color:'#89a54e'},
            {name:'协同',value:'20',color:'#80699b'}
        ];
        var chartCfg = AHelper.getDountCfg(data,'vm_num_canvas','虚拟机');
        new iChart.Donut2D(chartCfg).draw();
    }
    return exports;
});
App.page('alarm',function(){
   var exports = {};
    exports.init = function(){
        _subscribeEvents();
        _renderChart();
    }
    var _subscribeEvents = function(){
        var carousel = new J.Slider('#alarm_article');
        var carouselTrend = new J.Slider('#alarm_trend_article');
        $('#alarm_article').on('load',function(){
            _renderChart();
            carousel.refresh();
        });
        $('#alarm_trend_article').on('load',function(){
            _renderTrendChart();
            carouselTrend.refresh();
        });
    }
    var _renderChart = function(){
        var businessData = [
            {name : 'OA',value : 30,color:'#4572a7'},
            {name : '订单',value : 20,color:'#aa4643'},
            {name : '营销',value : 60,color:'#89a54e'},
            {name : '协同',value : 40,color:'#80699b'}
        ];
        var resData = [
            {name : 'ACP',value : 30,color:'#4572a7'},
            {name : '网络',value : 8,color:'#aa4643'},
            {name : '存储',value : 15,color:'#89a54e'},
            {name : 'PowerVM',value : 30,color:'#80699b'},
            {name : 'VMware',value : 30,color:'#3d96ae'}
        ];
        var businessChartCfg = AHelper.getPieCfg(businessData,'busiSysAlarmChart',true);
        businessChartCfg.listeners = {
            'bound':function(){
                J.Router.turnTo('#alarm_list_section');
            }
        };
        businessChartCfg.sub_option.listeners = {
            parseText:function(d, t){
                return d.get('value');
            }
        };
        businessChartCfg.height = AHelper.getArticleOffset().height - 44;
        new iChart.Pie2D(businessChartCfg).draw();

        var resChartCfg = AHelper.getPieCfg(resData,'resAlarmChart',true);
        resChartCfg.listeners = {
            'bound':function(){
                J.Slider.turnTo('#alarm_list_section');
            }
        };
        resChartCfg.sub_option.listeners = {
            parseText:function(d, t){
                return d.get('value');
            }
        };
        resChartCfg.height = AHelper.getArticleOffset().height - 44;
        new iChart.Pie2D(resChartCfg).draw();
    }
    var _renderTrendChart = function(){
        var pv=[],ip=[],t;
        for(var i=0;i<61;i++){
            t = Math.floor(Math.random()*(30+((i%12)*5)))+10;
            pv.push(t);
            t = Math.floor(t*0.5);
            t = t-Math.floor((Math.random()*t)/2);
            ip.push(t);
        }

        var data = [
            {
                name : 'OA',
                value:pv,
                color:'#0d8ecf',
                line_width:2
            },
            {
                name : '协同',
                value:ip,
                color:'#ef7707',
                line_width:2
            }
        ];
        var data2 = [{
                name : 'ACP',
                value:pv,
                color:'#0d8ecf',
                line_width:2
            },{
                name : 'PowerVM',
                value:ip,
                color:'#ef7707',
                line_width:2
            }];

        var labels = ["2012-08-01","2012-08-02","2012-08-03","2012-08-04","2012-08-05","2012-08-06"];
        var config = AHelper.getLineCfg(data,'busiSysTrendChart',labels);
        config.height = AHelper.getArticleOffset().height - 44;
        config.title='业务维度';
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data2,'resTrendChart',labels);
        config.height = AHelper.getArticleOffset().height - 44;
        config.title = '环境维度';
        new iChart.LineBasic2D(config).draw();
    }
    return exports;
});

App.page('res_allocate',function(){
    var exports = {};
    exports.init = function(){
        _renderChart();
        _subscribeEvents();
    }
    var _subscribeEvents = function(){
       new J.Slider('#res_allocate_article');
    }
    var _renderChart = function(){
        var pv=[],ip=[],t;
        for(var i=0;i<61;i++){
            t = Math.floor(Math.random()*(30+((i%12)*5)))+10;
            pv.push(t);
            t = Math.floor(t*0.5);
            t = t-Math.floor((Math.random()*t)/2);
            ip.push(t);
        }

        var data = [
            {
                name : 'OA',
                value:pv,
                color:'#0d8ecf',
                line_width:2
            },
            {
                name : '协同',
                value:ip,
                color:'#ef7707',
                line_width:2
            }
        ];

        var labels = ["2012-08-01","2012-08-02","2012-08-03","2012-08-04","2012-08-05","2012-08-06"];
        var config = AHelper.getLineCfg(data,'cpu_allocate_chart',labels);
        config.title = 'CPU';
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data,'mm_allocate_chart',labels);
        config.title = '内存';
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data,'sr_allocate_chart',labels);
        config.title = '存储';
        new iChart.LineBasic2D(config).draw();
    }
    return exports;
});

App.page('res_period',function(){
    var exports = {};
    exports.init = function(){
        _renderChart();
        _subscribeEvents();
    }
    var _subscribeEvents = function(){
        new J.Slider('#res_period_article');
    }
    var _renderChart = function(){
        var data = [
            {
                name : '工作时间',
                value:[0.6,0.8,0.5,0.9],
                color:'#4572a7'
            },
            {
                name : '非工作时间',
                value:[0.1,0.2,0.15,0.3],
                color:'#aa4643'
            }
        ];
        var config = AHelper.getBarCfg(data,'cpuPeriodChart',["QA","营销","订单","协同"]);
        config.title = "CPU使用率对比";
        new iChart.ColumnMulti2D(config).draw();
        var config = AHelper.getBarCfg(data,'mmPeriodChart',["QA","营销","订单","协同"]);
        config.title = "内存使用率对比";
        new iChart.ColumnMulti2D(config).draw();
    }
    return exports;
});

App.page('biz_sys',function(){
    var exports = {};
    exports.init = function(){
        $('#biz_alarm_list_anchor').on('tap',function(e){
            if(e.target.id == 'biz_alarm_trend_anchor'){
                J.Router.turnTo('#alarm_section');
            }else{
                toggleEl(this,'biz_alarm_list_container');
            }
        })
        $('#biz_vm_list_anchor').on('tap',function(){
            toggleEl(this,'biz_vm_list_container');
        })
        $('#biz_vm_list_container li').on('tap',function(){
            J.Router.turnTo('vm_section');
        })

    }
    function toggleEl(_this,elId){
        var el = $('#'+elId);
        el.toggle();
        $(_this).children('.icon').toggleClass('up');
    }
    return exports;
});

