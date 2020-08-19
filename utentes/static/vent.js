// A kind of EventAggregator
// Exponemos la misma interface que Backbone.Events pero de este modo tenemos
// la opción de inyectar nuestra propia lógica

if (window.vent) {
    throw new Error("window.vent ya está definido");
}

window.vent = (function() {
    const broker = _.extend({}, Backbone.Events);

    function on(...args) {
        broker.on.apply(broker, args);
    }

    function listenTo(...args) {
        broker.listenTo.apply(broker, args);
    }

    function off(...args) {
        broker.off.apply(broker, args);
    }

    function stopListening(...args) {
        broker.stopListening.apply(broker, args);
    }

    function once(...args) {
        broker.once.apply(broker, args);
    }

    function listenToOnce(...args) {
        broker.listenToOnce.apply(broker, args);
    }

    function trigger(...args) {
        broker.trigger.apply(broker, args);
    }

    return {
        on,
        listenTo,
        off,
        stopListening,
        once,
        listenToOnce,
        trigger,
    };
})();
