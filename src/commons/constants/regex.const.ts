export default class Regex {
   static readonly regexPhoneNumber = /((^(\+84|84|0|0084|\(\+84\)){1})(3|5|7|8|9))+([0-9]{8})$/;
   static readonly regexPassword = /^(?=.*[A-Z]+.*)(?=.*(\W|\d)+.*).{6,30}$/;
   static readonly regexNoSpace = /^\S+$/;
}
