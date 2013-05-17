/**
 * 页面设定
 * User: shixy
 * Date: 13-4-2
 * Time: 上午9:45
 */
App.page('login',function(){
    var exports = {};
    exports.init = function(){
        //todo  check native status. eg.network、 newVersion
        $('#login_form').submit(_login);
        setTimeout(_autoLogin,1);
    }
    var _login = function(){
        var username = $('#username').val();
        var pwd = $('#password').val();
        if(username == '' || pwd == ''){
            alert('请填写完整的信息！');
        }else{
            var auth = {username : username ,password : pwd};
            window.localStorage.setItem('auth',JSON.stringify(auth));
            //TODO  login rest api
            J.Router.turnTo('#index_section');
        }
        return false;
    }
    var _autoLogin = function(){
        var auth = localStorage.getItem('auth');
        if(auth){
            auth = JSON.parse(auth);
            $('#username').val(auth.username);
            $('#password').val(auth.password);
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
        _subscribeEvents();
        _renderIndex();
        _renderUsageChart();
    }
    var _subscribeEvents = function(){
        var boxList = $('#index_section .box li');
        var current = 0;
        var len = boxList.length;
        //nav box events
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
        //swipe events
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
            });
        // biz sys info events
        $('#bizSysContainer li .content').on('tap',function(e){
            J.Router.turnTo('#biz_sys_section');
        });
        //health events
        $('#bizSysContainer li .title').on('tap',function(e){
            var tip = $(this).find('.health-tip');
            tip.show().animate('scaleIn');
            setTimeout(function(){
                tip.animate('scaleOut');
                setTimeout(function(){tip.hide();},300);
            },4000);
        });
    }
    /**
     * render 全局概览信息
     * @private
     */
    var _renderIndex = function(){
        //render boxlist
        //todo 获取总数据，以下为模拟数据
        //render 业务系统
        //todo 获取业务系统数据列表
        _renderHealth();

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
    var _renderUsageChart = function(){
        //todo 获取资源分配数据
        var cpudata = mmdata = srdata = vmdata = [
            {name:'OA',value:'20',color:'#4572a7'},
            {name:'订单',value:'10',color:'#aa4643'},
            {name:'营销',value:'30',color:'#89a54e'},
            {name:'协同',value:'20',color:'#80699b'}
        ];
        _renderPieChart(cpudata,'cpu_usage_canvas','CPU');
        _renderPieChart(mmdata,'mm_usage_canvas','内存');
        _renderPieChart(srdata,'sr_usage_canvas','存储');
        _renderPieChart(vmdata,'vm_num_canvas','虚拟机');
    }
    var _renderPieChart = function(data,id,text){
        var chartCfg = AHelper.getDountCfg(data,id,text);
        new iChart.Donut2D(chartCfg).draw();
    }
    return exports;
});
App.page('alarm',function(){
   var exports = {};
    exports.init = function(){
        _subscribeEvents();
        $('#alarm_article').trigger('load');
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
        businessChartCfg.height -= 51;
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
        resChartCfg.height -= 51;
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
        config.height -= 51;
        config.title='业务维度';
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data2,'resTrendChart',labels);
        config.height -= 51;
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
        config.height -=30;
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data,'mm_allocate_chart',labels);
        config.title = '内存';
        config.height -=30;
        new iChart.LineBasic2D(config).draw();
        var config = AHelper.getLineCfg(data,'sr_allocate_chart',labels);
        config.title = '存储';
        config.height -=30;
        new iChart.LineBasic2D(config).draw();
    }
    return exports;
});

App.page('res_period',function(){
    var exports = {};
    var searchDate = new Date();
    exports.init = function(){
        new J.Slider('#res_period_article');
        _renderBar();
        _renderChart();
    }
    /**
     * render quick search bar
     */
    var _renderBar = function(){
        var today = new Date();
        searchDate.setDate(today.getDate()-1);
        var dateStr = AHelper.formatDate(searchDate,'yyyy-MM-dd');
        var $bar = $('#per_qs_bar a');
        $bar.eq(1).text(dateStr);
        $bar.eq(0).on('tap',function(){
            searchDate.setDate(searchDate.getDate()-1);
            $bar.eq(1).text(AHelper.formatDate(searchDate,'yyyy-MM-dd'));
            //todo getChartData and reRender
        });
        $bar.eq(-1).on('tap',function(){
            searchDate.setDate(searchDate.getDate()+1);
            $bar.eq(1).text(AHelper.formatDate(searchDate,'yyyy-MM-dd'));
            //todo getChartData and reRender
        });
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
        var config = AHelper.getBarCfg(data,'cpuPeriodChart',["OA","营销","订单","协同"]);
        config.height -=30;
        config.title = "CPU使用率对比";
        new iChart.ColumnMulti2D(config).draw();
        var config = AHelper.getBarCfg(data,'mmPeriodChart',["OA","营销","订单","协同"]);
        config.height -=30;
        config.title = "内存使用率对比";
        new iChart.ColumnMulti2D(config).draw();
    }
    return exports;
});

App.page('biz_sys',function(){
    var exports = {};
    exports.init = function(){
        _subscribeEvents();
        _render();
    }
    var _subscribeEvents = function(){
        $('#biz_vm_block,#biz_cpu_block,#biz_mm_block').on('tap',function(){
            J.Router.turnTo('#biz_vm_list_section');
        });
        $('#biz_alarm_block').on('tap',function(){
            J.Router.turnTo('#alarm_list_section');
        });
    }
    var _render = function(){
        //todo get biz_sys datas
    }
    return exports;
});

