/**
 * (c) jTools Javascript Web Components
 * 
 * Author: Paul Hodel <paul.hodel@gmail.com>
 * Website: https://bossanova.uk/jtools/
 * Description: Create amazing web based applications.
 * 
 * MIT License
 * 
 */

var jApp = function(options) {
    var obj = {}

    // Find root element
    obj.el = document.querySelector('.app');
    // Backdrop
    obj.backdrop = document.createElement('div');
    obj.backdrop.classList.add('jbackdrop');

    obj.getWindowWidth = function() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;
        return x;
    }

    obj.getWindowHeight = function() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return  y;
    }

    obj.getPosition = function(e) {
        if (e.changedTouches && e.changedTouches[0]) {
            var x = e.changedTouches[0].pageX;
            var y = e.changedTouches[0].pageY;
        } else {
            var x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            var y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        }

        return [ x, y ];
    }

    obj.click = function(el) {
        // Create our event (with options)
        var evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        el.dispatchEvent(evt);
    }

    obj.getElement = function(element, className) {
        var foundElement = false;

        function path (element) {
            if (element.className) {
                if (element.classList.contains(className)) {
                    foundElement = element;
                }
            }

            if (element.parentNode) {
                path(element.parentNode);
            }
        }

        path(element);

        return foundElement;
    }

    obj.getLinkElement = function(element) {
        var targetElement = false;

        function path (element) {
            if ((element.tagName == 'A' || element.tagName == 'DIV') && element.getAttribute('data-href')) {
                targetElement = element;
            }

            if (element.parentNode) {
                path(element.parentNode);
            }
        }

        path(element);

        return targetElement;
    }

    obj.getFormElements = function(formObject) {
        var ret = {};

        if (formObject) {
            var elements = formObject.querySelectorAll("input, select, textarea");
        } else {
            var elements = document.querySelectorAll("input, select, textarea");
        }

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
                ret[name] = value;
            }
        }

        return ret;
    }

    obj.getFiles = function(element) {
        if (! element) {
            console.error('No element defined in the arguments of your method');
        }
        // Clear current data
        var inputs = element.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].remove();
        }

        // Get attachments
        var files = element.querySelectorAll('.jfile');

        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var extension = files[i].getAttribute('data-name').toLowerCase().split('.');
                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', 'files[' + i + '][name]');
                input.value = files[i].getAttribute('data-name').toLowerCase()
                files[i].parentNode.appendChild(input);

                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', 'files[' + i + '][extension]');
                input.value = extension[1];
                files[i].parentNode.appendChild(input);

                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', 'files[' + i + '][size]');
                input.value = files[i].getAttribute('data-size');
                files[i].parentNode.appendChild(input);

                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', 'files[' + i + '][lastmodified]');
                input.value = files[i].getAttribute('data-lastmodified');
                files[i].parentNode.appendChild(input);

                if (files[i].getAttribute('data-cover')) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', 'files[' + i + '][cover]');
                    input.value = 1;
                    files[i].parentNode.appendChild(input);
                }

                // File thumbs
                var content = files[i].getAttribute('data-thumbs');

                if (content) {
                    if (content.substr(0,4) == 'data') {
                        var content = files[i].getAttribute('data-thumbs').split(',');

                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', 'files[' + i + '][thumbs]');
                        input.value = content[1];
                        files[i].parentNode.appendChild(input);
                    } else {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', 'files[' + i + '][thumbs]');
                        input.value = content;
                        files[i].parentNode.appendChild(input);
                    }
                }

                // File content
                var content = files[i].getAttribute('src');

                if (content.substr(0,4) == 'data') {
                    var content = files[i].getAttribute('src').split(',');

                    var input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    input.setAttribute('name', 'files[' + i + '][content]');
                    input.value = content[1];
                    files[i].parentNode.appendChild(input);
                } else {
                    if (files[i].classList.contains('jremove')) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', 'files[' + i + '][remove]');
                        input.value = 1;
                        files[i].parentNode.appendChild(input);
                    }
                }
            }
        }
    }

    obj.touchTracker = null;

    return obj;
}();

jApp.alert = function(message) {
    if (jApp.dialog && jApp.getWindowWidth() < 800) {
        jApp.dialog.open({
            title:'Alert',
            message:message,
        });
    } else {
        alert(message);
    }
}

jApp.keyDownControls = function(e) {
    if (e.which == 27) {
        var nodes = document.querySelectorAll('.jmodal');
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].modal.close();
            }
        }

        var nodes = document.querySelectorAll('.jslider');
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].slider.close();
            }
        }
    }

    // Verify mask
    if (jApp.mask) {
        jApp.mask.apply(e);
    }
}

jApp.actionDownControl = function(e) {
    jApp.touchTracker = jApp.getPosition(e);
    setTimeout(function() {
        jApp.touchTracker = null;
    }, 300);
};

jApp.actionUpControl = function(e) {
    var position = jApp.getPosition(e);

    if (jApp.touchTracker && (position[0] - jApp.touchTracker[0]) > 100) {
        // Left
        var event = new CustomEvent("swipeleft");
        document.dispatchEvent(event);
    } else if (jApp.touchTracker && (jApp.touchTracker[0] - position[0]) > 100) {
        // Right
        var event = new CustomEvent("swiperight");
        document.dispatchEvent(event);
    } else {
        var element = null;
        if (element = jApp.getLinkElement(e.target)) {
            var link = element.getAttribute('data-href');
            if (link == 'back') {
                window.history.back();
            } else {
                jApp.page(link);
            }
        }
    }
}

document.addEventListener('touchstart', jApp.actionDownControl);
document.addEventListener('touchend', jApp.actionUpControl);
document.addEventListener('keydown', jApp.keyDownControls);

window.onpopstate = function(e) {
    if (e.state && e.state.route) {
        if (jApp.page && jApp.page.items && jApp.page.items[e.state.route]) {
            jApp.page.items[e.state.route].show(true);
            // Verify toolbar bind with this page
            if (jApp.page.items[e.state.route].options.toolbar) {
                jApp.page.items[e.state.route].options.toolbar.selectItem(jApp.page.items[e.state.route].options.toolbarItem);
            }
        }
    }
}

/**
 * Date & Datetime picker v1.0.1
 * Author: paul.hodel@gmail.com
 * https://github.com/paulhodel/jtools
 */

jApp.calendar = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Global container
    if (! jApp.dropdown.current) {
        jApp.dropdown.current = null;
    }

    // Default configuration
    var defaults = {
        // Date format
        format:'DD/MM/YYYY',
        // Allow keyboard date entry
        readonly:0,
        // Today is default
        today:0,
        // Show timepicker
        time:0,
        // Show the reset button
        resetButton:true,
        // Placeholder
        placeholder:'',
        // Translations can be done here
        months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        weekdays_short:['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        // Value
        value:null,
        // Events
        onclose:null,
        onchange:null,
        // Fullscreen (this is automatic set for screensize < 800)
        fullscreen:false,
        // Internal mode controller
        mode:null,
        position:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Value
    if (! obj.options.value && el.value) {
        obj.options.value = el.value;
    }

    // Make sure use upper case in the format
    obj.options.format = obj.options.format.toUpperCase();

    if (obj.options.value) {
        var date = obj.options.value.split(' ');
        var time = date[1];
        var date = date[0].split('-');
        var y = parseInt(date[0]);
        var m = parseInt(date[1]);
        var d = parseInt(date[2]);

        if (time) {
            var time = time.split(':');
            var h = parseInt(time[0]);
            var i = parseInt(time[1]);
        } else {
            var h = 0;
            var i = 0;
        }
    } else {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var i = date.getMinutes();
    }

    // Current value
    obj.date = [ y, m, d, h, i, 0 ];

    // Two digits
    var two = function(value) {
        value = '' + value;
        if (value.length == 1) {
            value = '0' + value;
        }
        return value;
    }

    // Calendar elements
    var calendarReset = document.createElement('div');
    calendarReset.className = 'jcalendar-reset';
    calendarReset.innerHTML = 'Reset';

    var calendarConfirm = document.createElement('div');
    calendarConfirm.className = 'jcalendar-confirm';
    calendarConfirm.innerHTML = 'Done';

    var calendarControls = document.createElement('div');
    calendarControls.className = 'jcalendar-controls'
    if (obj.options.resetButton) {
        calendarControls.appendChild(calendarReset);
    }
    calendarControls.appendChild(calendarConfirm);

    var calendarContainer = document.createElement('div');
    calendarContainer.className = 'jcalendar-container';

    var calendarContent = document.createElement('div');
    calendarContent.className = 'jcalendar-content';
    calendarContent.appendChild(calendarControls);
    calendarContainer.appendChild(calendarContent);

    // Main element
    var calendar = document.createElement('div');
    calendar.className = 'jcalendar';
    calendar.appendChild(calendarContainer);

    // Previous button
    var calendarHeaderPrev = document.createElement('td');
    calendarHeaderPrev.setAttribute('colspan', '2');
    calendarHeaderPrev.className = 'jcalendar-prev';

    // Header with year and month
    var calendarLabelYear = document.createElement('span');
    calendarLabelYear.className = 'jcalendar-year';

    var calendarLabelMonth = document.createElement('span');
    calendarLabelMonth.className = 'jcalendar-month';

    var calendarHeaderTitle = document.createElement('td');
    calendarHeaderTitle.className = 'jcalendar-header';
    calendarHeaderTitle.setAttribute('colspan', '3');
    calendarHeaderTitle.appendChild(calendarLabelMonth);
    calendarHeaderTitle.appendChild(calendarLabelYear);

    var calendarHeaderNext = document.createElement('td');
    calendarHeaderNext.setAttribute('colspan', '2');
    calendarHeaderNext.className = 'jcalendar-next';

    var calendarHeaderRow = document.createElement('tr');
    calendarHeaderRow.appendChild(calendarHeaderPrev);
    calendarHeaderRow.appendChild(calendarHeaderTitle);
    calendarHeaderRow.appendChild(calendarHeaderNext);

    var calendarHeader = document.createElement('thead');
    calendarHeader.appendChild(calendarHeaderRow);

    var calendarBody = document.createElement('tbody');
    var calendarFooter = document.createElement('tfoot');

    // Calendar table
    var calendarTable = document.createElement('table');
    calendarTable.setAttribute('cellpadding', '0');
    calendarTable.setAttribute('cellspacing', '0');
    calendarTable.appendChild(calendarHeader);
    calendarTable.appendChild(calendarBody);
    calendarTable.appendChild(calendarFooter);
    calendarContent.appendChild(calendarTable);

    var calendarSelectHour = document.createElement('select');
    calendarSelectHour.onchange = function() {
        obj.date[3] = this.value; 
    }

    for (var i = 0; i < 24; i++) {
        var element = document.createElement('option');
        element.value = i;
        element.innerHTML = two(i);
        calendarSelectHour.appendChild(element);
    }

    var calendarSelectMin = document.createElement('select');
    calendarSelectMin.onchange = function() {
        obj.date[4] = this.value; 
    }

    for (var i = 0; i < 60; i++) {
        var element = document.createElement('option');
        element.value = i;
        element.innerHTML = two(i);
        calendarSelectMin.appendChild(element);
    }

    // Footer controls
    var calendarControls = document.createElement('div');
    calendarControls.className = 'jcalendar-controls';

    var calendarControlsTime = document.createElement('div');
    calendarControlsTime.className = 'jcalendar-time';
    calendarControlsTime.style.maxWidth = '140px';
    calendarControlsTime.appendChild(calendarSelectHour);
    calendarControlsTime.appendChild(calendarSelectMin);

    var calendarControlsUpdate = document.createElement('div');
    calendarControlsUpdate.style.flexGrow = '10';
    calendarControlsUpdate.innerHTML = '<input type="button" class="jcalendar-update" value="Update">'
    calendarControls.appendChild(calendarControlsTime);
    calendarControls.appendChild(calendarControlsUpdate);
    calendarContent.appendChild(calendarControls);

    var calendarBackdrop = document.createElement('div');
    calendarBackdrop.className = 'jcalendar-backdrop';
    calendar.appendChild(calendarBackdrop);

    // Methods
    obj.open = function (value) {
        if (jApp.calendar.current) {
            if (jApp.calendar.current != obj) {
                jApp.calendar.current.close();
            }
        }

        if (! jApp.calendar.current) {
            jApp.calendar.current = obj;
            // Show calendar
            calendar.classList.add('jcalendar-focus');
            // Get days
            obj.getDays();
            // Hour
            if (obj.options.time) {
                calendarSelectHour.value = obj.date[3];
                calendarSelectMin.value = obj.date[4];
            }

            // Get the position of the corner helper
            if (jApp.getWindowWidth() < 800 || obj.options.fullscreen) {
                // Full
                calendar.classList.add('jcalendar-fullsize');
                // Animation
                calendarContent.classList.add('slide-bottom-in');
            } else {
                const rect = el.getBoundingClientRect();
                const rectContent = calendarContent.getBoundingClientRect();

                if (obj.options.position) {
                    calendarContainer.style.position = 'fixed';
                    if (window.innerHeight < rect.bottom + rectContent.height) {
                        calendarContainer.style.top = rect.top - (rectContent.height + 2);
                    } else {
                        calendarContainer.style.top = rect.top + rect.height + 2;
                    }
                } else {
                    if (window.innerHeight < rect.bottom + rectContent.height) {
                        calendarContainer.style.bottom = (1 * rect.height + rectContent.height + 2);
                    } else {
                        calendarContainer.style.top = 2; 
                    }
                }
            }
        }
    }

    obj.close = function (ignoreEvents, update) {
        if (jApp.calendar.current) {
            jApp.calendar.current =  null;

            if (update != false && el.tagName == 'INPUT') {
                obj.setValue(obj.getValue());
            }

            if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
                obj.options.onclose(el);
            }

            // Animation
            calendarContainer.classList.remove('slide-bottom-in');
            calendar.classList.remove('jcalendar-focus');
        }

        return obj.getValue(); 
    }

    obj.prev = function() {
        // Check if the visualization is the days picker or years picker
        if (obj.options.mode == 'years') {
            obj.date[0] = obj.date[0] - 12;

            // Update picker table of days
            obj.getYears();
        } else {
            // Go to the previous month
            if (obj.date[1] < 2) {
                obj.date[0] = obj.date[0] - 1;
                obj.date[1] = 1;
            } else {
                obj.date[1] = obj.date[1] - 1;
            }

            // Update picker table of days
            obj.getDays();
        }
    }

    obj.next = function() {
        // Check if the visualization is the days picker or years picker
        if (obj.options.mode == 'years') {
            obj.date[0] = parseInt(obj.date[0]) + 12;

            // Update picker table of days
            obj.getYears();
        } else {
            // Go to the previous month
            if (obj.date[1] > 11) {
                obj.date[0] = obj.date[0] + 1;
                obj.date[1] = 1;
            } else {
                obj.date[1] = obj.date[1] + 1;
            }

            // Update picker table of days
            obj.getDays();
        }
    }

    obj.setValue = function(val) {
        if (val) {
            // Keep value
            obj.options.value = val;
            // Set label
            var value = obj.setLabel(val, obj.options.format);
            var date = obj.options.value.split(' ');
            if (! date[1]) {
                date[1] = '00:00:00';
            }
            var time = date[1].split(':')
            var date = date[0].split('-');
            var y = parseInt(date[0]);
            var m = parseInt(date[1]);
            var d = parseInt(date[2]);
            var h = parseInt(time[0]);
            var i = parseInt(time[1]);
            obj.date = [ y, m, d, h, i, 0 ];
            var val = obj.setLabel(val, obj.options.format);

            if (el.value != val) {
                el.value = val;
                // On change
                if (typeof(obj.options.onchange) ==  'function') {
                    obj.options.onchange(el, val, obj.date);
                }
            }

            obj.getDays();
        }
    }

    obj.getValue = function() {
        if (obj.date) {
            if (obj.options.time) {
                return two(obj.date[0]) + '-' + two(obj.date[1]) + '-' + two(obj.date[2]) + ' ' + two(obj.date[3]) + ':' + two(obj.date[4]) + ':' + two(0);
            } else {
                return two(obj.date[0]) + '-' + two(obj.date[1]) + '-' + two(obj.date[2]) + ' ' + two(0) + ':' + two(0) + ':' + two(0);
            }
        } else {
            return "";
        }
    }

    /**
     * Update calendar
     */
    obj.update = function(element) {
        obj.date[2] = element.innerText;

        if (! obj.options.time) {
            obj.close();
        } else {
            obj.date[3] = calendarSelectHour.value;
            obj.date[4] = calendarSelectMin.value;
        }

        var elements = calendar.querySelector('.jcalendar-selected');
        if (elements) {
            elements.classList.remove('jcalendar-selected');
        }
        element.classList.add('jcalendar-selected')
    }

    /**
     * Set to blank
     */
    obj.reset = function() {
        // Clear element
        obj.date = null;
        // Reset element
        el.value = '';
        // Close calendar
        obj.close();
    }

    /**
     * Get calendar days
     */
    obj.getDays = function() {
        // Mode
        obj.options.mode = 'days';

        // Variables
        var d = 0;
        var today = 0;
        var today_d = 0;
        var calendar_day;

        // Setting current values in case of NULLs
        var date = new Date();

        var year = obj.date && obj.date[0] ? obj.date[0] : parseInt(date.getFullYear());
        var month = obj.date && obj.date[1] ? obj.date[1] : parseInt(date.getMonth()) + 1;
        var day = obj.date && obj.date[2] ? obj.date[2] : parseInt(date.getDay());
        var hour = obj.date && obj.date[3] ? obj.date[3] : parseInt(date.getHours());
        var min = obj.date && obj.date[4] ? obj.date[4] : parseInt(date.getMinutes());

        obj.date = [year, month, day, hour, min, 0 ];

        // Update title
        calendarLabelYear.innerHTML = year;
        calendarLabelMonth.innerHTML = obj.options.months[month - 1];

        // Flag if this is the current month and year
        if ((date.getMonth() == month-1) && (date.getFullYear() == year)) {
            today = 1;
            today_d = date.getDate();
        }

        var date = new Date(year, month, 0, 0, 0);
        nd = date.getDate();

        var date = new Date(year, month-1, 0, hour, min);
        fd = date.getDay() + 1;

        // Reset table
        calendarBody.innerHTML = '';

        // Weekdays Row
        var row = document.createElement('tr');
        row.setAttribute('align', 'center');
        calendarBody.appendChild(row);

        for (var i = 0; i < 7; i++) {
            var cell = document.createElement('td');
            cell.setAttribute('width', '30');
            cell.classList.add('jcalendar-weekday')
            cell.innerHTML = obj.options.weekdays_short[i];
            row.appendChild(cell);
        }

        // Avoid a blank line
        if (fd == 7) {
            var j = 7;
        } else {
            var j = 0;
        }

        // Days inside the table
        var row = document.createElement('tr');
        row.setAttribute('align', 'center');
        calendarBody.appendChild(row);

        // Days in the month
        for (var i = j; i < (Math.ceil((nd + fd) / 7) * 7); i++) {
            // Create row
            if ((i > 0) && (!(i % 7))) {
                var row = document.createElement('tr');
                row.setAttribute('align', 'center');
                calendarBody.appendChild(row);
            }

            if ((i >= fd) && (i < nd + fd)) {
                d += 1;
            } else {
                d = 0;
            }

            // Create cell
            var cell = document.createElement('td');
            cell.setAttribute('width', '30');
            cell.classList.add('jcalendar-set-day');
            row.appendChild(cell);

            if (d == 0) {
                cell.innerHTML = '';
            } else {
                if (d < 10) {
                    cell.innerHTML = 0 + d;
                } else {
                    cell.innerHTML = d;
                }
            }

            // Selected
            if (d && d == day) {
                cell.classList.add('jcalendar-selected');
            }

            // Sundays
            if (! (i % 7)) {
                cell.style.color = 'red';
            }

            // Today
            if ((today == 1) && (today_d == d)) {
                cell.style.fontWeight = 'bold';
            }
        }

        // Show time controls
        if (obj.options.time) {
            calendarControlsTime.style.display = '';
        } else {
            calendarControlsTime.style.display = 'none';
        }
    }

    obj.getMonths = function() {
        // Mode
        obj.options.mode = 'months';

        // Loading month labels
        var months = obj.options.months;

        // Update title
        calendarLabelYear.innerHTML = obj.date[0];
        calendarLabelMonth.innerHTML = '';

        // Create months table
        var html = '<td colspan="7"><table width="100%"><tr align="center">';

        for (i = 0; i < 12; i++) {
            if ((i > 0) && (!(i % 4))) {
                html += '</tr><tr align="center">';
            }
            month = parseInt(i) + 1;
            html += '<td class="jcalendar-set-month" data-value="' + month + '">' + months[i] +'</td>';
        }

        html += '</tr></table></td>';

        calendarBody.innerHTML = html;
    }

    obj.getYears = function() { 
        // Mode
        obj.options.mode = 'years';

        // Array of years
        var y = [];
        for (i = 0; i < 25; i++) {
            y[i] = parseInt(obj.date[0]) + (i - 12);
        }

        // Assembling the year tables
        var html = '<td colspan="7"><table width="100%"><tr align="center">';

        for (i = 0; i < 25; i++) {
            if ((i > 0) && (!(i % 5))) {
                html += '</tr><tr align="center">';
            }
            html += '<td class="jcalendar-set-year">'+ y[i] +'</td>';
        }

        html += '</tr></table></td>';

        calendarBody.innerHTML = html;
    }

    obj.setLabel = function(value, format) {
        return jApp.calendar.getDateString(value, format);
    }

    obj.fromFormatted = function (value, format) {
        return jApp.calendar.extractDateFromString(value, format);
    }

    // Element
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('data-mask', obj.options.format.toLowerCase());
    if (obj.options.readonly) {
        el.setAttribute('readonly', 'readonly');
    }
    if (obj.options.placeholder) {
        el.setAttribute('placeholder', obj.options.placeholder);
    }
    el.addEventListener("focus", function(e) {
        obj.open();
    });
    el.addEventListener("mousedown", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        obj.open();
    });
    el.addEventListener("keyup", function(e) {
        if (e.target.value && e.target.value.length > 3) {
            var test = jApp.calendar.extractDateFromString(e.target.value, obj.options.format);
            if (test) {
                console.log(test);
                if (e.target.getAttribute('data-completed') == 'true') {
                    obj.setValue(test);
                }
            }
        }
    });
    document.addEventListener("swipeleft", function(e) {
        if (calendar.classList.contains('jcalendar-focus')) {
            obj.prev();
        }
    });
    document.addEventListener("swiperight", function(e) {
        if (calendar.classList.contains('jcalendar-focus')) {
            obj.next();
        }
    });

    el.parentNode.insertBefore(calendar, el.nextSibling);

    el.calendar = obj;

    return obj;
});

