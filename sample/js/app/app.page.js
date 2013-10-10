/**
 * 页面设定
 * User: shixy
 * Date: 13-4-2
 * Time: 上午9:45
 */
App.page('login',function(){
    var exports = {};
    exports.init = function(){
        _initUserName();
        $('#btn_login').tap(_login);
        if(!J.isWebApp){
            var networkState = navigator.connection.type;
            if(networkState == Connection.NONE){
                if(localStorage.getItem('auto-offline-mode')){
                    J.showToast('无可用网络连接！程序将采用离线模式访问！');
                    J.offline = true;
                }else{
                    J.showToast('无可用网络连接！');
                }
            }else{
                J.showToast('当前网络环境: '+ networkState);
            }
        }
        if(J.offline || localStorage.getItem('auto-login')){
            setTimeout(_autoLogin,1);
        }

    }
    var _login = function(){
        var username = $('#username').val();
        var pwd = $('#password').val();
        if(username == '' || pwd == ''){
            J.alert('提示','请填写完整的信息！');
        }else{
            J.showMask('登录中...');
            RsAPI.auth.login(username,pwd,function(data){
                J.hideMask();
                if(data.error){
                    J.showToast(data.error,'error');
                }else{
                    localStorage.setItem('userInfo',JSON.stringify(data.userInfo));
                    J.Router.turnTo('#index_section');
                }
            })

        }
        return false;
    }
    var _initUserName = function(){
        var userInfo = localStorage.getItem('userInfo');
        if(userInfo){
            userInfo = JSON.parse(userInfo);
            $('#username').val(userInfo.name);
        }
    }
    var _autoLogin = function(){
        var sessionId = localStorage.getItem('sessionId');
        if(sessionId){
            J.showMask('自动登录中...');
            RsAPI.auth.reLogin(function(data){
                J.hideMask();
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

App.page('index',function(){
    var exports = {};
    var serverType = '';
    exports.init = function(){
        var h = AHelper.getArticleOffset().height - 90;
        $('#bizSysContainer').height(h);
        _subscribeEvents();
        _render();
        _checkUnPostData();
    }

    exports.show = function(){
        RsAPI.vmApply.getUnderwayCount(function(count){
            var $count = $('#btn_approval .count');
            if(count>0){
                $count.text(count).show();
            }else{
                $count.hide();
            }
        });
    }

    var _checkUnPostData = function(){
        if(J.Service.getUnPostData()){
            J.showToast('正在同步离线数据...');
            J.Service.syncAllPostData();
        }
    }
    var _subscribeEvents = function(){
        var $box = $('#index_section .box li');
        var $container = $('#bizSysContainer');

        //swipe events
        var _beforeSlide = function(i,deltaX){
            if(i === 0 && deltaX >0) {//swipeRight
                if(!J.isMenuOpen){
                    J.Menu.show('#index_aside');
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
    }
    /**
     * render 全局概览信息
     * @private
     */
    var _render = function(){
        J.Template.loading('#bizSysContainer ul.group_list');
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
                J.tmpl('#bizSysContainer ul.group_list','bizInfoTmpl',data.list);
                J.Scroll('#bizSysContainer');
                _renderUsageChart(data);
                _renderHealth();
            }
        })
    }
    var _renderHealth = function(){
        RsAPI.res.getHealth(function(data){
            $('#bizSysContainer li').each(function(i,el){
                var bizId = $(this).data('id');
                var hdata = data[bizId];
                $(el).find('.progress').css('height',hdata+'%');
                $(el).find('.health-tip span').text(hdata);
            })
        })
    }
    var _renderUsageChart = function(data){
        var cpudata = [],mmdata = [],srdata =[], vmdata = [];
        var colors = ['#2980B9','#F39C12','#16A085','#7F8C8D','#aa4643','#3498DB','#9B59B6','#95A5A6','#F39C12','#C0392B'];
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

App.page('res_period',function(){
    var exports = {};
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
        $('#btn_begin_date,#btn_end_date').tap(function(){
            var $this = $(this);
            J.popup({
                html : '<div id="popup_calendar"></div>',
                pos : 'center',
                backgroundOpacity : 0.4,
                showCloseBtn : false,
                onShow : function(){
                    new J.Calendar('#popup_calendar',{
                        callback:function(date){
                            $this.data('value',date).find('span').text(date);
                            J.closePopup();
                        }
                    });
                }
            });
        });

        $('#btn_res_search').tap(_renderChart);

        _renderBar(new Date());
        _renderChart();
    }
    var _renderBar = function(date){
        var d = AHelper.formatDate(date,'yyyy-MM-dd');
        $('#btn_begin_date').data('value',d).find('span').text(d);
        $('#btn_end_date').data('value',d).find('span').text(d);
    }
    var _renderChart = function(){
        RsAPI.res.getBizResUsage($('#btn_begin_date').data('value'),$('#btn_end_date').data('value'),serverType,function(data){
            var cpuWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var cpuFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var mmWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var mmFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var labels = [];
            for(var i=0;i<data.length;i++){
                var obj = data[i];
                cpuWorkingData.value.push(obj.workingAvgCpuRate/100);
                cpuFreedomData.value.push(obj.freedomAvgCpuRate/100);
                mmWorkingData.value.push(obj.workingAvgMemoryRate/100);
                mmFreedomData.value.push(obj.freedomAvgMemoryRate/100);
                labels.push(obj.businessName);
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
            if($(this).data('loaded')){
                J.Router.turnTo('#alarm_list_section');
            }else{
                J.showToast('数据采集中，请稍候...');
            }

        });
    }
    var _render = function(){
        J.showMask();
        RsAPI.biz.getInfo(data.bizId,function(d){
            $('#biz_sys_section header .title').text(d.name);
            $('#txt_biz_health').text(d.health);
            $('#txt_biz_host').text(0);
            $('#txt_biz_vm').text(d.vmCount);
            $('#txt_biz_cpu').text(d.cpuCount);
            $('#txt_biz_memroy').text(d.memoryCapacity);
            $('#txt_biz_sr').text(d.memoryCapacity);
            J.hideMask();
        });
        $('#txt_biz_alarm').html('<div class="icon spinner" style="font-size: 0.5em"></div>');
        $('#biz_alarm_block').data('loaded',false);
        RsAPI.biz.getAlarms(data.bizId,function(d){
            var num = d.length;
            $('#txt_biz_alarm').html(num);
            $('#biz_alarm_block').data('loaded',true);
            App.page('alarm_list').setData({
                bizId : data.bizId,
                alarms : d
            });
        });
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
        $all.on('articleshow',function(){
            currentArticle = 'all';
            $title.show();
            $group.hide();
            _syncAndRender(currentArticle);
        });
        $cpu.on('articleshow',function(){
            currentArticle = 'cpuTop10';
            $('.control-group li[data-period="'+period+'"]',$cpu).addClass('active').siblings().removeClass('active');
            $title.hide();
            $group.show();
            _syncAndRender(currentArticle);
        });
        $mm.on('articleshow',function(){
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
        J.tmpl('#'+articleId+' ul.list',tmplId,data);
        J.Scroll('#'+articleId);
        J.hideMask();
    }
    return exports;
})

App.page('alarm_list',function(){
    var exports = {};
    var data;
    exports.setData = function(d){data = d; }
    exports.init = function(){

    }
    exports.load = function(){
        if(data.alarms){
            J.tmpl('#alarm_list_article ul.list','alarm_list_tmpl',data.alarms);
        }else{
            J.showMask();
            RsAPI.biz.getAlarms(data.bizId,function(result){
                J.tmpl('#alarm_list_article ul.list','alarm_list_tmpl',result);
                J.hideMask();
            })
        }
    }
    return exports;
})


App.page('vm',function(){
    var exports = {};
    var data;
    exports.setData = function(d){data = d; }
    exports.init = function(){
        $('#vm_section .control-group li').on('tap',function(){
            var actionStr = {'start':'启动','restart':'重启','stop':'停止'}
            var action = $(this).data('action');
            J.showMask('正在'+actionStr[action]);
            RsAPI.vm[action].call(this,data.vmId,function(){
                J.showToast('虚拟机已经'+actionStr[action]);
                exports.load();
            })
        })
    }
    exports.load = function(){
        var vmId = data.vmId;
        J.showMask();
        RsAPI.vm.get(vmId,function(data){
            J.tmpl('#vm_article','vm_detail_tmpl',data);
            J.hideMask();
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
            J.tmpl('#biz_health_list_article ul.list','biz_health_liut_tmpl',data);
            J.hideMask();
        })
    }
    return exports;
});
App.page('vm_apply_list',function(){
    var exports = {},pageNo = 1,$btnGetMore,$underwayList,$finishedList;
    exports.init = function(){
        $btnGetMore = $('#btn_get_more_finished_apply');
        $underwayList = $('#underway_apply_list_article ul.list');
        $finishedList = $('#finished_apply_list_article ul.list');
        $('#vm_apply_list_section header .control-group li').on('tap',function(){
            var $this = $(this);
            if($this.hasClass('active'))return;
            $this.addClass('active').siblings().removeClass('active');
            var type = $(this).data('type');
            if(type == 'underway'){
                $('#underway_apply_list_article').addClass('active');
                $('#finished_apply_list_article').removeClass('active');
                _renderUnderwayList();
            }else{
                $('#underway_apply_list_article').removeClass('active');
                $('#finished_apply_list_article').addClass('active');
                pageNo = 1 ;
                _renderFinishedList();
            }
        });
        $('#vm_apply_list_section article').on('tap',' ul.list li',function(){
            var applicationId = $(this).data('id');
            App.page('vm_apply').setData({id:applicationId});
            J.Router.turnTo('#vm_apply_section');
        });
        J.Refresh('#underway_apply_list_article','pullDown',function(){
            _renderUnderwayList(this);
        });
        $btnGetMore.tap(function(){
            pageNo++;
            $(this).text('加载中...');
            _renderFinishedList();
        });
    }
    exports.load = function(){
        _renderUnderwayList();
    }
    var _renderUnderwayList = function(scroll){
        RsAPI.vmApply.getUnderwayList(function(data){
            J.tmpl($underwayList,'underway_list_tmpl',data);
            scroll && scroll.refresh();
        });
    }
    var _renderFinishedList = function(){
        RsAPI.vmApply.getFinishedList(pageNo, function(data){
            if(data.length == 0){
                if(pageNo == 1){//一条记录都么有
                    J.Template.no_result($finishedList);
                }else{
                    $btnGetMore.show().text('没有了...');
                    pageNo--;//点击加载没有记录,还原页数
                }
            }else{
                J.tmpl($finishedList,'finished_list_tmpl',data,pageNo == 1 ? 'replace' : 'add');
                $btnGetMore.text('点击加载更多...');
            }
        });
    }
    return exports;
})
App.page('vm_apply',function(){
    var exports = {},data,cache_key;
    exports.setData = function(d){data = d; }
    exports.init = function(){
        $('#btn_process_agree').on('tap',function(){
            var param = {
                applicationId : data.id,
                approvalOpinion : $('#approvalOpinion').val(),
                items : _getFinalParam()
            };
            RsAPI.vmApply.agree(param,function(){
                if(J.offline){//处理离线缓存
                    //将缓存中的数据置为审批通过，防止用户在离线模式下重复操作
                    var data = J.Service.getCacheData(cache_key);
                    data.status.name = 'APPROVED';
                    data.status.label = '审批通过';
                    J.Service.saveCacheData(cache_key,data);
                }
                J.showToast('审批通过','success');
                exports.load();
            });
        });
        $('#btn_process_refuse').on('tap',function(){
            var param = {
                applicationId : data.id,
                approvalOpinion : $('#approvalOpinion').val()
            };
            RsAPI.vmApply.refuse(param,function(){
                if(J.offline){//处理离线缓存
                    //将缓存中的数据置为审批拒绝，防止用户在离线模式下重复操作
                    var data = J.Service.getCacheData(cache_key);
                    data.status.name = 'REFUSED';
                    data.status.label = '审批拒绝';
                    J.Service.saveCacheData(cache_key,data);
                }
                J.showToast('申请已退回','success');
                exports.load();
            });
        });
        $('#btn_process_confirm').on('tap',function(){
            var param = {
                applicationId : data.id,
                items : _getRevertInfos()
            };
            RsAPI.vmApply.confirm(param,function(){
                if(J.offline){//处理离线缓存
                    //将缓存中的数据置为审批确认，防止用户在离线模式下重复操作
                    var data = J.Service.getCacheData(cache_key);
                    data.status.name = 'CREATED';
                    data.status.label = '已创建虚拟机';
                    J.Service.saveCacheData(cache_key,data);
                }
                J.showToast('确认成功','success');
                exports.load();
            });
        });
        $('#btn_process_save').on('tap',function(){
            var param = {
                applicationId : data.id,
                items : _getRevertInfos()
            };
            RsAPI.vmApply.saveRevert(param,function(){
                J.showToast('保存成功','success');
                exports.load();
            });
        });
    }
    exports.load = function(){
        var $footer = $('#vm_apply_section footer').addClass('hide');
        var $approve_btn_container = $('#approve_btn_container');
        var $created_btn_container = $('#created_btn_container');
        RsAPI.vmApply.getApply(data.id,function(result,key){
            cache_key = key;
            var status = result.status.name;
            J.tmpl('#vm_apply_article>div.scrollWrapper','vm_apply_article_tmpl',result);
            new J.Slider('#vmConfigList',true);
            $footer.hide();
            if(status == 'WAIT_APPROVAL'){
                $approve_btn_container.css('display','-webkit-box');
                $created_btn_container.css('display','none');
                $footer.show();
            }
            if(status == 'APPROVED'){
                $approve_btn_container.css('display','none');
                $created_btn_container.css('display','-webkit-box');
                $footer.show();
            }
            J.Scroll('#vm_apply_article');
        })
    }

    var _getFinalParam = function(){
        var items  = [];
        $('#vmConfigList  ul').each(function(i,ul){
            var id = $(ul).data('id');
            var finalCpuCount = $(ul).find('input[name="finalCpuCount"]').val();
            var finalMemory = $(ul).find('input[name="finalMemory"]').val();
            var finalStorage = $(ul).find('input[name="finalStorage"]').val();
            items.push({id: id,finalCpuCount:finalCpuCount,finalMemory:finalMemory,finalStorage:finalStorage})
        });
        return items;
    }

    var _getRevertInfos = function(){
        var items = [];
        $('#vmConfigList  ul').each(function(i,ul){
            var itemId = $(ul).data('id');
            var item = {
                id : itemId,
                revertInfos : []
            }
            $('li[data-type="revertInfo"]',ul).each(function(i,revert){
                var revertId = $(revert).data('id');
                var vmName = $('input[name="vmName"]',revert).val();
                var ip = $('input[name="ip"]',revert).val();
                item.revertInfos.push({id:revertId,vmName:vmName,ip:ip});
            })
            items.push(item);
        });
        return items;
    }
    return exports;
})

App.page('user',function(){
    var exports = {};
    exports.init = function(){
        _subscribeEvents();
        _render();
    }
    var _subscribeEvents = function(){

    }
    var _render = function(){
        RsAPI.user.findAll(function(data){
            J.tmpl('#user_article ul.list','user_tmpl',data);
            J.Scroll('#user_article');
        })
    }
    return exports;
});
App.page('setting',function(){
   var exports = {},$autoLogin,$cache,$offline;
    exports.init = function(){
        $autoLogin = $('#toggle_auto_login');
        $cache = $('#toggle_offline_data');
        $offline = $('#toggle_offline_mode');
        $autoLogin.tap(function(){
            localStorage.setItem('auto-login',$(this).hasClass('active'));
        });
        $cache.tap(function(){
            localStorage.setItem('auto-cache-data',$(this).hasClass('active'));
        });
        $offline.tap(function(){
            localStorage.setItem('auto-offline-mode',$(this).hasClass('active'));
        });
        $('#btn_show_welcome').tap(J.showWelcome);
        $('#btn_check_version').tap(function(){
            //window.plugins.updateApp.check(UPDATE_APP_PATH);
            J.showToast('已经是最新版本');
        });
        $('#btn_clear_cache').tap(function(){
            J.Service.clear();
            J.showToast('清空完毕');

        });
        $('#btn_exit_user').tap(function(){
            J.Service.clear();
            window.localStorage.removeItem('sessionId');
            J.Router.turnTo('#login_section');
        });
    }

    exports.load = function(){
        localStorage.getItem('auto-login') == 'true'?$autoLogin.addClass('active'):$autoLogin.removeClass('active');
        localStorage.getItem('auto-cache-data') == 'true'?$cache.addClass('active'):$cache.removeClass('active');
        localStorage.getItem('auto-offline-mode') == 'true'?$offline.addClass('active'):$offline.removeClass('active');
    }
    return exports;
});
App.page('log_analy',function(){
    var exports = {},log,$progress;
    exports.init = function(){
        $progress = $('#file_upload_progress');
        $('#btn_log_upload').on('change',_handler);
        $('#btn_analy').on('tap',function(){
            J.showMask('分析数据中...');
            setTimeout(function(){
                var beginDate = new Date();
                var resultStr = exports.anlaysis(log);
                console.log(resultStr);
                var result = JSON.parse(resultStr);
                $('#log_analy_time').show().find('span').text(new Date()-beginDate);
                _showDistributedChart(result);
                _showTrendChart(result);
                J.Scroll('#log_analy_article',{onBeforeScrollStart:function(){}});
                J.hideMask();
            },1000);

        });
        var cfg = {
            funcPath : "App.page('log_analy').anlaysis",
            thisAttrs : []
        }
      Migrator.migrateToServer(cfg);
    }
    var _handler = function(e){
        var reader = new FileReader();
        reader.onprogress = _onProgress;
        reader.onloadstart = _onStart;
        reader.onload = _onLoad;
        reader.readAsText(e.target.files[0]);
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
        },2000);
    }

    var _showDistributedChart = function(result){
        var data = [
            {name : '信息',value : result.total[0],color:'#1ABC9C'},
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
                color:'#1ABC9C',
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

    exports.anlaysis = function(str){
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

    return exports;
});
App.page('utils',function(){
    var exports = {};
    exports.init = function(){
        $('#service_list li>div').tap(function(){
            var data;
            var $this = $(this);
            var service = $this.data('service');
            var apps = window.localStorage.getItem('_SERVICE_APP_');
            if(service){
                data = {
                    name : service,
                    title :  $this.text()
                };
                if(apps && apps.indexOf(service+'|')>-1){
                    data.url = 'file:///mnt/sdcard/hnyc/'+service+'/index.html'
                }else{
                    data.url = 'http://migrator.duapp.com/static/'+service+'/index.html',
                    data.installUrl = 'http://migrator.duapp.com/static/'+service+'/'+service+'.zip'
                }
            }else{
                data = {
                    url : $this.data('url'),
                    title :  $this.text()
                }
            }
            App.page('service_container').setData(data);
            J.Router.turnTo('#service_container_section');
        });
        $('#service_list li>button').tap(function(){
            var service = $(this).prev().data('service');
            var name = $(this).prev().children('strong').text();
            var installedApps = window.localStorage.getItem('_SERVICE_APP_');
            window.localStorage.setItem('_SERVICE_APP_',installedApps.replace(service+'|',''));
            navigator.app.clearCache();
            exports.show();
            J.showToast(name+'缓存清除成功！','success');
        });
    }
    exports.show = function(){
        $('#service_list li>div[data-service]').each(function(){
            var service = $(this).data('service');
            var apps = window.localStorage.getItem('_SERVICE_APP_');
            if(apps && apps.indexOf(service+'|')>-1){
                $(this).children('div').text('离线访问');
                $(this).next().show();
            }else{
                $(this).children('div').text('云端访问');
                $(this).next().hide();
            }
        })
    }
    return exports;
});
App.page('service_container',function(){
    var exports = {},data;
    exports.setData = function(d){
        data = d;
    }
    exports.init = function(){
        $('#service_container_section').on('pagehide',function(){
            $(this).find('iframe').attr('src','about:blank');
        });
    }
    exports.show = function(){
        if(data.installUrl){
            $('#btn_install_service').show();
            _install();
        }else{
            $('#btn_install_service').hide();
        }
        $('#service_container_section header h1.title').text(data.title);
        $('#frame_service').attr('src',data.url);
    }
    var _install = function(){
        $('#btn_install_service').show();
        window.plugins.component.install(data.installUrl,data.name,
            function(){
                $('#btn_install_service').hide();
                var apps = window.localStorage.getItem('_SERVICE_APP_');
                apps += data.name+'|';
                window.localStorage.setItem('_SERVICE_APP_',apps);
                J.showToast('缓存成功','success');
            },
            function(){
                J.showToast('缓存失败','error')
            });
    }
    return exports;
})