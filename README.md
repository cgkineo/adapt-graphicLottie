# Adapt Graphic Lottie

**Adapt Graphic Lottie** is an *extension* that renders Lottie animations exported from Adobe After Effect using the Bodymovin plugin. It works *only* where graphics are rendered as *img* tags and not everywhere graphics are rendered as *img* tags, due to custom styling and behaviour. 

Uses v5.7.6 of Lottie.

## Adapt Authoring Tool
Change the file ending of your json from `.json` to `.svgz` for use in the AAT image picker.

## Settings Overview

The attributes listed below are used in *course.json* to configure **Adapt Graphic Lottie**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-graphicLottie/blob/master/example.json).

### Attributes

**\_graphicLottie** (object): It contains values for **\_isEnabled**, **\_fileExtension**, **\_loops**, **\_autoPlay**, **\_onScreenPercentInviewVertical**, **\_offScreenPause**, **\_offScreenRewind**, **\_showPauseControl** and **\_onPauseRewind**

>**\_isEnabled** (String): Defaults to `true`.

>**\_fileExtension** (String): The image file extension of the json file. Acceptable values are `.svgz` and `.bmp`. Defaults to `svgz`. 

>**\_loops** (Number): Controls how many times the animation should loop. To set an infinite loop, use a value of `-1`. Defaults to `0` (don't loop).

>**\_autoPlay** (Boolean): Should the animations play when on screen. Note: Percentage onscreen determines when autoplay occurs. Defaults to `true`.

>**\_onScreenPercentInviewVertical** (Number): What percentage of the SVG container should be on-screen before the animations are triggered. Defaults to `1`.

>**\_offScreenPause** (Boolean): Pause when off screen. Defaults to `true`.

>**\_offScreenRewind** (Boolean): Rewind when off screen. Defaults to `true`.

>**\_showPauseControl** (Boolean): Show the play / pause button. Defaults to `false`.

>**\_onPauseRewind** (Boolean): Rewind when the pause button is clicked. Defaults to `false`.

----------------------------
**Version number:**  0.0.17   
**Framework versions:**  >=5.8   
**Author / maintainer:** Kineo   
**Accessibility support:** Yes   
**RTL support:** Yes   
**Cross-platform coverage:** Evergreen + IE11   
