define(function () { 'use strict';

	exports['default'] = null;
	globalThis.setFoo = value => (exports['default'] = value);

	return exports['default'];

});
