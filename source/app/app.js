import './../build/sass/build.scss';
import data from './data.js';

import Header from './../modules/header/header';
import Content from './../modules/content/content';
import Player from './../modules/player/player';
import Tracks from './../modules/tracks/tracks';

new Header(data.header);
new Content(data);
new Player(data, '#header-wrap');
new Tracks(data, '#content-wrap');

import './../build/sass/retina.scss';
import slider from 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui/themes/base/theme.css';



$(document).ready(function(){
    if (window.addEventListener) {
        window.addEventListener("storage", onStorageEvent, false);
    } else {
        window.attachEvent("onstorage", onStorageEvent);
    }

    let song,
        tracker = $('.tracker'),
        volume = $('.volume');

    initAudio($('.tracks li:first-child'));

    song.volume = 0.8;

    volume.slider({
        range: 'min',
        min: 1,
        max: 100,
        value: 80,
        start: function(event,ui) {},
        slide: function(event, ui) {
            song.volume = ui.value / 100;
        },
        stop: function(event,ui) {},
    });
    tracker.slider({
        range: 'min',
        min: 0, max: 10,
        start: function(event,ui) {},
        slide: function(event, ui) {
            song.currentTime = ui.value;
            console.log(song.currentTime);
        },
        stop: function(event,ui) {}
    });

    function initAudio(elem) {
        let url = elem.attr('data-src');
        let title = elem.attr('title');

        let cover = elem.attr('data-cover');
        // let artist = elem.attr('artist');
        $('.player__title').text(title);
        // $('.player .artist').text(artist);
        $('.player__cover').css('background-image','url('+ cover +')');

        song = new Audio(url);

        // timeupdate event listener
        song.addEventListener('timeupdate',function (){
            let curtime = parseInt(song.currentTime, 10);
            console.log(curtime);
            tracker.slider('value', curtime);
            console.log(tracker);
        });
        song.addEventListener('ended', function () {
            let next = $('.tracks li.active').next();
            if (next.length == 0) {
                next = $('.tracks li:first-child');
            }
            initAudio(next);
            playAudio();
        }, false);

        $('.tracks li').removeClass('active');
        elem.addClass('active');
    }

    function playAudio() {
        song.pause();
        song.play();
        tracker.slider("option", "max", song.duration);

        let nowTime = new Date().getTime();
        localStorage['song'] = nowTime;

        $('.fa-play').addClass('hidden');
        $('.fa-pause').removeClass('hidden');
    }
    function stopAudio() {
        song.pause();

        $('.fa-play').removeClass('hidden');
        $('.fa-pause').addClass('hidden');
    }
    function onStorageEvent(storageEvent){
        if(storageEvent.key == 'song')
            stopAudio();
    }

    // play click
    $('.fa-play').click(function (e) {
        e.preventDefault();
        playAudio();
    });

    // pause click
    $('.fa-pause').click(function (e) {
        e.preventDefault();
        stopAudio();
    });

    // forward click
    $('.fa-forward').click(function (e) {
        e.preventDefault();

        stopAudio();

        let next = $('.tracks li.active').next();
        if (next.length == 0) {
            next = $('.tracks li:first-child');
        }
        initAudio(next);
        playAudio();
    });

    // rewind click
    $('.fa-backward').click(function (e) {
        e.preventDefault();

        stopAudio();

        let prev = $('.tracks li.active').prev();
        if (prev.length == 0) {
            prev = $('.tracks li:last-child');
        }
        initAudio(prev);
        playAudio();
    });

    $('.tracks__item').click(function () {
        stopAudio();
        initAudio($(this));
        playAudio();
    });
});