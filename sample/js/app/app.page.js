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
            J.alert('提示','请填写完整的信息！');
        }else{
            RsAPI.auth.login(username,pwd,function(data){
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
    var serverType = 'PC';
    exports.init = function(){
        var h = AHelper.getArticleOffset().height - 90;
        $('#bizSysContainer').height(h);
        _subscribeEvents();
        _render();
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
        var beginDate,endDate
        RsAPI.res.getBizResUsage(AHelper.formatDate(searchDate,'yyyy-MM-dd'),serverType,function(data){
            var cpuWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var cpuFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var mmWorkingData = {name : '工作时间',color:'#4572a7',value:[]};
            var mmFreedomData = {name : '非工作时间',color:'#aa4643',value:[]};
            var labels = [];
            for(var i=0;i<data.length;i++){
                var obj = data[i];
                cpuWorkingData.value.push(obj.workingAvgCpuRate);
                cpuFreedomData.value.push(obj.freedomAvgCpuRate);
                mmWorkingData.value.push(obj.workingAvgMemoryRate);
                mmFreedomData.value.push(obj.freedomAvgMemoryRate);
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
    var exports = {};
    var pageNo = 0 ;
    exports.init = function(){
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
                pageNo = 0 ;
                _renderFinishedList();
            }
        });
        $('#vm_apply_list_section article').on('tap',' ul.list li',function(){
            var applicationId = $(this).data('id');
            App.page('vm_apply').setData({id:applicationId});
            J.Router.turnTo('#vm_apply_section');
        });
        J.Refresh('#underway_apply_list_article','pullDown',function(){
            this.refresh();
        });
        J.Refresh('#finished_apply_list_article','pullUp',function(){
            this.refresh();
        });
    }
    exports.load = function(){
        _renderUnderwayList();
    }
    var _renderUnderwayList = function(){
        J.showMask();
        RsAPI.vmApply.getUnderwayList(function(data){
            J.tmpl('#underway_apply_list_article ul.list','underway_list_tmpl',data);
            J.hideMask();
        });
    }
    var _renderFinishedList = function(){
        J.showMask();
        RsAPI.vmApply.getFinishedList(pageNo, function(data){
            if(pageNo == 0 && data.length == 0){
                $('#finished_apply_list_article .refresh-container').hide();
            }
            J.tmpl('#finished_apply_list_article ul.list','finished_list_tmpl',data);
            J.hideMask();
        });
    }
    return exports;
})
App.page('vm_apply',function(){
    var exports = {};
    var data;
    exports.setData = function(d){data = d; }
    exports.init = function(){
        $('#btn_process_agree').on('tap',function(){
            var param = {
                applicationId : data.id,
                approvalOpinion : $('#approvalOpinion').val(),
                items : _getFinalParam()
            };
            RsAPI.vmApply.agree(param,function(){
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
        RsAPI.vmApply.getApply(data.id,function(result){
            var status = result.status.name;
            if(status == 'WAIT_APPROVAL'){
                $approve_btn_container.css('display','-webkit-box');
                $created_btn_container.css('display','none');
                $footer.removeClass('hide');
            }
            if(status == 'APPROVED'){
                $approve_btn_container.css('display','none');
                $created_btn_container.css('display','-webkit-box');
                $footer.removeClass('hide');
            }
            J.tmpl('#vm_apply_article>div','vm_apply_article_tmpl',result);
            new J.Slider('#vmConfigList',true);
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
})