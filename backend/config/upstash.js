import { Redis } from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'

import "dotenv/config";
const ratelimiter = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(100, "60 s"), d
});

export default ratelimiter;