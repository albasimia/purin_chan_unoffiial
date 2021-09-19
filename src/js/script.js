import {
    BASE_DIR
} from '../constants.yml'
import axios from 'axios'
import wave, {
    init
} from './lib/wave'

let youtube_data = [];

const comment_data = [
    '仕事辞めたいキャンペーン開催はや6年、、',
    'ﾌﾟﾙ🏊🏻',
    'ましゅまろぼでぃ…',
    'ゆるしま㌢',
    '戸開けたら網戸にぶつかってはじかれた',
    'ピ',
    'いい腕をみるとかじりたくなる本能がそういってる',
    '無の感情で通勤するしかねえ',
    'なお、お風呂はすけすけ',
    'エコバッグ忘れてこうなってるなう(トマトのパックを鷲掴みにする画像)',
]

const isPC = window.matchMedia('(min-width: 769px)').matches
const kv = document.querySelector('.kv')
const youtube_list = document.querySelector('.youtube_list')
let kv_list

axios({
    method: 'get',
    url: 'data/youtube_data.json',
    // url: 'https://www.googleapis.com/youtube/v3/search',
    // params: {
    //     key: 'AIzaSyBqZtClYLk5bIjp_D0KoCNX8TjPBXCu9ZI',
    //     channelId: 'UCER-2DF4WSpGaK02GkvOzdg',
    //     part: 'snippet',
    //     maxResults: 10,
    //     order: 'date',
    // }
}).then(function (res) {
    youtube_data = res.data
    if (!isPC) {
        kv.insertAdjacentHTML('beforeend', [
            `<div class="kv_swiper swiper">`,
            `<div class="kv_list swiper-wrapper">`,
            `</div>`,
            `</div>`
        ].join(''))
        kv_list = document.querySelector('.kv_list')
    }
    youtube_data.items.forEach((item, i) => {
        if (isPC) {
            if (i == 0) {
                kv.insertAdjacentHTML('beforeend', [
                    `<iframe id="kv_iflame" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" src="https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`,
                ].join(''))
                document.querySelector('#kv_iflame').addEventListener('load', function () {
                    initPage()
                })
            }
        } else {
            kv_list.insertAdjacentHTML('beforeend', [
                `<div class="kv_slide swiper-slide">`,
                `<div class="kv_img">`,
                `<img src="${item.snippet.thumbnails.high.url}">`,
                `</div>`,
                `</div>`,
            ].join(''))

        }
        const youtube_slide = document.createElement('div')
        youtube_slide.classList.add('youtube_item', 'swiper-slide');
        youtube_slide.innerHTML = [
            `<iframe loading="lazy" width="854" height="480" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`,
            // `<p>${item.snippet.title}</p>`,
        ].join('')
        youtube_list.appendChild(youtube_slide);
    });
    if (!isPC) {
        initPage()
        const kv_swiper = new Swiper('.kv_swiper', {
            // Optional parameters
            speed: 500,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
        kv.style = 'padding-bottom:0;'
    }

    const youtube_swiper = new Swiper('.youtube_swiper', {
        // Optional parameters
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}).catch(function (error) {
    // console.error(error.response.data.error.errors)
    console.error(error)
})

window.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const anchorLinksArr = Array.prototype.slice.call(anchorLinks);

    anchorLinksArr.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.hash;
            const targetElement = document.querySelector(targetId);
            const targetOffsetTop = window.pageYOffset + targetElement.getBoundingClientRect().top;
            window.scrollTo({
                top: targetOffsetTop,
                behavior: "smooth"
            });
        });
    });
});

const commnets = document.querySelectorAll('.comment')
for (const ele of commnets) {
    ele.addEventListener('animationiteration', function () {
        this.textContent = comment_data[Math.floor(Math.random() * comment_data.length)];
    })
}

function initPage() {
    const loading = document.querySelector('.loading')
    loading.addEventListener('animationend', function () {
        this.style = 'display:none;'
    })
    loading.classList.add('fadeOut')

    document.querySelector('body').classList.remove('fixed')
    var ticking = false;
    const bg2 = document.querySelector('.bg2')
    let isInit = false
    const profile = document.querySelector("#profile")

    function animationCtrl() {
        if (!ticking) {
            requestAnimationFrame(function () {
                ticking = false;
                const y = window.pageYOffset
                const pageH = document.body.clientHeight
                const winH = window.innerHeight
                bg2.style.opacity = y / (pageH - winH)
                if (!isInit && window.pageYOffset + profile.getBoundingClientRect().top - winH * .4 < y) {
                    init()
                    isInit = true
                }
            });
            ticking = true;
        }
    }

    document.addEventListener('scroll', animationCtrl, {
        passive: true
    })
}