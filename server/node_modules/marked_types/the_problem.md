# instanceof problem

Sometimes `instanceof` returns false even if object is actually an instance of given type. This can be great surprise with hard way to discover what's actually wrong. Below are details on why this situation may appear and how to deal with it.

## Types Equality

`obj instanceof type` returns true if `Object.getPrototypeOf(obj) === type.prototype` or `type.prototype` is somewhere on obj's prototype chain (see [instanceof operator](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/instanceof)).

This means, `instanceof` doesn't care about type name or how type implementation was loaded, it just checks that some item of obj's prototype chain points to exactly same object in memory as `type.prototype`.

This also means, that if you load some module to memory twice, you'll have two sets of types that will not be anyhow related in terms of `instanceof`, just because they are located in different places in memory. So, type checking using `instanceof` will be problematic.

## Context Issues

Using [context](http://nodejs.org/api/all.html#all_executing_javascript) you can get into problem even with standard classes such as Array [will be different](http://nodejs.org/api/all.html#all_globals) within context. For example, `[1, 2, 3]` passed to context will not be `instanceof Array` for script within the context.

This kind of issue is potentially possible for browsers too if object is somehow passed between security contexts (not sure if it's actually possible).

## Package Issues

If some package have been loaded into memory twice, we definitely can have incorrect `instanceof` results. Let's see how this situation may occur and why it's common enough.

### node.js and packages

For node.js, package is just a module (all the dependencies magic is performed by [npm](https://npmjs.org/)). Node.js itself doesn't care about package name and version at all. It distinguishes modules simply by comparing their "real paths". Real path is an absolute path obtained by complete resolution of all possible symlinks (see [realpath](http://nodejs.org/api/fs.html#fs_fs_realpath_path_cache_callback)).

Modules are cached based on their real paths. If there is an attempt to load module with the same real path as some previously loaded have, the previously loaded module will be used instead and we'll have only one copy of the module in memory.

`require(path)` can be used with relative (beginning with './' or '../') or absolute (beginning with '/') path. In case of relative path, the module will be searched in the given path combined with current module directory.

If path is not relative nor absolute, the module will be searched in 'node_modules' subfolder of current module directory, then in 'node_modules' of it's parent directory, parent of it's parent and so on till the root of filesystem (see modules loading [details](http://nodejs.org/api/modules.html#modules_all_together)). If module cannot be found on any of these paths, then NODE_PATH paths will be searched as well as some more [locations](http://nodejs.org/api/modules.html#modules_loading_from_the_global_folders).

### npm and packages

npm can handle dependencies and it knows everything about package names and versions.

There are 3 ways to install a package:

* npm install
* npm install -g
* npm link

#### npm install

`npm install` installs a package (or all dependency packages) into current directory's 'node_modules' subfolder, using [algorithm](https://npmjs.org/doc/install.html#ALGORITHM) described in documentation.

Algorithm guarantees that if we are installing dependencies for package A, and

* A depends on B and C
* B depends on C
* C depends on D

then package C will be installed in 'node_modules' of package A only, producing following directory structure:

* `A/node_modules/B`
* `A/node_modules/C`
* `A/node_modules/C/node_modules/D`

There is no need to install package C into `B/node_modules`, because according to node's module loading rules, package C located in `A/node_modules/` is visible for package B. That's because `require()` will check `B/../node_modules` when searching module C from B.

But if B also depends on D, we will get two copies of D:

* `A/node_modules/B`
* `A/node_modules/B/node_modules/D`
* `A/node_modules/C`
* `A/node_modules/C/node_modules/D`

That's because modules contained in 'node_modules' of package C are not visible from B.

All above is true only if both A and B are depending on C of exactly same version. Otherwise, B will get it's own version of C into it's own 'node_modules'.

For the first example, there will be no module duplicates in memory, but for second one we'll get two copies of D because they will be loaded from different locations (`A/node_modules/B/node_modules/D` and `A/node_modules/C/node_modules/D`).

#### 'npm install -g' and 'npm link'

Both 'npm install -g' and 'npm link' install packages into 'global space' (some common dirrectory). 'npm link' does symlink from that common dirrectory to current package, 'npm install -g' installs into that dirrectory directly.

To make global package available for current one, `npm link <package_name>` can be used. It creates symlink from `node_modules/<package_name` to package previously installed into common dirrectory.

All the globally installed packages will have all their dependencies installed into their own 'node_modules' directories, because normally there will not be any 'node_modules' directories in directories containing 'global space' directory which could already contain some required modules.

Let's back to our example. We have following packages:

* A depends on B and C
* B depends on C
* C depends on D

If for package A we do `npm install -g B C` and then `npm link B C` we'll get following directory structure:

* `A/node_modules/B -> /<globals_path>/B`
* `A/node_modules/C -> /<globals_path>/C`
* `/<globals_path>/B`
* `/<globals_path>/B/node_modules/C`
* `/<globals_path>/B/node_modules/C/node_modules/D`
* `/<globals_path>/C`
* `/<globals_path>/C/node_modules/D`

This time we have two copies of package C - one globally installed and one for B. We need them both, because B is now actually located in `/<globals_path>/B` and `A/node_modules` containing C is not visible for B anymore.

And of course there will be two copies of C in memory, because they have different real paths.

To avoid duplication, we can do `npm link C` within B. Then we'll have:

* `A/node_modules/B -> /<globals_path>/B`
* `A/node_modules/C -> /<globals_path>/C`
* `/<globals_path>/B`
* `/<globals_path>/B/node_modules/C -> /<globals_path>/C`
* `/<globals_path>/C`
* `/<globals_path>/C/node_modules/D`

This way we'll have no copies of C in memory because both A and B use C located in `/<globals_path>/C`.

### Getting into Troubles

As you could see, it's easy enough to accidentally get into cases when some package gets loaded into memory twice or more. Especially it's easy within dev environment, where using `npm link` is a common practice.

Sometimes there will be problems in your dev environment, with no problems on production. It can occurs if you used `npm link` for some, but not all dependencies in dev and used single `npm install` on prod. Sometimes there will be problems in both environments.

Most problematic cases can be fixed one way or another. But some are unresolvable at all. Below are examples of different cases and way to fix them.

#### Dev in Trouble Example

Assume our packages are:

* A depends on B and C
* B depends on C
* C depends on D

And we have couple of types:

* TypeC is located in C
* TypeB is located in B and inherits TypeC

Also, package A has function `function f () { return new TypeB() instanceof TypeC; }`.

`f()` will work correctly, if TypeC used in module A is the same as TypeC used in module B, where `inherits(TypeB, TypeC)` was called. But if A and B use different copies of C, then `f()` will incorrectly return false.

On dev for package A we do `npm install -g B C` and then `npm link B C` and getting in trouble by having two copies of D. But on prod we do `npm install` for A and have no duplicates. See "'npm install -g' and 'npm link'" for corresponding directory trees.

To fix dev we can do `npm link C` within B.

#### Both in Trouble Example

Assume we have the following packages:

* A depends on B and C
* B depends on D
* C depends on D

and following types and functions:

* TypeD is located in D
* TypeB is located in B and inherits TypeD
* `function fc (obj) { return obj instanceof TypeD; }` within C
* `function fa () { return fc(new TypeB()); }` within A

This example will work correctly only if both B and C will use the same D. For dev environment we can install B, C and D globally and then link D to both A and B, getting the following structure:

* `A/node_modules/B -> /<globals_path>/B`
* `A/node_modules/C -> /<globals_path>/C`
* `/<globals_path>/B`
* `/<globals_path>/B/node_modules/D -> /<globals_path>/D`
* `/<globals_path>/C`
* `/<globals_path>/C/node_modules/D -> /<globals_path>/D`
* `/<globals_path>/D`

But on prod (when we do just `npm install`) we'll have the following:

* `A/node_modules/B`
* `A/node_modules/B/node_modules/D`
* `A/node_modules/C`
* `A/node_modules/C/node_modules/D`

And here we have two copies of D which make `fa()` function broken!

To fix it, we can introduce fake dependency D for package A. This way `npm install` will create following structure:

* `A/node_modules/B`
* `A/node_modules/C`
* `A/node_modules/D`

And this structure has exactly one D used by both B and C.

We fixed it, but at the price of having fake dependency for A, with need to keep in mind it's necessary and with getting warnings about it.

Another way to fix it is to use [npm dedupe](https://npmjs.org/doc/dedupe.html). It will move common dependencies up on the tree. In our case it will place D to `A/node_modules/D`.

#### Unresolvable Example

Assume we have the following packages:

* A depends on B and C
* B depends on D version 0.1.0
* C depends on D version 0.1.1

This way we cannot avoid duplication of D and this is reasonable, because we have two different versions. But we also will have potential `instanceof` issues even if versions are different in some little thing and all thair types are completely compatible.

The only way to fix these issues is to upgrade dependency of B or downgrade dependency of C, which can be impossible if you have no control on these packages.

## Recommendations

Making `instanceof` work properly can be a tricky problem, even if you perfectly know internals of packages you are intending to use. For less informed users it can be almost impossible to install packages the right way. Any `instanceof` usage is a potential danger for package users. Moreover, this danger is usually completely unexpected. You never can guess all the ways your packages and types will be used, inherited or depended on.

It's recommended to avoid usage of `instanceof` whenever it's possible, especially for common usage libraries. Use [marked types](https://github.com/dimsmol/marked_types) or similar approach instead of `instanceof`.