// Helper to extract date from a string
jApp.calendar.extractDateFromString = function(date, format) {
    var v1 = '' + date;
    var v2 = format.replace(/[0-9]/g,'');

    var test = 1;

    // Get year
    var y = v2.search("YYYY");
    y = v1.substr(y,4);
    if (parseInt(y) != y) {
        test = 0;
    }

    // Get month
    var m = v2.search("MM");
    m = v1.substr(m,2);
    if (parseInt(m) != m || d > 12) {
        test = 0;
    }

    // Get day
    var d = v2.search("DD");
    d = v1.substr(d,2);
    if (parseInt(d) != d  || d > 31) {
        test = 0;
    }

    // Get hour
    var h = v2.search("HH");
    if (h >= 0) {
        h = v1.substr(h,2);
        if (! parseInt(h) || h > 23) {
            h = '00';
        }
    } else {
        h = '00';
    }
    
    // Get minutes
    var i = v2.search("MI");
    if (i >= 0) {
        i = v1.substr(i,2);
        if (! parseInt(i) || i > 59) {
            i = '00';
        }
    } else {
        i = '00';
    }

    // Get seconds
    var s = v2.search("SS");
    if (s >= 0) {
        s = v1.substr(s,2);
        if (! parseInt(s) || s > 59) {
            s = '00';
        }
    } else {
        s = '00';
    }

    if (test == 1 && date.length == format.length) {
        // Update source
        var data = y + '-' + m + '-' + d + ' ' + h + ':' +  i + ':' + s;

        return data;
    }

    return '';
}

// Helper to convert date into string
jApp.calendar.getDateString = function(value, format) {
    // Default calendar
    if (! format) {
        var format = 'DD/MM/YYYY';
    }

    if (value) {
        var d = ''+value;
        d = d.split(' ');

        var h = '';
        var m = '';
        var s = '';

        if (d[1]) {
            h = d[1].split(':');
            m = h[1];
            s = h[2];
            h = h[0];
        } else {
            h = '00';
            m = '00';
            s = '00';
        }

        d = d[0].split('-');

        if (d[0] && d[1] && d[2] && d[0] > 0 && d[1] > 0 && d[1] < 13 && d[2] > 0 && d[2] < 32) {
            var calendar = new Date(d[0], d[1]-1, d[2]);
            var weekday = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');

            d[1] = (d[1].length < 2 ? '0' : '') + d[1];
            d[2] = (d[2].length < 2 ? '0' : '') + d[2];
            h = (h.length < 2 ? '0' : '') + h;
            m = (m.length < 2 ? '0' : '') + m;
            s = (s.length < 2 ? '0' : '') + s;

            value = format;
            value = value.replace('WD', weekday[calendar.getDay()]);
            value = value.replace('DD', d[2]);
            value = value.replace('MM', d[1]);
            value = value.replace('YYYY', d[0]);
            value = value.replace('YY', d[0].substring(2,4));

            if (h) {
                value = value.replace('HH24', h);
            }

            if (h > 12) {
                value = value.replace('HH12', h - 12);
                value = value.replace('HH', h);
            } else {
                value = value.replace('HH12', h);
                value = value.replace('HH', h);
            }

            value = value.replace('MI', m);
            value = value.replace('MM', m);
            value = value.replace('SS', s);
        } else {
            value = '';
        }
    }

    return value;
}

jApp.calendar.mouseDownControls = function(e) {
    if (! jApp.getElement(e.target, 'jcalendar')) {
        if (jApp.calendar.current) {
            jApp.calendar.current.close(false, false);
        }
    } else {
        if (jApp.calendar.current) {
            var action = e.target.className;

            // Object id
            if (action == 'jcalendar-prev') {
                jApp.calendar.current.prev();
            } else if (action == 'jcalendar-next') {
                jApp.calendar.current.next();
            } else if (action == 'jcalendar-month') {
                jApp.calendar.current.getMonths();
            } else if (action == 'jcalendar-year') {
                jApp.calendar.current.getYears();
            } else if (action == 'jcalendar-set-year') {
                jApp.calendar.current.date[0] = e.target.innerText;
                jApp.calendar.current.getDays();
            } else if (action == 'jcalendar-set-month') {
                jApp.calendar.current.date[1] = parseInt(e.target.getAttribute('data-value'));
                jApp.calendar.current.getDays();
            } else if (action == 'jcalendar-confirm' || action == 'jcalendar-update') {
                jApp.calendar.current.close();
            } else if (action == 'jcalendar-close') {
                jApp.calendar.current.close();
            } else if (action == 'jcalendar-backdrop') {
                jApp.calendar.current.close(false, false);
            } else if (action == 'jcalendar-reset') {
                jApp.calendar.current.reset();
            } else if (e.target.classList.contains('jcalendar-set-day')) {
                if (e.target.innerText) {
                    // Keep selected day
                    jApp.calendar.current.update(e.target);
                }
            }

            if (action.substr(0,9) == 'jcalendar') {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    }
}

document.addEventListener("mousedown", jApp.calendar.mouseDownControls);

/**
 * Color Picker v1.0.1
 * Author: paul.hodel@gmail.com
 * https://github.com/paulhodel/jtools
 */

jApp.color = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.values = [];

    // Global container
    if (! jApp.color.current) {
        jApp.color.current = null;
    }

    // Default configuration
    var defaults = {
        placeholder:'',
        value:null,
        onclose:null,
        onchange:null,
        position:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    var x = 0;
    var y = 0;
    var z = 0;

    var palette = {
        "red": {
            "50": "#ffebee",
            "100": "#ffcdd2",
            "200": "#ef9a9a",
            "300": "#e57373",
            "400": "#ef5350",
            "500": "#f44336",
            "600": "#e53935",
            "700": "#d32f2f",
            "800": "#c62828",
            "900": "#b71c1c",
          },
          "pink": {
            "50": "#fce4ec",
            "100": "#f8bbd0",
            "200": "#f48fb1",
            "300": "#f06292",
            "400": "#ec407a",
            "500": "#e91e63",
            "600": "#d81b60",
            "700": "#c2185b",
            "800": "#ad1457",
            "900": "#880e4f",
          },
          "purple": {
            "50": "#f3e5f5",
            "100": "#e1bee7",
            "200": "#ce93d8",
            "300": "#ba68c8",
            "400": "#ab47bc",
            "500": "#9c27b0",
            "600": "#8e24aa",
            "700": "#7b1fa2",
            "800": "#6a1b9a",
            "900": "#4a148c",
          },
          "deeppurple": {
            "50": "#ede7f6",
            "100": "#d1c4e9",
            "200": "#b39ddb",
            "300": "#9575cd",
            "400": "#7e57c2",
            "500": "#673ab7",
            "600": "#5e35b1",
            "700": "#512da8",
            "800": "#4527a0",
            "900": "#311b92",
          },
          "indigo": {
            "50": "#e8eaf6",
            "100": "#c5cae9",
            "200": "#9fa8da",
            "300": "#7986cb",
            "400": "#5c6bc0",
            "500": "#3f51b5",
            "600": "#3949ab",
            "700": "#303f9f",
            "800": "#283593",
            "900": "#1a237e",
          },
          "blue": {
            "50": "#e3f2fd",
            "100": "#bbdefb",
            "200": "#90caf9",
            "300": "#64b5f6",
            "400": "#42a5f5",
            "500": "#2196f3",
            "600": "#1e88e5",
            "700": "#1976d2",
            "800": "#1565c0",
            "900": "#0d47a1",
          },
          "lightblue": {
            "50": "#e1f5fe",
            "100": "#b3e5fc",
            "200": "#81d4fa",
            "300": "#4fc3f7",
            "400": "#29b6f6",
            "500": "#03a9f4",
            "600": "#039be5",
            "700": "#0288d1",
            "800": "#0277bd",
            "900": "#01579b",
          },
          "cyan": {
            "50": "#e0f7fa",
            "100": "#b2ebf2",
            "200": "#80deea",
            "300": "#4dd0e1",
            "400": "#26c6da",
            "500": "#00bcd4",
            "600": "#00acc1",
            "700": "#0097a7",
            "800": "#00838f",
            "900": "#006064",
          },
          "teal": {
            "50": "#e0f2f1",
            "100": "#b2dfdb",
            "200": "#80cbc4",
            "300": "#4db6ac",
            "400": "#26a69a",
            "500": "#009688",
            "600": "#00897b",
            "700": "#00796b",
            "800": "#00695c",
            "900": "#004d40",
          },
          "green": {
            "50": "#e8f5e9",
            "100": "#c8e6c9",
            "200": "#a5d6a7",
            "300": "#81c784",
            "400": "#66bb6a",
            "500": "#4caf50",
            "600": "#43a047",
            "700": "#388e3c",
            "800": "#2e7d32",
            "900": "#1b5e20",
          },
          "lightgreen": {
            "50": "#f1f8e9",
            "100": "#dcedc8",
            "200": "#c5e1a5",
            "300": "#aed581",
            "400": "#9ccc65",
            "500": "#8bc34a",
            "600": "#7cb342",
            "700": "#689f38",
            "800": "#558b2f",
            "900": "#33691e",
          },
          "lime": {
            "50": "#f9fbe7",
            "100": "#f0f4c3",
            "200": "#e6ee9c",
            "300": "#dce775",
            "400": "#d4e157",
            "500": "#cddc39",
            "600": "#c0ca33",
            "700": "#afb42b",
            "800": "#9e9d24",
            "900": "#827717",
          },
          "yellow": {
            "50": "#fffde7",
            "100": "#fff9c4",
            "200": "#fff59d",
            "300": "#fff176",
            "400": "#ffee58",
            "500": "#ffeb3b",
            "600": "#fdd835",
            "700": "#fbc02d",
            "800": "#f9a825",
            "900": "#f57f17",
          },
          "amber": {
            "50": "#fff8e1",
            "100": "#ffecb3",
            "200": "#ffe082",
            "300": "#ffd54f",
            "400": "#ffca28",
            "500": "#ffc107",
            "600": "#ffb300",
            "700": "#ffa000",
            "800": "#ff8f00",
            "900": "#ff6f00",
          },
          "orange": {
            "50": "#fff3e0",
            "100": "#ffe0b2",
            "200": "#ffcc80",
            "300": "#ffb74d",
            "400": "#ffa726",
            "500": "#ff9800",
            "600": "#fb8c00",
            "700": "#f57c00",
            "800": "#ef6c00",
            "900": "#e65100",
          },
          "deeporange": {
            "50": "#fbe9e7",
            "100": "#ffccbc",
            "200": "#ffab91",
            "300": "#ff8a65",
            "400": "#ff7043",
            "500": "#ff5722",
            "600": "#f4511e",
            "700": "#e64a19",
            "800": "#d84315",
            "900": "#bf360c",
          },
          "brown": {
            "50": "#efebe9",
            "100": "#d7ccc8",
            "200": "#bcaaa4",
            "300": "#a1887f",
            "400": "#8d6e63",
            "500": "#795548",
            "600": "#6d4c41",
            "700": "#5d4037",
            "800": "#4e342e",
            "900": "#3e2723"
          },
          "grey": {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
            "400": "#bdbdbd",
            "500": "#9e9e9e",
            "600": "#757575",
            "700": "#616161",
            "800": "#424242",
            "900": "#212121"
          },
          "bluegrey": {
            "50": "#eceff1",
            "100": "#cfd8dc",
            "200": "#b0bec5",
            "300": "#90a4ae",
            "400": "#78909c",
            "500": "#607d8b",
            "600": "#546e7a",
            "700": "#455a64",
            "800": "#37474f",
            "900": "#263238"
          }
    };

    var x = 0;
    var y = 0;
    var colors = [];

    Object.keys(palette).forEach(function(col) {
        y = 0;
        Object.keys(palette[col]).forEach(function(shade) {
            if (! colors[y]) {
                colors[y] = [];
            }
            colors[y][x] = palette[col][shade];
            y++;
        });
        x++;
    });

    // Table container
    var container = document.createElement('div');
    container.className = 'jcolor';

    // Content
    var content = document.createElement('div');
    content.className = 'jcolor-content';

    // Table pallete
    var table = document.createElement('table');
    table.setAttribute('cellpadding', '7');
    table.setAttribute('cellspacing', '0');

    for (var i = 0; i < colors.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < colors[i].length; j++) {
            var td = document.createElement('td');
            td.style.backgroundColor = colors[i][j];
            td.setAttribute('data-value', colors[i][j]);
            td.innerHTML = '';
            tr.appendChild(td);

            // Selected color
            if (obj.options.value == colors[i][j]) {
                td.classList.add('jcolor-selected');
            }

            // Possible values
            obj.values[colors[i][j]] = td;
        }
        table.appendChild(tr);
    }

    /**
     * Open color pallete
     */
    obj.open = function() {
        if (jApp.color.current) {
            if (jApp.color.current != obj) {
                jApp.color.current.close();
            }
        }

        if (! jApp.color.current) {
            // Persist element
            jApp.color.current = obj;
            // Show colorpicker
            container.classList.add('jcolor-focus');

            const rect = el.getBoundingClientRect();
            const rectContent = content.getBoundingClientRect();

            if (obj.options.position) {
                content.style.position = 'fixed';
                if (window.innerHeight < rect.bottom + rectContent.height) {
                    content.style.top = rect.top - (rectContent.height + 2);
                } else {
                    content.style.top = rect.top + rect.height + 2;
                }
            } else {
                if (window.innerHeight < rect.bottom + rectContent.height) {
                    content.style.top = -1 * (rectContent.height + 2);
                } else {
                    content.style.top = rect.height + 2; 
                }
            }

            container.focus();
        }
    }

    /**
     * Close color pallete
     */
    obj.close = function(ignoreEvents) {
        if (jApp.color.current) {
            jApp.color.current = null;
            if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
                obj.options.onclose(el);
            }
            container.classList.remove('jcolor-focus');
        }

        return obj.options.value;
    }

    /**
     * Set value
     */
    obj.setValue = function(color) {
        if (color) {
            el.value = color;
            obj.options.value = color;
        }

        // Remove current selecded mark
        var selected = container.querySelector('.jcolor-selected');
        if (selected) {
            selected.classList.remove('jcolor-selected');
        }

        // Mark cell as selected
        obj.values[color].classList.add('jcolor-selected');

        // Onchange
        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, color);
        }
    }

    /**
     * Get value
     */
    obj.getValue = function() {
        return obj.options.value;
    }

    /**
     * If element is focus open the picker
     */
    el.addEventListener("focus", function(e) {
        obj.open();
    });

    // Select color
    container.addEventListener("click", function(e) {
        if (e.target.tagName == 'TD') {
            jApp.color.current.setValue(e.target.getAttribute('data-value'));
            jApp.color.current.close();
        }
    });

    // Possible to focus the container
    container.setAttribute('tabindex', '900');
    // Append to the table
    content.appendChild(table);
    container.appendChild(content);
    container.onblur = function(e) {
        if (jApp.color.current) {
            jApp.color.current.close();
        }
    }
    // Insert picker after the element
    el.parentNode.insertBefore(container, el);
    // Keep object available thought the node
    el.color = obj;

    if (obj.options.placeholder) {
        el.setAttribute('placeholder', obj.options.placeholder);
    }

    return obj;
});

