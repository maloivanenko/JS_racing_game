var soundtrack = new Howl({
    src: ['snd/random-race.mp3'],
    autoplay: true,
    volume: 0.2,
    loop: true,
});
var engine = new Howl({
    src: ['snd/engine2.wav'],
    autoplay: false,
    volume: 0.07,
    loop: true,
});
var explode = new Howl({
    src: ['snd/crash.mp3'],
    autoplay: false,
    volume: 0.09,
    loop: false,
});
var pickupRepair = new Howl({
    src: ['snd/spell2.wav'],
    autoplay: false,
    volume: 0.4,
    loop: false,
});
var horn1 = new Howl({
    src: ['snd/horn1.mp3'],
    autoplay: false,
    volume: 0.08,
    loop: false,
});

//construction functions doesn't work in this case