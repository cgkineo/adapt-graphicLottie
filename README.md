# Adapt Graphic Lottie

**Adapt Graphic Lottie** is an *extension* that renders Lottie animations exported from Adobe After Effect using the Bodymovin plugin. It work *only* where graphics are rendered as *img* tags and not everywhere. Change the file ending, uploading the json as an svgz/bmp for the AAT.

Uses v5.7.6 of Lottie.

## Settings Overview

The attributes listed below are used in *course.json* to configure **Adapt Graphic Lottie**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-graphicLottie/blob/master/example.json).

### Attributes

**\_graphicLottie** (object): It contains values for **\_isEnabled**, **\_fileExtension**

>**\_isEnabled** (String): Defaults to `true`.

>**\_fileExtension** (String): Defaults to `svgz`. The image file extension of the json file.

>**\_loops** (Number): Controls how many times the animation should loop. To set an infinite loop, use a value of `-1`. Defaults to `0` (don't loop).

>**\_autoPlay** (Boolean): Should the animations play when on screen. Note: Percentage onscreen determines when autoplay occurs. Defaults to `true`.

>**\_onScreenPercentInviewVertical** (Number): What percentage of the SVG container should be on-screen before the animations are triggered. Defaults to `1`.

>**\_offScreenPause** (Boolean): Pause when off screen. Defaults to `true`.

>**\_offScreenRewind** (Boolean): Rewind when off screen. Defaults to `true`.

>**\_showPauseControl** (Boolean): Show the play / pause button. Defaults to `false`.

>**\_onPauseRewind** (Boolean): Rewind when the pause button is clicked. Defaults to `false`.

----------------------------
**Version number:**  0.0.16   
**Framework versions:**  >=5.8   
**Author / maintainer:** Kineo   
**Accessibility support:** None   
**RTL support:** No   
**Cross-platform coverage:** Evergreen + IE11   