jApp.combo = (function(el, options) {
    var obj = {};

    if (options) {
        obj.options = options;
    }

    // Reset
    if (obj.options.reset == true) {
        el.innerHTML = '';
    }

    // Blank option?
    if (obj.options.blankOption) {
        var option = document.createElement('option');
        option.value = '';
        el.appendChild(option);
    }

    // Load options from a remote URL
    if (obj.options.url) {
        fetch(obj.options.url, { headers: new Headers({ 'content-type': 'text/json' }) })
            .then(function(data) {
                data.json().then(function(data) {
                    obj.options.data = data;

                    Object.keys(data).forEach(function(k) {
                        var option = document.createElement('option');

                        if (data[k].id) {
                            option.value = data[k].id;
                            option.innerHTML = data[k].name;
                        } else {
                            option.value = k;
                            option.innerHTML = data[k];
                        }

                        el.appendChild(option);
                    });

                    if (obj.options.value) {
                        $(select).val(obj.options.value);
                    }

                    if (typeof(obj.options.onload) == 'function') {
                        obj.options.onload(el);
                    }
                })
            });
    } else if (options.numeric) {
        for (var i = obj.options.numeric[0]; i <= obj.options.numeric[1]; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            el.appendChild(option);
        }
    }

    el.combo = obj;

    return obj;
});


/**
 * Contextmenu v1.0.1
 * Author: paul.hodel@gmail.com
 * https://github.com/paulhodel/jtools
 */

jApp.contextmenu = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.options.items = options.items && options.items.length ? options.items : {};

    obj.menu = document.createElement('ul');
    obj.menu.classList.add('jcontextmenu');
    obj.menu.setAttribute('tabindex', '900');
    obj.menu.addEventListener('blur', (e) => {
        obj.menu.classList.remove('jcontextmenu-focus');
    });

    if (typeof(options.onclick) == 'function') {
        obj.menu.onclick = options.onclick;
    }

    /**
     * Open contextmenu
     */
    obj.open = function(e, items) {
        e = e || window.event;

        if (items) {
            obj.options.items = items;
        }

        // Reset content
        obj.menu.innerHTML = '';

        // Append items
        for (var i = 0; i < obj.options.items.length; i++) {
            if (obj.options.items[i].type && obj.options.items[i].type == 'line') {
                var itemContainer = document.createElement('hr');
            } else {
                var itemContainer = document.createElement('li');
                var itemText = document.createElement('a');
                itemText.innerHTML = obj.options.items[i].title;

                if (obj.options.items[i].disabled) {
                    itemContainer.className = 'jcontextmenu-disabled';
                } else if (obj.options.items[i].onclick) {
                    itemContainer.onclick = obj.options.items[i].onclick;
                }
                itemContainer.appendChild(itemText);

                if (obj.options.items[i].shortcut) {
                    var itemShortCut = document.createElement('span');
                    itemShortCut.innerHTML = obj.options.items[i].shortcut;
                    itemContainer.appendChild(itemShortCut);
                }
            }

            obj.menu.appendChild(itemContainer);
        }

        let position = jApp.getPosition(e);

        obj.menu.classList.add('jcontextmenu-focus');
        obj.menu.style.top = position[1];
        obj.menu.style.left = position[0];
        obj.menu.focus();
    }

    /**
     * Close
     */
    obj.close = function() {
        obj.menu.classList.remove('jcontextmenu-focus');
    }

    el.appendChild(obj.menu);
    el.contextmenu = obj;

    return obj;
});

/**
 * Dialog v1.0.1
 * Author: paul.hodel@gmail.com
 * https://github.com/paulhodel/jtools
 */
 
jApp.dialog = (function() {
    var obj = {};
    obj.options = {};

    var dialog = document.createElement('div');
    dialog.className = 'jdialog';
    dialog.id = 'dialog';

    var dialogHeader = document.createElement('div');
    dialogHeader.className = 'jdialog-header';

    var dialogTitle = document.createElement('div');
    dialogTitle.className = 'jdialog-title';
    dialogHeader.appendChild(dialogTitle);

    var dialogMessage = document.createElement('div');
    dialogMessage.className = 'jdialog-message';
    dialogHeader.appendChild(dialogMessage);

    var dialogFooter = document.createElement('div');
    dialogFooter.className = 'jdialog-footer';

    var dialogContainer = document.createElement('div');
    dialogContainer.className = 'jdialog-container';
    dialogContainer.appendChild(dialogHeader);
    dialogContainer.appendChild(dialogFooter);

    // Confirm
    var dialogConfirm = document.createElement('div');
    var dialogConfirmButton = document.createElement('input');
    dialogConfirmButton.value = obj.options.confirmLabel;
    dialogConfirmButton.type = 'button';
    dialogConfirmButton.onclick = function() {
        if (typeof(obj.options.onconfirm) == 'function') {
            obj.options.onconfirm();
        }
        obj.close();
    };
    dialogConfirm.appendChild(dialogConfirmButton);
    dialogFooter.appendChild(dialogConfirm);

    // Cancel
    var dialogCancel = document.createElement('div');
    var dialogCancelButton = document.createElement('input');
    dialogCancelButton.value = obj.options.cancelLabel;
    dialogCancelButton.type = 'button';
    dialogCancelButton.onclick = function() {
        if (typeof(obj.options.oncancel) == 'function') {
            obj.options.oncancel();
        }
        obj.close();
    }
    dialogCancel.appendChild(dialogCancelButton);
    dialogFooter.appendChild(dialogCancel);

    // Dialog
    dialog.appendChild(dialogContainer);

    obj.open = function(options) {
        obj.options = options;

        if (obj.options.title) {
            dialogTitle.innerHTML = obj.options.title;
        }

        if (obj.options.message) {
            dialogMessage.innerHTML = obj.options.message;
        }

        if (! obj.options.confirmLabel) {
            obj.options.confirmLabel = 'OK';
        }
        dialogConfirmButton.value = obj.options.confirmLabel;

        if (! obj.options.cancelLabel) {
            obj.options.cancelLabel = 'Cancel';
        }
        dialogCancelButton.value = obj.options.cancelLabel;

        if (obj.options.type == 'confirm') {
            dialogCancelButton.parentNode.style.display = '';
        } else {
            dialogCancelButton.parentNode.style.display = 'none';
        }

        // Append element to the app
        dialog.style.opacity = 100;
        jApp.el.appendChild(dialog);

        // Show
        setTimeout(function() {
            dialogContainer.style.opacity = 100;
        }, 0);
    };

    obj.close = function() {
        dialog.style.opacity = 0;
        dialogContainer.style.opacity = 0;
        setTimeout(function() {
            dialog.remove();
        }, 100);
    };

    return obj;
})();

/**
 * (c) 2013 jDropdown
 * http://www.github.com/paulhodel/jdropdown
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Custom dropdowns
 */

