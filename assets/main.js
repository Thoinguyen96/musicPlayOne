const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");
const cd = $(".cd");
const btnPlay = $(".btn-toggle-play");
const play = $(".player");
const audioPlay = $(".audio");
const heading = $("header h2");
const image = $(".cd-thumb");
const audio = $("#audio");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");

const progress = $(".progress");

const app = {
    btnRepeat: false,
    btnRandom: false,
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "/assets/mp3/song1.mp3",
            image: "/assets/img/ct6.jpg",
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "/assets/mp3/song2.mp3",
            image: "/assets/img/ct5.jpg",
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path: "/assets/mp3/song3.mp3",
            image: "/assets/img/ct4.jpg",
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "/assets/mp3/song4.mp3",
            image: "/assets/img/ct3.jpg",
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "/assets/mp3/song5.mp3",
            image: "/assets/img/ct2.jpg",
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "/assets/mp3/song1.mp3",
            image: "/assets/img/ct6.jpg",
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "/assets/mp3/song3.mp3",
            image: "/assets/img/ct3.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `

            <div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index = ${index}>

            <div
                class="thumb"
                style="
                    background-image: url('${song.image}');
                "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
        });
        playlist.innerHTML = htmls.join("");
    },

    handleEvent: function () {
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        const newspaperSpinning = [{ transform: "rotate(360deg)" }];

        const newspaperTiming = {
            duration: 10000,
            iterations: Infinity,
        };
        audio.ontimeupdate = function () {
            progress.value = (audio.currentTime / audio.duration) * 100;
        };
        progress.onchange = function () {
            audio.currentTime = (audio.duration / 100) * progress.value;
        };

        const cdTurn = cd.animate(newspaperSpinning, newspaperTiming);
        cdTurn.pause();
        btnPlay.onclick = function () {
            app.isPlaying = !app.isPlaying;
            play.classList.toggle("playing", app.isPlaying);
            console.log(app.isPlaying);
            if (app.isPlaying) {
                audio.play();
                cdTurn.play();
            } else {
                audio.pause();
                cdTurn.pause();
            }
        };
        prevBtn.onclick = function () {
            if (app.btnRandom) {
                app.randomSong();
            }
            app.isPlaying = true;
            app.scrollView();
            app.prevSong();
            play.classList.add("playing");
            app.loadCurrentSong();
            audio.play();
            app.render();

            cdTurn.play();
        };
        nextBtn.onclick = function () {
            if (app.btnRandom) {
                app.randomSong();
            }
            app.isPlaying = true;

            app.scrollView();
            app.nextSong();
            app.loadCurrentSong();
            cdTurn.play();
            play.classList.add("playing");
            app.render();
            audio.play();
        };

        btnRepeat.onclick = function () {
            app.btnRepeat = !app.btnRepeat;
            btnRepeat.classList.toggle("active");
        };
        audio.onended = function () {
            if (app.btnRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        btnRandom.onclick = function () {
            app.btnRandom = !app.btnRandom;
            btnRandom.classList.toggle("active", app.btnRandom);
            app.randomSong();
        };
        playlist.onclick = function (e) {
            const nodeSong = e.target.closest(".song:not(.active)");
            const nodeOption = e.target.closest(".option");
            if (nodeSong || nodeOption) {
                if (nodeSong) {
                    app.currentIndex = Number(
                        nodeSong.getAttribute("data-index")
                    );
                    app.isPlaying = true;
                    cdTurn.play();

                    play.classList.add("playing");
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
                if (nodeOption) {
                    // tùy chọn
                }
            }
        };
    },
    loadCurrentSong: function () {
        const currentSong = this.getCurrentSong();
        image.style.backgroundImage = `url(${currentSong.image})`;
        audio.src = currentSong.path;
        heading.textContent = currentSong.name;
    },
    randomSong: function () {
        this.currentIndex = Math.floor(Math.random() * app.songs.length);
        this.loadCurrentSong;
    },
    getCurrentSong: function () {
        return this.songs[this.currentIndex];
    },
    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        this.loadCurrentSong;
    },
    prevSong: function () {
        app.currentIndex--;

        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1;
        }
    },
    scrollView: function () {
        setTimeout(function () {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }, 300);
    },
    start: function () {
        this.loadCurrentSong();
        this.render();
        this.handleEvent();
        this.randomSong();
    },
};
app.start();

// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);
// const playlist = $(".playlist");
// const cd = $(".cd");
// const btnPlay = $(".btn-toggle-play");
// const play = $(".player");
// const audioPlay = $(".audio");
// const heading = $("header h2");
// const image = $(".cd-thumb");
// const audio = $("#audio");
// const nextBtn = $(".btn-next");
// const prevBtn = $(".btn-prev");
// const btnRandom = $(".btn-random");
// const btnRepeat = $(".btn-repeat");

// const progress = $(".progress");

// const app = {
//     btnRepeat: false,
//     btnRandom: false,

//     currentIndex: 0,
//     isPlaying: false,
//     songs: [
//         {
//             name: "Click Pow Get Down",
//             singer: "Raftaar x Fortnite",
//             path: "/assets/mp3/song1.mp3",
//             image: "/assets/img/ct6.jpg",
//         },
//         {
//             name: "Tu Phir Se Aana",
//             singer: "Raftaar x Salim Merchant x Karma",
//             path: "/assets/mp3/song2.mp3",
//             image: "/assets/img/ct5.jpg",
//         },
//         {
//             name: "Naachne Ka Shaunq",
//             singer: "Raftaar x Brobha V",
//             path: "/assets/mp3/song3.mp3",
//             image: "/assets/img/ct4.jpg",
//         },
//         {
//             name: "Mantoiyat",
//             singer: "Raftaar x Nawazuddin Siddiqui",
//             path: "/assets/mp3/song4.mp3",
//             image: "/assets/img/ct3.jpg",
//         },
//         {
//             name: "Aage Chal",
//             singer: "Raftaar",
//             path: "/assets/mp3/song5.mp3",
//             image: "/assets/img/ct2.jpg",
//         },
//         {
//             name: "Damn",
//             singer: "Raftaar x kr$na",
//             path: "/assets/mp3/song1.mp3",
//             image: "/assets/img/ct6.jpg",
//         },
//         {
//             name: "Feeling You",
//             singer: "Raftaar x Harjas",
//             path: "/assets/mp3/song3.mp3",
//             image: "/assets/img/ct3.jpg",
//         },
//     ],
//     render: function () {
//         const htmls = this.songs.map((song, index) => {
//             return `

//             <div class="song ${
//                 index === this.currentIndex ? "active" : ""
//             }" data-index = ${index}>

//             <div
//                 class="thumb"
//                 style="
//                     background-image: url('${song.image}');
//                 "
//             ></div>
//             <div class="body">
//                 <h3 class="title">${song.name}</h3>
//                 <p class="author">${song.singer}</p>
//             </div>
//             <div class="option">
//                 <i class="fas fa-ellipsis-h"></i>
//             </div>
//         </div>`;
//         });
//         playlist.innerHTML = htmls.join("");
//     },

//     loadCurrentSong: function () {
//         var currentSong = this.getCurrentSong();

//         heading.textContent = currentSong.name;
//         image.style.backgroundImage = `url('${currentSong.image}')`;
//         audio.src = currentSong.path;
//     },
//     // defineproperties: function () {
//     //     Object.defineProperty(this, "currentSong", {
//     //         get: function () {
//     //             return this.songs[this.currentIndex];
//     //         },
//     //     });
//     // },

//     handleEvent: function () {
//         const _this = this;
//         const cdWidth = cd.offsetWidth;
//         document.onscroll = function () {
//             const scrollTop =
//                 window.scrollY || document.documentElement.scrollTop;
//             const newCdWidth = cdWidth - scrollTop;
//             cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;

//             cd.style.opacity = newCdWidth / cdWidth;
//         };
//         const newspaperSpinning = [{ transform: "rotate(360deg)" }];
//         const newspaperTiming = {
//             duration: 10000,
//             iterations: Infinity,
//         };
//         const cdTurn = cd.animate(newspaperSpinning, newspaperTiming);
//         cdTurn.pause();
//         // next bài hát

