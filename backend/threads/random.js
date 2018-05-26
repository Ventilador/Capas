let seed = (Math.random() * 100000000000000) % 2147483647;

module.exports = function random(mod) {
    return (seed = seed * 16807 % 2147483647) % mod;
}