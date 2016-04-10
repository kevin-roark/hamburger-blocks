
var frampton = require('../frampton/dist/video-frampton');
var mediaConfig = require('./media_config.json');
var timing = require('./timing.json');

var renderer = new frampton.VideoRenderer({
  mediaConfig: mediaConfig,
  inputVideosHaveDifferentCodecs: true,
  log: true
});

var tagger = new frampton.Tagger(mediaConfig);
var expectedTags = ['fire', 'cows', 'cooking', 'chef', 'burger', 'food', 'eat', 'appliance', 'franchise', 'gold', 'money'];
expectedTags.forEach(function(tag) { tagger.tagVideosWithPattern(tag, tag); });

var taggedVideos = {};
expectedTags.forEach(function(tag) { taggedVideos[tag] = tagger.videosWithTag(tag, {shuffle: true}); });

timing.forEach(function(timingItem) {
  var tag = timingItem.tag;

  var videos = taggedVideos[tag];
  var video = videos.shift();
  if (videos.length === 0) {
    taggedVideos[tag] = tagger.videosWithTag(tag, {shuffle: true});
  }

  var videoSegment = new frampton.VideoSegment(video);
  renderer.scheduleSegmentRender(videoSegment, timingItem.time * 1000);
});
