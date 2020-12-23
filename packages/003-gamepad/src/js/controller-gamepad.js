import {
    isEmpty,
    isEqual,
    isNil,
    isNull,
    remove,
    get,
    forEach,
} from 'lodash';

const EventEnum = {
    up: 'up',
    down: 'down',
    touchStart: 'touchStart',
    touchEnd: 'touchEnd'
};


const ButtonEnum = {
    TRIGGER: 0,
    SQUEEEZE: 1,
    TOUCHPAD: 2,
    THUMBSTICK: 3,
    XORA: 4,
    BORY: 5
};

const ButtonDataEnum = {
    PRESSED: 'pressed',
    TOUCHED: 'touched',
    VALUE: 'value'
}


const ButtonMapping = {
    TRIGGER: 'trigger',
    SQUEEZE: 'squeeze',
    TOUCHPAD: 'touchpad',
    THUMBSTICK: 'thumbstick',
    XORA: 'xora',
    BORY: 'bory'
}

function getInitialButtonValues() {
    return {
        pressed: false,
        touched: false,
        value: 0
    };
}

export default function GamepadControls(event, controller) {
    const gamepad = get(event, 'data.gamepad', null);
    const _controller = controller;
    let buttons = {};
    window.gp = gamepad;

    function _init() {
        forEach(ButtonMapping, (btnName) => {
            const btn = controllerButton(btnName,_controller)
            controller[btnName] = btn;
            buttons[btnName] = btn;
        });
        controller.gamepadUpdate = update;
    }
    _init();

    function _loop() {
        if (isNil(gamepad)) {
            return;
        }
        controller[ButtonMapping.TRIGGER].update(gamepad.buttons[ButtonEnum.TRIGGER]);
        controller[ButtonMapping.SQUEEZE].update(gamepad.buttons[ButtonEnum.SQUEEEZE]);
        controller[ButtonMapping.TOUCHPAD].update(gamepad.buttons[ButtonEnum.TOUCHPAD]);
        controller[ButtonMapping.THUMBSTICK].update(gamepad.buttons[ButtonEnum.THUMBSTICK]);
        controller[ButtonMapping.XORA].update(gamepad.buttons[ButtonEnum.XORA]);
        controller[ButtonMapping.BORY].update(gamepad.buttons[ButtonEnum.BORY]);
    }

    function update() {
        _loop();
    }
    return {
        update,
        ...buttons
    };
}

function controllerButton(name,_controller) {
    let _btnCache = {
        pressed: false,
        touched: false,
        value: 0
    };
    let _listeners = null;
    const btnName = name;

    function _loop(btn) {
        if (isNil(_listeners) || isNil(btn)) {
            return;
        }
        _checkForChanges(btn);
    }

    function _checkForChanges(btn) {
        if (hasEventListeners(EventEnum.touchStart)) {
            _checkForEventChange(btn, 'touched', (a, b) => (a === true && b === false), EventEnum.touchStart);
        }
        if (hasEventListeners(EventEnum.down)) {
            _checkForEventChange(btn, 'pressed', (a, b) => (a === true && b === false), EventEnum.down);
        }
        if (hasEventListeners(EventEnum.up)) {
            _checkForEventChange(btn, 'pressed', (a, b) => (a === false && b === true), EventEnum.up);
        }
        if (hasEventListeners(EventEnum.touchEnd)) {
            _checkForEventChange(btn, 'touched', (a, b) => (a === false && b === true), EventEnum.touchEnd);
        }
        _btnCache = _copyButtonInfo(_btnCache, btn);
    }

    function _checkForEventChange(btnData, key, condition, type) {
        const current = get(btnData, key, false);
        const cached = get(_btnCache, key, false);
        const data = {
            btnData,
            position: _controller.position
        };
        if (condition(current, cached)) {
            _dispatchEvent({
                type,
                message: data
            });
        }
    }

    function _copyButtonInfo(target, source) {
        let newTarget = {
            ...target
        };
        newTarget['pressed'] = source['pressed'];
        newTarget['touched'] = source['touched'];
        return newTarget;
    }

    function _dispatchEvent({
        type,
        message
    }) {
        if (isNil(_listeners)) {
            return;
        }
        const listenerArr = get(_listeners, type, []);
        if (isEmpty(listenerArr)) {
            return;
        }
        const target = this;
        const arr = [...listenerArr];
        arr.forEach((listener) => listener.call(this, {
            type,
            message,
            target
        }));
    }

    function hasEventListeners(eventType) {
        const eventListeners = get(_listeners, eventType, []);
        return eventListeners.length !== 0;
    }

    function addEventListener(type, listener) {
        if (isNull(_listeners)) {
            _listeners = {};
        }
        if (isNil(_listeners[type])) {
            _listeners[type] = [];
        }
        _listeners[type].push(listener);
    }

    function removeEventListener(eventType, listener) {
        if (isNil(_listeners)) {
            return;
        }
        const listenersArr = _listeners[eventType];

        if (!isNil(listenersArr)) {
            remove(listenersArr, (_listener) => isEqual(listener, _listener));
        }
    }

    function update(btn) {
        _loop(btn);
    }

    return {
        btnName,
        update,
        addEventListener,
        removeEventListener
    }
}