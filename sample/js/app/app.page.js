/**
 * 页面设定
 * User: shixy
 * Date: 13-4-2
 * Time: 上午9:45
 */
App.page('login',function(){
    var exports = {};
    exports.init = function(){
        $('#login_form').submit(_login);
        if(!J.isWebApp){
            var networkState = navigator.connection.type;
            if(networkState == Connection.NONE){
                J.showToast('无可用网络连接！程序将采用离线模式访问！')
                J.offline = true;
            }else{
                J.showToast('当前网络环境: '+ networkState);
            }
        }
        setTimeout(_autoLogin,1);
    }
    var _login = function(){
        var username = $('#username').val();
        var pwd = $('#password').val();
        if(username == '' || pwd == ''){
            alert('请填写完整的信息！');
        }else{
            RsAPI.auth.login(username,pwd,function(data){
                if(data.error){
                    J.showToast(data.error,'error');
                }else{
                    localStorage.setItem('userInfo',data.userInfo);
                    J.Router.turnTo('#index_section');
                }
            })

        }
        return false;
    }
    var _autoLogin = function(){
        var sessionId = localStorage.getItem('sessionId');
        if(sessionId){
            RsAPI.auth.reLogin(function(data){
                if(data.error){
                    J.showToast(data.error,'error');
                }else{
                    J.Router.turnTo('#index_section');
                }
            })
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
    var serverType;
    exports.init = function(){
        var h = AHelper.getArticleOffset().height - 80;
        $('#bizSysContainer').height(h);
        _subscribeEvents();
        _render();
    }
    var _subscribeEvents = function(){
        var $box = $('#index_section .box li');
        var $container = $('#bizSysContainer');

        //swipe events
        var _beforeSlide = function(i,deltaX){
            if(i === 0 && deltaX >0) {//swipeRight
                if(!J.isMenuOpen){
                    J.Menu.show();
                }
                return false;
            }else if( i === 0 && deltaX<0){//swipeLeft
                if(J.isMenuOpen){
                    J.Menu.hide();
                    return false;
                }
            }
            return true;
        };
        var _afterSlide = function(i){
            $box.eq(i).addClass('active').siblings().removeClass('active');
        }
        var slider = new J.Slider({
            selector:'#index_container',
            noDots : true,
            onBeforeSlide : _beforeSlide,
            onAfterSlide : _afterSlide
        });
        //nav box events
        $box.each(function(i){
            $(this).on('tap',function(){
                slider.index(i);
            });
        });
        // biz sys info events
        $container.on('tap','li .content',function(e){
            var bizId = $(this).data('id');
            App.page('biz_sys').setData({bizId:bizId});
            J.Router.turnTo('#biz_sys_section');
        })
        //health events
        $container.on('tap','li .title',function(e){
            var tip = $(this).find('.health-tip');
            tip.show().animate('scaleIn');
            setTimeout(function(){
                tip.animate('scaleOut');
                setTimeout(function(){tip.hide();},300);
            },4000);
        });

        $('#index_title').tap(function(){
            var active;
            if(serverType == 'PC'){active = ['','active','']}
            else if(serverType == 'MINI'){active = ['','','active']}
            else{active = ['active','','']};
            var markup = '<ul class="list" id="index_popover"><li class="nav '+active[0]+
                '">全局概览</li><li class="nav '+active[1]+
                '" data-type="PC">PC机</li><li class="nav '+active[2]+'" data-type="MINI">小型机</li></ul>';
            J.popover(markup,{top:'44px',left:'20%',right:'20%'},'top');
        });
        $('#jingle_popup').on('tap','#index_popover li',function(){
            var type = $(this).data('type');
            if(serverType != type){
                serverType = type;
                $('#index_title').text($(this).text());
                _render();
                $(this).addClass('active').siblings().removeClass('active');
            }
            J.closePopup();
        });
        $('#btn_approval').on('tap',function(){
            J.alert('功能开发中..');
        })
    }
    /**
     * render 全局概览信息
     * @private
     */
    var _render = function(){
        RsAPI.res.summary(serverType,function(data){
			var $box = $('#index_article .box .text');
            $box.eq(0).text(data.bizCount);
            $box.eq(1).text(data.vmCount);
            $box.eq(2).text(data.totalCpuCount);
            $box.eq(3).html(AHelper.getAutoUnit(data.totalMemory));
            $box.eq(4).html(AHelper.getAutoUnit(data.totalLocalStorage));
            if(data.list.length === 0){
                $('#index_container').children().children().html('未获取到相关数据！');
            }else{
                var listHtml = template('bizInfoTmpl',data.list);
                $('#bizSysContainer').html(listHtml);
                _renderUsageChart(data);
                _renderHealth();
            }
        })
    }
    var _renderHealth = function(){
        var data_health = [70,60,20,40,40,70,90,50];
        $('#bizSysContainer li').each(function(i,el){
            var data = data_health[i];
            $(el).find('.progress').css('height',data+'%');
            $(el).find('.health-tip span').text(data);
        })

    }
    var _renderUsageChart = function(data){
        var cpudata = [],mmdata = [],srdata =[], vmdata = [];
        var colors = ['#4572a7','#aa4643','#89a54e','#80699b','#80699b','#80699b','#80699b','#80699b','#80699b','#80699b','#80699b','#80699b'];
        $.each(data.list,function(i,item){
            vmdata.push({name:item.businessSystem.name,color:colors[i],value:item.vmCount});
            cpudata.push({name:item.businessSystem.name,color:colors[i],value:item.totalCpuCoreCount});
            mmdata.push({name:item.businessSystem.name,color:colors[i],value:AHelper.getGB(item.totalMemory)});
            srdata.push({name:item.businessSystem.name,color:colors[i],value:AHelper.getGB(item.totalLocalStorage)});
        })
        _renderPieChart(vmdata,'vm_num_canvas','虚拟机');
        _renderPieChart(cpudata,'cpu_usage_canvas','CPU');
        _renderPieChart(mmdata,'mm_usage_canvas','内存');
        _renderPieChart(srdata,'sr_usage_canvas','存储');
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
    var serverType = 'PC';
    exports.init = function(){
        new J.Slider('#res_period_article');
        $('#res_period_section header ul.control-group li').on('tap',function(){
            var $this = $(this);
            if($this.hasClass('active'))return;
            $this.addClass('active').siblings().removeClass('active');
            serverType = $(this).data('type');
            _renderChart();

        })
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
            _renderChart();
        });
        $bar.eq(-1).on('tap',function(){
            searchDate.setDate(searchDate.getDate()+1);
            $bar.eq(1).text(AHelper.formatDate(searchDate,'yyyy-MM-dd'));
            _renderChart();
        });
    }
    var _renderChart = function(){
        RsAPI.res.getBizResUsage(AHelper.formatDate(searchDate,'yyyy-MM-dd'),serverType,function(data){
            var cpuWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var cpuFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var mmWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var mmFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var labels = [];
            for(var i=0;i<data.workingTime.length;i++){
                var workingObj = data.workingTime[i];
                var freedomObj = data.freedomTime[i];
                cpuWorkingData.value.push(workingObj.totalCpuRate);
                cpuFreedomData.value.push(freedomObj.totalCpuRate);
                mmWorkingData.value.push(workingObj.totalMemoryRate);
                mmFreedomData.value.push(freedomObj.totalMemoryRate);
                labels.push(workingObj.businessName);
            }
            _drawChart('cpu',[cpuWorkingData,cpuFreedomData],labels);
            _drawChart('memory',[mmWorkingData,mmFreedomData],labels);
        });
    }

    var _drawChart = function(type,data,labels){
        var title,renderId;
        if(type == 'cpu'){
            title = 'CPU使用率对比';
            renderId = 'cpuPeriodChart'
        }else{
            title = '内存使用率对比';
            renderId = 'mmPeriodChart'
        }
        var config = AHelper.getBarCfg(data,renderId,labels);
        config.height -=30;
        config.title = title;
        new iChart.ColumnMulti2D(config).draw();
    }
    return exports;
});

App.page('biz_sys',function(){
    var exports = {};
    var data;
    exports.setData = function(d){data = d; }
    exports.init = function(){
        _subscribeEvents();
    }
    exports.load = function(){
        _render();
    }
    var _subscribeEvents = function(){
        $('#biz_vm_block,#biz_cpu_block,#biz_mm_block').on('tap',function(){
            var articleId = $(this).data('article');
            App.page('biz_vm_list').setData({
                bizId : data.bizId,
                articleId : articleId
            });
            J.Router.turnTo('#biz_vm_list_section');
        });
        $('#biz_health_block').on('tap',function(){
            App.page('biz_health_list').setData({
                bizId : data.bizId
            });
            J.Router.turnTo('#biz_health_list_section');
        })
        $('#biz_alarm_block').on('tap',function(){
            J.Router.turnTo('#alarm_list_section');
        });
    }
    var _render = function(){
        RsAPI.biz.getInfo(data.bizId,function(d){
            $('#biz_sys_section header .title').text(d.name);
            $('#txt_biz_health').text(d.health);
            $('#txt_biz_alarm').text(d.alarmNum);
            $('#txt_biz_host').text(0);
            $('#txt_biz_vm').text(d.vmCount);
            $('#txt_biz_cpu').text(d.cpuCount);
            $('#txt_biz_memroy').text(d.memoryCapacity);
            $('#txt_biz_sr').text(d.memoryCapacity);
        })
    }
    return exports;
});

App.page('biz_vm_list',function(){
    var exports = {};
    var data;
    var period = "ONE_HOUR";
    var serverType = 'PC';
    var currentArticle = '';
    exports.setData = function(d){data = d; }
    exports.init = function(){
        var $title = $('#biz_vm_list_title'),$group = $('#biz_vm_title_group');
        var $all =  $('#biz_vm_list_article'),$cpu = $('#biz_vm_cpu_top10_article'),$mm = $('#biz_vm_memory_top10_article');
        $all.on('show',function(){
            currentArticle = 'all';
            $title.show();
            $group.hide();
            _syncAndRender(currentArticle);
        });
        $cpu.on('show',function(){
            currentArticle = 'cpuTop10';
            $('.control-group li[data-period="'+period+'"]',$cpu).addClass('active').siblings().removeClass('active');
            $title.hide();
            $group.show();
            _syncAndRender(currentArticle);
        });
        $mm.on('show',function(){
            currentArticle = 'mmTop10';
            $('.control-group li[data-period="'+period+'"]',$mm).addClass('active').siblings().removeClass('active');
            $title.hide();
            $group.show();
            _syncAndRender(currentArticle);
        });
        $('#biz_vm_list_section article .control-group li').on('tap',function(){
            period = $(this).data('period');
            $(this).addClass('active').siblings().removeClass('active');
            _syncAndRender(currentArticle);
        });
        $('li',$group).on('tap',function(){
            var $this = $(this);
            if($this.hasClass('active'))return;
            $this.addClass('active').siblings().removeClass('active');
            serverType = $(this).data('type');
            _syncAndRender(currentArticle);
        });
        $('#biz_vm_list_section article ul.list').on('tap','li[data-vmid]',function(){
            var vmId = $(this).data('vmid');
            App.page('vm').setData({
                vmId : vmId
            });
            J.Router.turnTo('#vm_section');
        })
    }
    exports.load = function(){
        $('#'+data.articleId+',footer a[href="#'+data.articleId+'"]').addClass('active').siblings().removeClass('active');
    }

    var _syncAndRender = function(article){
        J.showMask();
       if(article == 'cpuTop10'){
           RsAPI.biz.getVmCpuTop10(data.bizId,period,serverType,function(data){
               _renderList('biz_vm_cpu_top10_article','biz_vm_cpu_top10_list_tmpl',data);
           });
        }else if(article == 'mmTop10'){
           RsAPI.biz.getVmMemoryTop10(data.bizId,period,serverType,function(data){
               _renderList('biz_vm_memory_top10_article','biz_vm_mm_top10_list_tmpl',data);
           });
        }else{
           RsAPI.biz.getVms(data.bizId,function(data){
               _renderList('biz_vm_list_article','biz_vm_list_tmpl',data);
           });
       }

    }
    var _renderList = function(articleId,tmplId,data){
        var el =  $('#'+articleId+' ul.list');
        el.html(template(tmplId,data));
        J.Element.init(el);
        J.hideMask();
    }
    return exports;
})


App.page('vm',function(){
    var exports = {};
    var data;
    exports.setData = function(d){data = d; }
    exports.init = function(){
        $('#vm_section .control-group li').on('tap',function(){
            J.alert('功能开发中...');
        })
    }
    exports.load = function(){
        var vmId = data.vmId;
        RsAPI.vm.get(vmId,function(data){
            $('#vm_article').html(template('vm_detail_tmpl',data));
        })
    }
    return exports;
})
App.page('biz_health_list',function(){
    var exports = {};
    var data;
    var serverType = "PC";
    exports.setData = function(d){data = d; }
    exports.init = function(){
        $('#biz_health_list_section .control-group li').on('tap',function(){
            var $this = $(this);
            if($this.hasClass('active'))return;
            $this.addClass('active').siblings().removeClass('active');
            serverType = $(this).data('type');
            exports.load();
        })
    }
    exports.load = function(){
        var bizId = data.bizId;
        J.showMask();
        RsAPI.biz.getAvailability(bizId,serverType,function(data){
            $('#biz_health_list_article ul.list').html(template('biz_health_liut_tmpl',data));
            J.Element.init($('#biz_health_list_article ul.list'));
            J.hideMask();
        })
    }
    return exports;
})
