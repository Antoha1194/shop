const regexp = /(\'\B|\B\')/g;
const str = `'Thus Spoke Zarathustra: A Book for All and None' is a famous and somewhat controversial novel finalized by German philosopher Friedrich Nietzsche in 1885. Nietzsche has considered this book his most important work. It greatly expands on the main ideas that he has presented in his'previous works, and remains a hot topic for debates in scholarly circles up to this day.
`
console.log(str.replace(regexp, '"'));