jApp.dropdown = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.items = [];
    obj.groups = [];

    if (options) {
        obj.options = options;
    }

    // Global container
    if (! jApp.dropdown.current) {
        jApp.dropdown.current = null;
    }

    // Default configuration
    var defaults = {
        data: [],
        multiple: false,
        autocomplete: false,
        type:null,
        width:null,
        opened:false,
        onchange:null,
        onopen:null,
        onclose:null,
        onblur:null,
        value:null,
        placeholder:'',
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Create dropdown
    el.classList.add('jdropdown');
 
    if (obj.options.type == 'searchbar') {
        el.classList.add('jdropdown-searchbar');
    } else if (obj.options.type == 'list') {
        el.classList.add('jdropdown-list');
    } else if (obj.options.type == 'picker') {
        el.classList.add('jdropdown-picker');
    } else {
        if (jApp.getWindowWidth() < 800) {
            el.classList.add('jdropdown-picker');
            obj.options.type = 'picker';
        } else {
            if (obj.options.width) {
                el.style.width = obj.options.width;
            }
            el.classList.add('jdropdown-default');
            obj.options.type = 'default';
        }
    }

    // Header container
    var containerHeader = document.createElement('div');
    containerHeader.className = 'jdropdown-container-header';

    // Header
    var header = document.createElement('input');
    header.className = 'jdropdown-header';
    if (typeof(obj.options.onblur) == 'function') {
        header.onblur = function() {
            obj.options.onblur(el);
        }
    }

    // Container
    var container = document.createElement('div');
    container.className = 'jdropdown-container';

    // Dropdown content
    var content = document.createElement('div');
    content.className = 'jdropdown-content';

    // Close button
    var closeButton  = document.createElement('div');
    closeButton.className = 'jdropdown-close';
    closeButton.innerHTML = 'Done';

    // Create backdrop
    var backdrop  = document.createElement('div');
    backdrop.className = 'jdropdown-backdrop';

    // Autocomplete
    if (obj.options.autocomplete == true) {
        el.setAttribute('data-autocomplete', true);

        // Handler
        header.addEventListener('keyup', function(e) {
            obj.find(header.value);
        });
    } else {
        header.setAttribute('readonly', 'readonly');
    }

    // Place holder
    if (obj.options.placeholder) {
        header.setAttribute('placeholder', obj.options.placeholder);
    }

    // Append elements
    containerHeader.appendChild(header);
    container.appendChild(closeButton);
    container.appendChild(content);
    el.appendChild(containerHeader);
    el.appendChild(container);
    el.appendChild(backdrop);

    obj.init = function() {
        if (obj.options.url) {
            fetch(obj.options.url, { headers: new Headers({ 'content-type': 'text/json' }) })
                .then(function(data) {
                    data.json().then(function(data) {
                        if (data) {
                            obj.options.data = data;
                            obj.setData();
                        }
                    })
                });
        } else {
            obj.setData();
        }

        // Values
        obj.setValue(obj.options.value);

        if (obj.options.opened == true) {
            obj.open();
        }

        // Fix width - Workaround important to get the correct width
        if (obj.options.type == 'default') {
            setTimeout(function() {
                container.style.minWidth = header.outerWidth;
            }, 0);
        }
    }

    obj.setUrl = function(url) {
        obj.options.url = url;
        fetch(obj.options.url, { headers: new Headers({ 'content-type': 'text/json' }) })
            .then(function(data) {
                data.json().then(function(data) {
                    obj.setData(data);
                })
            });
    }

    obj.setData = function(data) {
        if (data) {
            obj.options.data = data;
        } else {
            var data = obj.options.data;
        }

        // Make sure the content container is blank
        content.innerHTML = '';

        // Containers
        var items = [];
        var groups = [];

        // Foreach in the data to create all items
        if (data.length) {
            data.forEach(function(v, k) {
                // Compatibility
                if (typeof(v) != 'object') {
                    var value = v;
                    v = {}
                    v.id = value;
                    v.name = value;

                    // Fix array
                    obj.options.data[k] = v;
                }

                // Create item
                items[k] = document.createElement('div');
                items[k].className = 'jdropdown-item';
                items[k].value = v.id;
                items[k].text = v.name;

                // Image
                if (v.image) {
                    var image = document.createElement('img');
                    image.className = 'jdropdown-image';
                    image.src = v.image;
                    if (! v.title) {
                       image.classList.add('jdropdown-image-small');
                    }
                    items[k].appendChild(image);
                }

                // Set content
                var node = document.createElement('div');
                node.className = 'jdropdown-description';
                node.innerHTML = v.name;
                items[k].appendChild(node);

                // Title
                if (v.title) {
                    var title = document.createElement('div');
                    title.className = 'jdropdown-title';
                    title.innerHTML = v.title;
                    node.appendChild(title);
                }

                // Append to the container
                if (v.group) {
                    if (! groups[v.group]) {
                        groups[v.group] = document.createElement('div');
                        groups[v.group].className = 'jdropdown-group-items';
                    }
                    groups[v.group].appendChild(items[k]);
                } else {
                    content.appendChild(items[k]);
                }
            });

            // Append groups in case exists
            if (Object.keys(groups).length > 0) {
                Object.keys(groups).forEach(function(v, k) {
                    var group = document.createElement('div');
                    group.className = 'jdropdown-group';
                    group.innerHTML = '<div class="jdropdown-group-name">' + v + '<i class="jdropdown-group-arrow jdropdown-group-arrow-down"></i></div>';
                    group.appendChild(groups[v]);
                    obj.groups.push(group);
                    content.appendChild(group);
                });
            }

            // Add index property
            var items = content.querySelectorAll('.jdropdown-item');
            [...items].forEach(function(v, k) {
                obj.items[k] = v;
                v.setAttribute('data-index', k);
            });
        }

        // Reset value
        obj.setValue(obj.options.value ? obj.options.value : '');
    }

    obj.getText = function(asArray) {
        // Result
        var result = [];
        // Get selected items
        var items = el.querySelectorAll('.jdropdown-selected');
        // Append options
        [...items].forEach(function(v) {
            result.push(v.text);
        });

        if (asArray) {
            return result
        } else {
            return result.join('; ');
        }
    }

    obj.getValue = function(asArray) {
        // Result
        var result = [];
        // Get selected items
        var items = el.querySelectorAll('.jdropdown-selected');
        // Append options
        [...items].forEach(function(v) {
            result.push(v.value);
        });

        if (asArray) {
            return result;
        } else {
            return result.join(';');
        }
    }

    obj.setValue = function(value) {
        // Remove values
        var items = el.querySelectorAll('.jdropdown-selected');
        for (var j = 0; j < items.length; j++) {
            items[j].classList.remove('jdropdown-selected')
        } 

        // Set values
        if (value) {
            if (typeof(value.forEach) == 'function') {
                for (var i = 0; i < obj.items.length; i++) {
                    value.forEach(function(val) {
                        if (obj.items[i].value == val) {
                            obj.items[i].classList.add('jdropdown-selected');
                        }
                    });
                }
            } else {
                for (var i = 0; i < obj.items.length; i++) {
                    if (obj.items[i].value == value) {
                        obj.items[i].classList.add('jdropdown-selected');
                    }
                }
            }
        }

        // Update labels
        obj.updateLabel();
    }

    obj.selectIndex = function(index) {
        // Focus behaviour
        if (! obj.options.multiple) {
            // Update selected item
            obj.items.forEach(function(v) {
                v.classList.remove('jdropdown-cursor');
                v.classList.remove('jdropdown-selected');
            });
            obj.items[index].classList.add('jdropdown-selected');
            obj.items[index].classList.add('jdropdown-cursor');
            // Close
            obj.close();
        } else {
            // Toggle option
            if (obj.items[index].classList.contains('jdropdown-selected')) {
                obj.items[index].classList.remove('jdropdown-selected');
                obj.items[index].classList.remove('jdropdown-cursor');
            } else {
                obj.items.forEach(function(v) {
                    v.classList.remove('jdropdown-cursor');
                });
                obj.items[index].classList.add('jdropdown-selected');
                obj.items[index].classList.add('jdropdown-cursor');
            }
            // Update cursor position
            obj.currentIndex = index;

            // Update labels for multiple dropdown
            if (! obj.options.autocomplete) {
                obj.updateLabel();
            }
        }

        // Events
        if (typeof(obj.options.onchange) == 'function') {
            var oldValue = obj.getValue();
            var newValue = obj.items[index].value;

            obj.options.onchange(el, index, oldValue, newValue);
        }
    }

    obj.selectItem = function(item) {
        var index = item.getAttribute('data-index');
        if (jApp.dropdown.current) {
            obj.selectIndex(item.getAttribute('data-index'));
        } else {
            // List
            if (obj.options.type == 'list') {
                if (! obj.options.multiple) {
                    obj.items.forEach(function(k, v) {
                        v.classList.remove('jdropdown-cursor');
                        v.classList.remove('jdropdown-selected');
                    });
                    obj.items[index].classList.add('jdropdown-selected');
                    obj.items[index].classList.add('jdropdown-cursor');
                } else {
                    // Toggle option
                    if (obj.items[index].classList.contains('jdropdown-selected')) {
                        obj.items[index].classList.remove('jdropdown-selected');
                        obj.items[index].classList.remove('jdropdown-cursor');
                    } else {
                        obj.items.forEach(function(v) {
                            v.classList.remove('jdropdown-cursor');
                        });
                        obj.items[index].classList.add('jdropdown-selected');
                        obj.items[index].classList.add('jdropdown-cursor');
                    }
                    // Update cursor position
                    obj.currentIndex = index;
                }
            }
        }
    }

    obj.find = function(str) {
        // Append options
        for (var i = 0; i < obj.items.length; i++) {
            if (str == null || obj.items[i].classList.contains('jdropdown-selected') || obj.items[i].innerHTML.toLowerCase().indexOf(str.toLowerCase()) != -1) {
                obj.items[i].style.display = '';
            } else {
                obj.items[i].style.display = 'none';
            }
        };

        var numVisibleItems = function(items) {
            var visible = 0;
            for (var j = 0; j < items.length; j++) {
                if (items[j].style.display != 'none') {
                    visible++;
                }
            }
            return visible;
        }

        // Hide groups
        for (var i = 0; i < obj.groups.length; i++) {
            if (numVisibleItems(obj.groups[i].querySelectorAll('.jdropdown-item'))) {
                obj.groups[i].children[0].style.display = '';
            } else {
                obj.groups[i].children[0].style.display = 'none';
            }
        }
    }

    obj.updateLabel = function() {
        // Update label
        header.value = obj.getText();
    }

    obj.open = function() {
        if (jApp.dropdown.current != el) {
            if (jApp.dropdown.current) {
                jApp.dropdown.current.dropdown.close();
            }
            jApp.dropdown.current = el;
        }

        // Focus
        if (! el.classList.contains('jdropdown-focus')) {
            // Add focus
            el.classList.add('jdropdown-focus');

            // Animation
            if (jApp.getWindowWidth() < 800) {
                if (obj.options.type == null || obj.options.type == 'picker') {
                    container.classList.add('slide-bottom-in');
                }
            }

            // Filter
            if (obj.options.autocomplete == true) {
                // Redo search
                obj.find();
                // Clear search field
                header.value = '';
                header.focus();
            }

            // Selected
            var selected = el.querySelector('.jdropdown-selected');
            // Update cursor position
            if (selected) {
                obj.updateCursor(selected.getAttribute('data-index'));
            }
            // Container Size
            if (! obj.options.type || obj.options.type == 'default') {
                const rect = el.getBoundingClientRect();
                const rectContainer = container.getBoundingClientRect();
                container.style.minWidth = rect.width + 'px';
                container.style.maxWidth = '100%';

                if (obj.options.position) {
                    container.style.position = 'fixed';
                    if (window.innerHeight < rect.bottom + rectContainer.height) {
                        container.style.top = rect.top - rectContainer.height - 2;
                    } else {
                        container.style.top = rect.top + rect.height + 1;
                    }
                } else {
                    if (window.innerHeight < rect.bottom + rectContainer.height) {
                        container.style.top = -1 * (rectContainer.height);
                    } else {
                        container.style.top = '';
                    }
                }
            }
        }

        // Events
        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el);
        }
    }

    obj.close = function(ignoreEvents) {
        if (jApp.dropdown.current) {
            // Remove controller
            jApp.dropdown.current = null
            // Remove cursor
            var cursor = el.querySelector('.jdropdown-cursor');
            if (cursor) {
                cursor.classList.remove('jdropdown-cursor');
            }
            // Update labels
            obj.updateLabel();
            // Events
            if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
                obj.options.onclose(el);
            }
            // Reset
            obj.currentIndex = null;
            // Blur
            header.blur();
            // Remove focus
            el.classList.remove('jdropdown-focus');
        }

        return obj.getValue();
    }

    obj.reset = function() {
        // Remove current cursor
        var cursor = el.querySelector('.jdropdown-cursor');
        if (cursor) {
            cursor.classList.remove('jdropdown-cursor');
        }
        // Unselected all
        obj.items.forEach(function(v) {
            v.classList.remove('jdropdown-selected');
        });
        // Update labels
        obj.updateLabel();
    }

    obj.first = function() {
        var newIndex = null;
        for (var i = obj.currentIndex - 1; i >= 0; i--) {
            if (obj.items[i].style.display != 'none') {
                newIndex = i;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.last = function() {
        var newIndex = null;
        for (var i = obj.currentIndex + 1; i < obj.options.data.length; i++) {
            if (obj.items[i].style.display != 'none') {
                newIndex = i;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.next = function() {
        var newIndex = null;
        for (var i = obj.currentIndex + 1; i < obj.options.data.length; i++) {
            if (obj.items[i].style.display != 'none') {
                newIndex = i;
                break;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.prev = function() {
        var newIndex = null;
        for (var i = obj.currentIndex - 1; i >= 0; i--) {
            if (obj.items[i].style.display != 'none') {
                newIndex = i;
                break;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.updateCursor = function(index) {
        // Update cursor
        if (obj.items[obj.currentIndex]) {
            obj.items[obj.currentIndex].classList.remove('jdropdown-cursor');
        }
        if (obj.items && obj.items[index]) {
            obj.items[index].classList.add('jdropdown-cursor');

            // Update position
            obj.currentIndex = parseInt(index);
    
            // Update scroll
            var container = content.scrollTop;
            var element = obj.items[obj.currentIndex];
            content.scrollTop = element.offsetTop - element.scrollTop + element.clientTop - 95;
        }
    }

    obj.init();

    el.dropdown = obj;

    return obj;
});

jApp.dropdown.onclick = function(e) {
    var element = jApp.getElement(e.target, 'jdropdown');
    if (element) {
        dropdown = element.dropdown;
        if (e.target.classList.contains('jdropdown-header')) {
            if (element.classList.contains('jdropdown-focus') && element.classList.contains('jdropdown-default')) {
                dropdown.close();
            } else {
                dropdown.open();
            }
        } else if (e.target.classList.contains('jdropdown-group-name')) {
            var items = e.target.nextSibling.children;
            if (e.target.nextSibling.style.display != 'none') {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].style.display != 'none') {
                        dropdown.selectItem(items[i]);
                    }
                }
            }
        } else if (e.target.classList.contains('jdropdown-group-arrow')) {
            if (e.target.classList.contains('jdropdown-group-arrow-down')) {
                e.target.classList.remove('jdropdown-group-arrow-down');
                e.target.classList.add('jdropdown-group-arrow-up');
                e.target.parentNode.nextSibling.style.display = 'none';
            } else {
                e.target.classList.remove('jdropdown-group-arrow-up');
                e.target.classList.add('jdropdown-group-arrow-down');
                e.target.parentNode.nextSibling.style.display = '';
            }
        } else if (e.target.classList.contains('jdropdown-item')) {
            dropdown.selectItem(e.target);
        } else if (e.target.classList.contains('jdropdown-image')) {
            dropdown.selectIndex(e.target.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-description')) {
            dropdown.selectIndex(e.target.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-title')) {
            dropdown.selectIndex(e.target.parentNode.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-close') || e.target.classList.contains('jdropdown-backdrop')) {
            // Close
            dropdown.close();
        }

        e.stopPropagation();
        e.preventDefault();
    } else {
        if (jApp.dropdown.current) {
            jApp.dropdown.current.dropdown.close();
        }
    }
}


// Keydown controls
jApp.dropdown.onkeydown = function(e) {
    if (jApp.dropdown.current) {
        // Element
        var element = jApp.dropdown.current.dropdown;
        // Index
        var index = element.currentIndex;

        if (e.shiftKey) {

        } else {
            if (e.which == 13 || e.which == 35 || e.which == 36 || e.which == 38 || e.which == 40) {
                // Move cursor
                if (e.which == 13) {
                    element.selectIndex(index)
                } else if (e.which == 38) {
                    if (index == null) {
                        element.updateCursor(0);
                    } else if (index > 0) {
                        element.prev();
                    }
                } else if (e.which == 40) {
                    if (index == null) {
                        element.updateCursor(0);
                    } else if (index + 1 < element.options.data.length) {
                        element.next();
                    }
                } else if (e.which == 36) {
                    element.first();
                } else if (e.which == 35) {
                    element.last();
                }

                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
}

document.addEventListener('click', jApp.dropdown.onclick);
document.addEventListener('keydown', jApp.dropdown.onkeydown);

/**
 * (c) jTools Text Editor
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Inline richtext editor
 */

jApp.editor = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        // Initial HTML content
        value:null,
        // Add toolbar
        toolbar:null,
        // Max height
        maxHeight:null,
        // Website parser is to read websites and images from cross domain
        websiteParser:null,
        // Key from youtube to read properties from URL
        youtubeKey:null,
        // Parse URL
        parseURL:true,
        // Accept drop images
        dropImages:true,
        // Events
        onclick:null,
        onfocus:null,
        onblur:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    if (obj.options.value) {
        var value = obj.options.value;
    } else {
        var value = el.innerHTML ? el.innerHTML : ''; 
    }

    // Prepare container
    el.innerHTML = '';
    el.classList.add('jeditor-container');

    // Create editor
    var editor = document.createElement('div');
    editor.setAttribute('contenteditable', true);
    editor.setAttribute('spellcheck', false);
    editor.className = 'jeditor';
    editor.innerHTML = value;
    el.appendChild(editor);

    // Max height
    if (obj.options.maxHeight) {
        editor.style.overflowY = 'auto';
        editor.style.maxHeight = obj.options.maxHeight;
    }

    // Timer
    var editorTimer = null;

    /**
     * Append snippet or thumbs in the editor
     * @Param object data
     */
    obj.appendElement = function(data) {
        var snippet = editor.querySelector('.jeditor-snippet');

        if (! snippet) {
            var snippet = document.createElement('div');
            snippet.className = 'jeditor-snippet';
            snippet.setAttribute('contenteditable', false);
            snippet.setAttribute('data-url', data.url);

            if (data.image) {
                var image = document.createElement('img');
                image.className = 'jeditor-snippet-image';
                image.src = data.image;
                snippet.appendChild(image);
            }

            var div = document.createElement('div');
            div.className = 'jeditor-snippet-title';
            div.innerHTML = data.title;
            snippet.appendChild(div);

            var div = document.createElement('div');
            div.className = 'jeditor-snippet-description';
            div.innerHTML = data.description;
            snippet.appendChild(div);

            var div = document.createElement('div');
            div.className = 'jeditor-snippet-host';
            div.innerHTML = data.host;
            snippet.appendChild(div);

            var div = document.createElement('div');
            div.className = 'jeditor-snippet-url';
            div.innerHTML = data.url;
            snippet.appendChild(div);

            editor.appendChild(snippet);
        }
    }

    obj.detectUrl = function(text) {
        var expression = /(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig;

        if (links = text.match(expression)) {
            if (links[0].substr(0,3) == 'www') {
                links[0] = 'http://' + links[0];
            }
        }

        return links;
    }

    obj.youtubeParser = function(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);

        return (match && match[7].length == 11) ? match[7] : false;
    }

    obj.getYoutube = function(id) {
        if (! obj.options.youtubeKey) {
            console.error('The youtubeKey is not defined');
        } else {
            fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=' + obj.options.youtubeKey + '&id=' + id , { headers: new Headers({ 'content-type': 'text/json' }) })
            .then(function(data) {
                data.json().then(function(result) {
                    var p = {
                        title:'',
                        description:'',
                        image:'',
                        host:'www.youtube.com',
                        url:'https://www.youtube.com?watch=' + id,
                    }
                    if (result.items[0].snippet.title) {
                        p.title = result.items[0].snippet.title;
                    }
                    if (result.items[0].snippet.description) {
                        p.description = result.items[0].snippet.description;

                        if (p.description.length > 150) {
                            p.description = p.description.substr(0, 150) + '...';
                        }
                    }
                    if (result.items[0].snippet.thumbnails.medium.url) {
                        p.image = result.items[0].snippet.thumbnails.medium.url;
                    }

                    obj.appendElement(p);
                })
            });
        }
    }

    obj.getWebsite = function(url) {
        if (! obj.options.websiteParser) {
            console.log('The websiteParser is not defined');
        } else {
            fetch(obj.options.websiteParser + encodeURI(url.trim()) , { headers: new Headers({ 'content-type': 'text/json' }) })
            .then(function(data) {
                data.json().then(function(result) {
                    var p = {
                        title:'',
                        description:'',
                        image:'',
                        host:url,
                        url:url,
                    }

                    if (result.title) {
                        p.title = result.title;
                    }
                    if (result.description) {
                        p.description = result.description;
                    }
                    if (result.image) {
                        p.image = result.image;
                    }
                    if (result.url) {
                        p.url = result.url;
                    }
                    if (result.host) {
                        p.host = result.host;
                    }

                    obj.appendElement(p);
                })
            });
        }
    }

    obj.setData = function(html) {
        editor.innerHTML = html;
    }

    obj.getData = function(json) {
        if (! json) {
            var data = editor.innerHTML;
        } else {
            var data = {
                message : '',
            };

            var div = document.createElement('div');
            div.innerHTML = editor.innerHTML;

            var snippet = div.querySelector('.jeditor-snippet');
            if (snippet) {
                var index = 0;
                data.snippet = {};
                if (snippet.children[0].tagName == 'IMG') {
                    data.snippet.image = snippet.children[index++].getAttribute('src');
                }

                data.snippet.title = snippet.children[index++].innerHTML;
                data.snippet.description = snippet.children[index++].innerHTML;
                data.snippet.host = snippet.children[index++].innerHTML;
                data.snippet.url = snippet.children[index++].innerHTML;

                snippet.remove();
            }
    
            //$(div).find('.thumbs-container').remove();
            text = div.innerHTML;
            text = text.replace(/<br>/g, "\n");
            text = text.replace(/<(?:.|\n)*?>/gm, '');
            data.message = text;
            data = JSON.stringify(data);
        }

        return data;
    }

    obj.verifyEditor = function() {
        clearTimeout(editorTimer);
        editorTimer = setTimeout(function() {
            var snippet = editor.querySelector('.jeditor-snippet');
            var thumbsContainer = el.querySelector('.jeditor-thumbs-container');

            if (! snippet && ! thumbsContainer) {
                var html = editor.innerHTML.replace(/\n/g, ' ');
                var container = document.createElement('div');
                container.innerHTML = html;
                var thumbsContainer = container.querySelector('.jeditor-thumbs-container');
                if (thumbsContainer) {
                    thumbsContainer.remove();
                }
                var text = container.innerText; 

                if (url = obj.detectUrl(text)) {
                    if (url[0].substr(-3) == 'jpg' || url[0].substr(-3) == 'png' || url[0].substr(-3) == 'gif') {
                        if (obj.getDomain(url[0]) == window.location.hostname) {
                            obj.importImage(url[0], '');
                        } else {
                            obj.importImage(obj.options.websiteParser + url[0], '');
                        }
                    } else {
                        if (id = obj.youtubeParser(url[0])) {
                            obj.getYoutube(id);
                        } else {
                            obj.getWebsite(url[0]);
                        }
                    }
                }
            }
        }, 1000);
    }

    obj.getDomain = function(url) {
        return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0].split(/:/g)[0];
    }

    obj.importImage = function(url, name) {
        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width  = 100;
            canvas.height = 100;
            var ctx = canvas.getContext("2d");
            ctx.imageSmoothingQuality = 'high';
            var w = img.width;
            var h = img.height;
            if (w > h) {
                p = 100 / w;
            } else {
                p = 100 / h;
            }
            var position = (100 - h*p) / 2;

            ctx.drawImage(img, 0, position, w*p, h*p);
            var img1 = new Image();
            var src1 = canvas.toDataURL();
            $(img1).prop('src', src1);

            // Thumbs holder
            var thumbsContainer = editor.querySelector('.jeditor-thumbs-container');
            if (! thumbsContainer) {
                thumbsContainer = document.createElement('div');
                thumbsContainer.className = 'jeditor-thumbs-container';
                thumbsContainer.setAttribute('contenteditable', 'false');

                if (! editor.innerHTML) {
                    editor.innerHTML = '<br><br>';
                }
                editor.appendChild(thumbsContainer);
            }

            // Create image
            var div = document.createElement('div');
            div.className = 'jeditor-thumbs';

            canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx = canvas.getContext("2d");
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);

            var l = editor.querySelectorAll('.jeditor-thumbs').length;
            var m = src1.split(';')[0].replace('data:', '');
            var e = m.split('/')[1];

            // Add image
            div.appendChild(img1);

            // Append thumbs to the main object
            thumbsContainer.appendChild(div);
        };

        img.src = url;
    }

    obj.addFile = function(files) {
        var reader = [];

        for (var i = 0; i < files.length; i++) {
            if (files[i].size > 8000000) {
                alert('The file is too big');
            } else {
                // Only PDF or Images
                var type = files[i].type.split('/');
                if (type[1] == 'pdf' || type[0] == 'image') {
                    // Create file
                    reader[i] = new FileReader();
                    reader[i].index = i;
                    reader[i].type = type;
                    reader[i].name = files[i].name;
                    reader[i].addEventListener("load", function (data) {
                        // Get result
                        if (data.target.type[1] == 'pdf') {
                            obj.importPdf(data.target.result, data.target.name);
                        } else {
                            obj.importImage(data.target.result, data.target.name);
                        }
                    }, false);

                    reader[i].readAsDataURL(files[i])
                } else {
                    alert('The extension is not allowed');
                }
            }
        }
    }

    // Toolbar defaults
    obj.getToolbar = function() {
        return [
            {
                icon:'undo',
                onclick: function() {
                    document.execCommand('undo');
                }
            },
            {
                icon:'redo',
                onclick: function() {
                    document.execCommand('redo');
                }
            },
            {
                type:'divisor'
            },
            {
                icon:'format_bold',
                onclick: function() {
                    document.execCommand('bold');

                    if (document.queryCommandState("bold")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_italic',
                onclick: function() {
                    document.execCommand('italic');

                    if (document.queryCommandState("italic")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_underline',
                onclick: function() {
                    document.execCommand('underline');

                    if (document.queryCommandState("underline")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            /*{
                type:'select',
                items: ['Verdana','Arial','Courier New'],
                onchange: function() {
                }
            },
            {
                type:'select',
                items: ['10px','12px','14px','16px','18px','20px','22px'],
                onchange: function() {
                }
            },
            {
                icon:'format_align_left',
                onclick: function() {
                    document.execCommand('JustifyLeft');

                    if (document.queryCommandState("JustifyLeft")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_align_center',
                onclick: function() {
                    document.execCommand('justifyCenter');

                    if (document.queryCommandState("justifyCenter")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_align_right',
                onclick: function() {
                    document.execCommand('justifyRight');

                    if (document.queryCommandState("justifyRight")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_align_justify',
                onclick: function() {
                    document.execCommand('justifyFull');

                    if (document.queryCommandState("justifyFull")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            },
            {
                icon:'format_list_bulleted',
                onclick: function() {
                    document.execCommand('insertUnorderedList');

                    if (document.queryCommandState("insertUnorderedList")) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                }
            }*/
        ];
    }

    // Toolbar
    if (obj.options.toolbar == null) {
        obj.options.toolbar = obj.getToolbar();
    }

    if (obj.options.toolbar) {
        var toolbar = document.createElement('div');
        toolbar.className = 'jeditor-toolbar';
        //toolbar.style.visibility = 'hidden';

        for (var i = 0; i < obj.options.toolbar.length; i++) {
            if (obj.options.toolbar[i].icon) {
                var item = document.createElement('div');
                item.style.userSelect = 'none';
                var itemIcon = document.createElement('i');
                itemIcon.className = 'material-icons';
                itemIcon.innerHTML = obj.options.toolbar[i].icon;
                itemIcon.onclick = obj.options.toolbar[i].onclick;
                item.appendChild(itemIcon);
                toolbar.appendChild(item);
            } else {
                if (obj.options.toolbar[i].type == 'divisor') {
                    var divisor = document.createElement('div');
                    divisor.className = 'jeditor-toolbar-divisor';
                    toolbar.appendChild(divisor);
                }
            }
        }

        el.appendChild(toolbar);
    }

    // Click
    if (typeof(obj.options.onclick) == 'function') {
        el.addEventListener('click', obj.options.onclick);
    }

    // Blur
    if (typeof(obj.options.onblur) == 'function') {
        editor.addEventListener('blur', function() {
            obj.options.onblur(obj);
        });
    }

    // Focus
    if (typeof(obj.options.onfocus) == 'function') {
        editor.addEventListener('focus', function() {
            obj.options.onfocus(obj);
        });
    }

    editor.addEventListener('mousedown', function(e) {
        var snippet = editor.querySelector('.jeditor-snippet');
        if (snippet) {
            var rect = snippet.getBoundingClientRect();
            if (rect.width - (e.clientX - rect.left) < 40 && e.clientY - rect.top < 40) {
                snippet.remove();
            }
        }
    });

    editor.addEventListener('keydown', function(e) {
        if (obj.options.parseURL == true) {
            obj.verifyEditor();
        }
    });

    editor.addEventListener('dragenter', function(e) {
        el.style.border = '1px dashed #000';
    });

    editor.addEventListener('dragover', function(e) {
        if (editorTimer) {
            clearTimeout(editorTimer);
        }
        editorTimer = setTimeout(function() {
            el.style.border = '';
        }, 100);
    });

    editor.addEventListener('drop', function(e) {
        var html = (e.originalEvent || e).dataTransfer.getData('text/html');
        var text = (e.originalEvent || e).dataTransfer.getData('text/plain');
        var file = (e.originalEvent || e).dataTransfer.files;

        if (text) {
            // Create temp element
            var div = document.createElement('div');
            div.innerHTML = html;

            // Get images
            var img = div.querySelectorAll('img');

            if (img.length) {
                for (var i = 0; i < img.length; i++) {
                    if (img[i].src.substr(0,4) == 'data') {
                        obj.importImage(img[i].src, '');
                    } else {
                        if (obj.getDomain(img[i].src) == window.location.hostname) {
                            obj.importImage(img[i].src, '');
                        } else {
                            obj.importImage(obj.options.websiteParser + img[i].src, '');
                        }
                    }
                }
            } else {
                var range = null;
                if (document.caretRangeFromPoint) { // Chrome
                    range=document.caretRangeFromPoint(e.clientX,e.clientY);
                } else if (e.rangeParent) { // Firefox
                    range=document.createRange();
                    range.setStart(e.rangeParent,e.rangeOffset);
                }
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                sel.anchorNode.parentNode.focus();

                if (document.queryCommandSupported('insertText')) {
                    document.execCommand('insertText', false, text);
                } else {
                    document.execCommand('paste', false, text);
                }
            }
        }

        if (file) {
            obj.addFile(file);
        }

        el.style.border = '';

        e.preventDefault();  
    });

    // Paste
    editor.addEventListener('paste', function(e) {
        if (e.clipboardData || e.originalEvent.clipboardData) {
            var html = (e.originalEvent || e).clipboardData.getData('text/html');
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
            var file = (e.originalEvent || e).clipboardData.files
        } else if (window.clipboardData) {
            var html = window.clipboardData.getData('Html');
            var text = window.clipboardData.getData('Text');
            var file = window.clipboardData.files
        }

        text = text.split('\r\n');
        var str = '';
        if (e.target.nodeName == 'DIV' && ! e.target.classList.contains('jeditor')) {
            for (var i = 0; i < text.length; i++) {
                if (text[i]) {
                    str += text[i] + "\n";
                }
            }
        } else {
            for (var i = 0; i < text.length; i++) {
                if (text[i]) {
                    str += '<div>' + text[i] + '</div>';
                } else {
                    str += '<div><br></div>';
                }
            }
        }
        document.execCommand('insertHtml', false, str);

        // Create temp element
        var div = document.createElement('div');
        div.innerHTML = html;

        // Get images
        var img = div.querySelectorAll('img');

        if (img.length) {
            for (var i = 0; i < img.length; i++) {
                if (img[i].src.substr(0,4) == 'data') {
                    obj.importImage(text.src, '');
                } else {
                    obj.importImage(obj.options.websiteParser + img[i].src, '');
                }
            }
        }

        if (file) {
            obj.addFile(file);
        }

        e.preventDefault();
    });

    el.editor = obj;

    return obj;
});

jApp.image = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        minWidth:false,
        onchange:null,
        singleFile:true,
        parser:'',
        text:{
            extensionNotAllowed:'The extension is not allowed',
            imageTooSmall:'The resolution is too low, try a image with a better resolution. width > 800px',
        }
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Upload icon
    el.classList.add('jupload');

    // Add image
    obj.addImage = function(file) {
        var img = document.createElement('img');
        img.setAttribute('data-lastmodified', file.size);
        img.setAttribute('data-name', file.name);
        img.setAttribute('data-size', file.size);
        img.setAttribute('data-thumbs', file.thumbs);
        img.setAttribute('data-cover', file.cover ? 1 : 0);
        img.setAttribute('src', file.file);
        img.className = 'jfile';
        img.style.width = '100%';

        return img;
    }

    // Add image
    obj.addImages = function(files) {
        if (obj.options.singleFile == true) {
            el.innerHTML = '';
        }

        for (var i = 0; i < files.length; i++) {
            el.appendChild(obj.addImage(files[i]));
        }
    }

    obj.addFromFile = function(file) {
        if (obj.options.singleFile == true) {
            el.innerHTML = '';
        }

        var type = file.type.split('/');
        if (type[0] == 'image') {
            var image = new FileReader();
            image.addEventListener("load", function (v) {

                var img = document.createElement('img');
                img.setAttribute('data-lastModified', file.lastModified);
                img.setAttribute('data-name', file.name);
                img.setAttribute('data-size', file.size);
                img.setAttribute('src', v.srcElement.result);
                el.appendChild(img);

                setTimeout(function() {
                    if (obj.options.minWidth && (parseInt(img.width) < parseInt(obj.options.minWidth))) {
                        img.remove();
                        alert(obj.options.text.imageTooSmall);
                    } else {
                        if (typeof(obj.options.onchange) == 'function') {
                            obj.options.onchange(img);
                        }
                    }
                }, 0);
            }, false);

            image.readAsDataURL(file);
        } else {
            alert(text.extentionNotAllowed);
        }
    }

    var attachmentInput = document.createElement('input');
    attachmentInput.type = 'file';
    attachmentInput.setAttribute('accept', 'image/*');
    attachmentInput.onchange = function() {
        for (var i = 0; i < this.files.length; i++) {
            obj.addFromFile(this.files[i]);
        }
    }

    el.addEventListener("dblclick", function(e) {
        var evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        attachmentInput.dispatchEvent(evt);
    });

    el.addEventListener('dragenter', function(e) {
        el.style.border = '1px dashed #000';
    });

    el.addEventListener('dragleave', function(e) {
        el.style.border = '1px solid #eee';
    });

    el.addEventListener('dragstop', function(e) {
        el.style.border = '1px solid #eee';
    });

    el.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    el.addEventListener('drop', function(e) {
        e.preventDefault();  
        e.stopPropagation();

        var data = e.dataTransfer.getData('text/html');
        if (! data) {
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                obj.addFromFile(e.dataTransfer.files[i]);
            }
        } else {
            if (obj.options.singleFile == true) {
                el.innerHTML = '';
            }

            var template = document.createElement('template');
            template.innerHTML = data.trim();
            data = template.content.firstChild;

            var img = document.createElement('img');
            img.setAttribute('data-lastModified', '');
            img.setAttribute('data-name', '');
            img.setAttribute('data-size', '');
            el.appendChild(img);

            if (data.src.substr(0,4) == 'data') {
                img.setAttribute('src', data.src);
                img.setAttribute('data-size', data.src.length);

                if (typeof(obj.options.onchange) == 'function') {
                    obj.options.onchange(img);
                }
            } else {
                var name = data.src.split('/');
                name = name[name.length-1];
                img.setAttribute('data-name', name);

                const toDataURL = url => fetch(url)
                    .then(response => response.blob())
                    .then(blob => new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result);
                          reader.onerror = reject;
                          reader.readAsDataURL(blob);
                    }));

                toDataURL(obj.options.parser + data.src).then(dataUrl => {
                    img.setAttribute('src', dataUrl);
                    img.setAttribute('data-size', dataUrl.length);

                    setTimeout(function() {
                        if (parseInt(img.width) < 800) {
                            img.remove();
                            alert(obj.options.imageTooSmall);
                        } else {
                            if (typeof(obj.options.onchange) == 'function') {
                                obj.options.onchange(img);
                            }
                        }
                    }, 0);
                });
            }
        }

        el.style.border = '1px solid #eee';

        return false;
    });

    el.image = obj;

    return obj;
});

/**
 * (c) jLoading
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Page loading spin
 */

jApp.loading = (function() {
    var obj = {};

    var loading = document.createElement('div');
    loading.className = 'jloading';

    obj.show = function() {
        document.body.appendChild(loading);
    };

    obj.hide = function() {
        loading.remove();
    };

    return obj;
})();

/**
 * (c) jLogin
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Login helper
 */

jApp.login = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        url:window.location.href,
        prepareRequest:null,
        accessToken:null,
        deviceToken:null,
        facebookUrl:null,
        maxHeight:null,
        onload:null,
        message:null,
        logo:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Message console container
    if (! obj.options.message) {
        var messageElement = document.querySelector('.message');
        if (messageElement) {
            obj.options.message = messageElement;
        }
    }

    // Container
    var container = document.createElement('div');
    el.appendChild(container);

    // Logo
    var divLogo = document.createElement('div');
    divLogo.className = 'logo'
    container.appendChild(divLogo);

    if (obj.options.logo) {
        var logo = document.createElement('img');
        logo.src = obj.options.logo;
        divLogo.appendChild(logo);
    }

    // Code
    var labelCode = document.createElement('label');
    labelCode.innerHTML = 'Please enter here the code received';
    var inputCode = document.createElement('input');
    inputCode.type = 'number';
    inputCode.id = 'code';
    inputCode.setAttribute('maxlength', 6);
    var divCode = document.createElement('div');
    divCode.appendChild(labelCode);
    divCode.appendChild(inputCode);

    // Hash
    var inputHash = document.createElement('input');
    inputHash.type = 'hidden';
    inputHash.name = 'h';
    var divHash = document.createElement('div');
    divHash.appendChild(inputHash);

    // Recovery
    var inputRecovery = document.createElement('input');
    inputRecovery.type = 'hidden';
    inputRecovery.name = 'recovery';
    inputRecovery.value = '1';
    var divRecovery = document.createElement('div');
    divRecovery.appendChild(inputRecovery);

    // Email
    var labelUsername = document.createElement('label');
    labelUsername.innerHTML = 'E-mail';
    var inputUsername = document.createElement('input');
    inputUsername.type = 'text';
    inputUsername.name = 'username';
    var divUsername = document.createElement('div');
    divUsername.appendChild(labelUsername);
    divUsername.appendChild(inputUsername);

    // Password
    var labelPassword = document.createElement('label');
    labelPassword.innerHTML = 'Password';
    var inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.name = 'password';
    var divPassword = document.createElement('div');
    divPassword.appendChild(labelPassword);
    divPassword.appendChild(inputPassword);

    // Repeat password
    var labelRepeatPassword = document.createElement('label');
    labelRepeatPassword.innerHTML = 'Password';
    var inputRepeatPassword = document.createElement('input');
    inputRepeatPassword.type = 'password';
    inputRepeatPassword.name = 'password';
    var divRepeatPassword = document.createElement('div');
    divRepeatPassword.appendChild(labelRepeatPassword);
    divRepeatPassword.appendChild(inputRepeatPassword);

    // Remember checkbox
    var labelRemember = document.createElement('label');
    labelRemember.innerHTML = 'Remember me on this device';
    var inputRemember = document.createElement('input');
    inputRemember.type = 'checkbox';
    inputRemember.name = 'remember';
    inputRemember.value = '1';
    labelRemember.appendChild(inputRemember);
    var divRememberButton = document.createElement('div');
    divRememberButton.className = 'rememberButton';
    divRememberButton.appendChild(labelRemember);

    // Login button
    var actionButton = document.createElement('input');
    actionButton.type = 'button';
    actionButton.value = 'Log In';
    actionButton.onclick = function() {
        obj.execute();
    }
    var divActionButton = document.createElement('div');
    divActionButton.appendChild(actionButton);

    // Cancel button
    var cancelButton = document.createElement('div');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.className = 'cancelButton';
    cancelButton.onclick = function() {
        obj.requestAccess();
    }
    var divCancelButton = document.createElement('div');
    divCancelButton.appendChild(cancelButton);

    // Captcha
    var labelCaptcha = document.createElement('label');
    labelCaptcha.innerHTML = 'Please type here the code below';
    var inputCaptcha = document.createElement('input');
    inputCaptcha.type = 'text';
    inputCaptcha.name = 'captcha';
    var imageCaptcha = document.createElement('img');
    var divCaptcha = document.createElement('div');
    divCaptcha.className = 'jlogin-captcha';
    divCaptcha.appendChild(labelCaptcha);
    divCaptcha.appendChild(inputCaptcha);
    divCaptcha.appendChild(imageCaptcha);

    // Facebook
    var facebookButton = document.createElement('div');
    facebookButton.innerHTML = 'Login with Facebook';
    facebookButton.className = 'facebookButton';
    var divFacebookButton = document.createElement('div');
    divFacebookButton.appendChild(facebookButton);
    divFacebookButton.onclick = function() {
        obj.requestLoginViaFacebook();
    }
    // Forgot password
    var inputRequest = document.createElement('span');
    inputRequest.innerHTML = 'Request a new password';
    var divRequestButton = document.createElement('div');
    divRequestButton.className = 'requestButton';
    divRequestButton.appendChild(inputRequest);
    divRequestButton.onclick = function() {
        obj.requestNewPassword();
    }

    el.className = 'jlogin';

    /** 
     * Show message
     */
    obj.showMessage = function(data) {
        var message = (typeof(data) == 'object') ? data.message : data;

        if (typeof(obj.options.showMessage) == 'function') {
            obj.options.showMessage(data);
        } else {
            alert(data);
        }
    }
    
    /**
     * Request the email with the recovery instructions
     */
    obj.requestNewPassword = function() {
        if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
            var captcha = true;
        }

        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divRecovery);
        container.appendChild(divUsername);
        if (captcha) {
            container.appendChild(divCaptcha);
        }
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Request a new password';
        inputRecovery.value = 1;
    }

    /**
     * Confirm recovery code
     */
    obj.codeConfirmation = function() {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divHash);
        container.appendChild(divCode);
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Confirm code';
        inputRecovery.value = 2;
    }

    /**
     * Update my password
     */
    obj.changeMyPassword = function(hash) {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divHash);
        container.appendChild(divPassword);
        container.appendChild(divRepeatPassword);
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Change my password';
        inputHash.value = hash;
    }

    /**
     * Request access default method
     */
    obj.requestAccess = function() {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divUsername);
        container.appendChild(divPassword);
        container.appendChild(divActionButton);
        container.appendChild(divFacebookButton);
        container.appendChild(divRequestButton);
        container.appendChild(divRememberButton);
        container.appendChild(divRequestButton);
        actionButton.value = 'Login';

        // Email persistence
        if (window.localStorage.getItem('username')) {
            inputUsername.value = window.localStorage.getItem('username');
            inputPassword.focus();
        } else {
            inputUsername.focus();
        }
    }

    /**
     * Request login via facebook
     */
    obj.requestLoginViaFacebook = function() {
        if (typeof(deviceNotificationToken) == 'undefined') {
            FB.getLoginStatus(function(response) {
                if (! response.status || response.status != 'connected') {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            obj.execute({ f:response.authResponse.accessToken });
                        } else {
                            obj.showMessage('Not authorized by facebook');
                        }
                    }, {scope: 'public_profile,email'});
                } else {
                    obj.execute({ f:response.authResponse.accessToken });
                }
            }, true);
        } else {
            jDestroy = function() {
                fbLogin.removeEventListener('loadstart', jStart);
                fbLogin.removeEventListener('loaderror', jError);
                fbLogin.removeEventListener('exit', jExit);
                fbLogin.close();
                fbLogin = null;
            }

            jStart = function(event) {
                var url = event.url;
                if (url.indexOf("access_token") >= 0) {
                    setTimeout(function(){
                        var u = url.match(/=(.*?)&/);
                        if (u[1].length > 32) {
                            obj.execute({ f:u[1] });
                        }
                        jDestroy();
                   },500);
                }

                if (url.indexOf("error=access_denied") >= 0) {
                   setTimeout(jDestroy ,500);
                   // Not authorized by facebook
                   obj.showMessage('Not authorized by facebook');
                }
            }

            jError = function(event) {
                jDestroy();
            }
        
            jExit = function(event) {
                jDestroy();
            }

            fbLogin = window.open(this.facebookUrl, "_blank", "location=no,closebuttoncaption=Exit,disallowoverscroll=yes,toolbar=no");
            fbLogin.addEventListener('loadstart', jStart);
            fbLogin.addEventListener('loaderror', jError);
            fbLogin.addEventListener('exit', jExit);
        }
    }

    // Perform request
    obj.execute = function(data) {
        // Keep email
        if (inputUsername.value != '') {
            window.localStorage.setItem('username', inputUsername.value);
        }

        // Captcha
        if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
            if (inputCaptcha.value == '') {
                obj.showMessage('Please enter the captch code below');
                return false;
            }
        }

        // Url
        var url = obj.options.url;

        // Device token
        if (obj.options.deviceToken) {
            url += '?token=' + obj.options.deviceToken;
        }

        // Callback
        var onsuccess = function(result) {
            if (result) {
                // Successfully response
                if (result.success == 1) {
                    // Recovery process
                    if (Array.prototype.indexOf.call(container.children, divRecovery) >= 0) {
                        if (inputRecovery.value == 1) {
                            obj.codeConfirmation();
                        } else {
                            obj.requestAccess();
                        }
                    }

                    // Token
                    if (result.token) {
                        // Set token
                        obj.options.accessToken = result.token;
                        // Save token
                        window.localStorage.setItem('Access-Token', result.token);
                    }
                }

                // Show message
                if (result.message) {
                    // Show message
                    obj.showMessage(result.message)
                }

                // Request captcha code
                if (! result.data) {
                    if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
                        divCaptcha.remove();
                    }
                } else {
                    container.insertBefore(divCaptcha, divActionButton);
                    imageCaptcha.setAttribute('src', 'data:image/png;base64,' + result.data);
                }

                // Give time to user see the message
                if (result.hash) {
                    // Change password
                    obj.changeMyPassword(result.hash);
                } else if (result.url) {
                    // App initialization
                    if (result.success == 1) {
                        if (typeof(obj.options.onload) == 'function') {
                            obj.options.onload(result);
                        } else {
                            if (result.message) {
                                setTimeout(function() { window.location.href = result.url; }, 2000);
                            } else {
                                window.location.href = result.url;
                            }
                        }
                    } else {
                        if (typeof(obj.options.onerror) == 'function') {
                            obj.options.onerror(result);
                        }
                    }
                }
            }
        }

        // Password
        if (! data) {
            var data = jApp.getFormElements(el);
            // Encode passworfd
            if (data.password) {
                data.password = jApp.login.sha512(data.password);
            }
            // Recovery code
            if (Array.prototype.indexOf.call(container.children, divCode) >= 0 && inputCode.value) {
                data.h = jApp.login.sha512(inputCode.value);
            }
        }
        var data = new URLSearchParams(data);

        // Remote call
        fetch(obj.options.url, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }),
            body: data
        })
        .then(function(data) {
            data.json().then(function(result) {
                onsuccess(result);
            })
        });
    }

    obj.requestAccess();

    return obj;
});


