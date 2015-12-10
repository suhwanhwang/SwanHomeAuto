var gpio = require('rpi-gpio');

module.exports = (function () {
    var boiler_state = false;
    var boiler_timer;
    var boiler_on = function(hour) {
        boiler_state = true;
        gpio.write(15, boiler_state);
        boiler_timer = setTimeout(boiler_off, hour * 60 * 60 * 1000);
    };
    var boiler_off = function() {
        boiler_state = false;
        gpio.write(15, boiler_state);
        clearTimeout(boiler_timer);
    };

    gpio.on('change', function (channel, value) {
        if (channel == 16 && value == true) {
            if (boiler_state == true) {
                boiler_off()
            } else {
                boiler_on(0.5);
            }
            console.log('Toggle button pushed, boiler_state ' + boiler_state);
        }
    });
    gpio.setup(15, gpio.DIR_OUT);
    gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH);

    return {
        on: function (hour) {
            console.log("boilerOn: set timeout hour = ", hour);
            boiler_on(hour);
        },
        off: function () {
            console.log("boilerOff");
            boiler_off();
        },
        getState: function () {
            return boiler_state;
        }
    };
}());