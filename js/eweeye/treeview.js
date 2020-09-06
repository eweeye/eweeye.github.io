if (!window.eweeye) {
    window.eweeye = { };
}
if (!window.eweeye.Constants) {
    window.eweeye.Constants = {};
}

// Add constants to ui namepace
window.eweeye.Constants.Library = "eweeye";
window.eweeye.Constants.NodeItem = "node";
window.eweeye.Constants.NodeButton = "main";
window.eweeye.Constants.NodeIcon = "icon";
window.eweeye.Constants.NodeLabel = "label";
window.eweeye.Constants.NodeSelf = "self";
window.eweeye.Constants.NodeChildren = "children";
window.eweeye.Constants.NodeOptions = "options";
window.eweeye.Constants.Hidden = "hidden";

(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.Tree) {
        _root.eweeye.Tree = {};
    }

    var _tree = _root.eweeye.Tree;
    var _constants = _root.eweeye.Constants;

    // Add base tree type constructor functions
    _tree.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    _tree.Type.Base = function Base(id, theme) {
        this.Id = id;
        this.Nodes = {};
        if (theme) {
            this.Theme = theme;
        }
    };
    _tree.Type.Base.prototype.Nodes = {};
    _tree.Type.Base.prototype.Theme = "";
    _tree.Type.Base.prototype.Add = function(node) {
        var _control = window.eweeye.TreeView;       
        if (!node) {
            return;
        }
        if (typeof node === "string") {
            if (!_control.Nodes.hasOwnProperty(node)) {
                console.error("Unknown Node");
                return;
            }
            this.Nodes[node] = node;
            if (this.Theme) {
                _control.Nodes[node].Theme = this.Theme;
            }
        }
    };
    _tree.Type.Base.prototype.Has = function(node) {
        if (!node) {
            return false;
        }
        if (typeof node === "string") {
            return this.Nodes.hasOwnProperty(node);
        }
        if (node.hasOwnProperty("Id")) {
            return this.Nodes.hasOwnProperty(node.Id);
        }
        return false;
    };    

    _tree.Create = function(id, theme) {
        return new eweeye.Tree.Type.Base(id, theme);
    };
})();
(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    var Node = function Node() {};
    Node.prototype.GetContainerElement = function(node) {
        // Determine the UL that the node should be added under
        // Default: Root of the tree
        var id = node.Tree;
        // Alternate: Parent within the tree
        if (node.Parent) {
            id = node.Parent;
        }
        // Verify the containing UL exists in the DOM already
        var found = document.getElementById(id);
        if (!found) {
            console.error("Unable to add to DOM");
            return null;
        }
        // If the selected element is not a UL, the child UL needs to be found
        if (!(found instanceof HTMLUListElement)) {
            // If the selected element is a LI, it is a list item that may have a UL for children
            if (found instanceof HTMLLIElement) {
                found = Array.prototype.filter.call(found.children,
                    function (found) {
                        return found instanceof HTMLUListElement;
                    });
                if (found && found.length > 0) {
                    found = found[0];
                }
            }
        }
        if (!found) {
            console.error("Unable to add to DOM");
            return;
        }                
        return found;
    };
    Node.prototype.GetElement = function(node) {
        return (function(node){
            var found = document.getElementById(node.Id);
            if (!found) {
                console.error("Unable to find in DOM");
                return;
            }                
            return found;
        })(node);
    };

    if (!_root.eweeye.Node) {
        _root.eweeye.Node = new Node();
    }

    var _node = _root.eweeye.Node;
    var _constants = _root.eweeye.Constants;

    // Add base node type constructor functions
    _node.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    _node.Type.Base = function Base(tree, parent, id) {
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
    };
    _node.Type.Base.prototype.Tree = "";
    _node.Type.Base.prototype.Parent = "";
    _node.Type.Base.prototype.Id = "";
    _node.Type.Base.prototype.Reactions = {};
    _node.Type.Base.prototype.Rendered = false;
    // Function to render a node into the DOM
    _node.Type.Base.prototype.Render = function() {
        var _node = window.eweeye.Node;
        var li;
        if (!this.Rendered) {
            var ul = _node.GetContainerElement(this);
            if (ul) {
                li = this.CreateElement();
                ul.appendChild(li);
            }   
        } else {
            li = _node.GetElement(this);
            if (li) {
                this.UpdateElement(li);
            }
        }
    };
    _node.Type.Base.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _node.Type.Base.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
        span.classList.add('fa-question');
        return span;
    };
    _node.Type.Base.prototype.CreateElement = function() {
        var li = document.createElement('li');
        li.id = this.Id;
        li.classList.add(_constants.NodeItem);
        var self = document.createElement('div');
        self.classList.add(_constants.NodeSelf);
        var button = document.createElement('button');
        button.classList.add(_constants.NodeButton);
        self.appendChild(button);
        var icon = document.createElement('div');
        icon.classList.add(_constants.NodeIcon);
        icon.appendChild(this.RenderIcon());
        icon.classList.add(_constants.NodeIcon);
        var label = document.createElement('div');
        label.classList.add(_constants.NodeLabel);
        label.appendChild(this.RenderContent());
        if (icon) {
            button.appendChild(icon);
        }
        if (label) {
            button.appendChild(label);
        }
        var options = document.createElement('div');
        options.classList.add(_constants.NodeOptions);
        li.appendChild(self);
        li.appendChild(options);
        this.Rendered = true;
        return li;
    };    
    _node.Type.Base.prototype.UpdateElement = function(li) {
        var button = li.querySelector('button.' + _constants.NodeButton);
        if (button) {
            var icon = button.querySelector('div.' + _constants.NodeIcon);
            if (icon) {
                icon.innerHTML = '';
                icon.appendChild(this.RenderIcon());
            }
            var label = button .querySelector('div.' + _constants.NodeLabel);
            if (label) {
                label.innerHTML = '';
                label.appendChild(this.RenderContent());
            }
        }
    };
    _node.Type.Base.prototype.Trigger = function(action, node, message) {
        if (action === "click") {
            console.log("Node [" + this.Id + "] clicked.");
            this.TriggerParent("poke", "Message from son!");
            this.TriggerSiblings("poke", "Message from bro!");
            if (this.TriggerChildren) {
                this.TriggerChildren("poke", "Message from dad!");
            }
        } else if (action === "poke") {
            console.log("Node [" + this.Id + "] poked by node [" + node.Id + "] with message [" + JSON.stringify(message) + "]");
        }
        if (this.Reactions.hasOwnProperty(action)) {
            this.Reactions[action].call(this, node);
        }
    };
    _node.Type.Base.prototype.TriggerParent = function(action, message) {
        if (!this.Parent) {
            console.log("Node [" + this.Id + "] has no parent.");
            return;
        }
        if (window.eweeye.TreeView.Nodes.hasOwnProperty(this.Parent)) {
            window.eweeye.TreeView.Nodes[this.Parent].Trigger(action, this, message);
        }
    };
    _node.Type.Base.prototype.TriggerSiblings = function(action, message) {
        // If the parent is falsey, the sibilings are the root nodes
        if (!this.Parent) {
            for (var prop1 in window.eweeye.TreeView.Nodes) {
                if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop1) && prop1 !== this.Id) {
                    if (!window.eweeye.TreeView.Nodes[prop1].Parent) {
                        window.eweeye.TreeView.Nodes[prop1].Trigger(action, this, message);
                    }
                }
            }
        } else {
            if (window.eweeye.TreeView.Nodes.hasOwnProperty(this.Parent)) {
                var node = window.eweeye.TreeView.Nodes[this.Parent];
                if (node instanceof window.eweeye.Node.Type.Expandable) {
                    for (var prop2 in node.Children) {
                        if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop2) && prop2 !== this.Id) {
                            window.eweeye.TreeView.Nodes[prop2].Trigger(action, this, message);
                        }
                    }    
                }
            }
        }
    };     

    _node.Type.Primitive = function Primitive(node) { 
        this.Tree = node.Tree;
        this.Parent = node.Parent;
        this.Id = node.Id;
        this.Value = node.Value;
        if (node.hasOwnProperty("Icon")) {
            this.Icon = node.Icon;
        } else {
            if (this.Value === null) 
            this.Icon = "ban";
            if (this.Value || this.Value === false || this.Value === 0) {
                switch (typeof this.Value) {
                    case "undefined":
                        this.Icon = "ban";
                        break;
                    case "boolean":
                        if (this.Value) 
                            this.Icon = "check";
                        else
                            this.Icon = "times";
                        break;
                    case "number":
                        this.Icon = "hashtag";
                        break;
                    case "string":
                        this.Icon = "text";
                        break;
                    case "object":
                        this.Icon = "cube";
                        break;
                    case "function":
                        this.Icon = "rocket";
                        break;
                }
            }
        }
    };
    Inherit(_node.Type.Primitive, _node.Type.Base);
    _node.Type.Primitive.prototype.Value = null;
    _node.Type.Primitive.prototype.Icon = "circle";
    _node.Type.Primitive.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        var element = null;
        if (this.Value === null) 
            text = "null";
        if (this.Value || this.Value === false || this.Value === 0) {
            switch (typeof this.Value) {
                case "undefined": 
                    text = "undefined";
                    break;
                case "boolean":
                    if (this.Value)
                        text = "true";
                    else
                        text = "false";
                    break;
                case "number":
                    text = this.Value.toString();
                    break;
                case "string":
                    text = this.Value;
                    break;
                case "object":
                    try {
                    if (this.Value instanceof HTMLElement)
                        element = this.Value;
                    } catch (e) {
                        text = JSON.stringify(this.Value);
                    }
                    break;
                case "function":
                    text = JSON.stringify(this.Value);
                    break;
            }
        }
        if (!element) {
            span.appendChild(document.createTextNode(text));
        } else {
            span.appendChild(element);
        }
        return span;
    };
    _node.Type.Primitive.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
        if (this.Value === null) 
        span.classList.add('fa-ban');
        span.classList.add('fa-' + this.Icon);
        return span;
    };

    _node.Type.Toggle = function Toggle(node) { 
        this.Tree = node.Tree;
        this.Parent = node.Parent;
        this.Id = node.Id;
        this.Value = node.Value;
        if (node.hasOwnProperty("IconTrue")) {
            this.IconTrue = node.IconTrue;
        }
        if (node.hasOwnProperty("IconFalse")) {
            this.IconFalse = node.IconFalse;
        }
    };
    Inherit(_node.Type.Toggle, _node.Type.Base);
    _node.Type.Toggle.prototype.Value = false;
    _node.Type.Toggle.prototype.IconTrue = "dot-circle";
    _node.Type.Toggle.prototype.IconFalse = "circle";    
    _node.Type.Toggle.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "false";
        if (this.Value) 
            text = "true";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _node.Type.Toggle.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
        if (this.Value) 
            span.classList.add('fa-' + this.IconTrue);
        else
            span.classList.add('fa-' + this.IconFalse);
        return span;
    };
    _node.Type.Toggle.prototype.Reactions = {
        "click": function (actor) {
            this.Value = !this.Value;
            this.Render();
        }
    };

    _node.Type.Expandable = function Expandable(node) { 
        this.Id = node.Id;
        this.Tree = node.Tree;
        this.Value = node.Value;
        this.Parent = node.hasOwnProperty("Parent") ? node.Parent : null;
        if (node.hasOwnProperty("IconOpen")) {
            this.IconOpen = node.IconOpen;
        }
        if (node.hasOwnProperty("IconClosed")) {
            this.IconClosed = node.IconClosed;
        }
        this.Children = {};
    };
    Inherit(_node.Type.Expandable, _node.Type.Primitive);
    _node.Type.Expandable.prototype.Children = {};
    _node.Type.Expandable.prototype.Expanded = false;
    _node.Type.Expandable.prototype.IconOpen = "minus-square";
    _node.Type.Expandable.prototype.IconClosed = "plus-square";
    _node.Type.Expandable.prototype.Reactions = {
        "click": function (actor) {
            this.Expanded = !this.Expanded;
            this.Render();
        }
    };  
    _node.Type.Expandable.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);        
        if (this.Expanded) {
            if (this.IconOpen && typeof this.IconOpen === 'string') {
                span.classList.add('fa-' + this.IconOpen);
            }
        } else {
            if (this.IconClosed && typeof this.IconClosed === 'string') {
                span.classList.add('fa-' + this.IconClosed);
            }
        }
        return span;
    };
    _node.Type.Expandable.prototype.CreateElement = function() {
        var li = document.createElement('li');
        li.id = this.Id;
        li.classList.add(_constants.NodeItem);
        var self = document.createElement('div');
        self.classList.add(_constants.NodeSelf);
        var button = document.createElement('button');
        button.classList.add(_constants.NodeButton);
        self.appendChild(button);
        var icon = document.createElement('div');
        icon.classList.add(_constants.NodeIcon);
        icon.appendChild(this.RenderIcon());
        icon.classList.add(_constants.NodeIcon);
        var label = document.createElement('div');
        label.classList.add(_constants.NodeLabel);
        label.appendChild(this.RenderContent());
        if (icon) {
            button.appendChild(icon);
        }
        if (label) {
            button.appendChild(label);
        }
        var options = document.createElement('div');
        options.classList.add(_constants.NodeOptions);
        li.appendChild(self);
        li.appendChild(options);
        var ul = document.createElement('ul');
        ul.classList.add(_constants.NodeChildren);
        li.appendChild(ul);
        this.Rendered = true;
        return li;
    };
    _node.Type.Expandable.prototype.UpdateElement = function(li) {
        var button = li.querySelector('button.' + _constants.NodeButton);
        if (button) {
            var icon = button.querySelector('div.' + _constants.NodeIcon);
            if (icon) {
                icon.innerHTML = '';
                icon.appendChild(this.RenderIcon());
            }
            var label = button .querySelector('div.' + _constants.NodeLabel);
            if (label) {
                label.innerHTML = '';
                label.appendChild(this.RenderContent());
            }
        }
        var children = li.querySelector('ul.' + _constants.NodeChildren);
        if (children) {
            if (this.Expanded) {
                for (var prop in this.Children) {
                    if (this.Children.hasOwnProperty(prop)) {
                        var subnode = _root.eweeye.TreeView.Nodes.Get(prop);
                        if (!subnode.Rendered) {
                            subnode.Render();
                        }
                    }
                }
                children.classList.remove(_constants.Hidden);
            } else {
                children.classList.add(_constants.Hidden);                    
            }
        }
    };
    _node.Type.Expandable.prototype.TriggerChildren = function(action, message) {
        for (var prop in this.Children) {
            if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop)) {
                window.eweeye.TreeView.Nodes[prop].Trigger(action, this, message);
            }
        }    
    };     

    _node.Create = function(node) {
        if (node.hasOwnProperty("Type")) {
            switch (node.Type.toLowerCase()) {
                case "expandable":
                    return new eweeye.Node.Type.Expandable(node);
                case "toggle":
                    return new eweeye.Node.Type.Toggle(node);
                default:
                    return new eweeye.Node.Type.Primitive(node);
            }
        }
    };
})();
(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.TreeView) {
        _root.eweeye.TreeView = {};
        _root.eweeye.TreeView.Type = {};
        _root.eweeye.TreeView.Type.Nodes = function Nodes() {};
        _root.eweeye.TreeView.Type.Nodes.prototype.Has = function(node) {
            if (typeof node === "string") {
                return this.hasOwnProperty(node);
            } else {
                if (node.hasOwnProperty("Id")) {
                    return this.hasOwnPropery(node.Id);
                }
            }
            return false;
        };
        _root.eweeye.TreeView.Type.Nodes.prototype.Get = function(node) {
            if (this.Has(node)) {
                if (typeof node === "string") {
                    return this[node];
                } else {
                    if (node.hasOwnProperty("Id")) {
                        return this[node.Id];
                    }
                }    
            }
            return null;
        };
        _root.eweeye.TreeView.Type.Nodes.prototype.Add = function(node) {
            var _control = window.eweeye.TreeView;
            if (!node) {
                console.error("Empty node");
                return;
            }
            if (!_control.Trees.Has(node.Tree)) {
                console.error("Unknown tree");
                return;
            }
            if (_control.Trees[node.Tree].Has(node.Id)) {
                console.error("Node already exists in tree");
                return;
            }
            if (_control.Nodes.Has(node.Id)) {
                console.error("Node already exists in alternate tree");
                return;
            }                
            if (document.getElementById(node.Id)) {
                console.error("Id already exists in DOM");
                return;
            }
            // Add node to treeview/tree
            _control.Nodes[node.Id] = node;
            _control.Trees[node.Tree].Add(node.Id);
            // If node is expandable and orphans exist, then check orphans
            if (_control.Orphans.length > 0 && node instanceof eweeye.Node.Type.Expandable) {
                for (var o = 0, olen = _control.Orphans.length; o < olen; o++) {
                    // If orphan has new node as it's parent, then reparent
                    if (_control.Nodes[_control.Orphans[o]].Parent === node.Id) {
                        var id = _control.Nodes[_control.Orphans[o]].Id;
                        node.Children[id] = id;
                        _control.Orphans.splice(o,1);
                        olen--;
                        o--;
                    }
                }
            }                         
            var render = true;
            // Check if it has a parent
            if (node.Parent) {
                // If parent doesn't exist, then node is orphaned
                if (!_control.Nodes.Has(node.Parent)) {
                    _control.Orphans.push(node.Id);
                    render = false;
                    return;
                }
                // If parent does exist, then update parent's children
                var parentNode = _control.Nodes[node.Parent];
                if (!(parentNode instanceof eweeye.Node.Type.Expandable)) {
                    render = false;
                    return;
                }
                parentNode.Children[node.Id] = node.Id;
                // Check if node needs to be rendered immediately
                var tempParentId = node.Parent;
                var parent = _control.Nodes[tempParentId];
                if (parent.Rendered === false || parent.Expanded === false) {
                    render = false;
                }                
            }
            if (render) {
                node.Render();
            }
        }; 

        _root.eweeye.TreeView.Type.Trees = function Trees() {};
        _root.eweeye.TreeView.Type.Trees.prototype.Has = function(tree) {
            if (typeof tree !== "string" || !window.eweeye.TreeView.Trees.hasOwnProperty(tree)) {
                return false;
            }
            return true;
        };
        _root.eweeye.TreeView.Type.Trees.prototype.Add = function(tree) {
            var _control = window.eweeye.TreeView;
            if (!tree) {
                console.error("Empty tree");
                return;
            }
            if (typeof tree === "string") {
                if (_control.Trees.Has(tree)) {
                    console.error("Tree already exists");
                    return;
                }
                _control.Trees[tree] = new _root.eweeye.Tree.Type.Base(tree);
            } else if (tree instanceof _root.eweeye.Tree.Type.Base) {
                if (_control.Trees.Has(tree.Id)) {
                    console.error("Tree already exists");
                    return;
                }
                _control.Trees[tree.Id] = tree;
            }
        };

        _root.eweeye.TreeView = {
            Trees: new _root.eweeye.TreeView.Type.Trees(),
            Nodes: new _root.eweeye.TreeView.Type.Nodes(),
            Orphans: []
        };
    }

    var _control = _root.eweeye.TreeView;
    _control._renderQueue = [];

})();
document.addEventListener('click', function(event) {
    var GetClosest = function (elem, selector) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;
    };
    // look for the containing button
    var button = GetClosest(event.target, 'button');
    if (button) {
        // check for main button of node
        if (button.matches('.' + window.eweeye.Constants.NodeButton)) {
            var li = GetClosest(button, 'li');
            if (li.matches('.' + window.eweeye.Constants.NodeItem)) {
                var nodeId = li.id;
                var result = eweeye.TreeView.Nodes[nodeId].Trigger("click", "user");
                if (result) {
                    eweeye.TreeView.Render(result);
                }
            }
        }
    }
});
(function () {    
    var _id = 1;
    var processTrees = function() {
        var _control = window.eweeye.TreeView;
        var found = document.getElementsByClassName("eweeye-treeview");
        if (found) {
            for (var i = 0, ilen = found.length; i < ilen; i++) {
                var tree = found[i];
                var items = [];
                // Each tree must have an id, assign one if one doesn't exist
                if (!tree.id) {
                    tree.id = _id.toString();
                    _id++;
                    while (_control.Trees.Has(tree.id)) {
                        tree.id = _id.toString();
                        _id++;
                    }
                }
                // Add tree item if it doesn't exist
                if (!_control.Trees.Has(tree.id)) {
                    _control.Trees.Add(tree.id);
                }
                // Each tree's child LI elements are nodes, anything else is to be disposed
                for (var j = 0, jlen = tree.children.length; j < jlen; j++) {
                    if (tree.children[j].matches("li")) {
                        items.push(tree.children[j]);
                    }
                }
                // Iterate through each LI and convert it to nodes
                for (var k = 0, klen = items.length; k <  klen; k++) {
                    if (!items[k].id || (items[k].id && !window.eweeye.TreeView.Nodes.Has(items[k].id))) {                    
                        processItem(tree.id, null, items[k]);
                        tree.removeChild(items[k]);
                    }
                }
            }
            return;
        }               
    };
    var processItem = function(tree, parent, item) {
        var _control = window.eweeye.TreeView;
        var _node = window.eweeye.Node;
        var node = {
            Id: (Math.floor((Math.random() * 9007199254740990) + 1)).toString(),
            Tree: tree,
            Parent: parent,
            Value: document.createElement("div")
        };
        var lists = [];
        // Each node must have an id, assign one if one doesn't exist for item
        while (document.getElementById(node.Id)) {
            node.Id =(Math.floor((Math.random() * 9007199254740990) + 1)).toString();
        }
        // Check for icon on LI
        if (item.getAttribute('Icon')) {
            node.Icon = item.getAttribute('Icon');
        }
        // Each item's child UL elements are child node containers, anything else is content
        for (var j = 0, jlen = item.children.length; j < jlen; j++) {
            if (item.children[j].matches("ul") || item.children[j].matches("ol")) {
                lists.push(item.children[j]);
            }
        }
        for (var m = 0, mlen = lists.length; m < mlen; m++) {
            item.removeChild(lists[m]);
        }
        // Each item's child UL elements are child node containers, anything else is content
        while (item.childNodes.length > 0) {
            node.Value.appendChild(item.childNodes[0]);
        }
        if (lists.length > 0) {
            node.Type = "Expandable";
        } else {
            node.Type = "Primitive";
            if (!node.hasOwnProperty("Icon")) {
                node.Icon = "circle";
            }
        }
        _control.Nodes.Add(_node.Create(node));
        // Iterate through each UL/OL and convert it to nodes
        for (var k = 0, klen = lists.length; k <  klen; k++) {
            processList(tree, node.Id, lists[k]);
        }
    };
    var processList = function(tree, parent, item) {
        var items = [];
        // Each item's child UL elements are child node containers, anything else is content
        for (var j = 0, jlen = item.children.length; j < jlen; j++) {
            if (item.children[j].matches("li")) {
                items.push(item.children[j]);
            }
        }
        // Iterate through each LI and convert it to nodes
        for (var k = 0, klen = items.length; k <  klen; k++) {
            if (!items[k].id || (items[k].id && !window.eweeye.TreeView.Nodes.Has(items[k].id))) {                    
                processItem(tree, parent, items[k]);
                item.removeChild(items[k]);
            }
        }
    };    
    if (
        document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        processTrees();
    } else {
        document.addEventListener("DOMContentLoaded", processTrees);
    }
})();