jApp.login.sha512 = function(str) {
    function int64(msint_32, lsint_32) {
        this.highOrder = msint_32;
        this.lowOrder = lsint_32;
    }

    var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
        new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
        new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
        new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

    var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
        new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
        new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
        new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
        new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
        new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
        new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
        new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
        new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
        new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
        new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
        new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
        new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
        new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
        new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
        new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
        new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
        new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
        new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
        new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
        new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
        new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
        new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
        new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
        new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
        new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
        new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
        new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
        new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
        new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
        new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
        new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
        new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
        new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
        new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
        new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
        new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
        new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
        new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
        new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    var charsize = 8;

    function utf8_encode(str) {
        return unescape(encodeURIComponent(str));
    }

    function str2binb(str) {
        var bin = [];
        var mask = (1 << charsize) - 1;
        var len = str.length * charsize;
    
        for (var i = 0; i < len; i += charsize) {
            bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
        }
    
        return bin;
    }

    function binb2hex(binarray) {
        var hex_tab = "0123456789abcdef";
        var str = "";
        var length = binarray.length * 4;
        var srcByte;

        for (var i = 0; i < length; i += 1) {
            srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
            str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
        }

        return str;
    }

    function safe_add_2(x, y) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
        msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_4(a, b, c, d) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_5(a, b, c, d, e) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function maj(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
        );
    }

    function ch(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
        );
    }

    function rotr(x, n) {
        if (n <= 32) {
            return new int64(
             (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
             (x.lowOrder >>> n) | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
             (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
             (x.highOrder >>> n) | (x.lowOrder << (32 - n))
            );
        }
    }

    function sigma0(x) {
        var rotr28 = rotr(x, 28);
        var rotr34 = rotr(x, 34);
        var rotr39 = rotr(x, 39);

        return new int64(
            rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
            rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
        );
    }

    function sigma1(x) {
        var rotr14 = rotr(x, 14);
        var rotr18 = rotr(x, 18);
        var rotr41 = rotr(x, 41);

        return new int64(
            rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
            rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
        );
    }

    function gamma0(x) {
        var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

        return new int64(
            rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
            rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
        );
    }

    function gamma1(x) {
        var rotr19 = rotr(x, 19);
        var rotr61 = rotr(x, 61);
        var shr6 = shr(x, 6);

        return new int64(
            rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
            rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
        );
    }

    function shr(x, n) {
        if (n <= 32) {
            return new int64(
                x.highOrder >>> n,
                x.lowOrder >>> n | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
                0,
                x.highOrder << (32 - n)
            );
        }
    }

    str = utf8_encode(str);
    strlen = str.length*charsize;
    str = str2binb(str);

    str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
    str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

    for (var i = 0; i < str.length; i += 32) {
        a = H[0];
        b = H[1];
        c = H[2];
        d = H[3];
        e = H[4];
        f = H[5];
        g = H[6];
        h = H[7];

        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
            } else {
                W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
            }

            T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
            T2 = safe_add_2(sigma0(a), maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add_2(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add_2(T1, T2);
        }

        H[0] = safe_add_2(a, H[0]);
        H[1] = safe_add_2(b, H[1]);
        H[2] = safe_add_2(c, H[2]);
        H[3] = safe_add_2(d, H[3]);
        H[4] = safe_add_2(e, H[4]);
        H[5] = safe_add_2(f, H[5]);
        H[6] = safe_add_2(g, H[6]);
        H[7] = safe_add_2(h, H[7]);
    }

    var binarray = [];
    for (var i = 0; i < H.length; i++) {
        binarray.push(H[i].highOrder);
        binarray.push(H[i].lowOrder);
    }
    return binb2hex(binarray);
}
    

/**
 * (c) jTools Input Mask
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Input mask
 */

jApp.mask = (function() {
    var obj = {};
    var index = 0;
    var values = []
    var pieces = [];

    obj.run = function(value, mask, decimal) {
        if (value && mask) {
            if (! decimal) {
                decimal = '.';
            }
            if (value == Number(value)) {
                var number = (''+value).split('.');
                var value = number[0];
                var valueDecimal = number[1];
            } else {
                value = '' + value;
            }
            index = 0;
            values = [];
            // Create mask token
            obj.prepare(mask);
            // Current value
            var currentValue = value;
            if (currentValue) {
                // Checking current value
                for (var i = 0; i < currentValue.length; i++) {
                    if (currentValue[i] != null) {
                        obj.process(currentValue[i]);
                    }
                }
            }
            if (valueDecimal) {
                obj.process(decimal);
                var currentValue = valueDecimal;
                if (currentValue) {
                    // Checking current value
                    for (var i = 0; i < currentValue.length; i++) {
                        if (currentValue[i] != null) {
                            obj.process(currentValue[i]);
                        }
                    }
                }
            }
            // Formatted value
            return values.join('');
        } else {
            return '';
        }
    }

    obj.apply = function(e) {
        var mask = e.target.getAttribute('data-mask');
        if (mask && e.keyCode > 46) {
            index = 0;
            values = [];
            // Create mask token
            obj.prepare(mask);
            // Current value
            var currentValue = e.target.value;
            if (currentValue) {
                // Checking current value
                for (var i = 0; i < currentValue.length; i++) {
                    if (currentValue[i] != null) {
                        obj.process(currentValue[i]);
                    }
                }
            }
            // New input
            obj.process(obj.fromKeyCode(e));
            // Update value to the element
            e.target.value = values.join('');
            if (pieces.length == values.length && pieces[pieces.length-1].length == values[values.length-1].length) {
                e.target.setAttribute('data-completed', 'true');
            } else {
                e.target.setAttribute('data-completed', 'false');
            }
            // Prevent default
            e.preventDefault();
        }
    }

    /**
     * Process inputs and save to values
     */
    obj.process = function(input) {
        do {
            if (pieces[index] == 'mm') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 1 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 1 && values[index] < 2 && parseInt(input) < 3) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] == 0 && values[index] < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'dd') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 3 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 3 && parseInt(input) < 2) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 3 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'hh24') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 2 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 2 && parseInt(input) < 4) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 2 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'hh') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 1 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 1 && parseInt(input) < 3) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 1 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'mi' || pieces[index] == 'ss') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 5 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                     } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'yy' || pieces[index] == 'yyyy') {
                if (parseInt(input) < 10) {
                    if (values[index] == null || values[index] == '') {
                        values[index] = input;
                    } else {
                        values[index] += input;
                    }
                    
                    if (values[index].length == pieces[index].length) {
                        index++;
                    }
                    return true;
                } else {
                    return false;
                }
            } else if (pieces[index] == '#' || pieces[index] == '#.##' || pieces[index] == '#,##') {
                if (input.match(/[0-9]/g)) {
                    if (pieces[index] == '#.##') {
                        var separator = '.';
                    } else if (pieces[index] == '#,##') {
                        var separator = ',';
                    } else {
                        var separator = '';
                    }
                    if (values[index] == null || values[index] == '') {
                        values[index] = input;
                    } else {
                        values[index] += input;
                        if (separator) {
                            values[index] = values[index].match(/[0-9]/g).join('');
                            var t = [];
                            var s = 0;
                            for (var j = values[index].length - 1; j >= 0 ; j--) {
                                t.push(values[index][j]);
                                s++;
                                if (! (s % 3)) {
                                    t.push(separator);
                                }
                            }
                            t = t.reverse();
                            values[index] = t.join('');
                            if (values[index].substr(0,1) == separator) {
                                values[index] = values[index].substr(1);
                            } 
                        }
                    }
                    return true;
                } else {
                    if (pieces[index] == '#.##' && input == '.') {
                        // Do nothing
                    } else if (pieces[index] == '#,##' && input == ',') {
                        // Do nothing
                    } else {
                        if (values[index]) {
                            index++;
                            if (pieces[index]) {
                                if (pieces[index] == input) {
                                    values[index] = input;
                                    return true;
                                } else {
                                    if (pieces[index] == '0' && pieces[index+1] == input) {
                                        index++;
                                        values[index] = input;
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    return false;
                }
            } else if (pieces[index] == '0') {
                if (input.match(/[0-9]/g)) {
                    values[index] = input;
                    index++;
                    return true;
                } else {
                    return false;
                }
            } else if (pieces[index] == 'a') {
                if (input.match(/[a-zA-Z]/g)) {
                    values[index] = input;
                    index++;
                    return true;
                } else {
                    return false;
                }
            } else {
                if (pieces[index] != null) {
                    if (pieces[index] == '\\a') {
                        var v = 'a';
                    } else if (pieces[index] == '\\0') {
                        var v = '0';
                    } else {
                        var v = pieces[index];
                    }
                    values[index] = v;
                    if (input == v) {
                        index++;
                        return true;
                    }
                }
            }

            index++;
        } while (pieces[index]);
    }

    /**
     * Create tokens for the mask
     */
    obj.prepare = function(mask) {
        pieces = [];
        for (var i = 0; i < mask.length; i++) {
            if (mask[i].match(/[0-9]|[a-z]|\\/g)) {
                if (mask[i] == 'y' && mask[i+1] == 'y' && mask[i+2] == 'y' && mask[i+3] == 'y') {
                    pieces.push('yyyy');
                    i += 3;
                } else if (mask[i] == 'y' && mask[i+1] == 'y') {
                    pieces.push('yy');
                    i++;
                } else if (mask[i] == 'm' && mask[i+1] == 'm' && mask[i+2] == 'm' && mask[i+3] == 'm') {
                    pieces.push('mmmm');
                    i += 3;
                } else if (mask[i] == 'm' && mask[i+1] == 'm' && mask[i+2] == 'm') {
                    pieces.push('mmm');
                    i += 2;
                } else if (mask[i] == 'm' && mask[i+1] == 'm') {
                    pieces.push('mm');
                    i++;
                } else if (mask[i] == 'd' && mask[i+1] == 'd') {
                    pieces.push('dd');
                    i++;
                } else if (mask[i] == 'h' && mask[i+1] == 'h' && mask[i] == '2' && mask[i+1] == '4') {
                    pieces.push('hh24');
                    i += 3;
                } else if (mask[i] == 'h' && mask[i+1] == 'h') {
                    pieces.push('hh');
                    i++;
                } else if (mask[i] == 'm' && mask[i+1] == 'i') {
                    pieces.push('mi');
                    i++;
                } else if (mask[i] == 's' && mask[i+1] == 's') {
                    pieces.push('ss');
                    i++;
                } else if (mask[i] == 'a' && mask[i+1] == 'm') {
                    pieces.push('am');
                    i++;
                } else if (mask[i] == 'p' && mask[i+1] == 'm') {
                    pieces.push('pm');
                    i++;
                } else if (mask[i] == '\\' && mask[i+1] == '0') {
                    pieces.push('\\0');
                    i++;
                } else if (mask[i] == '\\' && mask[i+1] == 'a') {
                    pieces.push('\\a');
                    i++;
                } else {
                    pieces.push(mask[i]);
                }
            } else {
                if (mask[i] == '#' && mask[i+1] == '.' && mask[i+2] == '#' && mask[i+3] == '#') {
                    pieces.push('#.##');
                    i += 3;
                } else if (mask[i] == '#' && mask[i+1] == ',' && mask[i+2] == '#' && mask[i+3] == '#') {
                    pieces.push('#,##');
                    i += 3;
                } else {
                    pieces.push(mask[i]);
                }
            }
        }
    }

    /** 
     * Thanks for the collaboration
     */
    obj.fromKeyCode = function(e) {
        var _to_ascii = {
            '188': '44',
            '109': '45',
            '190': '46',
            '191': '47',
            '192': '96',
            '220': '92',
            '222': '39',
            '221': '93',
            '219': '91',
            '173': '45',
            '187': '61', //IE Key codes
            '186': '59', //IE Key codes
            '189': '45'  //IE Key codes
        }

        var shiftUps = {
            "96": "~",
            "49": "!",
            "50": "@",
            "51": "#",
            "52": "$",
            "53": "%",
            "54": "^",
            "55": "&",
            "56": "*",
            "57": "(",
            "48": ")",
            "45": "_",
            "61": "+",
            "91": "{",
            "93": "}",
            "92": "|",
            "59": ":",
            "39": "\"",
            "44": "<",
            "46": ">",
            "47": "?"
        };

        var c = e.which;

        if (_to_ascii.hasOwnProperty(c)) {
            c = _to_ascii[c];
        }

        if (!e.shiftKey && (c >= 65 && c <= 90)) {
            c = String.fromCharCode(c + 32);
        } else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
            c = shiftUps[c];
        } else if (96 <= c && c <= 105) {
            c = String.fromCharCode(c - 48);
        } else {
            c = String.fromCharCode(c);
        }

        return c;
    }

    return obj;
})();

