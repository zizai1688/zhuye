// 简单烟花特效
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;
window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
});
function randomColor() {
    return `hsl(${Math.random()*360},100%,60%)`;
}
function Firework() {
    this.x = Math.random() * W;
    this.y = H;
    this.radius = 5 + Math.random() * 5;
    this.color = randomColor();
    this.speed = 3 + Math.random() * 4;
    this.angle = -Math.PI/2 + (Math.random()-0.5)*0.2;
    this.exploded = false;
    this.particles = [];
    this.explodeHeight = 0.2*H + Math.random()*0.5*H;
}
Firework.prototype.update = function() {
    if (!this.exploded) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.y < this.explodeHeight) {
            this.exploded = true;
            for (let i=0; i<60+Math.random()*40; i++) {
                this.particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    } else {
        this.particles.forEach(p=>p.update());
    }
};
Firework.prototype.draw = function() {
    if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    } else {
        this.particles.forEach(p=>p.draw());
    }
};
function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 2+Math.random()*3;
    this.color = color;
    this.angle = Math.random()*2*Math.PI;
    this.speed = 2+Math.random()*4;
    this.alpha = 1;
    this.decay = 0.01+Math.random()*0.015;
}
Particle.prototype.update = function() {
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed;
    this.speed *= 0.98;
    this.alpha -= this.decay;
};
Particle.prototype.draw = function() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
};
let fireworks = [];
function loop() {
    ctx.clearRect(0,0,W,H);
    if (Math.random() < 0.04) fireworks.push(new Firework());
    fireworks.forEach(fw=>fw.update());
    fireworks.forEach(fw=>fw.draw());
    fireworks = fireworks.filter(fw=>!fw.exploded || fw.particles.some(p=>p.alpha>0));
    requestAnimationFrame(loop);
}
loop();
// 加油按钮点赞emoji特效
function createLikeEmoji() {
    const emoji = document.createElement('div');
    emoji.textContent = '👍';
    emoji.style.position = 'fixed';
    emoji.style.left = (10 + Math.random() * 80) + 'vw';
    emoji.style.top = (60 + Math.random() * 30) + 'vh';
    emoji.style.fontSize = (32 + Math.random() * 32) + 'px';
    emoji.style.opacity = 1;
    emoji.style.transition = 'transform 1.2s cubic-bezier(.17,.67,.83,.67), opacity 1.2s';
    emoji.style.transform = 'translateY(0) scale(1)';
    emoji.style.pointerEvents = 'none';
    emoji.style.zIndex = 1000;
    document.body.appendChild(emoji);
    setTimeout(() => {
        emoji.style.transform = `translateY(-${100 + Math.random()*100}px) scale(${1.2+Math.random()*0.8})`;
        emoji.style.opacity = 0;
    }, 10);
    setTimeout(() => {
        emoji.remove();
    }, 1300);
}
document.getElementById('cheer-btn').addEventListener('click', function(e) {
    e.preventDefault();
    for(let i=0;i<24;i++) setTimeout(createLikeEmoji, i*30);
}); 