"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenElementStack = void 0;
const html_js_1 = require("../common/html.js");
//Element utils
const IMPLICIT_END_TAG_REQUIRED = new Set([html_js_1.TAG_ID.DD, html_js_1.TAG_ID.DT, html_js_1.TAG_ID.LI, html_js_1.TAG_ID.OPTGROUP, html_js_1.TAG_ID.OPTION, html_js_1.TAG_ID.P, html_js_1.TAG_ID.RB, html_js_1.TAG_ID.RP, html_js_1.TAG_ID.RT, html_js_1.TAG_ID.RTC]);
const IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([
    ...IMPLICIT_END_TAG_REQUIRED,
    html_js_1.TAG_ID.CAPTION,
    html_js_1.TAG_ID.COLGROUP,
    html_js_1.TAG_ID.TBODY,
    html_js_1.TAG_ID.TD,
    html_js_1.TAG_ID.TFOOT,
    html_js_1.TAG_ID.TH,
    html_js_1.TAG_ID.THEAD,
    html_js_1.TAG_ID.TR,
]);
const SCOPING_ELEMENT_NS = new Map([
    [html_js_1.TAG_ID.APPLET, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.CAPTION, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.HTML, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.MARQUEE, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.OBJECT, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.TABLE, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.TD, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.TEMPLATE, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.TH, html_js_1.NS.HTML],
    [html_js_1.TAG_ID.ANNOTATION_XML, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.MI, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.MN, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.MO, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.MS, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.MTEXT, html_js_1.NS.MATHML],
    [html_js_1.TAG_ID.DESC, html_js_1.NS.SVG],
    [html_js_1.TAG_ID.FOREIGN_OBJECT, html_js_1.NS.SVG],
    [html_js_1.TAG_ID.TITLE, html_js_1.NS.SVG],
]);
const NAMED_HEADERS = [html_js_1.TAG_ID.H1, html_js_1.TAG_ID.H2, html_js_1.TAG_ID.H3, html_js_1.TAG_ID.H4, html_js_1.TAG_ID.H5, html_js_1.TAG_ID.H6];
const TABLE_ROW_CONTEXT = [html_js_1.TAG_ID.TR, html_js_1.TAG_ID.TEMPLATE, html_js_1.TAG_ID.HTML];
const TABLE_BODY_CONTEXT = [html_js_1.TAG_ID.TBODY, html_js_1.TAG_ID.TFOOT, html_js_1.TAG_ID.THEAD, html_js_1.TAG_ID.TEMPLATE, html_js_1.TAG_ID.HTML];
const TABLE_CONTEXT = [html_js_1.TAG_ID.TABLE, html_js_1.TAG_ID.TEMPLATE, html_js_1.TAG_ID.HTML];
const TABLE_CELLS = [html_js_1.TAG_ID.TD, html_js_1.TAG_ID.TH];
//Stack of open elements
class OpenElementStack {
    constructor(document, treeAdapter, handler) {
        this.treeAdapter = treeAdapter;
        this.handler = handler;
        this.items = [];
        this.tagIDs = [];
        this.stackTop = -1;
        this.tmplCount = 0;
        this.currentTagId = html_js_1.TAG_ID.UNKNOWN;
        this.current = document;
    }
    get currentTmplContentOrNode() {
        return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
    }
    //Index of element
    _indexOf(element) {
        return this.items.lastIndexOf(element, this.stackTop);
    }
    //Update current element
    _isInTemplate() {
        return this.currentTagId === html_js_1.TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === html_js_1.NS.HTML;
    }
    _updateCurrentElement() {
        this.current = this.items[this.stackTop];
        this.currentTagId = this.tagIDs[this.stackTop];
    }
    //Mutations
    push(element, tagID) {
        this.stackTop++;
        this.items[this.stackTop] = element;
        this.current = element;
        this.tagIDs[this.stackTop] = tagID;
        this.currentTagId = tagID;
        if (this._isInTemplate()) {
            this.tmplCount++;
        }
        this.handler.onItemPush(element, tagID, true);
    }
    pop() {
        const popped = this.current;
        if (this.tmplCount > 0 && this._isInTemplate()) {
            this.tmplCount--;
        }
        this.stackTop--;
        this._updateCurrentElement();
        this.handler.onItemPop(popped, true);
    }
    replace(oldElement, newElement) {
        const idx = this._indexOf(oldElement);
        this.items[idx] = newElement;
        if (idx === this.stackTop) {
            this.current = newElement;
        }
    }
    insertAfter(referenceElement, newElement, newElementID) {
        const insertionIdx = this._indexOf(referenceElement) + 1;
        this.items.splice(insertionIdx, 0, newElement);
        this.tagIDs.splice(insertionIdx, 0, newElementID);
        this.stackTop++;
        if (insertionIdx === this.stackTop) {
            this._updateCurrentElement();
        }
        this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
    }
    popUntilTagNamePopped(tagName) {
        let targetIdx = this.stackTop + 1;
        do {
            targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
        } while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== html_js_1.NS.HTML);
        this.shortenToLength(targetIdx < 0 ? 0 : targetIdx);
    }
    shortenToLength(idx) {
        while (this.stackTop >= idx) {
            const popped = this.current;
            if (this.tmplCount > 0 && this._isInTemplate()) {
                this.tmplCount -= 1;
            }
            this.stackTop--;
            this._updateCurrentElement();
            this.handler.onItemPop(popped, this.stackTop < idx);
        }
    }
    popUntilElementPopped(element) {
        const idx = this._indexOf(element);
        this.shortenToLength(idx < 0 ? 0 : idx);
    }
    popUntilPopped(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(idx < 0 ? 0 : idx);
    }
    popUntilNumberedHeaderPopped() {
        this.popUntilPopped(NAMED_HEADERS, html_js_1.NS.HTML);
    }
    popUntilTableCellPopped() {
        this.popUntilPopped(TABLE_CELLS, html_js_1.NS.HTML);
    }
    popAllUpToHtmlElement() {
        //NOTE: here we assume that the root <html> element is always first in the open element stack, so
        //we perform this fast stack clean up.
        this.tmplCount = 0;
        this.shortenToLength(1);
    }
    _indexOfTagNames(tagNames, namespace) {
        for (let i = this.stackTop; i >= 0; i--) {
            if (tagNames.includes(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) {
                return i;
            }
        }
        return -1;
    }
    clearBackTo(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(idx + 1);
    }
    clearBackToTableContext() {
        this.clearBackTo(TABLE_CONTEXT, html_js_1.NS.HTML);
    }
    clearBackToTableBodyContext() {
        this.clearBackTo(TABLE_BODY_CONTEXT, html_js_1.NS.HTML);
    }
    clearBackToTableRowContext() {
        this.clearBackTo(TABLE_ROW_CONTEXT, html_js_1.NS.HTML);
    }
    remove(element) {
        const idx = this._indexOf(element);
        if (idx >= 0) {
            if (idx === this.stackTop) {
                this.pop();
            }
            else {
                this.items.splice(idx, 1);
                this.tagIDs.splice(idx, 1);
                this.stackTop--;
                this._updateCurrentElement();
                this.handler.onItemPop(element, false);
            }
        }
    }
    //Search
    tryPeekProperlyNestedBodyElement() {
        //Properly nested <body> element (should be second element in stack).
        return this.stackTop >= 1 && this.tagIDs[1] === html_js_1.TAG_ID.BODY ? this.items[1] : null;
    }
    contains(element) {
        return this._indexOf(element) > -1;
    }
    getCommonAncestor(element) {
        const elementIdx = this._indexOf(element) - 1;
        return elementIdx >= 0 ? this.items[elementIdx] : null;
    }
    isRootHtmlElementCurrent() {
        return this.stackTop === 0 && this.tagIDs[0] === html_js_1.TAG_ID.HTML;
    }
    //Element in scope
    hasInScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === html_js_1.NS.HTML) {
                return true;
            }
            if (SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasNumberedHeaderInScope() {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if ((0, html_js_1.isNumberedHeader)(tn) && ns === html_js_1.NS.HTML) {
                return true;
            }
            if (SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInListItemScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === html_js_1.NS.HTML) {
                return true;
            }
            if (((tn === html_js_1.TAG_ID.UL || tn === html_js_1.TAG_ID.OL) && ns === html_js_1.NS.HTML) || SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInButtonScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === html_js_1.NS.HTML) {
                return true;
            }
            if ((tn === html_js_1.TAG_ID.BUTTON && ns === html_js_1.NS.HTML) || SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInTableScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== html_js_1.NS.HTML) {
                continue;
            }
            if (tn === tagName) {
                return true;
            }
            if (tn === html_js_1.TAG_ID.TABLE || tn === html_js_1.TAG_ID.TEMPLATE || tn === html_js_1.TAG_ID.HTML) {
                return false;
            }
        }
        return true;
    }
    hasTableBodyContextInTableScope() {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== html_js_1.NS.HTML) {
                continue;
            }
            if (tn === html_js_1.TAG_ID.TBODY || tn === html_js_1.TAG_ID.THEAD || tn === html_js_1.TAG_ID.TFOOT) {
                return true;
            }
            if (tn === html_js_1.TAG_ID.TABLE || tn === html_js_1.TAG_ID.HTML) {
                return false;
            }
        }
        return true;
    }
    hasInSelectScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== html_js_1.NS.HTML) {
                continue;
            }
            if (tn === tagName) {
                return true;
            }
            if (tn !== html_js_1.TAG_ID.OPTION && tn !== html_js_1.TAG_ID.OPTGROUP) {
                return false;
            }
        }
        return true;
    }
    //Implied end tags
    generateImpliedEndTags() {
        while (IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) {
            this.pop();
        }
    }
    generateImpliedEndTagsThoroughly() {
        while (IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
            this.pop();
        }
    }
    generateImpliedEndTagsWithExclusion(exclusionId) {
        while (this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
            this.pop();
        }
    }
}
exports.OpenElementStack = OpenElementStack;
//# sourceMappingURL=open-element-stack.js.map