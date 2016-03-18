var xpathTransformer = {
    attrs: {
        last: ["true", "false"]
    },
    children: ["xpath", "anti-xpath", "accessor", "filter", "sub-transformer"]
};

var tags = {
    "!top": ["transformations"],
    transformations: {
        attrs: {
            name: null
        },
        children: ["transformation"]
    },
    transformation: {
        attrs: {
            last: ["true", "false", "group"]
        },
        children: ["content-type", "uri", "status", "transformer"]
    },
    transformer: {
        children: ["xpath-html-transformer", "xpath-xml-transformer", "xpath-json-transformer", "content-transformer"]
    },
    "sub-transformer": {
        children: ["text-replacer", "pattern-replacer", "composite-replacer", "keep"]
    },
    "xpath-html-transformer": xpathTransformer,
    "xpath-xml-transformer": xpathTransformer,
    "xpath-json-transformer": xpathTransformer,
    "content-transformer": {
        children: ["sub-transformer0"]
    },
    "sub-transformer0": {
        children: ["content-replacer"]
    },
    "content-replacer": {
        attrs: {
            url: null,
            format: ["plain", "base64"]
        }
    },
    "pattern-replacer": {
        attrs: {
            pattern: null,
            replace: ["all", "first", "each"],
            "anti-pattern": null
        }
    },
    "composite-replacer": {
        attrs: {
            last: ["true", "false"],
            format: ["plain", "base64"]
        }
    },
    accessor: {
        children: ["tag", "attribute"]
    },
    attribute: {
        attrs: {
            name: null
        }
    },
    "content-type": {
        children: ["string", "pattern", "compare", "string-set", "or", "and", "not"]
    },
    "uri": {
        children: ["string", "pattern", "compare", "string-set", "or", "and", "not"]
    },
    "status": {
        children: ["string", "pattern", "compare", "string-set", "or", "and", "not"]
    },
    "filter": {
        children: ["string", "pattern", "compare", "string-set", "or", "and", "not"]
    },
    string: {
        attrs: {
            substring: null,
            match: ["equals", "starts", "ends", "contains"],
            caseSensitive: ["true", "false"]
        }
    },
    pattern: {
        attrs: {
            options: null
        }
    },
    compare: {
        attrs: {
            type: null,
            operator: ["eq", "ne", "gt", "ge", "lt", "le"]
        }
    },
    "string-set": {
        attrs: {
            caseSensitive: ["true", "false"]
        },
        children: ["string"]
    },
    or: {
        children: ["string", "pattern", "compare", "string-set", "and", "not"]
    },
    and: {
        children: ["string", "pattern", "compare", "string-set", "or", "not"]
    },
    not: {
        children: ["string", "pattern", "compare", "string-set", "and", "or"]
    }
};

function completeAfter(cm, pred) {
    var cur = cm.getCursor();
    if (!pred || pred()) setTimeout(function() {
        if (!cm.state.completionActive)
            cm.showHint({completeSingle: false});
    }, 100);
    return CodeMirror.Pass;
}

function completeIfAfterLt(cm) {
    return completeAfter(cm, function() {
        var cur = cm.getCursor();
        return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
    });
}

function completeIfInTag(cm) {
    return completeAfter(cm, function() {
        var tok = cm.getTokenAt(cm.getCursor());
        if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
        var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
        return inner.tagName;
    });
}

var xmlEditor = CodeMirror.fromTextArea(document.getElementById("xmlEditor"), {
    mode: "xml",
    lineNumbers: true,
    viewportMargin: Infinity,
    lineWrapping: true,
    extraKeys: {
        "'<'": completeAfter,
        "'/'": completeIfAfterLt,
        "' '": completeIfInTag,
        "'='": completeIfInTag,
        "Ctrl-Space": "autocomplete"
    },
    hintOptions: {schemaInfo: tags}
});

var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
    mode: "htmlmixed",
    lineNumbers: true,
    viewportMargin: Infinity,
    lineWrapping: true
});

var sourceEditor = CodeMirror.fromTextArea(document.getElementById("sourceEditor"), {
    mode: "htmlmixed",
    lineNumbers: true,
    viewportMargin: Infinity,
    lineWrapping: true
});