//         // play,pause bài hát
//         btnPlay.onclick = function () {
//             _this.isPlaying = !_this.isPlaying;
//             play.classList.toggle("playing", _this.isPlaying);
//             if (_this.isPlaying) {
//                 audio.play();
//                 cdTurn.play();
//             } else {
//                 audio.pause();
//                 cdTurn.pause();
//             }
//             // cách 2
//             // if (_this.isPlaying) {
//             //     _this.isPlaying = false;
//             //     audio.pause();
//             //     play.classList.remove("playing");
//             //     cdTurn.pause();
//             // } else {
//             //     _this.isPlaying = true;
//             //     audio.play();
//             //     play.classList.add("playing");
//             //     cdTurn.play();
//             // }
//         };
//         nextBtn.onclick = function () {
//             if (_this.btnRandom) {
//                 _this.getBtnRandom();
//             } else {
//                 _this.nextSong();
//             }
//             cdTurn.play();
//             _this.isPlaying = true;
//             audio.play();
//             play.classList.add("playing");
//             _this.render();
//             _this.scrollView();
//         };
//         prevBtn.onclick = function () {
//             if (_this.btnRandom) {
//                 _this.getBtnRandom();
//             } else {
//                 _this.prevSong();
//             }
//             play.classList.add("playing");
//             cdTurn.play();
//             _this.isPlaying = true;
//             audio.play();
//             _this.render();
//             _this.scrollView();
//         };
//         // thay đổi tiến độ bài hát đang phát
//         audio.ontimeupdate = function () {
//             (audio.currentTime / audio.duration) * 100;
//             progress.value = (audio.currentTime / audio.duration) * 100;
//         };
//         // tua bài hát
//         progress.onchange = function () {
//             audio.currentTime = (audio.duration / 100) * progress.value;
//         };
//         // ngẫu nhiên bài hát
//         btnRandom.onclick = function () {
//             _this.btnRandom = !_this.btnRandom;
//             btnRandom.classList.toggle("active", _this.btnRandom);
//             _this.getCurrentSong();
//         };
//         // phát lại
//         btnRepeat.onclick = function () {
//             _this.btnRepeat = !_this.btnRepeat;
//             btnRepeat.classList.toggle("active", _this.btnRepeat);
//         };

//         // next khi audio end
//         audio.onended = function () {
//             if (_this.btnRepeat) {
//                 audio.play();
//             } else {
//                 nextBtn.click();
//             }
//         };
//         // click chuyển bài hát trên mỗi song
//         playlist.onclick = function (e) {
//             const nodeSong = e.target.closest(".song:not(.active)");
//             const nodeOption = e.target.closest(".option");
//             if (nodeSong || nodeOption) {
//                 if (nodeSong) {
//                     _this.currentIndex = Number(
//                         nodeSong.getAttribute("data-index")
//                     );
//                     play.classList.add("playing");
//                     _this.render();
//                     _this.loadCurrentSong();
//                     audio.play();
//                     _this.isPlaying = true;
//                 }
//                 if (nodeOption) {
//                     // tùy chọn
//                 }
//             }
//         };
//     },

//     nextSong: function () {
//         this.currentIndex++;
//         if (this.currentIndex >= this.songs.length) {
//             this.currentIndex = 0;
//         }
//         this.loadCurrentSong();
//     },
//     prevSong: function () {
//         this.currentIndex--;
//         if (this.currentIndex < 0) {
//             this.currentIndex = this.songs.length - 1;
//         }
//         this.loadCurrentSong();
//     },
//     getCurrentSong: function () {
//         return this.songs[this.currentIndex];
//     },
//     getBtnRandom: function () {
//         let newIndex;
//         do {
//             newIndex = Math.floor(Math.random() * this.songs.length);
//         } while (this.currentIndex === newIndex);
//         this.currentIndex = newIndex;
//         this.loadCurrentSong();
//     },
//     //   view song
//     scrollView: function () {
//         setTimeout(() => {
//             $(".song.active").scrollIntoView({
//                 behavior: "smooth",
//                 block: "end",
//             });
//         }, 200);
//     },

//     start: function () {
//         // const currentSong = this.getCurrentSong();
//         // this.defineproperties();

//         this.render();
//         this.handleEvent();
//         this.loadCurrentSong();
//     },
// };
// app.start();
