import {
    forEach,
    get,
    isEmpty,
    isNil,
    remove,
    isEqual
} from 'lodash';

const hasChangedToFalse = (prev, next) => prev === true && next === false;
const hasChangedToTrue = (prev, next) => prev === false && next === true;

const BUTTON_MAPPING = {
    TRIGGER: 'trigger',
    SQUEEZE: 'squeeze',
    TOUCHPAD: 'touchpad',
    THUMBSTICK: 'thumbstick',
    XORA: 'xora',
    BORY: 'bory'
};

const BUTTON_ENUM = {
    TRIGGER: 0,
    SQUEEZE: 1,
    TOUCHPAD: 2,
    THUMBSTICK: 3,
    XORA: 4,
    BORY: 5
};

const AXES_ENUM = {
    TOUCHPAD_X:0,
    TOUCHPAD_Y:1,
    THUMBSTICK_X:2,
    THUMBSTICK_Y:3
}

const GAMEPAD_EVENTS = {
    TOUCHED: 'touched',
    PRESSED: 'pressed'
}

const EVENT_ENUM = {
    up: 'up',
    down: 'down',
    touchStart: 'touchStart',
    touchEnd: 'touchEnd'
};

export function GamepadControls(event, controller) {
    const _gamepad = get(event, 'data.gamepad', null);
    console.log(_gamepad.hapticActuators);
    window.h = _gamepad.hapticActuators;
    const _controller = controller;
    let buttons = {};
    console.log(_gamepad.axes);
    let _axes = [];

    function _init() {
        forEach(BUTTON_MAPPING, btnName => {
            const btn = GamepadControlButton(btnName, _controller);
            buttons[btnName] = btn;
        });
        _axes = GamepadControlAxes('touchpad',controller);
    }

    function _loop() {
        if (isNil(_gamepad)) {
            return;
        }
        buttons[BUTTON_MAPPING.TRIGGER].update(_gamepad.buttons[BUTTON_ENUM.TRIGGER]);
        buttons[BUTTON_MAPPING.SQUEEZE].update(_gamepad.buttons[BUTTON_ENUM.SQUEEZE]);
        buttons[BUTTON_MAPPING.TOUCHPAD].update(_gamepad.buttons[BUTTON_ENUM.TOUCHPAD]);
        buttons[BUTTON_MAPPING.THUMBSTICK].update(_gamepad.buttons[BUTTON_ENUM.THUMBSTICK]);
        buttons[BUTTON_MAPPING.XORA].update(_gamepad.buttons[BUTTON_ENUM.XORA]);
        buttons[BUTTON_MAPPING.BORY].update(_gamepad.buttons[BUTTON_ENUM.BORY]);
        // update axes change
        _axes.update(_gamepad.axes);
    }

    function update() {
        _loop();
    }

    _init();
    return {
        update,
        ...buttons
    }
}

function GamepadControlButton(name, controller) {
    let _btnCache = {
        pressed: false,
        touched: false,
        value: 0
    };
    let _listeners = {};
    const btnName = name;

    function _loop(btn) {
        if (isEmpty(_listeners) || isNil(btn)) {
            return;
        }
        _checkForChanges(btn);
    }

    function _checkForChanges(btn) {
        _checkForEventChange(btn, GAMEPAD_EVENTS.TOUCHED, hasChangedToFalse, EVENT_ENUM.touchStart);
        _checkForEventChange(btn, GAMEPAD_EVENTS.PRESSED, hasChangedToFalse, EVENT_ENUM.down);
        _checkForEventChange(btn, GAMEPAD_EVENTS.PRESSED, hasChangedToTrue, EVENT_ENUM.up);
        _checkForEventChange(btn, GAMEPAD_EVENTS.TOUCHED, hasChangedToTrue, EVENT_ENUM.touchEnd);

        _btnCache = _copyButtonInfo(_btnCache, btn);
    }

    function _checkForEventChange(btnData, key, condition, type) {
        const current = get(btnData, key, false);
        const cached = get(_btnCache, key, false);
        const data = {
            btnData,
            position: controller.position
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
        newTarget[GAMEPAD_EVENTS.PRESSED] = source[GAMEPAD_EVENTS.PRESSED];
        newTarget[GAMEPAD_EVENTS.TOUCHED] = source[GAMEPAD_EVENTS.TOUCHED];
        newTarget['value'] = source['value'];
        return newTarget;
    }

    function _dispatchEvent({
        type,
        message
    }) {
        const listenerArr = get(_listeners, type, []);  
        listenerArr.forEach((listener) => listener.call(this, {
            type,
            message,
        }));
    }


    function addEventListener(eventType, listener) {
        const listenersArr = get(_listeners, eventType, []);
        listenersArr.push(listener);
        _listeners[eventType] = listenersArr;
    }

    function removeEventListener(eventType, listener) {
        const listenersArr = get(_listeners, eventType, []);
        remove(listenersArr, (_listener) => isEqual(listener, _listener));
        listenersArr[eventType] = listenersArr;
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

function GamepadControlAxes(name,controller){
    const _name = name;
    let _listeners = [];
    let _axesCache = [0,0,0,-0];
    const _epsilon = 0.5;

    function _loop(axes){

        if(isEmpty(axes)){
            return;
        }
        _checkForChanges(axes);
    }

    function _checkForChanges(axes){
        _checkForAxesChanges(axes);
    }

    function _checkForAxesChanges(axes){
        if(Math.abs(_axesCache[0]-axes[0]) > _epsilon || Math.abs(_axesCache[1]-axes[1]) > _epsilon){
            console.log('axes changed more than epsilon');
            console.log({_axesCache,axes});
        }
        if(Math.abs(_axesCache[2]-axes[2]) > _epsilon || Math.abs(_axesCache[3]-axes[3]) > _epsilon){
            console.log('axes changed more than epsilon');
            console.log({_axesCache,axes});
        }
        _axesCache = _copyAxesInfo(_axesCache,axes);
    }

    function _copyAxesInfo(target,source){
        let newTarget = {...target};
        newTarget[0] = source[0];
        newTarget[1] = source[1];
        newTarget[2] = source[2];
        newTarget[3] = source[3];
        return newTarget;
    }
    
    function update(axes){
        _loop(axes);
    }
    return {
        update
    }
}