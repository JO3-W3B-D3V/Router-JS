/**
 * @author      Joseph Evans<joeevs196@gmail.com>
 * @since       05/07/2018
 * @version     0.0.1
 * @description the prupose of this code is to allow your SPA
 *              to be able to route through to different pages
 *              I'm not reinventing the wheel here, I'm simply
 *              making sure that the code is stable and that it
 *              works in the likes of IE 8
 *
 * @todo      general tidy up & more documentation
 *
 * @copyright (c) 2018 copyright holder all Rights Reserved.
 *            Permission is hereby granted, free of charge, to any person obtaining a copy
 *            of this software and associated documentation files (the "Software"), to deal
 *            in the Software without restriction, including without limitation the rights
 *            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *            copies of the Software, and to permit persons to whom the Software is
 *            furnished to do so, subject to the following conditions:
 *
 *            The above copyright notice and this permission notice shall be included in all
 *            copies or substantial portions of the Software.
 *
 *            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *            SOFTWARE.
 */
function Router () {
    var state;
    var pathLocation;
    var url = "";
    var title;
    var history = {
        0: {STATE:state, TITLE:title, URL:url}
    };
    var length = 1;
    var index = 1;
    var internalNav = false;
    var changed = function() {
        try { console.log("changed detected");  }
        catch (Exception) { /* do nothing */ }
    };

    // just do it this way, it's easier
    history.length = length;

    var nav = function (bool) {
        if (url == null) {
            throw new Error("You must at least provide a url.");
        }

        if (window.history.pushState) {
            window.history.pushState(state, title, url);
        } else {
            window.location.hash = url;
        }

        pathLocation = url;

        if (title != null && title != "" && typeof title == "string") {
            document.title = title;
        }

        if (typeof changed == "function") {
            changed();
        }

        var updateLength = function () {
            var c = 0;
            for (var h in history) {
                if (h != "length") {
                    c++;
                }
            }
            length = c;

            history.length = length;
        }; updateLength();

        if (!internalNav) {
            history[index++] = {STATE:state, TITLE:title, URL:url};
        } else {
            if (index < length) {
                var c = length;
                for (var key in history) {
                    if (c <= index) break;
                    try { delete history[c]; }
                    catch (Exception) {}
                    c--;
                }
            }
            history[index] = {STATE:state, TITLE:title, URL:url};
        }
        updateLength();
        internalNav = false;
    };

    var publicObject = {
        getState: function () {
            return state;
        },
        getURL: function () {
            return url;
        },
        getTitle: function () {
            return title;
        },
        getHistory: function () {
            return history;
        },
        setState: function (d) {
            state = d;
        },
        setTitle: function (t) {
            if (typeof t == "string") {
                title = t;
            } else {
                throw new Error("Invalid data type provided.");
            }
        },
        setURL: function (u) {
            if (typeof u == "string") {
                url = u;
            } else {
                throw new Error("Invalid data type provided.");
            }
        },
        onStateChange: function (callback) {
            if (typeof callback == "function") {
                changed = callback;
            } else {
                throw new Error("You must provide a function.");
            }
        },
        navigate: function (_s, _t, _u) {
            if (_u == null) {
                throw new Error("You must at leats provide a url."
                    + "\nParams(state, title, url)");
            }

            try { publicObject.setURL(_u); }
            catch (Exception) { /* no need to do anything  */ }

            try { publicObject.setTitle(_t); }
            catch (Exception) { /* no need to do anything  */ }

            try { publicObject.setState(_s); }
            catch (Exception) { /* no need to do anything  */ }

            nav();
        },
        back: function () {
            if (index > -1) {
                if (history[index - 1] == null) {
                    throw new Error("Null Pointer Exception");
                }

                var obj = history[--index];
                var _s = obj.STATE;
                var _t = obj.TITLE;
                var _u = obj.URL;
                internalNav = true;
                publicObject.navigate(_s, _t, _u);
            } else {
                throw new Error("Null Pointer Exception");
            }
        },
        forward: function () {
            if (index < length) {
                if (history[index] == null) {
                    throw new Error("Null Pointer Exception");
                }

                var obj = history[index];
                var _s = obj.STATE;
                var _t = obj.TITLE;
                var _u = obj.URL;
                internalNav = true;
                publicObject.navigate(_s, _t, _u);
            } else {
                throw new Error("Null Pointer Exception");
            }
        }
    };
    return publicObject;
}


/// test example
var router = new Router();
router.onStateChange(function () {
    var url = window.location.href;
    console.log(url);
});
router.navigate(null, null, "testing123testing");
