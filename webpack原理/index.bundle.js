(function () {
    var moduleList = [
        function (require, module, exports) {
            //index.js
            const moduleA = require('./moduleA')
            console.log('moduleA', moduleA)
        },
        function (require, module, exports) {
            module.exports = new Date().getTime()
        }
    ];
    //模块直接的依赖映射列表
    var moduleDepIdList = [
        {'./moduleA': 1},
        {}
    ];
    var cache = {}

    function require(id, parentId) {
        var currentModuleId = parentId !== undefined ? moduleDepIdList[parentId][id] : id;
        var module = {exports: {}};
        var moduleFunc = moduleList[currentModuleId];
        //这里的闭包是为了让父模块里面的子模块找到依赖对照列表moduleDepIdList里面的映射关系
        moduleFunc((id) => require(id, currentModuleId), module, module.exports)
        return module.exports;
    }

    window._JSONP = function (chunkId, moduleFunc) {
        var currentChunkStatus = cache[chunkId];
        var resolve = currentChunkStatus[0];
        var module = {exports: {}};
        moduleFunc(require, module, module.exports)
        resolve(module.exports)
    }
    require.ensure = function (chunkId, parentId) {//模块异步加载
        var currentModuleId = parentId !== undefined ? moduleDepIdList[parentId][chunkId] : chunkId;
        var currentChunkStatus = cache[currentModuleId];
        if (!currentChunkStatus) {
            //先判断是否有该模块了，没有通过jsonp异步加载，加载的时候用promise来储存同步的模块，等异步的模块加载完再执行刚才储存同步的模块
            //有点像小规模的洋葱模型
            var $script = document.createElement('script');
            $script.src = chunkId + '.js'
            document.body.appendChild($script);
            var promise = new Promise((resolve, reject) => {
                var chunkCache = [resolve];
                chunkCache.status = true;
                cache[currentModuleId] = chunkCache;
            })
            cache[currentModuleId].push(promise);
            return promise;
        }
        if (currentChunkStatus.status) {
            return currentChunkStatus[1];
        }
    }
    require(0)
})()