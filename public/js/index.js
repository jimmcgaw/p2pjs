(function(){
  navigator.getWebcam = ( navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

  var peer = new Peer({
    'host': 'peerless.herokuapp.com',
    'path': '/peerjs',
    'debug': 3,
    'key': 'peerjs',
    'port': location.port || (location.protocol === 'https:' ? 443 : 80),
  });

  peer.on('open', function(){
    $("#my-id").text(peer.id);
  });

  peer.on('call', function(call){
    call.answer(window.localStream);
    initiateCall(call);
  });

  $('#make-call').click(function(){
    var peerId = $("#callto-id").val();
    var call = peer.call(peerId, window.localStream);
    initiateCall(call);
  });

  $("#end-call").click(function(){
    endCall();
  });

  var init = function(){
    navigator.getWebcam({ audio: false, video: true}, function(stream){
      $('#my-video').prop('src', URL.createObjectURL(stream));

      window.localStream = stream;
      console.log(window.localStream);

    }, function(){ console.log('error on init!'); });
  };

  var endCall = function(){
    if (window.existingCall){
      window.existingCall.close();
    }
  };

  var initiateCall = function(call){
    endCall();

    call.on('stream', function(stream){
      $('#their-video').prop('src', URL.createObjectURL(stream));
    });

  };

  init();

}());
