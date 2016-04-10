
var frampton = require('../frampton/dist/video-frampton');
var mediaConfig = require('./media_config.json');
var timing = require('./timing.json');

var renderer = new frampton.VideoRenderer({
  mediaConfig: mediaConfig,
  inputVideosHaveDifferentCodecs: true
});

var tagger = new frampton.Tagger(mediaConfig);
var expectedTags = ['fire', 'cows', 'cooking', 'chef', 'burger', 'food', 'eat', 'appliance', 'franchise', 'gold', 'money'];
expectedTags.forEach(function(tag) { tagger.tagVideosWithPattern(tag, tag); });

timing.forEach(function(timingItem) {
  var video = tagger.randomVideoWithTag(timingItem.tag);
  var videoSegment = new frampton.VideoSegment(video);
  renderer.scheduleSegmentRender(videoSegment, timingItem.time * 1000);
});
