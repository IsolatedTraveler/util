((w, d) => {
  /** msg参数说明
   {
     type: '',   0  文本消息， 1 音视频请求 
     msg: ''  主体信息
   }
  */
  const RTC = function() {
    const rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {},
      init: false
    }, option = {
      room: null,
      userid: null,
      audio: false,
      video: false,
      to: null
    }, id = 'a377b1eed7c24cd69a907cfb46a5d81e', rtmClient = AgoraRTM.createInstance(id)

    let rtmLogin = false
    rtmClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason)
    })
    rtmClient.on('MessageFromPeer', ({ text }, peerId) => {
      let v = JSON.parse(text)
      option.to = peerId
      if (v.type === 1) {
        option.room = v.msg.room
        option.video = v.msg.video
        option.audio = v.msg.audio
        join()
      }
    })
    rtc.client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})
    // 监听远端流加入
    rtc.client.on('stream-added', evt => {
      let remoteStreams = evt.stream, id = remoteStreams.getId()
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStreams, err => {
          console.error(err)
        })
      }
    })
    // 监听远端流解析
    rtc.client.on('stream-subscribed', evt => {
      let remoteStreams = evt.stream, id = remoteStreams.getId()
      addView(id)
      remoteStreams.play('remote_video_' + id)
    })
    // 监听远端流退出
    rtc.client.on('stream-removed', evt => {
      let remoteStreams = evt.stream, id = remoteStreams.getId()
      exit(remoteStreams, id)
    })
    // 初始化客户端
    function init() {
      return new Promise((resolve, reject) => {
        if (rtc.init) {
          resolve()
        } else {
          rtc.client.init(id, sucess => {
            rtc.init = true
            resolve()
          }, err => {
            console.error(err)
            reject(err)
          })
        }
      })
    }
    // 设置房间号
    function setRoom(to) {
      if (option.room) {
        return Promise.resolve()
      } else {
        option.room = option.userid
        return sendMessage({video: option.video, audio: option.audio, room: option.userid}, to, 1)
      }
    }
    function setUserId(id) {
      option.userid = id
      rtmClient.login({token: null, uid: id}).then(() => {
        rtmLogin = true
      }).catch(e => {
      })
    }
    // 加入房间
    function join(to) {
      setRoom(to).then(e => {
        init().then(e => {
          rtc.client.join(null, option.room, option.userid, success => {
            rtc.params.uid = success
            createStream()
          }, err => {
            console.error("client join failed", err)
          })
        })
      })
    }
    // 创建本地音视频流
    function createStream() {
      rtc.localStream = AgoraRTC.createStream({
        streamID: rtc.params.uid,
        audio: option.video || false,
        video: option.audio || false,
        screen: false
      })
      rtc.localStream.init(success => {
        rtc.localStream.play('local_stream')
        publicStream()
      }, err => {
        console.error("init local stream failed ", err);
      })
    }
    // 发布本地音视频流
    function publicStream() {
      rtc.client.publish(rtc.localStream, err => {
        console.error(err)
      })
    }
    // 关闭会话窗口
    function exit(remoteStreams, id) {
      option.room = null
      rtc.localStream.stop()
      rtc.localStream.close()
      if (id) {
        remoteStreams.stop('remote_video_' + id)
        removeView(id)
      } else {
        while (rtc.remoteStreams.length > 0) {
          let stream = evt.stream, sid = remoteStreams.getId()
          stream.stop()
          removeView(id)
        }
      }
    }
    // 退出会话
    function leave() {
      rtc.client.leave(() => {
        exit()
      })
    }
    // 发送即时消息
    function sendMessage(msg, id, type = 0) {
      if (!rtmLogin) {
        console.error('当前用户暂未登录，请登录后使用')
      }
      return rtmClient.sendMessageToPeer({text: JSON.stringify({msg, type})}, id).catch(e => {
        // 发送失败
          console.log('发送失败', e)
          return Promise.reject()
      }).then(res => {
        if (res.hasPeerReceived) {
          // 用户已接收消息
          console.log('用户已接受消息')
        } else {
          // 服务器已接受，用户不在线
          console.log('服务器已接受，用户不在线')
          return Promise.reject()
        }
      })
    }
    return {
      openVideo(id) {
        option.video = true
        option.audio = true
        join(id)
      },
      openAudio(id) {
        option.video = false
        option.audio = true
        join(id)
      },
      leave,
      setUserId,
      setVideo(v) {
        option.video = v
        if (v) {
          rtc.localStream.unmuteVideo()
        } else {
          rtc.localStream.muteVideo()
        }
      },
      setAudio(v) {
        option.audio = v
        if (v) {
          rtc.localStream.unmuteAudio()
        } else {
          rtc.localStream.muteAudio()
        }
      },
      setPlayMode(a, v) {
        this.setAudio(a)
        this.setVideo(v)
      },
      logOut() {
        rtmClient.logOut()
        rtmLogin = false
      },
      sendMessage
    }
  }
})(window, document)