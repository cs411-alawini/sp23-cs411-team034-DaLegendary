# Marked Types

Fix for instanceof issues.

## The Problem

Using [npm](https://npmjs.org/) packaging you can easily get into situation when `instanceof` returns false even if object is actually an instance of given type.

This may happen when some module is loaded more than once from several different locations. It is common situation because of the way npm handles dependencies.

Note, that you can run into this problem not only with npm itself, but also by using [browserify](http://browserify.org/), working with different execution contexts and possibly in number of other situations.

For more information, see [problem details](./the_problem.md).

## Motivation

Most cases when you want to use instanceof are simple enough:

* You want to recognize certain type of objects
	* for example, you declared Option type and later want to check argument of some function to be an Option
* You want to distinguish between number of types
	* for example, you declared several kinds of Exception subtypes and want to recognize which one you've catched.

For both cases it's enough to mark somehow your types of interest and later check objects on having corresponding markers. That's exactly what marked_types allows to do.

Marked types can be used in node.js and also in browser using [browserify](http://browserify.org/) or something similar.

## API

* mark(type, id) - marks specified type with given id
* is(obj, type) - checks if obj is instance of given type according to markers previously set

## Type Id

**NOTE** Type ids are always compared as strings for type checking purposes, without any parsing or deeper analysis. Marked types supposed to be fast, not smart. The only reason type ids have some specific format is to guarantee global uniqueness.

Type id format:

`packageName{URI}(versionSpecifier):idWithinPackage`

* `{URI}` part is optional if package is registered in [npm](https://npmjs.org/) under packageName specified, because this makes packageName unique enough
* packageName is optional if URI is specified and already contains package name
* `(versionSpecifier)` part is optional and can use whatever agreements you want for your package versioning
	* it's recommended to use version specifiers compatible with used by [npm](https://npmjs.org/)
* `idWithinPackage` part is unique type id within your package
	* it can use semicolons to separate it's parts
	* it's recommended to use type name as idWithinPackage whenever possible
	* if you have several types with the same name, you can distinguish them by
		* using some "kind specifier" as part of idWithinPackage:
			* `(client):MyType`, `(server):MyType`
		* use path within package as part of idWithinPackage:
			* `lib/client:MyType`, `lib/server:MyType`

It's recommended to:

* Use simplest form with skipping all optional parts whenever possible
* Keep ids short but readable

Escaping:

* If packageName part contains ":" (semicolon) characters, they must be escaped with "\" (backslash)
* If URI part contains "}" characters, they must be escaped with "\" (backslash)
* If versionSpecifier part contains ")" characters, they must be escaped with "\" (backslash)

Id examples:

* `myPkg:MyType`
* `myPkg:(server):MyType`
* `myPkg:lib/client:MyType`
* `myPkg{http://myprojectpage.com/myPkg}:(client):MyType`
* `{http://myprojectpage.com/myOtherPkg}:(client):MyType`
* `myPkg(>=0.1.0):MyType`

## Inheritance

It works well with inherited types as far as they have correct `super_` property referencing supertype. To distinguish type from it's marked supertypes, the type itself should be marked too. See "Usage" and "Internals" below for details.

## Types Versioning

Types marked with the same id are equivalent for marked_types even if they belong to different package versions. You can use versionSpecifier part to prevent this. But also you can use versionSpecifier to state that some type can be freely used across several versions.

For example:

* Assume, we have package version 0.1.0 with type marked as `myPkg(0.1.0):MyType` within it
* Then we alter version to 0.1.1 and change type id to `myPkg(>=0.1.1):MyType`
* Then we alter version to 0.1.2 and leave type id the same
* Then we alter version to 0.2.0 and change type id to `myPkg(>=0.2.0):MyType`

This case:

* MyType types from package versions 0.1.1 and 0.1.2 will be equivalent for marked_types
* But MyType from package version 0.1.0 will not be equivalent to ones of other versions
* The same for version 0.2.0

Note, that versionSpecifier has no direct relation to your package version. For marked_types it's just part of id and have no special meaning. But you can use it to do tricks described above.

## Usage

You can mark type when it is declared:

```js
var mt = require('marked_types');

var MyType = function () {
};
mt.mark(MyType, 'myPkg:MyType');
```

And then check if an object is instance of your type:

```js
var obj1 = new MyType();
mt.is(obj1, MyType); // true
mt.is(obj1, SomeOtherType); // false
```

This will also work for inherited types:

```js
var inherits = require('util').inherits;

var MyOtherType = function () {
};
inherits(MyOtherType, MyType);

var obj2 = new MyOtherType();

mt.is(obj2, MyType); // true
// but
mt.is(obj2, MyOtherType); // false - because MyOtherType is not marked
```

If you want to be able to detect inherited type also, you should mark it too:

```js
var MyThirdType = function () {
};
inherits(MyThirdType, MyType);
mt.mark(MyThirdType, 'myPkg:MyThirdType');

var obj3 = new MyThirdType();
mt.is(obj3, MyType); // true
mt.is(obj3, MyThirdType); // true
mt.is(obj3, MyOtherType); // false
```

## Internals

`mark(type, id)` sets `typeMarker_` property of type to id specified.

`is(obj, type)` gets marker of `type` or it's nearest marked supertype (if `type` itself has no marker) and returns true if the marker obtained is the same as marker of `obj.constructor` or one of it's supertypes. It uses `super_` property to get supertypes.

Note, that internals can be changed in future implementations.

## License

MIT
