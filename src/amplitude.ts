import * as amplitude from '@amplitude/analytics-browser';
import {config} from "../config";
const isProd = process.env.NODE_ENV === 'production';
const key = isProd? config.amplitudeApiKey: 'dev key';
amplitude.init(key ,{ defaultTracking: true, });


export default amplitude;