jApp.mobile = (function(el, options) {
    var obj = {};
    obj.options = {};

    return obj;
});

jApp.page = (function(route, options) {
    if (! route) {
        console.error('It is not possible to create a page without a route');
        return;
    }

    if (jApp.page.items && jApp.page.items[route]) {
        var obj = jApp.page.items[route];
        obj.show();
        return obj;
    }

    var obj = {};
    obj.options = options || {};

    // Default configuration
    var defaults = {
        closed:false,
        route:null,
        toolbar:null,
        toolbarItem:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    obj.options.route = route;

    // Base path where the views are stored
    if (! jApp.page.path) {
        jApp.page.path = 'pages';
    }
    // If no defined path for this file get the default
    if (! obj.options.path) {
        obj.options.path = (jApp.page.path + route + '.html');
    }
    if (! obj.options.title) {
        obj.options.title = 'Untitled';
    }

    // Create page container
    if (! jApp.page.container) {
        jApp.page.container = document.createElement('div');
        jApp.page.container.className = 'pages';
        if (jApp.el) {
            jApp.el.appendChild(jApp.page.container);
        } else {
            document.body.appendChild(jApp.page.container);
        }

        // If there is no element yet, can't be closed
        obj.options.closed = false;
    }

    // Create page
    var page = document.createElement('div');

    // Class
    if (obj.options.panel) {
        page.classList.add('panel');
        page.classList.add(obj.options.panel);
    } else {
        page.classList.add('page');
    }

    // Panel goes in the main element
    if (obj.options.panel) {
        //jApp.el.appendChild(page);
    } else {
        if (! jApp.page.current) {
            jApp.page.container.appendChild(page);
        } else {
            jApp.page.container.insertBefore(page, jApp.page.current.nextSibling);
        }
    }

    // Keep page in the container
    if (! jApp.page.items) {
        jApp.page.items = [];
    }
    jApp.page.items[route] = obj;

    // Load content
    obj.create = function() {
        var parse = function(result) {
            page.innerHTML = result;
            if (obj.options.closed) {
                page.style.display = 'none';
            } else {
                obj.show();
            }
        }

        fetch(obj.options.path).then(function(data) {
            data.text().then(function(html) {
                page.innerHTML = html;
                var script = page.getElementsByTagName('script');
                for (var i = 0; i < script.length; i++) {
                    var type = script[i].getAttribute('type');
                    if (! type || type == 'text/javascript') {
                        eval(script[i].innerHTML);
                    }
                }
            })
        });
    };

    obj.show = function(historyDirection) {
        if (jApp.page.current) {
            if (jApp.page.current == page) {
                jApp.page.current = page;
            } else {
                if (page.classList.contains('panel')) {
                } else {
                    page.style.display = '';

                    var a = Array.prototype.indexOf.call(jApp.page.container.children, jApp.page.current);
                    var b = Array.prototype.indexOf.call(jApp.page.container.children, page);

                    if (a < b) {
                        jApp.page.container.classList.add('slide-left-out');
                    } else {
                        jApp.page.container.classList.add('slide-left-in');
                    }

                    setTimeout(function(){
                        jApp.page.current.style.display = 'none';
                        jApp.page.current = page;
                        jApp.page.container.classList.remove('slide-left-out');
                        jApp.page.container.classList.remove('slide-left-in');
                    }, 400);
                }
            }
        } else {
            jApp.page.current = page;
        }

        if (! historyDirection) {
            // Add history
            window.history.pushState({ route:route }, obj.options.title, obj.options.route);
        }
    }

    obj.create();

    return obj;
});

jApp.toolbar = (function(el, options) {
    var obj = {};
    obj.options = options;

    var toolbar = document.createElement('div');
    toolbar.classList.add('jtoolbar');
    toolbar.onclick = function(e) {
        var element = jApp.getElement(e.target, 'jtoolbar-item');
        if (element) {
            obj.selectItem(element);
        }
    }

    var toolbarContent = document.createElement('div');
    toolbar.appendChild(toolbarContent);

    for (var i = 0; i < options.items.length; i++) {
        var toolbarItem = document.createElement('div');
        toolbarItem.classList.add('jtoolbar-item');
        if (options.items[i].route) {
            toolbarItem.setAttribute('data-href', options.items[i].route);
            jApp.page(options.items[i].route, {
                closed:true,
                toolbar:obj,
                toolbarItem:toolbarItem,
           });
        }

        if (options.items[i].icon) {
            var toolbarIcon = document.createElement('i');
            toolbarIcon.classList.add('material-icons');
            toolbarIcon.innerHTML = options.items[i].icon;
            toolbarItem.appendChild(toolbarIcon);
        }
        if (options.items[i].badge) {
            var toolbarBadge = document.createElement('div');
            toolbarBadge.classList.add('badge');
            var toolbarBadgeContent = document.createElement('div');
            toolbarBadgeContent.innerHTML = options.items[i].badge;
            toolbarBadge.appendChild(toolbarBadgeContent);
            toolbarItem.appendChild(toolbarBadge);
        }
        if (options.items[i].title) {
            var toolbarTitle = document.createElement('span');
            toolbarTitle.innerHTML = options.items[i].title;
            toolbarItem.appendChild(toolbarTitle);
        }

        toolbarContent.appendChild(toolbarItem);
    }

    obj.selectItem = function(element) {
        var elements = toolbarContent.children;
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('selected');
        }
        element.classList.add('selected');
    }

    el.appendChild(toolbar);

    return obj;
});

