/// <reference path="C:\_project3\1319.ir\1319.ir\1319.ir\Scripts/jquery-2.1.1.min.js" />

var AudioPlayerManager = function () {

    var _PlayerArr = [];

    var _CurrentPlayer = null;

    function AudioPlayer(element) {
        this.status = 0

        var playerID = $(element).prop("id");
        var audioID = $(element).data("audio-id");
        var audioSection = $(element).data("audio-section");

        var currentTime = 0;
        var durationTime = 0;

        this.ID = playerID;
        this.AudioSrc = "/handlers/getAudio.ashx?section=" + audioSection + "&subsection=1&id=" + audioID;
        this.BtnPlay = $(element).find("[role='player-btn-play']");
        this.BtnForward = $(element).find("[role='player-btn-forward']");
        this.BtnBackward = $(element).find("[role='player-btn-backward']");
        this.LBCurrent = $(element).find("[role='player-label-current']");
        this.LBDuration = $(element).find("[role='player-label-duration']");
        this.Indicator = $(element).find("[role='player-indicator']");
        this.Head = $(element).find("[role='player-indicator-head']");
        this.AudioObj = new Audio(this.AudioSrc);


        this.LBCurrent.text(ToMinSecond(currentTime));
        this.LBDuration.text(ToMinSecond(durationTime));

        var _this = this;

        this.AudioObj.oncanplaythrough = function () {
            durationTime = _this.AudioObj.duration;
            _this.Preview();
        };

        this.AudioObj.ontimeupdate = function () {
            currentTime = _this.AudioObj.currentTime;
            _this.Preview();
        };

        this.BtnPlay.click(function () {
            _this.Play();
        });

        this.Indicator.click(function (e) {
            _this.Jump(e.offsetX);
        });

        //this.BtnPlay.click((function () {
        //    this.Play();
        //}).bind(this));

        this.Play = function () {

            if (this.status == 0) {
                StopAll();
                this.AudioObj.play();
                this.BtnPlay.addClass('fa-pause');
                this.status = 1;
            } else {
                this.AudioObj.pause();
                this.BtnPlay.removeClass('fa-pause');
                this.status = 0;
            }

        };

        this.Preview = function () {
            this.LBCurrent.text(ToMinSecond(currentTime));
            this.LBDuration.text(ToMinSecond(durationTime));
            if (durationTime != 0) {
                var currentPercent = 100 * (currentTime / durationTime);
                this.Head.css('width', currentPercent + '%');
            }
        };

        var jumpTime = -1;
        this.Jump = function (e) {
            jumpTime = (e / this.Indicator.width()) * durationTime;
            _this.AudioObj.currentTime = jumpTime;
            _this.AudioObj.play();
        }

        this.Stop = function () {
            if(this.status ==1)
            {
                this.AudioObj.pause();
                this.BtnPlay.removeClass('fa-pause');
                this.status = 0;
            }
        };

        this.Reset = function () {

        };

        //this.AudioObj.oncanplaythrough = function () {
        //    if (jumpTime != -1) {
        //        _this.AudioObj.currentTime = jumpTime;
        //        _this.AudioObj.play();
        //    }

        //};

        function ToMinSecond(x) {
            var min = Math.floor(x / 60);
            var sec = Math.round(x - min * 60);
            return min + ":" + sec;
        }

    }

    function StopAll()
    {
        _PlayerArr.forEach(function (element) {
            element.Stop();
        });
    }

    function AudioPlayerManager() {

    }

    AudioPlayerManager.prototype = function () {
        var obj = {};
        obj.AddPlayer = function (element) {

            var playerObj = new AudioPlayer(element);

            _PlayerArr.push(playerObj)

        };
        return obj;
    }();

    var GetPlayer = function (playerID) {
        return _PlayerArr.find(function (e) { return e.ID == playerID });
    };

    return AudioPlayerManager;
}();
