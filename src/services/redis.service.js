const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient);
const setnxAsync = promisify(redisClient.SETNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock:${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 second lock
  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, thang nao nam giu duoc vao thanh toan
    const result = await setnxAsync(key, expireTime);
    console.log("result", result);
    if (result === 1) {
      // thao tac voi inventory
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        // neu khong co du lieu, release lock
        await pexpire(key, expireTime);
        return key; // tra ve key lock
      }
      return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