jApp.actionsheet = (function() {
    var obj = {};
    obj.options = {};

     var actionsheet = document.createElement('div');
     actionsheet.className = 'jactionsheet';

    var actionContent = document.createElement('div');
    actionContent.className = 'jactionsheet-content';
    actionsheet.appendChild(actionContent);

    obj.open = function(options) {
       obj.options = options;

       obj.options.groups.forEach(function(group) {
            var actionGroup = document.createElement('div');
            actionGroup.className = 'jactionsheet-group';

            group.forEach(function(v) {
                var actionItem = document.createElement('div');
                var actionInput = document.createElement('input');
                actionInput.type = 'button';
                actionInput.value = v.title;
                if (v.className) {
                    actionInput.className = v.className; 
                }
                if (v.onclick) {
                    actionInput.onclick = v.onclick; 
                }
                actionItem.appendChild(actionInput);
                actionGroup.appendChild(actionItem);
            });

            actionContent.appendChild(actionGroup);
        });

        // Append
        actionsheet.style.opacity = 100;
        jApp.el.appendChild(actionsheet);

        // Animation
        actionContent.classList.add('slide-bottom-in');
    }

    obj.close = function() {
        actionsheet.style.opacity = 0;
        // Remove any existing actionsheet
        actionContent.classList.add('slide-bottom-out');

        // Wait for the animation and remove any actionsheet
        setTimeout(function() {
            actionsheet.remove();
        }, 400);
    }

    return obj;
})();

/**
 * (c) jTools Modal page
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Modal page
 */

jApp.modal = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        // Events
        onopen:null,
        onclose:null,
        closed:false,
        width:null,
        height:null,
        title:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    el.classList.add('jmodal');

    if (obj.options.title) {
        el.setAttribute('title', obj.options.title);
    }
    if (obj.options.width) {
        el.style.width = obj.options.width;
    }
    if (obj.options.height) {
        el.style.height = obj.options.height;
    }

    var container = document.createElement('div');
    for (var i = 0; i < el.children.length; i++) {
        container.appendChild(el.children[i]);
    }
    el.appendChild(container);

    // Title
    if (! el.getAttribute('title')) {
        el.classList.add('no-title');
    }

    if (! obj.options.closed) {
        el.style.display = 'block';
    }

    obj.open = function() {
        el.style.display = 'block';

        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el);
        }
        // Backdrop
        document.body.appendChild(jApp.backdrop);
    }

    obj.close = function() {
        el.style.display = 'none';

        if (typeof(obj.options.onclose) == 'function') {
            obj.options.onclose(el);
        }
        // Backdrop
        jApp.backdrop.remove();
    }

    el.addEventListener('mousedown', function(e) {
        obj.position = [];

        if (e.target.classList.contains('jmodal')) {
            setTimeout(function() {

                var rect = el.getBoundingClientRect();
                if (rect.width - (e.clientX - rect.left) < 50 && e.clientY - rect.top < 50) {
                    obj.close();
                } else {
                    if (el.getAttribute('title') && e.clientY - rect.top < 50) {
                        if (document.selection) {
                            document.selection.empty();
                        } else if ( window.getSelection ) {
                            window.getSelection().removeAllRanges();
                        }

                        obj.position = [
                            rect.left,
                            rect.top,
                            e.clientX,
                            e.clientY,
                            rect.width,
                            rect.height,
                        ];
                    }
                }
            }, 100);
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (obj.position) {
            if (e.which == 1 || e.which == 3) {
                el.style.top = obj.position[1] + (e.clientY - obj.position[3]) + (obj.position[5] / 2);
                el.style.left = obj.position[0] + (e.clientX - obj.position[2]) + (obj.position[4] / 2);
                el.style.cursor = 'move';
            } else {
                el.style.cursor = 'auto';
            }
        }
    });

    document.addEventListener('mouseup', function(e) {
        obj.position = null;

        el.style.cursor = 'auto';
    });

    el.modal = obj;

    return obj;
});

jApp.rating = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        number:5,
        value:0,
        tooltip: [ 'Very bad', 'Bad', 'Average', 'Good', 'Very good' ],
        onchange:null,
    };

    // Loop through the initial configuration
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Class
    el.classList.add('jrating');

    // Add elements
    for (var i = 0; i < obj.options.number; i++) {
        var div = document.createElement('div');
        div.setAttribute('data-index', (i + 1))
        div.setAttribute('title', obj.options.tooltip[i])
        el.appendChild(div);
    }

    // Set value
    obj.setValue = function(index) {
        for (var i = 0; i < obj.options.number; i++) {
            if (i < index) {
                el.children[i].classList.add('jrating-selected');
            } else {
                el.children[i].classList.remove('jrating-selected');
            }
        }

        obj.options.value = index;

        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, index);
        }
    }

    if (obj.options.value) {
        for (var i = 0; i < obj.options.number; i++) {
            if (i < obj.options.value) {
                el.children[i].classList.add('jrating-selected');
            }
        }
    }

    // Events
    el.addEventListener("click", function(e) {
        var index = e.target.getAttribute('data-index');
        if (index == obj.options.value) {
            obj.setValue(0);
        } else {
            obj.setValue(index);
        }
    });

    el.addEventListener("mouseover", function(e) {
        var index = e.target.getAttribute('data-index');
        for (var i = 0; i < obj.options.number; i++) {
            if (i < index) {
                el.children[i].classList.add('jrating-over');
            } else {
                el.children[i].classList.remove('jrating-over');
            }
        }
    });

    el.addEventListener("mouseout", function(e) {
        for (var i = 0; i < obj.options.number; i++) {
            el.children[i].classList.remove('jrating-over');
        }
    });

    el.rating = obj;

    return obj;
});

/**
 * (c) Image slider
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Image Slider
 */

jApp.slider = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.currentImage = null;

    if (options) {
        obj.options = options;
    }

    // Items
    obj.options.items = [];

    if (! el.classList.contains('jslider')) {
        el.classList.add('jslider');

        // Create container
        var container = document.createElement('div');
        container.className = 'jslider-container';

        // Move children inside
        if (el.children.length > 0) {
            // Keep children items
            for (var i = 0; i < el.children.length; i++) {
                obj.options.items.push(el.children[i]);
            }
        }
        if (obj.options.items.length > 0) {
            for (var i = 0; i < obj.options.items.length; i++) {
                obj.options.items[i].classList.add('jfile');
                var index = obj.options.items[i].src.lastIndexOf('/');
                if (index < 0) {
                    obj.options.items[i].setAttribute('data-name', obj.options.items[i].src);
                } else {
                    obj.options.items[i].setAttribute('data-name', obj.options.items[i].src.substr(index + 1));
                }
                var index = obj.options.items[i].src.lastIndexOf('/');

                container.appendChild(obj.options.items[i]);
            }
        }
        el.appendChild(container);
        // Add close buttom
        var close = document.createElement('div');
        close.className = 'jslider-close';
        close.innerHTML = 'close';
        close.onclick =  function() {
            obj.close();
        }
        el.appendChild(close);
    } else {
        var container = el.querySelector('slider-container');
    }

    // Append data
    if (obj.options.data && obj.options.data.length) {
        for (var i = 0; i < obj.options.data.length; i++) {
            if (obj.options.data[i]) {
                var img = document.createElement('img');
                img.setAttribute('data-name', obj.options.data[i].name);
                img.setAttribute('data-size', obj.options.data[i].size);
                img.setAttribute('data-cover', obj.options.data[i].cover);
                img.setAttribute('data-extension', obj.options.data[i].extension);
                img.setAttribute('src', obj.options.data[i].file);
                obj.options.items.push(img);
                container.appendChild(img);
            }
        }
    }

    obj.show = function(target) {
        if (! target) {
            var target = container.children[0];
        }

        if (! container.classList.contains('jslider-preview')) {
            container.classList.add('jslider-preview');
            close.style.display = 'block';
        }

        // Hide all images
        [...container.children].forEach(function(v) {
            v.style.display = 'none';
        });

        // Show clicked only
        target.style.display = 'block';

        // Is there any previous
        if (target.previousSibling) {
            container.classList.add('jslider-left');
        } else {
            container.classList.remove('jslider-left');
        }

        // Is there any next
        if (target.nextSibling) {
            container.classList.add('jslider-right');
        } else {
            container.classList.remove('jslider-right');
        }

        obj.currentImage = target;
    }

    // Allow insert
    if (obj.options.allowAttachment) {
        var attachmentInput = document.createElement('input');
        attachmentInput.type = 'file';
        attachmentInput.className = 'slider-attachment';
        attachmentInput.setAttribute('accept', 'image/*');
        attachmentInput.style.display = 'none';
        attachmentInput.onchange = function() {
            var reader = [];

            for (var i = 0; i < this.files.length; i++) {
                var type = this.files[i].type.split('/');

                if (type[0] == 'image') {
                    var file = {
                        size: this.files[i].size,
                        name: this.files[i].name,
                        lastmodified: this.files[i].lastModified,
                    }

                    reader[i] = new FileReader();
                    reader[i].addEventListener("load", function (e) {
                        file.file = e.target.result;
                        obj.addFile(file);
                    }, false);

                    reader[i].readAsDataURL(this.files[i]);
                } else {
                    alert('The extension is not allowed');
                }
            };
        }

        var attachmentIcon = document.createElement('i');
        attachmentIcon.innerHTML = 'attachment';
        attachmentIcon.className = 'jslider-attach material-icons';
        attachmentIcon.onclick = function() {
            jApp.click(attachmentInput);
        }

        el.appendChild(attachmentInput);
        el.appendChild(attachmentIcon);
    }

    obj.open = function() {
        obj.show();

        // Event
        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el);
        }
    }

    obj.close = function() {
        container.classList.remove('jslider-preview');
        container.classList.remove('jslider-left');
        container.classList.remove('jslider-right');

        [...container.children].forEach(function(v) {
            v.style.display = '';
        });

        close.style.display = '';

        obj.currentImage = null;

        // Event
        if (typeof(obj.options.onclose) == 'function') {
            obj.options.onclose(el);
        }
    }

    obj.addFile = function(v) {
        var img = document.createElement('img');
        img.setAttribute('data-lastmodified', v.lastmodified);
        img.setAttribute('data-name', v.name);
        img.setAttribute('data-size', v.size);
        img.setAttribute('src', v.file);
        img.className = 'jfile';
        container.appendChild(img);
        obj.options.items.push(img);

        // Onchange
        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, v);
        }
    }

    obj.addFiles = function(files) {
        for (var i = 0; i < files.length; i++) {
            obj.addFile(files[i]);
        }
    }

    obj.next = function() {
        if (obj.currentImage.nextSibling) {
            obj.show(obj.currentImage.nextSibling);
        }
    }
    
    obj.prev = function() {
        if (obj.currentImage.previousSibling) {
            obj.show(obj.currentImage.previousSibling);
        }
    }

    obj.getData = function() {
        var files = jApp.getFiles(container);

        const values = {};
        const inputs = container.children;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].name) {
                values[inputs[i].name] = inputs[i].value;
            }
        }
        return values;
    }

    // Push to refresh
    var longTouchTimer = null;

    var mouseDown = function(e) {
        if (e.target.tagName == 'IMG') {
            // Remove
            var targetImage = e.target;
            longTouchTimer = setTimeout(function() {
                if (e.target.src.substr(0,4) == 'data') {
                    e.target.remove();
                } else {
                    if (e.target.classList.contains('jremove')) {
                        e.target.classList.remove('jremove');
                    } else {
                        e.target.classList.add('jremove');
                    }
                }

                // Onchange
                if (typeof(obj.options.onchange) == 'function') {
                    obj.options.onchange(el, e.target);
                }
            }, 1000);
        }
    }

    var mouseUp = function(e) {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer);
        }

        // Open slider
        if (e.target.tagName == 'IMG') {
            if (! e.target.classList.contains('jremove')) {
                obj.show(e.target);
            }
        } else {
            // Arrow controls
            if (e.target.clientWidth - e.offsetX < 40) {
                // Show next image
                obj.next();
            } else if (e.offsetX < 40) {
                // Show previous image
                obj.prev();
            }
        }
    }

    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('touchstart', mouseDown);
    container.addEventListener('mouseup', mouseUp);
    container.addEventListener('touchend', mouseUp);

    el.slider = obj;

    return obj;
});

