/*
 class name 
 container 可放入其他grid container
 content 内容, 不可放入其他grid container

 container:
    left
    top
    width
    height
    // 邻边
    adjacentSide:
        left
        right
        up
        down

    // 结构树
    domTree:
        before
        after

// 内部
    insertInnerLeft
    insertInnerRight
    insertInnerUp
    insertInnerDown

// 外部
    insertOuterLeft
    insertOuterRight
    insertOuterUp
    insertOuterDown

// 分割
    splitHorizontal
    splitVertical

// divider

// collaps expand

tile
container-axis-horizontal
    panel
    panel.resizeable
    panel.container-axis-vertical.resizble
        panel.resizble
        panel

overlay
    panel.overlay.container-vertical
*/


/**
 * Layout 管理多个容器和容器元素（控制flexbox属性和所有节点信息）
 * Container 容器(block, flex, grid等)，存放容器节点，其本身也可以是容器节点
 * Window（或panel），显示信息的载体, 只能被追加到Container中, Container不能被追加到Window中。如果要实现
 * 分屏，可在Container里或外面加入
 * WindowGroup 
 * -----------
 * Tab 
 * Accordion
 * ...other(添加扩展机制，使其他组件也可以被添加进来)
 */

var utils = {
    dom: {
        strToDom: function(str, selector) {
            let
                parser = new DOMParser
                doc = parser.parseFromString(str, 'text/html')
            return document.querySelector(selector)
        }

    }
}

// 管理多个容器，节点
function Layout() {}
function FlexLayout() {}
function GridLayout() {}
//...

Layout.prototype = (function() {
    var insert = {
        innerLeft: function(){},
        innerRight: function() {},
        innerUp: function(){},
        innerDown: function(){},
        outerLeft: function() {},
        outerRight: function() {},
        outerUp: function(){},
        outerDown: function() {}
    }
    return {
        insert: function(plot) {

        },
        splitHorizontal: function() {},
        splitVertical: function() {},

        collapse: function() {},
        expand: function() {},

    }
})()


// 每个容器，也是一个容器节点
// dom对象的封装
function Container(cfg) {
    this.left = 0
    this.right = 0
    this.width = 0
    this.height = 0
    this.cfg = cfg
    this.el = document.querySelector(this.cfg.el)

    // 是否为容器节点元素
    // 如果是，insertInner之类的方法都不可使用
    this.isItem = false

    if (!this.el.classList.contains(this.cfg.containerClass)) {
        throw new Error(`${this.el} is not a container.`)
    }
}

Container.prototype = (function(){
    function genDirection(dir, size) {
        switch (dir) {
            case 'top':
                return `left: 0; top: 0; width: 100%; height: ${size}; cursor: row-resize;`
            case 'bottom':
                return `left: 0; bottom: 0; width: 100%; height: ${size}; cursor: row-resize;`
            case 'left':
                return `left: 0; top: 0; width: ${size}; height: 100%; cursor: col-resize;`
            default:
                return `right: 0; top: 0; width: ${size}; height: 100%; cursor: col-resize;`
        }
    }
    function createDivider(params) {
        // resize and expanc/collapse
        let 
            cssStr = genDirection(params.direction, params.width)
            domStr = `
                <div class="divider direction-${params.direction}" style="${cssStr}">
                    <div class="switcher"></div>
                </div>
            `,
            parser = new DOMParser,
            doc = parser.parseFromString(domStr, 'text/html')


        return doc.querySelector('.divider')

    }
    return {
        addDivider: function(cfg) {
            cfg = Object.assign({}, this.cfg.divider, cfg)
            this.el.append(createDivider.call(this, cfg))
            return this
        },

        

        // 隐藏，考虑隐藏的方向
        hide: function() {},

        // 根据隐藏的方向打开
        show: function() {},

        // 同级，同方向的节点需要进行resize
        // 其他自适应缩放
        resize: function() {},

        // 从tile转成overlay
        // 需要将节点放到跟容器里
        drag: function() {},

        // 从overlay转成tile
        // inert into placeholder
        // 由容器自己决定是否可被插入， 如果不能插入，往往会转成overlay
        insertInnerUp: function() {},
        insertInnerDown: function() {},
        insertInnerLeft: function() {},
        insertInnerRight: function() {},

        insertOuterUp: function() {},
        insertOuterDown: function() {},
        insertOuterLeft: function() {},
        insertOuterRight: function() {},

        // 分割
        splitHorizontal: function() {},
        splitVertical: function() {},

        // 在本容器里增加group
        // 会产生groupId和Tag组件
        // 容器类型是否为tab类型，生成时就决定，tab样式在初始化时确定
        addGroup: function() {},


    }
})()



// 创建一些数据结构，这些数据结构会生成Tab或其他组件，加入到container中 
class Group {
    // 激活的元素
    activeItem = []
    createGroup(groupId, items) {}

    // id(s) or index(s)
    active(selector) {}

    // 取消激活
    deActive() {}

    // 移动
    next() {
        if (this.done)
            this.head()
        else
            this.cursor++
        return this
    }

    // 增加新元素
    add() {}
    rm() {}
    update() {}


    // 删除新元素
    insert(selector) {}

    // 跳转
    head() {
        this.cursor = 0
        return this
    }
    tail() {
        this.cursor = this.len - 1
        this.done = true
        return this
    }

    // 长度
    len() {
        this.length = this.items.length
        return this
    }

}


/**
 *  {
 *   head: [
 *      {
 *          title,
 *          icon,
 *          close
 *      },
 *      ...
 *   ],
 *   body: [
 *      {
 *          content
 *      }
 *  ]
 * }
 */
class Tab {
    active(){}
    next() {}
    add() {}
    close() {}
}
class TabHead {
    add() {}
    rm() {}
}
class TabBody {
    createBody() {}
    addContent() {}
}

class Window {
    width = 100
    height = 100
    close() {
        this.el.style.display = 'none'
        // other clears...
    }
    min() {}
    max() {}
    normal() {}
    addHead(head) {
        this.head = head
        head.handleClose('click', this.close)
    }
    // 必须
    addBody(body) {
        this.body = body
    }
    addMainMenu() {}
    addContexMenu() {}
    createWindow() {
        let domStr = `
            <div class="window"></div>
        `,
            dom = utils.dom.strToDom(domStr, 'window')
            
        dom.append(this.head)
        dom.append(this.body)
        return this
    }

    // 组
    // 加入组，形成WindowGroup, 通常的表现形式是Tab
    joinGroup(groupId) {}
}



class WindowHead {
    createHead() {
        let domStr = `
            <h3 class="head" title="${this.label}">
                <i class="icon" style="background-image: ${this.icon}"></i>
                <span class="title">${this.label}</span>
            </h3>
        `,
            this.dom = utils.dom.strToDom(domStr, '.title')
            return this.dom
    }
    set title(params) {
        this.label = params.label
    }
    addCloseBtn(btnDom) {
        this.closeBtn = btnDom
        this.dom.append(btnDom)
    }

    handleClose(evt, fn) {
        this.closeBtn.addEventListener(evt, fn, false)
    }
}


class WindowBody {
    createBody() {
        let domStr = `
            <div class="body"> 
            </div>
        `,
            this.dom = utils.dom.strToDom(domStr, '.body')

    }
    addContent(dom) {
        this.dom.append(dom)
    }
}



let container = new Container({
    el: '.layout-item',
    containerClass: 'layout-item',
    divider: {
        width: 5,
        direction: 'right'
    }
})

container
    .addDivider({
        width: 10,
        direction: 'top'
    })
    .addDivider({
        width: 5,
        direction: 'right'
    })