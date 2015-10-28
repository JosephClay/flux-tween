# Deprecated
This library tries to tackle too much, so I've split spring animations into [`flux-spring`](https://github.com/JosephClay/flux-spring). For tweens, I highly recommend [sole's tween.js](https://github.com/tweenjs/tween.js/).

`npm install flux-tween`

Example
-----------

Create an animation by calling `flux.tween()` or a spring by calling `flux.spring()`. Animate between values using `to` and `from` or animate 
a matrix using `transform.to` and `transform.from`. Hook into the update event to make updates every tick.

spring:
```
flux.spring(document.getElementById('spring-me'))
    .transform.to({ x: 50 })
    .on('update', flux.applyMatrix)
    .start();
```

tween:
```
flux.tween({ x: 0 })
    .to({ x: 50 })
    .duration(500)
    .ease(flux.ease.bounce.in)
    .on('update', function(obj) {
        console.log(obj.x);
    })
    .start();
```

Then hook `flux` into `requestAnimationFrame`:

```
function tick() {
    flux.update();

    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
```

Animations
-----------

* [`.flux.tween || .flux.spring`](#animation)
* [`.from`](#animation-from)
* [`.to`](#animation-to)
* [`.transform.from`](#animation-transform-from)
* [`.transform.to`](#animation-transform-to)
* [`.repeat`](#animation-repeat)
* [`.yoyo`](#animation-yoyo)
* [`.stop`](#animation-stop)
* [`.start`](#animation-start)
* [`.pause`](#animation-pause)
* [`.resume`](#animation-resume)
* [`.reverse`](#animation-reverse)
* [`.events`](#animation-events)

<a name="animation" />
#### `.flux.tween(obj)` or `.flux.spring(obj)`

Creates a tween or spring.

When creating a tween, the `object` passed will be used as the starting value. If nothing is passed, use [`from`](#animation-from) to set the starting value.

When creating a spring, the `object` passed is a shortcut to [`set`](#spring-set).

If an element is passed, `flux` can use the element to calculate the starting [`transform`](#animation-transform-from) values.

<a name="animation-from">
#### `.from(obj)`
---

Sets the starting value for the tween.

<a name="animation-to">
#### `.to(obj)`
---

Sets the ending value for the tween.

<a name="animation-transform-from">
#### `.transform.from(obj)`
---

Sets the starting value for a matrix transformation.

If a starting value isn't set and an [element](#animation) was passed, the starting matrix values will be calculated from the element.

__Arguments__

- obj
    * `x`
    * `y`
    * `z`
    * `scaleX`
    * `scaleY`
    * `scaleZ`
    * `rotationX`
    * `rotationY`
    * `rotationZ`

- Additionally, these shorthand methods are accepted.
    * `scale`
    * `rotation`
    * `rotate`

<a name="animation-transform-to">
#### `.transform.to(obj)`
---

Sets the ending value for a matrix transformation.  

__Arguments__

See [`.transform.from(obj)`](#animation-transform-from)

<a name="animation-repeat">
#### `.repeat(times)`
---

How many times to repeat the animation. Defaults to `0`.

__Arguments__

    * `times` - how many times to repeat. Set to `Infinity` to repeat forever.


<a name="animation-yoyo">
#### `.yoyo(bool)`
---

Whether to reverse the animation when repeating. Calling `.yoyo()` without a value will set it to `true`. Defaults to `false`.

__Arguments__

    * `bool` - whether to yoyo

<a name="animation-stop">
#### `.stop()`
---

Stops the animation.

<a name="animation-start">
#### `.start()`
---

Starts the animation.

<a name="animation-pause">
#### `.pause()`
---

Pauses the animation. Note that the animation must be [started](#animation-start) in order to pause.

<a name="animation-resume">
#### `.resume()`
---

Resumes the animation if it is paused. Note that the animation must be [started](#animation-start) in order to resume.

<a name="animation-reverse">
#### `.reverse()`
---

Reverses the animation.

<a name="animation-events">
## Events
---

#### update `.on('update', callback)`
---

Called when the animation updates.

__Arguments__

* `callback(obj, animation)` - A function to call when the animation updates.

`obj` is the current state of the animation using [`.to()`](#animation-to) and [`.from()`](#animation-from). 

`animation` is an [animation](#animation) object containing:
    * `playing` : bool, whether the animation is playing
    * `matrix` : matrix, a CSSMatrix if a matrix has been set with [`.transform.to()`](#animation-transform-to) and [`.transform.from()`](#animation-transform-from)
    * `elem` : element [if one was passed in the constructor](#animation)


#### start `.on('start', callback)`
---

Called when the animation starts.

__Arguments__

    * 'callback' - a callback function

#### stop `.on('stop', callback)`
---

Called when the animation stops.

__Arguments__

    * 'callback' - a callback function

#### complete `.on('complete', callback)`
---

Called when the animation completes. This is the finished state for the animation. It is recommended that a new object be created 
for further animations after this event.

__Arguments__

    * 'callback' - a callback function

Tween specific
-----------

* [`.duration`](#tween-duration)
* [`.ease`](#tween-ease)

<a name="tween-duration">
#### `.duration(ms)`
---

Sets the duration in ms for the tween to run. Defaults to `1000`.

__Arguments__

    * `ms` - Number of milliseconds for the animation to run.

<a name="tween-ease">
#### `.ease(fn)`
---

The easing function to use for the tween. See [`flux.easing`](#easing). Defaults to `linear`.

__Arguments__

    * `fn` - An easing function.


Spring specific
-----------
* [`.set`](#spring-set)
* [`.tension`](#spring-tension)
* [`.friction`](#spring-friction)
* [`.velocity`](#spring-velocity)

<a name="spring-set">
#### `.set(obj)`

Sets the spring's tension, friction and velocity.

__Arguments__

- obj
    * [`tension`](#spring-tension) - defaults to `0`
    * [`friction`](#spring-friction) - defaults to `8`
    * [`velocity`](#spring-velocity) - defaults to `80`

<a name="spring-tension">
#### `.tension(num)`

Sets the spring tension.

__Arguments__

    * `num` - tension

<a name="spring-friction">
#### `.friction(num)`

Sets the spring friction.

__Arguments__

    * `num` - friction

<a name="spring-velocity">
#### `.velocity(num)`

Sets the spring velocity.

__Arguments__

    * `num` - velocity

Quality of life
-----------

If an element is passed in the [`constructor`](#animation), you can apply matrix transformations via: `.on('update', flux.applyMatrix)`.

```
flux.spring(document.getElementById('spring-me'))
    .transform.to({ x: 50 })
    .on('update', flux.applyMatrix)
    .start();
```
which is the same as:
```
flux.spring(document.getElementById('spring-me'))
    .transform.to({ x: 50 })
    .on('update', function(obj, anim) {
        anim.elem.style[flux.transform] = anim.matrix.toString();
    })
    .start();
```

`flux.transform` contains the transformation property to use for styles in the current browser.

```
var elem = document.getElementById('animate-me');
elem.style[flux.transform] = 'rotateX(90deg)';
```

All methods on the animation are chainable for easy animation creation. 

Plugins
-----------

Register functions to `flux` to implement custom logic for your animations...

```
flux.plugin('log', function(opts) {
    if (opts && opts.start) {
        var inst = this;
        inst.on('start', function() {
            console.log('starting!');
        })
    }
});
```

...then invoke the plugin when you want to use it:

```
flux.spring(document.getElementById('spring-me'))
    .transform.to({ x: 50 })
    .on('update', flux.applyMatrix)
    .log({ start: true })
    .start();
```

Support
----------------

Modern browsers and IE9+

Credit to
----------------

* [XCSSMatrix](https://github.com/jfsiii/XCSSMatrix)
* [sole/tween.js](https://github.com/sole/tween.js/)

#License
----------------

The MIT License (MIT)

Copyright (c) 2014 Joseph Clay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
