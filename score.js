
var frampton = require('../frampton/dist/video-frampton');
var mediaConfig = require('./media_config.json');
var timing = require('./timing.json');

var renderer = new frampton.VideoRenderer({
  mediaConfig: mediaConfig,
  inputVideosHaveDifferentCodecs: true,
  stripAudioFromAllVideos: true,
  preferredVideoScale: '1920:1080',
  log: true
});

var tagger = new frampton.Tagger(mediaConfig);
var expectedTags = ['fire', 'cows', 'cooking', 'chef', 'burger', 'food', 'eat', 'appliance', 'franchise', 'gold', 'money'];
expectedTags.forEach(function(tag) { tagger.tagVideosWithPattern(tag, tag); });

var taggedVideos = {};
expectedTags.forEach(function(tag) { taggedVideos[tag] = tagger.videosWithTag(tag, {shuffle: true}); });

timing.forEach(function(timingItem, idx) {
  var tag = timingItem.tag;

  var videos = taggedVideos[tag];
  var video = videos.shift();
  if (videos.length === 0) {
    taggedVideos[tag] = tagger.videosWithTag(tag, {shuffle: true});
  }

  var videoSegment = new frampton.VideoSegment(video);
  videoSegment.setVolume(0);

  if (idx + 1 < timing.length) {
    var nextItem = timing[idx + 1];
    videoSegment.setDuration(nextItem.time - timingItem.time);
  }
  else {
    videoSegment.setDuration(3.5);
  }

  renderer.scheduleSegmentRender(videoSegment, timingItem.time * 1000);
});
