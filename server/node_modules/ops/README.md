# ops

Applies default values to options for your function and classes. Options supposed to be dictionaries. They can contain value types, arrays or dictionaries which can contain the same. User objects are not supported.

## Functions provided

* `applyDefaults(options, defaults, opt_cloneDefaults)` - applies default values from "defaults" on "options". If "opt_cloneDefaults" is true, cloned default values will be used, preventing modification of "defaults" by modifying returned result.
* `cloneWithDefaults(options, defaults, opt_cloneDefaults)` - applies default values from "defaults" on clone of "options", keeping original "options" untouched. "opt_cloneDefaults" has the same meaning as for applyDefaults().

**NOTE** corresponding default values will be substituted in place of missed keys and undefined values of options.

## Usage example

```js
var applyDefaults = require('ops').applyDefaults;

function f (options) {
	options = applyDefaults(options, {
		a: true,
		b: {x: 5},
		c: [1, 2, 3],
		d: 0
	});

	return options;
}

var result = f({
	b: {y: 7},
	c: 0,
	d: undefined
});
```

Result will be

```js
{
	a: true, // from defaults
	b: { // from options
		x: 5, // from defaults
		y: 7 // from options
	},
	c: 0, // from options
	d: 0 // from defaults
}
```

## Subclassing

Use `require('ops').Ops` to get class providing ops functionality. You can subclass and then use an instance of your subclass instead of ops itself.

## License

MIT
