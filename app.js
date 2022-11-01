const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER' // luu vao localStorage

const player = $('.player')
const audio = $('#audio')
const header = $('header h2')
const cdThumb = $('.cd-thumb')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progess = $('.progress')
const playRandom = $('.btn-random')
const playRepeat = $('.btn-repeat')
const playlist = $('.playlist')
// khai bao app

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, // cau hinh cho luu vao localStorage
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))// localStorage chi luu chuoi
    },
    songs: [
        {
            name: 'Bai hat 1',
            singer: 'Ca sy 1',
            path: './assets/miusic/song1.mp3',
            imga: './assets/img/song1.jpg'
        },
        {
            name: 'Bai hat 2',
            singer: 'Ca sy 2',
            path: './assets/miusic/song2.mp3',
            imga: './assets/img/song2.jpg'
        },
        {
            name: 'Bai hat 3',
            singer: 'Ca sy 3',
            path: './assets/miusic/song4.mp3',
            imga: './assets/img/song4.jpg'
        },
        {
            name: 'Bai hat 4',
            singer: 'Ca sy 4',
            path: './assets/miusic/song4.mp3',
            imga: './assets/img/song4.jpg'
        },
        {
            name: 'Bai hat 5',
            singer: 'Ca sy 5',
            path: './assets/miusic/song5.mp3',
            imga: './assets/img/song5.jpg'
        },
        {
            name: 'Bai hat 6',
            singer: 'Ca sy 6',
            path: './assets/miusic/song6.mp3',
            imga: './assets/img/song6.jpg'
        },
        {
            name: 'Bai hat 7',
            singer: 'Ca sy 7',
            path: './assets/miusic/song7.mp3',
            imga: './assets/img/song7.jpg'
        },
        {
            name: 'Bai hat 8',
            singer: 'Ca sy 8',
            path: './assets/miusic/song8.mp3',
            imga: './assets/img/song8.jpg'
        },
        {
            name: 'Bai hat 9',
            singer: 'Ca sy 9',
            path: './assets/miusic/song9.mp3',
            imga: './assets/img/song9.jpg'
        },
        {
            name: 'Bai hat 10',
            singer: 'Ca sy 10',
            path: './assets/miusic/song10.mp3',
            imga: './assets/img/song10.jpg'
        },
    ],
    render: function () {
        // render html
        const playlist = $('.playlist')
        const htmls = this.songs.map((song, index) => {
            return `
    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index} >
        <div class="thumb"
            style="background-image: url('${song.imga}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
</div>
    `
        })
        playlist.innerHTML = htmls.join('')

    },
    // khai bao de lay ra currentIndex
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    // handl song
    handlEventSong: function () {
        //di chuyen len xong phong to cdthumb
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const windowScroll = window.scrollY
            const cdWidthNew = cdWidth - windowScroll
            cd.style.width = cdWidthNew > 0 ? cdWidthNew + 'px' : 0
        }

        //play/pause song
        const playbtn = $('.btn-toggle-play')
        const _this = this
        playbtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }

        }
        //khi duoc play song
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdRotate.play()

        }
        // khi bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdRotate.pause()
        }
        // update time bh

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const newTime = audio.currentTime / audio.duration * 100
                progess.value = newTime
            }

        }
        // xly tua bh
        progess.oninput = function (e) {
            const seek = e.target.value * audio.duration / 100
            audio.currentTime = seek
        }
        // next bh
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }
            _this.scrollActiveSong()
            _this.render()// render lai song de them 'active
            audio.play()
        }
        // prev bh
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.prevSong()
            }
            _this.scrollActiveSong()

            _this.render()// render lai song de them active
            audio.play()
        }
        // xly random song
        playRandom.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            playRandom.classList.toggle('active', _this.isRandom)

        }
        // repeat song
        playRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            playRepeat.classList.toggle('active', _this.playRepeat)
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play() // chay lai song
            }
            else {
                nextBtn.click() // next song tiep
            }
        }
        // hanh vi click vao playlist chon song bh
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // xly khi click vao song 
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index) // covert sang Number
                    _this.loadcurrentSong()
                    _this.render()
                    audio.play()
                }
                // xly khi click vao option
                if (e.target.closest('.option')) {
                    alert('Hello aken')
                }
            }
        }
        // xly quay cho thumb
        const cdRotate = cdThumb.animate([
            //keyframes
            { transform: 'rotate(360deg)' },

        ], {
            //timing options
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause()
    },
    // scroll in to view( bh se chuyen ve center trong tam view)
    scrollActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 200)
    },

    // load song
    loadcurrentSong: function () {
        header.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.imga})`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // next song
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadcurrentSong()
    },
    // prev song
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadcurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)// dk khong trung voi bai hat dang hat hien tai
        this.currentIndex = newIndex// dat lai currentSong random
        this.loadcurrentSong()
    },

    start: function () {
        this.loadConfig() // gan cau hinh tu config vao ung dung
        this.defineProperties()// dinh nghia cac thuoc tinh cho Oject
        this.render()// render playlist
        this.handlEventSong() // lang nghe / xu ly su kien( DOM event)
        this.loadcurrentSong() // tai thong tin bai hat dau tien
        // hien thi trang thai ban dau cuar button repeat & random
        playRandom.classList.toggle('active', this.isRandom)
        playRepeat.classList.toggle('active', this.isRepeat)

    }
}
app.start()
