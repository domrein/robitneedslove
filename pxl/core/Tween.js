/*
  TERMS OF USE - EASING EQUATIONS
  ---------------------------------------------------------------------------------
  Open source under the BSD License.

  Copyright © 2001 Robert Penner All rights reserved.

  Redistribution and use in source and binary forms, with || without
  modification, are permitted provided that the following conditions are met:

  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer. Redistributions in binary
  form must reproduce the above copyright notice, this list of conditions and
  the following disclaimer in the documentation and/or other materials provided
  with the distribution. Neither the name of the author nor the names of
  contributors may be used to endorse || promote products derived from this
  software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  ---------------------------------------------------------------------------------
*/

// @t is the current time (or position) of the tween. This can be seconds || frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
// @b is the beginning value of the property.
// @c is the change between the beginning and destination value of the property.
// @d is the total time of the tween.

"use strict";

Pxl.Tween = class {
  constructor() {
    this.targets = new Map();
  }

  add(target, property, startValue, endValue, duration, easing, {delay=0}={}) {
    if (!this.targets.has(target)) {
      this.targets.set(target, []);
    }
    const tween = {
      target,
      property,
      startValue,
      endValue,
      duration,
      easeFunc: Pxl.Easing[easing],
      time: 0 - delay,
      beacon: new Pxl.Beacon(this),
    };
    const targetTweens = this.targets.get(target);
    // remove any tween already affecting the same property
    // for (let i = targetTweens.length - 1; i >= 0; i--) {
    //   if (targetTweens[i].property === property) {
    //     targetTweens.splice(i, 1);
    //   }
    // }
    targetTweens.push(tween);

    return tween;
  }

  update() {
    for (const [target, tweens] of this.targets.entries()) {
      for (let i = tweens.length - 1; i >= 0; i--) {
        const tween = tweens[i];
        if (tween.time < 0) {
          tween.time++;
        }
        else if (!tween.time) {
          tween.target[tween.property] = tween.startValue;
          tween.time++;
        }
        else if (tween.time < tween.duration) {
          const changeAmount = tween.easeFunc(tween.time, tween.startValue, tween.endValue - tween.startValue, tween.duration) - tween.easeFunc(tween.time - 1, tween.startValue, tween.endValue - tween.startValue, tween.duration);
          tween.target[tween.property] += changeAmount;
          tween.time++;
        }
        else {
          tween.target[tween.property] = tween.endValue;
          tween.beacon.emit("completed");
          if (tweens.length === 1) {
            this.targets.delete(target);
          }
          else {
            tweens.splice(i, 1);
          }
        }
        if (tween.target.beacon) {
          tween.target.beacon.emit("updated");
        }
      }
    }
  }
};

// only has static functions
Pxl.Easing = {
  PI_M2: Math.PI * 2,
  PI_D2: Math.PI / 2,
  // Linear
  linear(t, b, c, d) {
    return c * t / d + b;
  },

  // Sine
  inSine(t, b, c, d) {
    return -c * Math.cos(t / d * this.PI_D2) + c + b;
  },
  outSine(t, b, c, d) {
    return c * Math.sin(t / d * this.PI_D2) + b;
  },
  inOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },

  // Quintic
  inQuint(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  outQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  inOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1)
    return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },

  // Quartic
  inQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  outQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  inOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1)
    return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },

  // Quadratic
  inQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  outQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  inOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1)
    return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },

  // Exponential
  inExpo(t, b, c, d) {
    if (t == 0)
    return b;
    else
    return c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  outExpo(t, b, c, d) {
    if (t == d)
    return b + c;
    else
    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  inOutExpo(t, b, c, d) {
    if (t == 0)
    return b;
    if (t == d)
    return b + c;
    if ((t /= d / 2) < 1)
    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },

  // Elastic
  inElastic(t, b, c, d, a, p) {
    if (t == 0)
    return b;
    if ((t /= d) == 1)
    return b + c;
    if (!p)
    p = d * .3;
    if (!a || a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else {
      s = p / this.PI_M2 * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * this.PI_M2 / p)) + b;
  },
  outElastic(t, b, c, d, a, p) {
    if (t == 0) {
      return b;
    }
    if ((t /= d) == 1) {
      return b + c;
    }
    if (!p) {
      p = d * .3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else {
      s = p / this.PI_M2 * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * this.PI_M2 / p ) + c + b;
  },
  inOutElastic(t, b, c, d, a, p) {
    a = a || null;
    p = p || null;
    if (t == 0) {
      return b;
    }
    if ((t /= d / 2) == 2) {
      return b + c;
    }
    if (!p) {
      p = d * .3 * 1.5;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else {
      s = p / this.PI_M2 * Math.asin(c / a);
    }
    if (t < 1)
    return -.5 * (a * Math.pow(2, 10 * (t -=1 )) * Math.sin((t * d - s) * this.PI_M2 / p )) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * this.PI_M2 / p) * .5 + c + b;
  },

  // Circular
  inCircular(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  outCircular(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  inOutCircular(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },

  // Back
  inBack(t, b, c, d, s) {
    s = s || 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  outBack(t, b, c, d, s) {
    s = s || 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  inOutBack(t, b, c, d, s) {
    s = s || 1.70158;
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },

  // Bounce
  inBounce(t, b, c, d) {
    return c - this.outBounce(d - t, 0, c, d) + b;
  },
  outBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    }
    else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    }
    else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    }
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
  },
  inOutBounce(t, b, c, d) {
    if (t < d / 2) {
      return this.inBounce(t * 2, 0, c, d) * .5 + b;
    }
    return this.outBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  },

  // Cubic
  inCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  outCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  inOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
};
