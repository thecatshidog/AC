var bindingMark = 'data-element-binding'
function Element (id, initData) {
    var self     = this,
        el          = self.el = document.getElementById(id),
        bindings = {}, //内部暂存绑定数据及dom
        data      = self.data = {}, //存储bingding数据并实现监控
        content  = el.innerHTML.replace(/\{\{(.*)\}\}/g, markToken);
    
    el.innerHTML = content;
    
    for (var variable in bindings) {
        bind(variable); //将每个数据的名称比如'msg'绑定到data
    }
    if (initData) {
        for (var variable in initData) {
            data[variable] = initData[variable]
        }
    }
    function markToken (match, variable) {
        bindings[variable] = {} //bindings里存储了数据来源的字段比如bindings['msg']
        return '<span ' + bindingMark + '="' + variable +'"></span>'
    }
    function bind (variable) {
        bindings[variable].els = el.querySelectorAll('[' + bindingMark + '="' + variable + '"]');//bindings里再存储msg绑定的元素
        [].forEach.call(bindings[variable].els, function (e) { //删除data-element-binding属性
            e.removeAttribute(bindingMark)
        })
        Object.defineProperty(data, variable, { //es5观察属性
            set: function (newVal) {
                [].forEach.call(bindings[variable].els, function (e) {
                    bindings[variable].value = e.textContent = newVal //=>这里才是实现的绑定,更新数据到dom并更新内部暂存数据
                })
            },
            get: function () {
                return bindings[variable].value  //取数据仅仅是内部暂存的数据
            }
        })
    }
}