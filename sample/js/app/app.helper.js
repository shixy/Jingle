var AHelper = {
    getGB : function(v){
        return Math.round(v/1024);
    },
    getAutoUnit : function(v){
        var g = parseInt(v/1024);
        if(g<1){
            return v+'<sub>MB</sub>';
        }else if(g>1024){
            return Math.round(v/(1024*1024))+'<sub>TB</sub>';
        }else{
            return g + '<sub>GB</sub>';
        }
    },
    formatDate : function(date,format){
        var o =
        {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format))
            format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    },
    time2date : function(time){
        var date = new Date();
        date.setTime(time*1000);
        return this.formatDate(date,'hh:mm:ss ')
    },
    jsonDateFormart : function(dateStr){
        //2012-03-26T11:22:17.031+08:00
        var year = dateStr.substring(0,10);
        var hms = dateStr.substring(11,19);
        return year + ' '+ hms;
    },
    getVMStatusClass : function(status){
        if(status == 'RUNNING' || status == 'ONLINE'){
            return 'green-sea';
        }else if(status == 'DOWN'|| status == 'ERROR' || status == 'OFFLINE' ){
            return 'pomegranate';
        }else{
            return 'orange';
        }
    },
    registerTemplateHelper : function(){
        template.helper('$getGB',this.getGB);
        template.helper('$getAutoUnit',this.getAutoUnit);
        template.helper('$getVMStatusClass',this.getVMStatusClass);
    },
    getArticleOffset : function(){
      if(!App.articleOffset){
          var screenOffset = $('#section-container').offset();
          var width = screenOffset.width;
          var height = screenOffset.height-44;
          App.articleOffset = {
              width:width,
              height:height
          }
      }
        return App.articleOffset;
    },
    //饼图默认配置
    getPieCfg : function(data,renderId,hasFooter){
        var offset = AHelper.getArticleOffset();
        return {
            data : data,
            render : renderId,
            sub_option : {
                mini_label_threshold_angle : 20,//迷你label的阀值,单位:角度
                mini_label:{//迷你label配置项
                    fontsize:20,
                    fontweight:600,
                    color : '#ffffff'
                },
                label : {
                    background_color:null,
                    sign:false,//设置禁用label的小图标
                    padding:'0 4',
                    border:{
                        enable:false,
                        color:'#666666'
                    },
                    fontsize:11,
                    fontweight:600,
                    color : '#4572a7'
                },
                border : {
                    width : 2,
                    color : '#ffffff'
                }
            },
            legend:{
                enable:true,
                padding:0,
                offsety:50,
                color:'#3e576f',
                border:false,
                align:'center',
                valign:'top',
                row:1,
                column:'max',
                background_color : null//透明背景
            },
            shadow : true,
            shadow_blur : 6,
            shadow_color : '#aaaaaa',
            border:false,
            background_color:'#f4f5f5',
            width:offset.width,
            height:offset.height,
            mutex:true
        }
    },
    //环形图默认配置
    getDountCfg : function(data,renderId,centerText){
        var offset = AHelper.getArticleOffset();
        var rows = 2;
        if(data.length>6)rows = 3;
        return {
            data : data,
            render : renderId,
            background_color:'#34495E',
            gradient:true,
            border:false,
            showpercent:true,
            donutwidth:0.5,
            turn_off_touchmove:true,
            //offsety : 20,
            sub_option : {
                mini_label_threshold_angle : 30,//迷你label的阀值,单位:角度
                mini_label:{//迷你label配置项
                    fontsize:10,
                    fontweight:600,
                    color : '#ffffff'
                },
                label : {
                    background_color:null,
                    sign:false,//设置禁用label的小图标
                    border:{
                        enable:false,
                        color:'#666666'
                    },
                    fontsize:11,
                    fontweight:600,
                    color : '#fff'
                },
                listeners:{
                    parseText:function(d, t){
                        return d.get('value');
                    }
                }
            },
            legend:{
                enable:true,
                color:'#fff',
                fontsize:20,//文本大小
                sign_size:20,//小图标大小
                line_height:28,//设置行高
                sign_space:10,//小图标与文本间距
                row:rows,//设置在一行上显示，与column配合使用
                column : 'max',
                border:false,
                valign : 'top',
                align : 'center',
                background_color : null,//透明背景
                listeners:{
                    parse:function(obj,text,i){
                        var t = text + ': '+obj.data[i].value;
                        return {text:t};
                    }
                }
            },
            center:{
                text : centerText,
                shadow:true,
                shadow_offsetx:0,
                shadow_offsety:2,
                shadow_blur:2,
                shadow_color:'#b7b7b7',
                color:'#fff'
            },
            shadow : true,
            shadow_blur : 2,
            shadow_color : '#aaaaaa',
            width:offset.width-20,
            height:offset.height-55-40
        }
    },
    //柱状图默认配置
    getBarCfg : function(data,renderId,labels){
        var offset = AHelper.getArticleOffset();
        return {
            render : renderId,
            data: data,
            labels:labels,
            width:offset.width,
            height:offset.height,
            border:false,
            background_color:'#f4f5f5',
            animation:true,
            showpercent:true,
            z_index : 9,
            legend:{
                enable:true,
                background_color : null,
                border : {
                    enable : false
                },
                align : 'center',
                valign:'top',
                row:1,
                column:'max'
            },coordinate:{
                scale:[{
                    listeners:{
                        parseText:function(t,x,y){
                            return {text:t*100+"%"}
                        }
                    }
                }]
            }
        }
    },
    //折线图默认配置
    getLineCfg : function(data,renderId,labels){
        var offset = AHelper.getArticleOffset();
        return {
            render : renderId,
            data: data,
            align:'center',
            width:offset.width,
            height:offset.height,
            padding:'10px 10px 35px 10px',
            background_color:'#f4f5f5',
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
            sub_option : {
                label:false,
                point_hollow : false
            },
            coordinate:{
                axis:{
                    color:'#9f9f9f',
                    width:[0,0,2,2]
                },
                scale:[{
                    position:'left',
                    start_scale:0,
                    end_scale:100,
                    scale_space:10,
                    scale_size:2,
                    scale_color:'#9f9f9f'
                },{
                    position:'bottom',
                    labels:labels,
                    label : {
                        fontsize:9,
                        textAlign:'right',
                        textBaseline:'middle',
                        rotate:-45
                    }
                }]
            }
        }
    }
};