/**
 * (c) jTools v1.0.1 - Element sorting
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Element drag and drop sorting
 */

jApp.sorting = (function(el, options) {
    el.classList.add('jsorting');

    el.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    el.addEventListener('dragover', (e) => {
        e.preventDefault();

        if (e.target.clientHeight / 2 > e.offsetY) {
            e.path[0].style.borderTop = '1px dotted #ccc';
            e.path[0].style.borderBottom = '';
        } else {
            e.path[0].style.borderTop = '';
            e.path[0].style.borderBottom = '1px dotted #ccc';
        }
    });

    el.addEventListener('dragleave', (e) => {
        e.path[0].style.borderTop = '';
        e.path[0].style.borderBottom = '';
    });

    el.addEventListener('dragend', (e) => {
        e.path[1].querySelector('.dragging').classList.remove('dragging');
    });

    el.addEventListener('drop', (e) => {
        var element = e.path[1].querySelector('.dragging');

        if (e.target.clientHeight / 2 > e.offsetY) {
            e.path[1].insertBefore(element, e.path[0]);
        } else {
            e.path[1].insertBefore(element, e.path[0].nextSibling);
        }

        e.path[0].style.borderTop = '';
        e.path[0].style.borderBottom = '';
    });

    [...el.children].forEach(function(v) {
        v.setAttribute('draggable', 'true');
    });

    return el;
});

jApp.tabs = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        onchange:null,
    };

    // Loop through the initial configuration
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Class
    el.classList.add('jtabs');

    // Elements
    var headers = el.children[0];
    var content = el.children[1];
    headers.classList.add('jtabs-headers');
    content.classList.add('jtabs-content');

    // Set value
    obj.open = function(index) {
        for (var i = 0; i < headers.children.length; i++) {
            headers.children[i].classList.remove('jtabs-selected');
            content.children[i].classList.remove('jtabs-selected');
        }

        headers.children[index].classList.add('jtabs-selected');
        content.children[index].classList.add('jtabs-selected');
    }

    // Events
    headers.addEventListener("click", function(e) {
        var index = Array.prototype.indexOf.call(headers.children, e.target);
        if (index >= 0) {
            obj.open(index);
        }
    });

    obj.open(0);

    el.tabs = obj;

    return obj;
});

/**
 * (c) jTools Element template render
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Template renderer
 */

jApp.template = (function(el, options) {
    options.getData = function(pageNumber, query) {
        // Node container
        var container = '';

        // Filter data
        if (query) {
            var test = function(obj, query) {
                for (var key in obj) {
                    var value = obj[key];

                    if ((''+value).toLowerCase().search(query) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            var data = options.data.filter(function(item) {
                return test(item, query);
            });
        } else {
            var data = options.data;
        }

        // Method filter
        if (options.filter) {
            data = options.filter(data);
        }

        if (! data.length) {
            container.innerHTML = 'No records found';
        } else {
            var component = options.template;

            if (options.pagination) {
                if (! pageNumber) {
                    pageNumber = 1;
                }
                var quantityPerPage = options.pagination;
                startNumber = (options.pagination * (pageNumber - 1));
                finalNumber = (options.pagination * (pageNumber - 1)) + options.pagination;

                if (data.length < finalNumber) {
                    finalNumber = data.length;
                }
            } else {
                var startNumber = 0;
                var finalNumber = data.length;
            }

            // Append itens
            for (var i = startNumber; i < finalNumber; i++) {
                container += component[Object.keys(options.template)[0]](data[i]).trim();
            }

            // Create pagination
            if (options.pagination && data.length > options.pagination) {
                // Pagination container
                var pagination = document.createElement('div');
                pagination.className = 'jtemplate-pagination';

                var quantyOfPages = parseInt(data.length / options.pagination);

                if (pageNumber < 6) {
                    startNumber = 1;
                    finalNumber = quantyOfPages < 10 ? quantyOfPages + 1 : 10;
                } else if (quantyOfPages - pageNumber < 6) {
                    startNumber = quantyOfPages - 9;
                    finalNumber = quantyOfPages;
                } else {
                    startNumber = pageNumber - 4;
                    finalNumber = pageNumber + 5;
                }

                // First
                if (startNumber > 1) {
                    var paginationItem = document.createElement('div');
                    paginationItem.innerHTML = '<';
                    paginationItem.title = 1;
                    pagination.appendChild(paginationItem);
                }

                // Get page links
                for (var i = startNumber; i <= finalNumber; i++) {
                    var paginationItem = document.createElement('div');
                    paginationItem.innerHTML = i;
                    pagination.appendChild(paginationItem);

                    if (pageNumber == i) {
                        paginationItem.style.fontWeight = 'bold';
                    }
                }

                // Last
                if (finalNumber < quantyOfPages) {
                    var paginationItem = document.createElement('div');
                    paginationItem.innerHTML = '>';
                    paginationItem.title = quantyOfPages;
                    pagination.appendChild(paginationItem);
                }

                container = pagination.outerHTML + container;
            }
        }

        return container;
    };

    if (options.search) {
        var searchContainer = document.createElement('div');
        searchContainer.className = 'jtemplate-results';
        var searchInput = document.createElement('input');
        searchInput.onkeyup = function(e) {
            el.innerHTML = options.getData(1, this.value.toLowerCase());
        }
        searchContainer.appendChild(searchInput);
        el.parentNode.insertBefore(searchContainer, el);
    }

    options.reset = function() {
        el.innerHTML = '';
    }

    options.refresh = function() {
        el.innerHTML = options.render();
    }

    if (options.url) {
        fetch(options.url, { headers: new Headers({ 'content-type': 'text/json' }) })
            .then(function(data) {
                data.json().then(function(data) {
                    options.data = data;
                    el.innerHTML = options.render();
                })
            });
    } else {
        el.innerHTML = options.render();
    }

    el.addEventListener('mousedown', function(e) {
        if (e.path[1].classList.contains('jtemplate-pagination')) {
            var index = e.path[0].innerText;
            if (index == '<') {
                el.innerHTML = options.getData(1);
            } else if (index == '>') {
                el.innerHTML = options.getData(e.path[0].getAttribute('title'));
            } else {
                el.innerHTML = options.getData(parseInt(index));
            }
            e.preventDefault();
        }
    });

    el.template = options;

    return options;
});

/**
 * (c) jTools Timeline
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Timeline
 */

jApp.timeline = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Two digits
    var two = function(value) {
        value = '' + value;
        if (value.length == 1) {
            value = '0' + value;
        }
        return value;
    }

    // Default date format
    if (! options.date) {
        var date = new Date();
        y = date.getFullYear();
        m = two(date.getMonth() + 1);
        date = y + '-' + m;
    }

    // Default configurations
    var defaults = {
        data: [],
        date: date,
        months: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        text: {
            noInformation: '<div class="jtimeline-message">No information for this period</div>',
        }
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Add class
    el.classList.add('jtimeline');

    // Header
    var timelineHeader = document.createElement('div');
    timelineHeader.className = 'jtimeline-header';

    var timelineLabel = document.createElement('div');
    timelineLabel.className = 'jtimeline-label';

    var timelineNavigation = document.createElement('div');
    timelineNavigation.className = 'jtimeline-navigation';

    // Labels 
    var timelineMonth = document.createElement('div');
    timelineMonth.className = 'jtimeline-month';
    timelineMonth.innerHTML = '';
    timelineLabel.appendChild(timelineMonth);

    var timelineYear = document.createElement('div');
    timelineYear.className = 'jtimeline-year';
    timelineYear.innerHTML = '';
    timelineLabel.appendChild(timelineYear);

    // Navigation
    var timelinePrev = document.createElement('div');
    timelinePrev.className = 'jtimeline-prev';
    timelinePrev.innerHTML = '<i class="material-icons">keyboard_arrow_left</i>';
    timelineNavigation.appendChild(timelinePrev);

    var timelineNext = document.createElement('div');
    timelineNext.className = 'jtimeline-next';
    timelineNext.innerHTML = '<i class="material-icons">keyboard_arrow_right</i>';
    timelineNavigation.appendChild(timelineNext);

    timelineHeader.appendChild(timelineLabel);
    timelineHeader.appendChild(timelineNavigation);

    // Data container
    var timelineContainer = document.createElement('div');
    timelineContainer.className = 'jtimeline-container';

    // Append headers
    el.appendChild(timelineHeader);
    el.appendChild(timelineContainer);

    // Date
    if (obj.options.date.length > 7) {
        obj.options.date = obj.options.date.substr(0, 7)
    }

    obj.setData = function(rows) {
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            var d = rows[i].date.substr(0,7);

            // Create the object if not exists
            if (! data[d]) {
                data[d] = [];
            }

            // Create array
            data[d].push(rows[i]);
        };
        obj.options.data = data;
        obj.render(obj.options.date);
    }

    obj.render = function(date) {
        // Filter
        if (date.length > 7) {
            var date = date.substr(0,7);
        }

        // Update current date
        obj.options.date = date;

        // Reset data
        timelineContainer.innerHTML = '';

        // Days
        var timelineDays = [];

        // Itens
        if (! obj.options.data[date]) {
            timelineContainer.innerHTML = obj.options.text.noInformation;
        } else {
            for (var i = 0; i < obj.options.data[date].length; i++) {
                var v = obj.options.data[date][i];
                var d = v.date.split('-');

                // Item container
                var timelineItem = document.createElement('div');
                timelineItem.className = 'jtimeline-item';

                // Date
                var timelineDateContainer = document.createElement('div');
                timelineDateContainer.className = 'jtimeline-date-container';

                var timelineDate = document.createElement('div');
                if (! timelineDays[d[2]]) {
                    timelineDate.className = 'jtimeline-date jtimeline-date-bullet';
                    timelineDate.innerHTML = d[2];

                    if (! v.title) {
                        v.title = v.subtitle ? v.subtitle : 'Information';
                    }
                } else {
                    timelineDate.className = 'jtimeline-date';
                    timelineDate.innerHTML = '';
                }
                timelineDateContainer.appendChild(timelineDate);

                var timelineContent = document.createElement('div');
                timelineContent.className = 'jtimeline-content';

                var timelineTitle = document.createElement('div');
                timelineTitle.className = 'jtimeline-title';
                timelineTitle.innerHTML = v.title;
                timelineContent.appendChild(timelineTitle);

                var timelineSubtitle = document.createElement('div');
                timelineSubtitle.className = 'jtimeline-subtitle';
                timelineSubtitle.innerHTML = v.subtitle ? v.subtitle : '';
                timelineContent.appendChild(timelineSubtitle);

                // Text
                var timelineText = document.createElement('div');
                timelineText.className = 'jtimeline-text';
                timelineText.innerHTML = v.text;
                timelineContent.appendChild(timelineText);

                // Tag
                if (v.tag) {
                    var timelineTag = document.createElement('div');
                    timelineTag.className = 'jtimeline-tag';
                    if (typeof(v.tag) == 'string') {
                        timelineTag.innerHTML = v.tag;
                    } else {
                        timelineTag.innerHTML = v.tag.text;
                        timelineTag.style.backgroundColor = v.tag.color;
                    }
                    timelineContent.appendChild(timelineTag);
                }

                // Day
                timelineDays[d[2]] = true;

                // Append Item
                timelineItem.appendChild(timelineDateContainer);
                timelineItem.appendChild(timelineContent);
                timelineContainer.appendChild(timelineItem);
            };
        }

        // Update labels
        var d = date.split('-');
        timelineYear.innerHTML = d[0];
        timelineMonth.innerHTML = obj.options.monthsFull[parseInt(d[1]) - 1];
    }

    obj.next = function() {
        // Update current date
        var d = obj.options.date.split('-');
        // Next month
        d[1]++;
        // Next year
        if (d[1] > 12) {
            d[0]++;
            d[1] = 1;
        }
        date = d[0] + '-' + (d[1] < 10 ? '0' + d[1] : d[1]);
        obj.render(date);
    }

    obj.prev = function() {
        // Update current date
        var d = obj.options.date.split('-');
        // Next month
        d[1]--;
        // Next year
        if (d[1] < 1) {
            d[0]--;
            d[1] = 12;
        }
        date = d[0] + '-' + (d[1] < 10 ? '0' + d[1] : d[1]);
        obj.render(date);
    }

    // Init
    if (obj.options.url) {
        $.ajax({
            url: obj.options.url,
            type: 'GET',
            dataType:'json',
            success: function(data) {
                // Timeline data
                obj.setData(data);
            }
        });
    } else {
        // Timeline data
        obj.setData(obj.options.data);
    }

    var timelineMouseDownControls = function(e) {
        if (e.target.classList.contains('jtimeline-next') || e.target.parentNode.classList.contains('jtimeline-next')) {
            obj.next();
        } else if (e.target.classList.contains('jtimeline-prev') || e.target.parentNode.classList.contains('jtimeline-prev')) {
            obj.prev();
        }
    }

    el.addEventListener("mousedown", timelineMouseDownControls);

    el.timeline = obj;

    return obj;
});

jApp.tracker = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        message: 'Are you sure? There are unsaved information in your form',
        ignore: false,
        currentHash: null,
        submitButton:null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    obj.validateElement = function(element) {
        var emailChecker = function(data) {
            var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
            return pattern.test(data) ? true : false; 
        }

        var passwordChecker = function(data) {
            return (data.length > 5) ? true : false;
        }

        var addError = function(element) {
            // Add error in the element
            element.classList.add('error');
            // Submit button
            if (obj.options.submitButton) {
                obj.options.submitButton.setAttribute('disabled', true);
            }
            // Return error message
            return element.getAttribute('data-error') || 'There is an error in the form';
        }

        var delError = function(element) {
            var error = false;
            // Remove class from this element
            element.classList.remove('error');
            // Get elements in the form
            var elements = el.querySelectorAll("input, select, textarea");
            // Run all elements 
            for (i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute('data-validation')) {
                    if (elements[i].classList.contains('error')) {
                        error = true;
                    }
                }
            }

            if (obj.options.submitButton) {
                if (error) {
                    obj.options.submitButton.setAttribute('disabled', true);
                } else {
                    obj.options.submitButton.removeAttribute('disabled');
                }
            }
        }

        // Blank
        var test = '';
        if (! element.value) {
            test = addError(element);
        } else if (element.getAttribute('data-email') && ! emailChecker(element.value)) {
            test = addError(element);
        } else if (element.getAttribute('data-password') && ! emailChecker(element.value)) {
            test = addError(element);
        } else {
            if (element.classList.contains('error')) {
                delError(element);
            }
        }

        return test;
    }

    // Run form validation
    obj.validate = function() {
        var test = '';
        // Get elements in the form
        var elements = el.querySelectorAll("input, select, textarea");
        // Run all elements 
        for (i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute('data-validation')) {
                if (test) {
                    test += "<br>\r\n";
                }
                test += obj.validateElement(elements[i]);
            }
        }
        return test;
    }

    // Check the form
    obj.getError = function() {
        // Validation
        return obj.validation() ? true : false;
    }

    // Return the form hash
    obj.setHash = function() {
        return obj.getHash(obj.getElements());
    }

    // Get the form hash
    obj.getHash = function(str) {
        return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
    }

    // Is there any change in the form since start tracking?
    obj.isChanged = function() {
        var hash = obj.setHash();
        return (obj.options.currentHash != hash);
    }

    // Change the ignore flag
    obj.setIgnore = function(option) {
        obj.options.ignore = option;
    }

    // Restart tracking
    obj.resetTracker = function() {
        obj.options.currentHash = obj.setHash();
        obj.options.ignore = false;
    }

    obj.reset = function() {
        obj.options.currentHash = obj.setHash();
        obj.options.ignore = false;
    }

    // Ignore flag
    obj.setIgnore = function(ignoreFlag) {
        obj.options.ignore = ignoreFlag ? true : false;
    }

    // Get form elements
    obj.getElements = function() {
        var ret = {};
        var elements = el.querySelectorAll("input, select, textarea");

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
                ret[name] = value;
            }
        }

        return JSON.stringify(ret);
    }

    // Start tracking in one second
    setTimeout(function() {
        obj.options.currentHash = obj.setHash();
    }, 1000);

    // Alert
    window.addEventListener("beforeunload", function (e) {
        if (obj.isChanged() && obj.options.ignore == false) {
            var confirmationMessage =  obj.options.message? obj.options.message : "\o/";

            if (confirmationMessage) {
                if (typeof e == 'undefined') {
                    e = window.event;
                }

                if (e) {
                    e.returnValue = confirmationMessage;
                }

                return confirmationMessage;
            } else {
                return void(0);
            }
        }
    });

    // Validations
    el.addEventListener("keyup", function(e) {
        if (e.target.getAttribute('data-validation')) {
            obj.validateElement(e.target);
        }
    });

    el.tracker = obj;

    return obj;
});

