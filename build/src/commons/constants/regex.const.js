"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Regex {
    static regexPhoneNumber = /((^(\+84|84|0|0084|\(\+84\)){1})(3|5|7|8|9))+([0-9]{8})$/;
    static regexPassword = /^(?=.*[A-Z]+.*)(?=.*(\W|\d)+.*).{6,30}$/;
    static regexNoSpace = /^\S+$/;
}
exports.default = Regex;
