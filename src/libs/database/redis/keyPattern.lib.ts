class RedisKeyPattern {
   public static accessTokenKey(userID: string) {
      return `AccessToken_User:${userID}`;
   }
}
export default RedisKeyPattern;
