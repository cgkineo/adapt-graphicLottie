# Adapt Graphic Lottie

**Adapt Graphic Lottie** is an *extension* that renders Lottie animations exported from Adobe After Effect using the Bodymovin plugin. It works *only* where graphics are rendered as *img* tags and not everywhere graphics are rendered as *img* tags, due to custom styling and behaviour.

Uses v5.7.6 of Lottie.

## Adapt Authoring Tool
To use in the AAT image picker, change the file ending of your JSON file from `.json` to `.svgz`.

## Settings Overview

The attributes listed below are used in *course.json* to configure **Adapt Graphic Lottie**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-graphicLottie/blob/master/example.json).

### Attributes

**\_graphicLottie** (object): Contains the following attributes:

>**\_isEnabled** (String): Defaults to `true`.

>**\_fileExtension** (String): The file extension of the JSON file that is exported from Adobe After Effects. Acceptable values are `svgz` and `json`. Defaults to `svgz`.

>**\_loops** (Number): Controls how many times the animation should loop when inview. To set an infinite loop, use a value of `-1`. Defaults to `0` (don't loop).

>**\_autoPlay** (Boolean): Should the animations play when on screen. Note: Percentage onscreen determines when autoplay occurs. Defaults to `true`.

>**\_onScreenPercentInviewVertical** (Number): What percentage of the SVG container should be on-screen before the animations are triggered. Defaults to `1`.

>**\_playFirstViewOnly** (Boolean): Determines whether the animation should only play the first time it is inview.

>**\_offScreenPause** (Boolean): Pause when off screen. Defaults to `true`.

>**\_offScreenRewind** (Boolean): Rewind when off screen. Defaults to `true`.

>**\_showPauseControl** (Boolean): Show the play / pause button. Defaults to `false`.

>**\_onPauseRewind** (Boolean): Rewind when the pause button is clicked. Defaults to `false`.

----------------------------

**Framework versions:**  >=5.14<br/>
**Author / maintainer:** Kineo<br/>
**Accessibility support:** Yes<br/>
**RTL support:** Yes<br/>
**Cross-platform coverage:** Evergreen + IE11<br/>
