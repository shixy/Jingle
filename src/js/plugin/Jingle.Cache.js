/**
 * 数据缓存
 * todo  对数据进行加密
 */
Jingle.Cache = (function(J,$){
    var UNPOST_KEY = '_J_P_',
        GET_KEY_PREFIX = '_J_';

    /**
     * 缓存从服务端获取的数据
     * @param key
     * @param value
     */
    var save = function(key,value){
        var data = {
            data : value,
            cacheTime : new Date()
        }
        window.localStorage.setItem(GET_KEY_PREFIX+key,JSON.stringify(data));
    }
    /**
     * 获取本地已缓存的数据
     */
    var get = function(key){
        return JSON.parse(window.localStorage.getItem(GET_KEY_PREFIX+key));
    }

    /**
     * 缓存本地待提交到服务端的数据(离线操作)
     * @param url
     * @param result
     */
    var savePost = function(url,result){
        var data = getPost();
        data = data || {};
        data[url] = {
            data : result,
            createdTime : new Date()
        }
        window.localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
    }

    /**
     *  获取本地尚未提交到服务端的缓存数据
     * @param url  没有就返回所有未同步的数据
     */
    var getPost = function(url){
        var data = JSON.parse(window.localStorage.getItem(UNPOST_KEY));
        return (data && url ) ? data[url] : data;
    }
    /**
     * 移除未提交的待提交到服务端的缓存数据
     * @param url 没有就移除所有未提交的数据
     */
    var removePost = function(url){
        if(url){
            var data = getPost();
            delete data[url];
            window.localStorage.setItem(UNPOST_KEY,JSON.stringify(data));
        }else{
            window.localStorage.removeItem(UNPOST_KEY);
        }
    }
    /**
     * 同步本地未提交的数据到服务端
     * * @param url 没有就同步所有未提交的数据
     */
    var syncPost = function(url,success,error){
        var dataLen,index = 0;
        if($.type(url) == 'string'){
            dataLen = 1;
            sync(url);
        }else{
            var postData = getPost();
            if(!postData)return;
            dataLen = postData.length;
            for(var url in postData){
                sync(url);
            }
        }
        function sync(url){
            var data = getPost(url).data;
            $.ajax({
                url : url,
                contentType:'application/json',
                data : data,
                type : 'post',
                success : function(){
                    index++;
                    removePost(url);
                    if(index == dataLen)success(url);
                },
                error : function(){
                    error(url);
                }
            })
        }
    }

    /**
     * 清空本地缓存
     */
    var clear = function(){
        var storage = window.localStorage;
        for(var key in storage){
            if(key.indexOf(GET_KEY_PREFIX) == 0){
                storage.removeItem(key);
            }
        }
        storage.removeItem(UNPOST_KEY);
    }


    return {
        get : get,
        save : save,
        getPost : getPost,
        savePost : savePost,
        removePost : removePost,
        syncPost : syncPost,
        clear : clear
    }

})(Jingle,Zepto);